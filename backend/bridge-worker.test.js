import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import worker from './bridge-worker.js';

function kvStore(pageSize = 1000) {
	const values = new Map();
	return {
		values,
		async get(keyOrKeys, type) {
			const parse = value => value == null ? null : type === 'json' ? JSON.parse(value) : value;
			if (Array.isArray(keyOrKeys)) return new Map(keyOrKeys.map(key => [key, parse(values.get(key))]));
			return parse(values.get(keyOrKeys));
		},
		async put(key, value) { values.set(key, value); },
		async list({ prefix = '', cursor } = {}) {
			const offset = Number(cursor) || 0;
			const names = Array.from(values.keys()).filter(key => key.startsWith(prefix)).sort();
			const page = names.slice(offset, offset + pageSize);
			const next = offset + page.length;
			return {
				keys: page.map(name => ({ name })),
				list_complete: next >= names.length,
				...(next < names.length ? { cursor: String(next) } : {}),
			};
		},
	};
}

function realtimePayload(botId, relative, text = 'Hello', speaker = 'Ada') {
	return {
		event: 'transcript.data',
		data: {
			bot: { id: botId },
			transcript: { id: `tx-${botId}` },
			recording: { id: `rec-${botId}` },
			data: {
				participant: { name: speaker },
				words: text ? [{ text, start_timestamp: { relative } }] : [],
			},
		},
	};
}

function signedHeaders(secret, id, timestamp, raw, extraSignature = '') {
	const key = Buffer.from(secret.slice('whsec_'.length), 'base64');
	const signature = createHmac('sha256', key).update(`${id}.${timestamp}.${raw}`).digest('base64');
	return {
		'content-type': 'application/json',
		'webhook-id': id,
		'webhook-timestamp': timestamp,
		'webhook-signature': `${extraSignature ? `${extraSignature} ` : ''}v1,${signature}`,
	};
}

test('create bot forwards through bridge with Recall token', async () => {
	let forwarded = null;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'recall-test-key',
			recallRegion: 'eu-central-1',
			payload: { meeting_url: 'https://meet.google.com/abc-defg-hij', bot_name: 'Thymer' },
		}),
	}), {
		__fetch: async (url, options) => {
			forwarded = { url, options, body: JSON.parse(options.body) };
			return Response.json({ id: 'bot_123', status: { code: 'joining_call' } });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json.botId, 'bot_123');
	assert.equal(json.status, 'joining_call');
	assert.equal(forwarded.url, 'https://eu-central-1.recall.ai/api/v1/bot/');
	assert.equal(forwarded.options.headers.Authorization, 'Token recall-test-key');
	assert.equal(forwarded.body.meeting_url, 'https://meet.google.com/abc-defg-hij');
});

test('create bot adds realtime endpoint and perfect diarization payload', async () => {
	let forwarded = null;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'recall-test-key',
			recallRegion: 'us-east-1',
			bridgeUrl: 'https://bridge.example.com/',
			payload: {
				meeting_url: 'https://meet.google.com/abc-defg-hij',
				recording_config: {
					transcript: {
						provider: { recallai_streaming: { mode: 'prioritize_low_latency', language_code: 'en' } },
						diarization: { use_separate_streams_when_available: true },
					},
				},
			},
		}),
	}), {
		__fetch: async (url, options) => {
			forwarded = { url, options, body: JSON.parse(options.body) };
			return Response.json({ id: 'bot_456' });
		},
	});

	assert.equal(response.status, 200);
	assert.deepEqual(forwarded.body.recording_config.realtime_endpoints, [{
		type: 'webhook',
		url: 'https://bridge.example.com/api/recall/realtime',
		events: ['transcript.data'],
	}]);
	assert.equal(forwarded.body.recording_config.transcript.provider.recallai_streaming.language_code, 'en');
	assert.equal(forwarded.body.recording_config.transcript.diarization.use_separate_streams_when_available, true);
});

