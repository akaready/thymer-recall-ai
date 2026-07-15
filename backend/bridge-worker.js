const RECALL_REGIONS = Object.freeze({
	'us-east-1': 'https://us-east-1.recall.ai',
	'us-west-2': 'https://us-west-2.recall.ai',
	'eu-central-1': 'https://eu-central-1.recall.ai',
	'ap-northeast-1': 'https://ap-northeast-1.recall.ai',
	payg: 'https://api.recall.ai',
});

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
					kv: store ? 'bound' : 'MISSING',
					kvHint: store ? undefined : 'Bind a KV namespace named RECALL_TRANSCRIPTS to this Worker, or the live transcript cannot be stored.',
				});
			}
			if (request.method !== 'POST') return json({ error: 'Not found' }, 404);
			if (url.pathname === '/api/recall/bots') return await createRecallBot(request, env);
			if (url.pathname === '/api/recall/bot') return await getRecallBot(request, env);
			if (url.pathname === '/api/recall/transcript') return await getRecallTranscript(request, env);
			if (url.pathname === '/api/recall/leave') return await leaveRecallCall(request, env);
			if (url.pathname === '/api/recall/realtime') return await receiveRealtimeTranscript(request, env);
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
	const response = await recallFetch(env, body.recallRegion, '/api/v1/bot/', {
		method: 'POST',
		headers: recallHeaders(apiKey),
		body: JSON.stringify(payload),
	});
	const data = await safeJson(response);
	if (!response.ok) return json({ error: recallError(data, response.status), detail: data }, response.status);
	const botId = data.id || data.bot_id;
	if (botId) upsertSession(botId, { updatedAt: Date.now() });
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
	if (!response.ok) return json({ error: recallErrorMessage(data, response.status), detail: data }, response.status);
	return json(data && typeof data === 'object' ? data : { ok: true });
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

async function receiveRealtimeTranscript(request, env) {
	const payload = await readJson(request);
	const botId = botIdFromPayload(payload);
	if (!botId) {
		console.info('[recall-ai bridge] realtime ignored: missing bot id', {
			event: payload && payload.event || null,
			keys: payload && typeof payload === 'object' ? Object.keys(payload) : [],
		});
		return json({ ok: true, ignored: 'missing bot id' }, 202);
	}
	// Store FINALIZED utterances only. `transcript.partial_data` is the recognizer's live guess —
	// "chap" -> "chapter" -> "chapter 16" -> ... — one event per word as it refines. Storing those
	// filled the transcript with every intermediate state of the same sentence. `transcript.data` is
	// the completed utterance: one clean line. New bots no longer subscribe to partials at all, but a
	// bot created before this fix still sends them, so drop them here too.
	const eventName = (payload && payload.event) || '';
	if (eventName && eventName !== 'transcript.data') {
		return json({ ok: true, ignored: `non-final event ${eventName}` }, 202);
	}
	// Refresh from KV before appending. Webhook POSTs can hit different Worker isolates, so each
	// isolate's in-memory session is only a cache and must never be treated as the source of truth.
	const session = await getLiveSession(botId, env, true);
	session.receivedPosts = (Number(session.receivedPosts) || 0) + 1;
	const row = normalizeRealtimeTranscript(payload);
	if (!row || !row.text) {
		console.info('[recall-ai bridge] realtime ignored: empty transcript', {
			botId,
			event: payload && payload.event || null,
			hasWords: !!(payload && payload.data && payload.data.data && payload.data.data.words),
		});
		session.updatedAt = Date.now();
		await saveLiveSession(session, env);
		return json({ ok: true, ignored: 'empty transcript' }, 202);
	}
	// Stamp the wall-clock time we RECEIVED this finalized utterance — the realtime webhook carries
	// no absolute time, and receipt is within a second or two of when it was spoken. The plugin
	// renders this in the reader's local timezone as "[2:47 PM]".
	if (!row.absoluteTime) row.absoluteTime = new Date().toISOString();
	const key = `${row.relativeTime || ''}:${row.speaker}:${row.text}`;
	if (!session.keys.has(key)) {
		session.keys.add(key);
		session.rows.push(row);
		if (session.rows.length > 5000) session.rows.shift();
	}
	session.updatedAt = Date.now();
	await saveLiveSession(session, env);
	console.info('[recall-ai bridge] realtime transcript row', {
		botId,
		speaker: row.speaker,
		textLength: row.text.length,
		rows: session.rows.length,
		receivedPosts: session.receivedPosts,
	});
	return json({ ok: true }, 202);
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
		session = { botId, rows: [], keys: new Set(), receivedPosts: 0, updatedAt: Date.now() };
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
	return {
		results: session ? session.rows : [],
		live: true,
		receivedPosts: session ? Number(session.receivedPosts) || 0 : 0,
		updatedAt: session ? session.updatedAt : null,
	};
}

async function loadLiveSession(botId, env) {
	const store = transcriptStore(env);
	if (!store || !store.get) return null;
	try {
		const raw = await store.get(`bot:${botId}`, 'json');
		if (!raw || !Array.isArray(raw.rows)) return null;
		const existing = LIVE_SESSIONS.get(botId);
		const rows = [];
		const keys = new Set();
		for (const row of [...raw.rows, ...(existing && Array.isArray(existing.rows) ? existing.rows : [])]) {
			const key = `${row.relativeTime || ''}:${row.speaker}:${row.text}`;
			if (keys.has(key)) continue;
			keys.add(key);
			rows.push(row);
		}
		rows.sort((a, b) => (Number(a && a.relativeTime) || 0) - (Number(b && b.relativeTime) || 0));
		const session = {
			botId,
			rows,
			keys,
			receivedPosts: Math.max(Number(raw.receivedPosts) || 0, Number(existing && existing.receivedPosts) || 0),
			updatedAt: Math.max(Number(raw.updatedAt) || 0, Number(existing && existing.updatedAt) || 0) || Date.now(),
		};
		LIVE_SESSIONS.set(botId, session);
		return session;
	} catch {
		return null;
	}
}

async function saveLiveSession(session, env) {
	const store = transcriptStore(env);
	if (!store || !store.put) {
		// Workers run many isolates: the isolate Recall POSTs to is usually NOT the one the plugin
		// polls. Without KV the rows live in one isolate's memory and are never seen again — which
		// looks exactly like "Recall never sent a transcript". Say so, loudly, every time.
		console.error('[recall-ai bridge] NO KV BINDING — the live transcript is being discarded. Bind a KV namespace named RECALL_TRANSCRIPTS to this Worker.', { botId: session.botId });
		return;
	}
	try {
		await store.put(`bot:${session.botId}`, JSON.stringify({
			botId: session.botId,
			rows: session.rows,
			receivedPosts: Number(session.receivedPosts) || 0,
			updatedAt: session.updatedAt,
		}), { expirationTtl: 60 * 60 * 24 * 7 });
	} catch (err) {
		console.error('[recall-ai bridge] KV write failed — live transcript row lost', { botId: session.botId, error: errorMessage(err) });
	}
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
		liveUpdatedAt: live ? live.updatedAt : null,
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
