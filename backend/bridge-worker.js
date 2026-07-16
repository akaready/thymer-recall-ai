const RECALL_REGIONS = Object.freeze({
	'us-east-1': 'https://us-east-1.recall.ai',
	'us-west-2': 'https://us-west-2.recall.ai',
	'eu-central-1': 'https://eu-central-1.recall.ai',
	'ap-northeast-1': 'https://ap-northeast-1.recall.ai',
	payg: 'https://api.recall.ai',
});

const BRIDGE_VERSION = '1.22.1';
const BRIDGE_CAPABILITIES = Object.freeze([
	'append-only-realtime',
	'bridge-checks',
	'participant-artifact',
	'parser-diagnostics',
	'scheduled-bot-cancel',
	'signed-realtime',
]);
const REALTIME_TTL_SECONDS = 60 * 60 * 24 * 7;
const WEBHOOK_MAX_AGE_SECONDS = 5 * 60;
const TERMINAL_BOT_STATUSES = new Set(['done', 'fatal', 'call_ended', 'recording_done', 'media_expired', 'analysis_done', 'analysis_failed']);
const LIVE_SESSIONS = new Map();

export default {
	async fetch(request, env = {}) {
		if (request.method === 'OPTIONS') return optionsResponse();
		const url = new URL(request.url);
		try {
			if (request.method === 'GET' && url.pathname === '/health') {
				// Report the KV binding. Without it the realtime transcript is silently discarded, and a
				// bare {ok:true} would let you believe the bridge was fine while it dropped every row.
				const store = transcriptStore(env);
				return json({
					ok: true,
					bridgeVersion: BRIDGE_VERSION,
					capabilities: BRIDGE_CAPABILITIES,
					kv: store ? 'bound' : 'MISSING',
					webhookVerification: env.RECALL_WORKSPACE_VERIFICATION_SECRET ? 'enforced' : 'compatibility',
					kvHint: store ? undefined : 'Bind a KV namespace named RECALL_TRANSCRIPTS to this Worker, or the live transcript cannot be stored.',
				});
			}
			if (request.method !== 'POST') return json({ error: 'Not found' }, 404);
			if (url.pathname === '/api/recall/bots') return await createRecallBot(request, env);
			if (url.pathname === '/api/recall/check') return await checkRecallConnection(request, env);
			if (url.pathname === '/api/recall/bot') return await getRecallBot(request, env);
			if (url.pathname === '/api/recall/diagnostics') return await getRecallDiagnostics(request, env);
			if (url.pathname === '/api/recall/transcript') return await getRecallTranscript(request, env);
			if (url.pathname === '/api/recall/participants') return await getRecallParticipants(request, env);
			if (url.pathname === '/api/recall/leave') return await leaveRecallCall(request, env);
			if (url.pathname === '/api/recall/cancel') return await cancelScheduledRecallBot(request, env);
			if (url.pathname === '/api/recall/realtime') return await receiveRealtimeTranscript(request, env);
			if (url.pathname === '/api/anthropic/check') return await checkAnthropicConnection(request, env);
			if (url.pathname === '/api/anthropic/summary') return await createSummary(request, env);
			return json({ error: 'Not found' }, 404);
		} catch (err) {
			return json({ error: errorMessage(err) }, 500);
		}
	},
};