test('create bot returns Recall 400 validation detail', async () => {
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'recall-test-key',
			payload: { meeting_url: 'https://meet.google.com/abc-defg-hij' },
		}),
	}), {
		__fetch: async () => Response.json({ detail: { recording_config: ['Invalid config'] } }, { status: 400 }),
	});
	const json = await response.json();

	assert.equal(response.status, 400);
	assert.equal(json.error, '{"recording_config":["Invalid config"]}');
	assert.deepEqual(json.detail, { detail: { recording_config: ['Invalid config'] } });
});

test('scheduled bot cancellation uses Recall delete endpoint', async () => {
	let forwarded = null;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/cancel', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_scheduled', recallApiKey: 'key', recallRegion: 'eu-central-1' }),
	}), {
		__fetch: async (url, options) => {
			forwarded = { url, options };
			return new Response(null, { status: 204 });
		},
	});

	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), { ok: true });
	assert.equal(forwarded.url, 'https://eu-central-1.recall.ai/api/v1/bot/bot_scheduled/');
	assert.equal(forwarded.options.method, 'DELETE');
	assert.equal(forwarded.options.headers.Authorization, 'Token key');
});

test('active-call leave returns Recall errors without masking them', async () => {
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/leave', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_active', recallApiKey: 'key' }),
	}), {
		__fetch: async () => Response.json({ detail: 'Bot is not in a call' }, { status: 400 }),
	});
	const data = await response.json();

	assert.equal(response.status, 400);
	assert.equal(data.error, 'Bot is not in a call');
});

test('realtime webhook buffers transcript rows for transcript polling', async () => {
	const payload = {
		event: 'transcript.data',
		data: {
			bot: { id: 'bot_live' },
			data: {
				participant: { name: 'Ada' },
				words: [
					{ text: 'Hello', start_timestamp: { relative: 3.2 } },
					{ text: 'there' },
				],
			},
		},
	};
	const ingest = await worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	}));
	assert.equal(ingest.status, 202);

	const transcript = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_live', recallApiKey: 'key' }),
	}), {
		__fetch: async () => Response.json({ detail: 'not ready' }, { status: 404 }),
	});
	const json = await transcript.json();

	assert.equal(transcript.status, 200);
	assert.equal(json.results[0].speaker, 'Ada');
	assert.equal(json.results[0].text, 'Hello there');
	assert.equal(json.results[0].relativeTime, 3.2);
	assert.equal(json.receivedPosts, 1);
});

test('transcript polling refreshes KV after this isolate cached an empty live session', async () => {
	let stored = null;
	const kv = {
		async get(_key, type) { return stored && type === 'json' ? JSON.parse(stored) : stored; },
		async put(_key, value) { stored = value; },
	};
	const request = () => new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_stale_cache', recallApiKey: 'key' }),
	});
	const env = {
		RECALL_TRANSCRIPTS: kv,
		__fetch: async (url) => url.endsWith('/api/v1/bot/bot_stale_cache/')
			? Response.json({ status: { code: 'in_call_recording' }, recordings: [] })
			: Response.json({ detail: 'not ready' }, { status: 404 }),
	};

	const first = await worker.fetch(request(), env);
	assert.equal(first.status, 202);

	stored = JSON.stringify({
		botId: 'bot_stale_cache',
		rows: [{ speaker: 'Grace', text: 'Now visible', relativeTime: 4.5 }],
		receivedPosts: 1,
		updatedAt: Date.now(),
	});
	const second = await worker.fetch(request(), env);
	const json = await second.json();

	assert.equal(second.status, 200);
	assert.equal(json.results[0].text, 'Now visible');
	assert.equal(json.receivedPosts, 1);
});

