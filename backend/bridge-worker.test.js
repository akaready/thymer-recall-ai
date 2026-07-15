import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from './bridge-worker.js';

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