async function createRecallBot(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.payload || !body.payload.meeting_url) return json({ error: 'payload.meeting_url is required' }, 400);
	const payload = structuredClone(body.payload);
	if (body.bridgeUrl) {
		payload.recording_config = payload.recording_config || {};
		payload.recording_config.realtime_endpoints = [{
			type: 'webhook',
			url: `${String(body.bridgeUrl).replace(/\/+$/, '')}/api/recall/realtime`,
			events: ['transcript.data'],
		}];
	}
	if (body.botImageData || body.botImageUrl) {
		const image = body.botImageData ? jpegFromBase64(body.botImageData) : await fetchJpegAsBase64(body.botImageUrl, env);
		payload.automatic_video_output = {
			in_call_not_recording: image,
			in_call_recording: image,
		};
	}
	const existing = await findExistingRecallBot(env, body.recallRegion, apiKey, payload);
	if (existing) {
		const botId = existing.id || existing.bot_id;
		if (botId) upsertSession(botId);
		console.info('[recall-ai bridge] reused existing bot', { botId, recordGuid: payload.metadata && payload.metadata.record_guid });
		return json({
			botId,
			status: latestRecallStatus(existing) || 'bot.created',
			recall: existing,
			deduplicated: true,
		});
	}
	const response = await recallFetch(env, body.recallRegion, '/api/v1/bot/', {
		method: 'POST',
		headers: recallHeaders(apiKey),
		body: JSON.stringify(payload),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({ error: recallError(data, response.status), detail: data }, response.status);
	const botId = data.id || data.bot_id;
	if (botId) upsertSession(botId);
	console.info('[recall-ai bridge] created bot', {
		botId,
		status: latestRecallStatus(data) || 'bot.created',
		hasRealtimeEndpoint: !!(payload.recording_config && Array.isArray(payload.recording_config.realtime_endpoints) && payload.recording_config.realtime_endpoints.length),
		hasBotImage: !!payload.automatic_video_output,
	});
	return json({
		botId,
		status: latestRecallStatus(data) || 'bot.created',
		recall: data,
	});
}

async function findExistingRecallBot(env, region, apiKey, payload) {
	const metadata = payload && payload.metadata || {};
	const recordGuid = String(metadata.record_guid || '').trim();
	if (!recordGuid) return null;
	const source = String(metadata.source || 'thymer-recall-ai-plugin').trim();
	try {
		const response = await recallFetch(env, region, `/api/v1/bot/?use_cursor=true&metadata__record_guid=${encodeURIComponent(recordGuid)}&metadata__source=${encodeURIComponent(source)}`, {
			method: 'GET',
			headers: recallHeaders(apiKey, false),
		});
		const data = await safeJson(response);
		if (!response.ok) return null;
		const bots = Array.isArray(data && data.results) ? data.results : Array.isArray(data) ? data : [];
		const meetingUrl = String(payload.meeting_url || '').trim();
		return bots.find(bot => {
			const status = String(latestRecallStatus(bot) || '').toLowerCase();
			if (TERMINAL_BOT_STATUSES.has(status) || status.includes('fatal') || status.includes('done')) return false;
			const candidate = typeof bot.meeting_url === 'string'
				? bot.meeting_url
				: firstString(bot.meeting_url && bot.meeting_url.url, bot.meeting_url && bot.meeting_url.meeting_url);
			return !candidate || !meetingUrl || candidate === meetingUrl;
		}) || null;
	} catch {
		// Deduplication is a guard, not a reason to make bot creation unavailable.
		return null;
	}
}

async function checkRecallConnection(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ ok: false, error: 'Recall API key is required' }, 400);
	const response = await recallFetch(env, body.recallRegion, '/api/v1/bot/?use_cursor=true', {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({
		ok: false,
		error: response.status === 401 || response.status === 403
			? 'Recall rejected this key for the selected region.'
			: `Recall validation failed (${response.status}).`,
	}, response.status);
	return json({ ok: true, region: String(body.recallRegion || 'us-east-1') });
}

async function checkAnthropicConnection(request, env) {
	const body = await readJson(request);
	const apiKey = body.anthropicApiKey || env.ANTHROPIC_API_KEY || '';
	if (!apiKey) return json({ ok: false, error: 'Anthropic API key is required' }, 400);
	const model = String(body.anthropicModel || env.ANTHROPIC_MODEL || '').trim();
	const response = await fetchImpl(env)('https://api.anthropic.com/v1/models?limit=100', {
		method: 'GET',
		headers: {
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
		},
	});
	const data = await safeJson(response);
	if (!response.ok) return json({
		ok: false,
		error: response.status === 401 || response.status === 403
			? 'Anthropic rejected this API key.'
			: `Anthropic validation failed (${response.status}).`,
	}, response.status);
	const models = Array.isArray(data && data.data) ? data.data : [];
	return json({
		ok: true,
		model,
		modelAvailable: !model || models.some(item => item && item.id === model),
	});
}

async function getRecallBot(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.botId) return json({ error: 'botId is required' }, 400);
	const response = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/`, {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({ error: recallError(data, response.status), detail: data }, response.status);
	return json(data);
}

async function getRecallDiagnostics(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.botId) return json({ error: 'botId is required' }, 400);
	const live = await liveTranscriptPayload(body.botId, env);
	const response = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/`, {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const bot = await safeJson(response);
	if (!response.ok) return json({ error: recallError(bot, response.status) }, response.status);
	return json({ ok: true, debug: await transcriptDebug(env, body.recallRegion, apiKey, bot, live) });
}

/** Pull the notetaker out of the call. Recall keeps whatever it has already recorded. */
async function leaveRecallCall(request, env) {
	const body = await readJson(request);
	const apiKey = body.recallApiKey || env.RECALL_API_KEY;
	if (!apiKey) return json({ error: 'Missing Recall API key' }, 400);
	if (!body.botId) return json({ error: 'Missing bot id' }, 400);
	const response = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/leave_call/`, {
		method: 'POST',
		headers: recallHeaders(apiKey),
		body: JSON.stringify({}),
	});
	const data = await safeJson(response);
	// Recall answers 200/202 with the bot, or 204 with nothing at all.
	if (!response.ok) return json({ error: recallError(data, response.status), detail: data }, response.status);
	return json(data && typeof data === 'object' ? data : { ok: true });
}

/** Delete a bot that Recall has scheduled but has not yet sent into the meeting. */
async function cancelScheduledRecallBot(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.botId) return json({ error: 'botId is required' }, 400);
	const response = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/`, {
		method: 'DELETE',
		headers: recallHeaders(apiKey, false),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({ error: recallError(data, response.status), detail: data }, response.status);
	return json({ ok: true });
}

async function getRecallTranscript(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.botId) return json({ error: 'botId is required' }, 400);
	const live = await liveTranscriptPayload(body.botId, env);
	const botResponse = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/`, {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const bot = await safeJson(botResponse);
	const debug = botResponse.ok ? await transcriptDebug(env, body.recallRegion, apiKey, bot, live) : { liveRows: live.results.length };
	console.info('[recall-ai bridge] transcript poll', {
		botId: body.botId,
		botStatus: botResponse.ok ? latestRecallStatus(bot) : `bot_fetch_${botResponse.status}`,
		liveRows: live.results.length,
		realtimeEndpoints: debug.realtimeEndpoints,
		realtimeEndpointStatuses: debug.realtimeEndpointStatuses,
	});
	if (botResponse.ok) {
		const downloadUrl = transcriptDownloadUrl(bot);
		const downloaded = downloadUrl ? await fetchTranscriptDownload(env, downloadUrl) : null;
		if (downloaded && downloaded.ok && hasTranscriptRows(downloaded.data)) {
			console.info('[recall-ai bridge] final transcript rows ready', {
				botId: body.botId,
				rows: transcriptRowCount(downloaded.data),
				source: 'bot.media_shortcuts',
			});
			return json(downloaded.data);
		}
		if (downloaded && !downloaded.ok && live.results.length) return json(live);

		const listed = await fetchDoneTranscriptByRecording(env, body.recallRegion, apiKey, bot);
		if (listed && listed.ok && hasTranscriptRows(listed.data)) {
			console.info('[recall-ai bridge] final transcript rows ready', {
				botId: body.botId,
				rows: transcriptRowCount(listed.data),
				source: 'transcript.list',
			});
			return json(listed.data);
		}

		// If neither final source returned rows, DON'T give up here — fall through to the legacy
		// /transcript/ endpoint below, then the live buffer, then pending. Returning pending here skipped
		// the legacy endpoint, so a "done" transcript with a stale media_shortcuts URL dead-ended as
		// "not ready" even though the rows were still reachable.
	} else if (!live.results.length) {
		return json({ error: recallError(bot, botResponse.status), detail: bot }, botResponse.status);
	}

	const legacyResponse = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/transcript/`, {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const legacy = await safeJson(legacyResponse);
	if (legacyResponse.ok && hasTranscriptRows(legacy)) return json(legacy);
	if (live.results.length) return json(live);
	console.info('[recall-ai bridge] transcript pending', {
		botId: body.botId,
		debug,
	});
	return json({
		pending: true,
		results: [],
		bot: botResponse.ok ? bot : null,
		debug,
	}, 202);
}

/** Download the finalized participant roster, including attendees who never spoke. */
async function getRecallParticipants(request, env) {
	const body = await readJson(request);
	const apiKey = recallApiKey(body, env);
	if (!apiKey) return json({ error: 'Recall API key is required' }, 400);
	if (!body.botId) return json({ error: 'botId is required' }, 400);
	const botResponse = await recallFetch(env, body.recallRegion, `/api/v1/bot/${encodeURIComponent(body.botId)}/`, {
		method: 'GET',
		headers: recallHeaders(apiKey, false),
	});
	const bot = await safeJson(botResponse);
	if (!botResponse.ok) return json({ error: recallError(bot, botResponse.status), detail: bot }, botResponse.status);

	const direct = await fetchParticipantDownloads(env, participantDownloadUrls(bot));
	if (direct.length) return json({ participants: direct, source: 'bot.media_shortcuts' });

	const listedUrls = await participantDownloadUrlsByRecording(env, body.recallRegion, apiKey, bot);
	const listed = await fetchParticipantDownloads(env, listedUrls);
	if (listed.length) return json({ participants: listed, source: 'participant_events.list' });

	return json({ participants: [], pending: true }, 202);
}

async function receiveRealtimeTranscript(request, env) {
	const rawBody = await request.text();
	try {
		await verifyRecallWebhook(request.headers, rawBody, env.RECALL_WORKSPACE_VERIFICATION_SECRET || '');
	} catch (err) {
		console.warn('[recall-ai bridge] rejected realtime webhook', { error: errorMessage(err) });
		return json({ ok: false, error: 'Recall webhook verification failed' }, 401);
	}
	const payload = parseJson(rawBody);
	const botId = botIdFromPayload(payload);
	if (!botId) {
		console.info('[recall-ai bridge] realtime ignored: missing bot id', {
			event: payload && payload.event || null,
			keys: payload && typeof payload === 'object' ? Object.keys(payload) : [],
		});
		return json({ ok: true, ignored: 'missing bot id' }, 202);
	}
	const eventName = (payload && payload.event) || '';
	const receivedAt = Date.now();
	const row = eventName && eventName !== 'transcript.data' ? null : normalizeRealtimeTranscript(payload);
	if (row && !row.absoluteTime) row.absoluteTime = new Date(receivedAt).toISOString();
	const eventId = await realtimeEventId(request.headers, rawBody);
	const event = {
		id: eventId,
		botId,
		eventName: eventName || null,
		parseStatus: eventName && eventName !== 'transcript.data' ? 'ignored_non_final' : (row && row.text ? 'parsed' : 'empty_transcript'),
		receivedAt,
		row: row && row.text ? row : null,
		transcriptId: artifactId(payload, 'transcript'),
		recordingId: artifactId(payload, 'recording'),
	};
	const session = upsertSession(botId);
	mergeRealtimeEvent(session, event);
	await saveRealtimeEvent(event, env);
	if (!event.row) {
		console.info('[recall-ai bridge] realtime ignored: empty transcript', {
			botId,
			event: eventName || null,
			parseStatus: event.parseStatus,
			hasWords: !!(payload && payload.data && payload.data.data && payload.data.data.words),
		});
		return json({ ok: true, ignored: event.parseStatus }, 202);
	}
	console.info('[recall-ai bridge] realtime transcript row', {
		botId,
		speaker: row.speaker,
		textLength: row.text.length,
		rows: session.rows.length,
		receivedPosts: session.receivedPosts,
	});
	return json({ ok: true }, 202);
}

async function verifyRecallWebhook(headers, rawBody, secret) {
	if (!secret) return { configured: false };
	if (!String(secret).startsWith('whsec_')) throw new Error('Verification secret must start with whsec_');
	const id = headers.get('webhook-id') || headers.get('svix-id') || '';
	const timestamp = headers.get('webhook-timestamp') || headers.get('svix-timestamp') || '';
	const signatures = headers.get('webhook-signature') || headers.get('svix-signature') || '';
	if (!id || !timestamp || !signatures) throw new Error('Missing verification headers');
	const seconds = Number(timestamp);
	if (!Number.isFinite(seconds) || Math.abs(Date.now() / 1000 - seconds) > WEBHOOK_MAX_AGE_SECONDS) throw new Error('Stale webhook timestamp');
	const keyBytes = base64Bytes(String(secret).slice('whsec_'.length));
	const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const message = new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`);
	const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, message));
	for (const token of signatures.split(/\s+/)) {
		const [version, encoded] = token.split(',');
		if (version !== 'v1' || !encoded) continue;
		let actual;
		try { actual = base64Bytes(encoded); } catch { continue; }
		if (timingSafeEqual(expected, actual)) return { configured: true };
	}
	throw new Error('No matching signature');
}

async function realtimeEventId(headers, rawBody) {
	const supplied = headers.get('webhook-id') || headers.get('svix-id') || '';
	if (supplied) return supplied.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);
	try {
		const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawBody)));
		return `fallback-${Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('')}`;
	} catch {
		return `fallback-${fnv1a(rawBody)}`;
	}
}

function artifactId(payload, kind) {
	const outer = payload && payload.data || {};
	return firstString(outer && outer[kind] && outer[kind].id, payload && payload[`${kind}_id`]) || null;
}

async function createSummary(request, env) {
	const body = await readJson(request);
	const apiKey = body.anthropicApiKey || env.ANTHROPIC_API_KEY || '';
	if (!apiKey) return json({ error: 'Anthropic API key is required' }, 400);
	if (!body.transcriptText) return json({ error: 'transcriptText is required' }, 400);
	const prompt = body.summaryPrompt || 'Summarize this meeting transcript.';
	// Caller-supplied token cap (topic-sectioning needs more headroom than a plain summary), clamped so a
	// bad value can't run up a huge bill. Falls back to the old default, so older plugins are unaffected.
	const maxTokens = Number(body.maxTokens) > 0
		? Math.min(Math.floor(Number(body.maxTokens)), 8000)
		: (Number(env.MAX_TOKENS) || 1400);
	const response = await fetchImpl(env)('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			model: body.anthropicModel || env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
			max_tokens: maxTokens,
			messages: [{
				role: 'user',
				content: `${prompt}\n\nTranscript:\n${body.transcriptText}`,
			}],
		}),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({ error: anthropicError(data, response.status), detail: data }, response.status);
	const summary = Array.isArray(data.content)
		? data.content.map(part => part && part.type === 'text' ? part.text : '').join('\n').trim()
		: '';
	return json({ summary, anthropic: data });
}

async function recallFetch(env, region, path, options) {
	const response = await fetchWithBackoff(fetchImpl(env), `${recallBaseUrl(region)}${path}`, options);
	return response;
}

async function fetchWithBackoff(doFetch, url, options, maxAttempts = 5) {
	let lastResponse = null;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const response = await doFetch(url, options);
		lastResponse = response;
		if (![429, 503, 507].includes(response.status)) return response;
		const retryAfter = Number(response.headers && response.headers.get ? response.headers.get('retry-after') : 0);
		const delayMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 500 * 2 ** attempt);
		await new Promise(resolve => setTimeout(resolve, delayMs));
	}
	return lastResponse;
}

function recallBaseUrl(region) {
	return RECALL_REGIONS[String(region || 'us-east-1').toLowerCase()] || RECALL_REGIONS['us-east-1'];
}

function recallApiKey(body, env) {
	return body.recallApiKey || env.RECALL_API_KEY || '';
}

function recallHeaders(apiKey, includeContentType = true) {
	const headers = { Authorization: `Token ${apiKey}` };
	if (includeContentType) headers['Content-Type'] = 'application/json';
	return headers;
}

function fetchImpl(env) {
	return env.__fetch || fetch;
}

async function fetchJpegAsBase64(url, env) {
	if (!/^https:\/\//i.test(url)) throw new Error('Bot image URL must be HTTPS.');
	const response = await fetchImpl(env)(url);
	if (!response.ok) throw new Error(`Unable to fetch bot image: ${response.status}`);
	const contentType = response.headers.get('content-type') || '';
	if (!/jpe?g/i.test(contentType)) throw new Error('Bot image must be a JPEG.');
	const bytes = new Uint8Array(await response.arrayBuffer());
	if (bytes.byteLength > 1_300_000) throw new Error('Bot image JPEG must be under 1.3MB.');
	return {
		kind: 'jpeg',
		b64_data: bytesToBase64(bytes),
	};
}

function jpegFromBase64(value) {
	const b64 = String(value || '').replace(/^data:image\/jpe?g;base64,/i, '').trim();
	if (!b64) throw new Error('Uploaded bot image is empty.');
	const approxBytes = Math.ceil(b64.length * 3 / 4);
	if (approxBytes > 1_300_000) throw new Error('Bot image JPEG must be under 1.3MB.');
	return {
		kind: 'jpeg',
		b64_data: b64,
	};
}

function bytesToBase64(bytes) {
	let binary = '';
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}

async function readJson(request) {
	try { return await request.json(); }
	catch { return {}; }
}

function parseJson(value) {
	try { return JSON.parse(String(value || '')); }
	catch { return {}; }
}

function base64Bytes(value) {
	const binary = atob(String(value || ''));
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
	return bytes;
}

function timingSafeEqual(a, b) {
	if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array) || a.length !== b.length) return false;
	let difference = 0;
	for (let index = 0; index < a.length; index++) difference |= a[index] ^ b[index];
	return difference === 0;
}

function fnv1a(value) {
	let hash = 2166136261;
	for (const char of String(value || '')) {
		hash ^= char.charCodeAt(0);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(36);
}

async function safeJson(response) {
	try { return await response.json(); }
	catch { return {}; }
}

function latestRecallStatus(bot) {
	if (!bot) return '';
	if (typeof bot.status === 'string') return bot.status;
	if (bot.status && typeof bot.status.code === 'string') return bot.status.code;
	const changes = Array.isArray(bot.status_changes) ? bot.status_changes : [];
	const last = changes[changes.length - 1];
	return last && (last.code || last.status || last.message) || '';
}

function upsertSession(botId, patch = {}) {
	let session = LIVE_SESSIONS.get(botId);
	if (!session) {
		session = {
			botId,
			events: new Map(),
			rows: [],
			receivedPosts: 0,
			parseFailures: 0,
			updatedAt: 0,
		};
		LIVE_SESSIONS.set(botId, session);
	}
	Object.assign(session, patch);
	return session;
}

async function getLiveSession(botId, env, refresh = false) {
	const existing = LIVE_SESSIONS.get(botId);
	if (refresh) {
		const stored = await loadLiveSession(botId, env);
		if (stored) return stored;
	}
	if (existing) return existing;
	const stored = await loadLiveSession(botId, env);
	if (stored) return stored;
	return upsertSession(botId);
}

async function liveTranscriptPayload(botId, env) {
	// Always reconcile KV. A previous poll may have cached an empty session in this isolate while
	// Recall delivered its webhooks to another isolate; returning that stale cache caused live_rows=0
	// for the entire meeting even though the rows were safely sitting in KV.
	const session = await getLiveSession(botId, env, true);
	const lastEvent = latestRealtimeEvent(session);
	return {
		results: session ? session.rows : [],
		live: true,
		receivedPosts: session ? Number(session.receivedPosts) || 0 : 0,
		parseFailures: session ? Number(session.parseFailures) || 0 : 0,
		parseStatusCounts: realtimeParseStatusCounts(session),
		lastEventName: lastEvent && lastEvent.eventName || null,
		lastParseStatus: lastEvent && lastEvent.parseStatus || null,
		updatedAt: session && session.updatedAt ? session.updatedAt : null,
		bridgeVersion: BRIDGE_VERSION,
	};
}

async function loadLiveSession(botId, env) {
	const store = transcriptStore(env);
	if (!store || !store.get) return LIVE_SESSIONS.get(botId) || null;
	try {
		const session = upsertSession(botId);
		// One-release migration path for the pre-1.22 coalesced session key.
		const legacy = await store.get(`bot:${botId}`, 'json');
		if (legacy && Array.isArray(legacy.rows)) {
			legacy.rows.forEach((row, index) => mergeRealtimeEvent(session, {
				id: `legacy-${index}-${fnv1a(`${row && row.relativeTime || ''}:${row && row.speaker || ''}:${row && row.text || ''}`)}`,
				botId,
				eventName: 'transcript.data',
				parseStatus: row && row.text ? 'parsed' : 'empty_transcript',
				receivedAt: Number(legacy.updatedAt) || 0,
				row: row && row.text ? row : null,
			}));
		}
		const keys = await listRealtimeEventKeys(store, botId);
		for (let index = 0; index < keys.length; index += 100) {
			const batch = keys.slice(index, index + 100);
			const values = await getKvJsonBatch(store, batch);
			for (const key of batch) {
				const event = values.get(key);
				if (event && event.id) mergeRealtimeEvent(session, event);
			}
		}
		// Legacy counts include ignored posts that cannot be reconstructed as individual keys.
		session.receivedPosts = Math.max(Number(session.receivedPosts) || 0, Number(legacy && legacy.receivedPosts) || 0);
		session.updatedAt = Math.max(Number(session.updatedAt) || 0, Number(legacy && legacy.updatedAt) || 0);
		return session;
	} catch {
		return LIVE_SESSIONS.get(botId) || null;
	}
}

async function saveRealtimeEvent(event, env) {
	const store = transcriptStore(env);
	if (!store || !store.put) {
		// Workers run many isolates: the isolate Recall POSTs to is usually NOT the one the plugin
		// polls. Without KV the rows live in one isolate's memory and are never seen again — which
		// looks exactly like "Recall never sent a transcript". Say so, loudly, every time.
		console.error('[recall-ai bridge] NO KV BINDING — the live transcript exists only in this Worker isolate. Bind a KV namespace named RECALL_TRANSCRIPTS.', { botId: event.botId });
		return;
	}
	try {
		await store.put(realtimeEventKey(event.botId, event.id), JSON.stringify(event), { expirationTtl: REALTIME_TTL_SECONDS });
	} catch (err) {
		console.error('[recall-ai bridge] KV event write failed', { botId: event.botId, eventId: event.id, error: errorMessage(err) });
	}
}

function mergeRealtimeEvent(session, event) {
	if (!session || !event || !event.id || session.events.has(event.id)) return;
	session.events.set(event.id, event);
	const ordered = Array.from(session.events.values()).sort(compareRealtimeEvents);
	const rows = [];
	const rowKeys = new Set();
	for (const item of ordered) {
		const row = item && item.row;
		if (!row || !row.text) continue;
		const key = `${row.relativeTime == null ? '' : row.relativeTime}:${row.speaker}:${row.text}`;
		if (rowKeys.has(key)) continue;
		rowKeys.add(key);
		rows.push(row);
	}
	session.rows = rows.slice(-5000);
	session.receivedPosts = session.events.size;
	session.parseFailures = ordered.filter(item => item && item.parseStatus !== 'parsed').length;
	session.updatedAt = Math.max(...ordered.map(item => Number(item && item.receivedAt) || 0), Number(session.updatedAt) || 0) || Date.now();
}

function realtimeParseStatusCounts(session) {
	const counts = {};
	const events = session && session.events instanceof Map ? Array.from(session.events.values()) : [];
	for (const event of events) {
		const status = String(event && event.parseStatus || 'unknown');
		counts[status] = (counts[status] || 0) + 1;
	}
	return counts;
}

function latestRealtimeEvent(session) {
	const events = session && session.events instanceof Map ? Array.from(session.events.values()) : [];
	return events.sort((left, right) => {
		const receipt = (Number(right && right.receivedAt) || 0) - (Number(left && left.receivedAt) || 0);
		return receipt || String(right && right.id || '').localeCompare(String(left && left.id || ''));
	})[0] || null;
}

function compareRealtimeEvents(a, b) {
	const ar = Number(a && a.row && a.row.relativeTime);
	const br = Number(b && b.row && b.row.relativeTime);
	const aHas = Number.isFinite(ar);
	const bHas = Number.isFinite(br);
	if (aHas && bHas && ar !== br) return ar - br;
	if (aHas !== bHas) return aHas ? -1 : 1;
	const received = (Number(a && a.receivedAt) || 0) - (Number(b && b.receivedAt) || 0);
	return received || String(a && a.id || '').localeCompare(String(b && b.id || ''));
}

function realtimeEventKey(botId, eventId) {
	return `bot:${botId}:event:${eventId}`;
}

async function listRealtimeEventKeys(store, botId) {
	if (!store || typeof store.list !== 'function') return [];
	const prefix = `bot:${botId}:event:`;
	const keys = [];
	let cursor = undefined;
	do {
		const page = await store.list({ prefix, limit: 1000, ...(cursor ? { cursor } : {}) });
		for (const item of Array.isArray(page && page.keys) ? page.keys : []) {
			if (item && item.name) keys.push(item.name);
		}
		cursor = page && page.list_complete === false ? page.cursor : undefined;
	} while (cursor);
	return keys;
}

async function getKvJsonBatch(store, keys) {
	if (!keys.length) return new Map();
	try {
		const result = await store.get(keys, 'json');
		if (result instanceof Map) return result;
	} catch { /* older mocks/runtimes: fall through */ }
	const pairs = await Promise.all(keys.map(async key => [key, await store.get(key, 'json')]));
	return new Map(pairs);
}

function transcriptStore(env) {
	return env.RECALL_TRANSCRIPTS || env.RECALL_AI_TRANSCRIPTS || env.TRANSCRIPTS_KV || null;
}

function hasTranscriptRows(data) {
	return Array.isArray(data)
		? data.length > 0
		: !!(data && ((Array.isArray(data.results) && data.results.length) || (Array.isArray(data.transcript) && data.transcript.length)));
}

function transcriptRowCount(data) {
	if (Array.isArray(data)) return data.length;
	if (data && Array.isArray(data.results)) return data.results.length;
	if (data && Array.isArray(data.transcript)) return data.transcript.length;
	return 0;
}

function transcriptDownloadUrl(bot) {
	const recordings = Array.isArray(bot && bot.recordings) ? bot.recordings : [];
	for (const recording of recordings) {
		const transcript = recording && recording.media_shortcuts && recording.media_shortcuts.transcript;
		const url = transcript && transcript.data && transcript.data.download_url;
		if (typeof url === 'string' && /^https:\/\//i.test(url)) return url;
	}
	return '';
}

function participantDownloadUrls(bot) {
	const urls = [];
	const recordings = Array.isArray(bot && bot.recordings) ? bot.recordings : [];
	for (const recording of recordings) {
		const artifact = recording && recording.media_shortcuts && recording.media_shortcuts.participant_events;
		const url = artifact && artifact.data && artifact.data.participants_download_url;
		if (typeof url === 'string' && /^https:\/\//i.test(url) && !urls.includes(url)) urls.push(url);
	}
	return urls;
}

async function participantDownloadUrlsByRecording(env, region, apiKey, bot) {
	const urls = [];
	const recordings = Array.isArray(bot && bot.recordings) ? bot.recordings : [];
	for (const recording of recordings) {
		if (!recording || !recording.id) continue;
		const response = await recallFetch(env, region, `/api/v1/participant_events/?recording_id=${encodeURIComponent(recording.id)}`, {
			method: 'GET',
			headers: recallHeaders(apiKey, false),
		});
		const data = await safeJson(response);
		if (!response.ok) continue;
		const rows = Array.isArray(data && data.results) ? data.results : Array.isArray(data) ? data : [];
		for (const row of rows) {
			const url = row && row.data && row.data.participants_download_url;
			if (typeof url === 'string' && /^https:\/\//i.test(url) && !urls.includes(url)) urls.push(url);
		}
	}
	return urls;
}

async function fetchParticipantDownloads(env, urls) {
	const participants = [];
	for (const url of Array.isArray(urls) ? urls : []) {
		try {
			const response = await fetchImpl(env)(url, { method: 'GET', headers: { accept: 'application/json' } });
			const data = await safeJson(response);
			if (!response.ok || !Array.isArray(data)) continue;
			participants.push(...data.filter(participant => participant && typeof participant === 'object'));
		} catch {
			// Try the next recording/artifact; the plugin has a transcript-speaker fallback.
		}
	}
	return participants;
}

async function fetchTranscriptDownload(env, downloadUrl) {
	const response = await fetchImpl(env)(downloadUrl, {
		method: 'GET',
		headers: { accept: 'application/json' },
	});
	const data = await safeJson(response);
	return {
		ok: response.ok,
		status: response.status,
		data,
		detail: data,
	};
}

async function fetchDoneTranscriptByRecording(env, region, apiKey, bot) {
	const recordings = Array.isArray(bot && bot.recordings) ? bot.recordings : [];
	for (const recording of recordings) {
		if (!recording || !recording.id) continue;
		const response = await recallFetch(env, region, `/api/v1/transcript/?recording_id=${encodeURIComponent(recording.id)}&status_code=done`, {
			method: 'GET',
			headers: recallHeaders(apiKey, false),
		});
		const data = await safeJson(response);
		if (!response.ok) return { ok: false, status: response.status, detail: data };
		const rows = Array.isArray(data && data.results) ? data.results : Array.isArray(data) ? data : [];
		const transcript = rows.find(item => item && item.data && item.data.download_url) || null;
		if (!transcript) continue;
		const downloaded = await fetchTranscriptDownload(env, transcript.data.download_url);
		if (downloaded.ok && hasTranscriptRows(downloaded.data)) return downloaded;
		if (!downloaded.ok) return downloaded;
	}
	return null;
}

async function transcriptDebug(env, region, apiKey, bot, live) {
	const recordings = Array.isArray(bot && bot.recordings) ? bot.recordings : [];
	const shortcuts = recordings
		.map(recording => recording && recording.media_shortcuts && recording.media_shortcuts.transcript)
		.filter(Boolean);
	const realtime = await realtimeEndpointDebug(env, region, apiKey, recordings);
	return {
		botStatus: latestRecallStatus(bot) || null,
		recordings: recordings.length,
		transcriptArtifacts: shortcuts.length,
		transcriptStatuses: shortcuts.map(transcript => transcript && transcript.status && (transcript.status.code || transcript.status)).filter(Boolean),
		hasDownloadUrl: !!transcriptDownloadUrl(bot),
		// The single most useful field here. liveRows=0 has two very different causes — Recall never
		// called us, or we had nowhere to put what it sent — and they are indistinguishable without it.
		kv: transcriptStore(env) ? 'bound' : 'MISSING',
		liveRows: live && Array.isArray(live.results) ? live.results.length : 0,
		realtimePosts: live ? Number(live.receivedPosts) || 0 : 0,
		realtimeParseFailures: live ? Number(live.parseFailures) || 0 : 0,
		realtimeParseStatuses: live && live.parseStatusCounts || {},
		lastRealtimeEvent: live && live.lastEventName || null,
		lastRealtimeParseStatus: live && live.lastParseStatus || null,
		liveUpdatedAt: live ? live.updatedAt : null,
		bridgeVersion: BRIDGE_VERSION,
		webhookVerification: env.RECALL_WORKSPACE_VERIFICATION_SECRET ? 'enforced' : 'compatibility',
		...realtime,
	};
}

async function realtimeEndpointDebug(env, region, apiKey, recordings) {
	const recordingIds = recordings.map(recording => recording && recording.id).filter(Boolean);
	if (!recordingIds.length) return { realtimeEndpoints: 0, realtimeEndpointStatuses: [] };
	const endpoints = [];
	for (const recordingId of recordingIds.slice(0, 2)) {
		try {
			const response = await recallFetch(env, region, `/api/v1/realtime_endpoint/?recording_id=${encodeURIComponent(recordingId)}`, {
				method: 'GET',
				headers: recallHeaders(apiKey, false),
			});
			const data = await safeJson(response);
			if (!response.ok) {
				endpoints.push({ recordingId, status: `fetch_${response.status}` });
				continue;
			}
			const rows = Array.isArray(data && data.results) ? data.results : Array.isArray(data) ? data : [];
			for (const row of rows) {
				endpoints.push({
					recordingId,
					type: row.type || null,
					status: row.status && (row.status.code || row.status) || row.status_code || null,
					events: row.events || row.config && row.config.events || [],
					url: row.url || row.config && row.config.url || null,
				});
			}
		} catch (err) {
			endpoints.push({ recordingId, status: `error:${errorMessage(err)}` });
		}
	}
	return {
		realtimeEndpoints: endpoints.length,
		realtimeEndpointStatuses: endpoints.map(endpoint => endpoint.status || 'unknown'),
		realtimeEndpointEvents: endpoints.map(endpoint => endpoint.events).filter(events => Array.isArray(events) && events.length),
	};
}

function botIdFromPayload(payload) {
	const data = payload && payload.data ? payload.data : payload;
	return firstString(
		payload && payload.bot_id,
		data && data.bot_id,
		data && data.bot && data.bot.id,
		data && data.recording && data.recording.bot_id,
		data && data.transcript && data.transcript.bot_id,
	);
}

function normalizeRealtimeTranscript(payload) {
	const eventData = payload && payload.data ? payload.data : payload;
	const data = eventData && eventData.data ? eventData.data : eventData;
	const words = Array.isArray(data && data.words) ? data.words : [];
	const text = firstString(
		data && data.text,
		data && data.transcript,
		words.map(w => w.text || w.word || '').join(' '),
	).trim();
	const participant = data && data.participant || {};
	const speaker = firstString(
		participant.name,
		data && data.speaker,
		data && data.speaker_name,
		'Speaker',
	).trim();
	const firstWord = words[0] || {};
	return {
		speaker,
		text,
		words,
		participant,
		relativeTime: firstNumber(
			data && data.start_time,
			data && data.start_timestamp,
			firstWord.start_time,
			firstWord.start_timestamp,
			firstWord.start_timestamp && firstWord.start_timestamp.relative,
		),
		// The realtime webhook has no absolute time (only relative); it is stamped at receipt in
		// receiveRealtimeTranscript. Capture the word's absolute here for the rare case it IS present.
		absoluteTime: firstString(
			firstWord.start_timestamp && firstWord.start_timestamp.absolute,
			data && data.start_timestamp && data.start_timestamp.absolute,
		) || null,
	};
}

function firstString(...values) {
	for (const value of values) {
		if (typeof value === 'string' && value.trim()) return value;
	}
	return '';
}

function firstNumber(...values) {
	for (const value of values) {
		const n = Number(value);
		if (Number.isFinite(n)) return n;
	}
	return null;
}

function recallError(data, status) {
	const detail = errorDetail(data);
	if (detail) return detail;
	return `Recall returned ${status}`;
}

function anthropicError(data, status) {
	if (data && data.error && data.error.message) return data.error.message;
	return `Anthropic returned ${status}`;
}

function errorMessage(err) {
	return err && err.message ? err.message : String(err);
}

function errorDetail(data) {
	if (!data) return '';
	if (typeof data === 'string') return data;
	for (const key of ['detail', 'message', 'error']) {
		const value = data[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
		if (value && typeof value === 'object') {
			if (typeof value.message === 'string' && value.message.trim()) return value.message.trim();
			try { return JSON.stringify(value); } catch {}
		}
	}
	try { return JSON.stringify(data); } catch {}
	return '';
}

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json',
			...corsHeaders(),
		},
	});
}

function optionsResponse() {
	return new Response(null, {
		status: 204,
		headers: corsHeaders(),
	});
}

function corsHeaders() {
	return {
		'access-control-allow-origin': '*',
		'access-control-allow-methods': 'GET,POST,OPTIONS',
		'access-control-allow-headers': 'content-type,authorization',
		'access-control-max-age': '86400',
	};
}