test('transcript polling fetches v1.11 download URL from bot recording', async () => {
	const calls = [];
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_done', recallApiKey: 'key', recallRegion: 'us-west-2' }),
	}), {
		__fetch: async (url) => {
			calls.push(url);
			if (url === 'https://us-west-2.recall.ai/api/v1/bot/bot_done/') {
				return Response.json({
					recordings: [{
						media_shortcuts: {
							transcript: {
								data: { download_url: 'https://download.recall.test/transcript.json' },
							},
						},
					}],
				});
			}
			if (url === 'https://download.recall.test/transcript.json') {
				return Response.json([{
					participant: { name: 'Grace' },
					words: [{ text: 'Final transcript', start_timestamp: { relative: 12 } }],
				}]);
			}
			return Response.json({ detail: 'unexpected' }, { status: 500 });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json[0].participant.name, 'Grace');
	assert.deepEqual(calls, [
		'https://us-west-2.recall.ai/api/v1/bot/bot_done/',
		'https://download.recall.test/transcript.json',
	]);
});

test('transcript polling falls back to listing done transcript by recording id', async () => {
	const calls = [];
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_done_list', recallApiKey: 'key', recallRegion: 'eu-central-1' }),
	}), {
		__fetch: async (url) => {
			calls.push(url);
			if (url === 'https://eu-central-1.recall.ai/api/v1/bot/bot_done_list/') {
				return Response.json({
					status: { code: 'call_ended' },
					recordings: [{
						id: 'rec_123',
						media_shortcuts: { transcript: { id: 'transcript_123', status: { code: 'done' }, data: {} } },
					}],
				});
			}
			if (url === 'https://eu-central-1.recall.ai/api/v1/realtime_endpoint/?recording_id=rec_123') {
				return Response.json({ results: [] });
			}
			if (url === 'https://eu-central-1.recall.ai/api/v1/transcript/?recording_id=rec_123&status_code=done') {
				return Response.json({ results: [{ data: { download_url: 'https://download.recall.test/listed-transcript.json' } }] });
			}
			if (url === 'https://download.recall.test/listed-transcript.json') {
				return Response.json([{
					participant: { name: 'Lin' },
					words: [{ text: 'Listed transcript', start_timestamp: { relative: 18 } }],
				}]);
			}
			return Response.json({ detail: 'unexpected' }, { status: 500 });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json[0].participant.name, 'Lin');
	assert.ok(calls.includes('https://eu-central-1.recall.ai/api/v1/transcript/?recording_id=rec_123&status_code=done'));
});

test('transcript polling returns pending when final transcript is not ready', async () => {
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_pending', recallApiKey: 'key' }),
	}), {
		__fetch: async (url) => {
			if (url.endsWith('/api/v1/bot/bot_pending/')) {
				return Response.json({ recordings: [{ media_shortcuts: {} }] });
			}
			return Response.json({ detail: 'not found' }, { status: 404 });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 202);
	assert.equal(json.pending, true);
	assert.deepEqual(json.results, []);
});

test('participant polling downloads the finalized roster from media shortcuts', async () => {
	const calls = [];
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/participants', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_people', recallApiKey: 'key', recallRegion: 'us-west-2' }),
	}), {
		__fetch: async (url) => {
			calls.push(url);
			if (url === 'https://us-west-2.recall.ai/api/v1/bot/bot_people/') {
				return Response.json({ recordings: [{ media_shortcuts: { participant_events: {
					data: { participants_download_url: 'https://download.recall.test/participants.json' },
				} } }] });
			}
			if (url === 'https://download.recall.test/participants.json') {
				return Response.json([{ id: 1, name: 'Ada' }, { id: 2, name: 'Silent attendee' }]);
			}
			return Response.json({ detail: 'unexpected' }, { status: 500 });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json.source, 'bot.media_shortcuts');
	assert.deepEqual(json.participants.map(p => p.name), ['Ada', 'Silent attendee']);
	assert.deepEqual(calls, [
		'https://us-west-2.recall.ai/api/v1/bot/bot_people/',
		'https://download.recall.test/participants.json',
	]);
});

test('participant polling falls back to listing participant events by recording', async () => {
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/participants', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_people_list', recallApiKey: 'key', recallRegion: 'eu-central-1' }),
	}), {
		__fetch: async (url) => {
			if (url === 'https://eu-central-1.recall.ai/api/v1/bot/bot_people_list/') {
				return Response.json({ recordings: [{ id: 'recording_people', media_shortcuts: {} }] });
			}
			if (url === 'https://eu-central-1.recall.ai/api/v1/participant_events/?recording_id=recording_people') {
				return Response.json({ results: [{ data: {
					participants_download_url: 'https://download.recall.test/listed-participants.json',
				} }] });
			}
			if (url === 'https://download.recall.test/listed-participants.json') {
				return Response.json([{ id: 7, name: 'Grace', email: 'grace@example.com' }]);
			}
			return Response.json({ detail: 'unexpected' }, { status: 500 });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json.source, 'participant_events.list');
	assert.equal(json.participants[0].email, 'grace@example.com');
});

test('create bot can attach jpeg output image from URL', async () => {
	let forwarded = null;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'recall-test-key',
			botImageUrl: 'https://assets.example.com/bot.jpg',
			payload: { meeting_url: 'https://meet.google.com/abc-defg-hij' },
		}),
	}), {
		__fetch: async (url, options) => {
			if (url === 'https://assets.example.com/bot.jpg') {
				return new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/jpeg' } });
			}
			forwarded = { url, options, body: JSON.parse(options.body) };
			return Response.json({ id: 'bot_img' });
		},
	});

	assert.equal(response.status, 200);
	assert.equal(forwarded.body.automatic_video_output.in_call_recording.kind, 'jpeg');
	assert.equal(forwarded.body.automatic_video_output.in_call_not_recording.b64_data, 'AQID');
});

test('create bot can attach uploaded jpeg base64 image', async () => {
	let forwarded = null;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'recall-test-key',
			botImageData: 'AQID',
			payload: { meeting_url: 'https://meet.google.com/abc-defg-hij' },
		}),
	}), {
		__fetch: async (url, options) => {
			forwarded = { url, options, body: JSON.parse(options.body) };
			return Response.json({ id: 'bot_upload_img' });
		},
	});

	assert.equal(response.status, 200);
	assert.equal(forwarded.body.automatic_video_output.in_call_recording.kind, 'jpeg');
	assert.equal(forwarded.body.automatic_video_output.in_call_recording.b64_data, 'AQID');
});

test('summary endpoint returns text content', async () => {
	const response = await worker.fetch(new Request('https://bridge.test/api/anthropic/summary', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			anthropicApiKey: 'anthropic-test-key',
			anthropicModel: 'claude-test',
			summaryPrompt: 'Summarize',
			transcriptText: 'Ada: Ship it.',
		}),
	}), {
		__fetch: async (url, options) => {
			const body = JSON.parse(options.body);
			assert.equal(url, 'https://api.anthropic.com/v1/messages');
			assert.equal(options.headers['x-api-key'], 'anthropic-test-key');
			assert.equal(body.model, 'claude-test');
			return Response.json({ content: [{ type: 'text', text: 'Decision: ship it.' }] });
		},
	});
	const json = await response.json();

	assert.equal(response.status, 200);
	assert.equal(json.summary, 'Decision: ship it.');
});

test('health and credential checks expose only stable validation state', async () => {
	const health = await worker.fetch(new Request('https://bridge.test/health'), {
		RECALL_TRANSCRIPTS: kvStore(),
		RECALL_WORKSPACE_VERIFICATION_SECRET: 'whsec_dGVzdA==',
	});
	const healthJson = await health.json();
	assert.equal(healthJson.ok, true);
	assert.equal(healthJson.bridgeVersion, '1.22.1');
	assert.equal(healthJson.kv, 'bound');
	assert.equal(healthJson.webhookVerification, 'enforced');
	assert.ok(healthJson.capabilities.includes('append-only-realtime'));
	assert.ok(healthJson.capabilities.includes('parser-diagnostics'));
	assert.ok(healthJson.capabilities.includes('scheduled-bot-cancel'));

	const recall = await worker.fetch(new Request('https://bridge.test/api/recall/check', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ recallApiKey: 'recall-secret', recallRegion: 'eu-central-1' }),
	}), {
		__fetch: async (url, options) => {
			assert.equal(url, 'https://eu-central-1.recall.ai/api/v1/bot/?use_cursor=true');
			assert.equal(options.headers.Authorization, 'Token recall-secret');
			return Response.json({ results: [{ id: 'must-not-leak' }] });
		},
	});
	assert.deepEqual(await recall.json(), { ok: true, region: 'eu-central-1' });

	const anthropic = await worker.fetch(new Request('https://bridge.test/api/anthropic/check', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ anthropicApiKey: 'anthropic-secret', anthropicModel: 'claude-test' }),
	}), {
		__fetch: async (url, options) => {
			assert.equal(url, 'https://api.anthropic.com/v1/models?limit=100');
			assert.equal(options.headers['x-api-key'], 'anthropic-secret');
			return Response.json({ data: [{ id: 'claude-test' }] });
		},
	});
	assert.deepEqual(await anthropic.json(), { ok: true, model: 'claude-test', modelAvailable: true });
});

test('signed realtime webhook accepts rotated signatures and rejects invalid or stale requests', async () => {
	const secret = 'whsec_dGVzdC13ZWJob29rLXNlY3JldA==';
	const store = kvStore();
	const env = { RECALL_TRANSCRIPTS: store, RECALL_WORKSPACE_VERIFICATION_SECRET: secret };
	const raw = JSON.stringify(realtimePayload('bot_signed', 1, 'Verified'));
	const timestamp = String(Math.floor(Date.now() / 1000));
	const valid = await worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
		method: 'POST',
		headers: signedHeaders(secret, 'evt-valid', timestamp, raw, 'v1,AAAA'),
		body: raw,
	}), env);
	assert.equal(valid.status, 202);
	assert.equal(store.values.size, 1);

	const invalid = await worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'webhook-id': 'evt-invalid',
			'webhook-timestamp': timestamp,
			'webhook-signature': 'v1,AAAA',
		},
		body: raw,
	}), env);
	assert.equal(invalid.status, 401);
	assert.equal(store.values.size, 1);

	const staleTimestamp = String(Math.floor(Date.now() / 1000) - 3600);
	const stale = await worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
		method: 'POST',
		headers: signedHeaders(secret, 'evt-stale', staleTimestamp, raw),
		body: raw,
	}), env);
	assert.equal(stale.status, 401);
	assert.equal(store.values.size, 1);
});

test('append-only realtime storage deduplicates, counts malformed events, and orders rows', async () => {
	const store = kvStore();
	const env = { RECALL_TRANSCRIPTS: store };
	const post = (id, payload) => worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'webhook-id': id },
		body: JSON.stringify(payload),
	}), env);
	await Promise.all([
		post('evt-late', realtimePayload('bot_append_only', 8, 'Second')),
		post('evt-early', realtimePayload('bot_append_only', 2, 'First')),
		post('evt-empty', realtimePayload('bot_append_only', 4, '')),
		post('evt-early', realtimePayload('bot_append_only', 2, 'First')),
	]);
	assert.equal(store.values.size, 3);
	assert.ok(Array.from(store.values.keys()).every(key => key.startsWith('bot:bot_append_only:event:')));

	const transcript = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_append_only', recallApiKey: 'key' }),
	}), { ...env, __fetch: async () => Response.json({ detail: 'not ready' }, { status: 404 }) });
	const json = await transcript.json();
	assert.equal(transcript.status, 200);
	assert.deepEqual(json.results.map(row => row.text), ['First', 'Second']);
	assert.equal(json.receivedPosts, 3);
	assert.equal(json.parseFailures, 1);
	assert.deepEqual(json.parseStatusCounts, { parsed: 2, empty_transcript: 1 });
	assert.equal(json.lastEventName, 'transcript.data');
	assert.ok(['parsed', 'empty_transcript'].includes(json.lastParseStatus));
});

test('meeting diagnostics expose parse-status breakdown and last accepted event', async () => {
	const store = kvStore();
	const env = { RECALL_TRANSCRIPTS: store };
	for (const [id, payload] of [
		['evt-diagnostic-parsed', realtimePayload('bot_diagnostics', 1, 'Parsed')],
		['evt-diagnostic-empty', realtimePayload('bot_diagnostics', 2, '')],
	]) {
		await worker.fetch(new Request('https://bridge.test/api/recall/realtime', {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'webhook-id': id },
			body: JSON.stringify(payload),
		}), env);
	}
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/diagnostics', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId: 'bot_diagnostics', recallApiKey: 'key' }),
	}), {
		...env,
		__fetch: async () => Response.json({ status: { code: 'in_call_recording' }, recordings: [] }),
	});
	const { debug } = await response.json();

	assert.equal(response.status, 200);
	assert.deepEqual(debug.realtimeParseStatuses, { parsed: 1, empty_transcript: 1 });
	assert.equal(debug.lastRealtimeEvent, 'transcript.data');
	assert.ok(['parsed', 'empty_transcript'].includes(debug.lastRealtimeParseStatus));
});

test('KV migration reads legacy sessions and paginated event keys in bulk', async () => {
	const store = kvStore(40);
	const botId = 'bot_paginated_migration';
	await store.put(`bot:${botId}`, JSON.stringify({
		botId,
		rows: [{ speaker: 'Ada', text: 'Legacy', relativeTime: 0 }],
		receivedPosts: 1,
		updatedAt: 1,
	}));
	for (let index = 1; index <= 105; index += 1) {
		await store.put(`bot:${botId}:event:${String(index).padStart(3, '0')}`, JSON.stringify({
			id: String(index).padStart(3, '0'),
			botId,
			parseStatus: 'parsed',
			receivedAt: index,
			row: { speaker: 'Ada', text: `Row ${index}`, relativeTime: index },
		}));
	}
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/transcript', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ botId, recallApiKey: 'key' }),
	}), {
		RECALL_TRANSCRIPTS: store,
		__fetch: async () => Response.json({ detail: 'not ready' }, { status: 404 }),
	});
	const json = await response.json();
	assert.equal(response.status, 200);
	assert.equal(json.results.length, 106);
	assert.equal(json.results[0].text, 'Legacy');
	assert.equal(json.results[105].text, 'Row 105');
	assert.equal(json.receivedPosts, 106);
});

test('bot creation reuses a nonterminal bot with matching record metadata', async () => {
	let posts = 0;
	const response = await worker.fetch(new Request('https://bridge.test/api/recall/bots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			recallApiKey: 'key',
			payload: {
				meeting_url: 'https://meet.google.com/reuse-me',
				metadata: { record_guid: 'record-123', plugin: 'thymer-recall-ai' },
			},
		}),
	}), {
		__fetch: async (url, options) => {
			if (options.method === 'POST') posts += 1;
			assert.match(url, /metadata__record_guid=record-123/);
			return Response.json({ results: [{
				id: 'bot-existing',
				meeting_url: 'https://meet.google.com/reuse-me',
				status: { code: 'in_call_recording' },
			}] });
		},
	});
	const json = await response.json();
	assert.equal(response.status, 200);
	assert.equal(json.botId, 'bot-existing');
	assert.equal(json.deduplicated, true);
	assert.equal(posts, 0);
});
