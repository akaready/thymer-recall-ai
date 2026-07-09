# Recall.ai Bridge

Tiny bridge for environments where the Thymer browser plugin cannot call Recall.ai or Anthropic directly because of CORS/CSP.

The plugin sends its isolated Recall/Anthropic keys with each request; the bridge forwards the request server-side and returns the response. For live transcript rows, the bridge can optionally use a Cloudflare KV namespace named `RECALL_TRANSCRIPTS`.

## Endpoints

- `POST /api/recall/bots`
- `POST /api/recall/bot`
- `POST /api/recall/transcript`
- `POST /api/recall/realtime`
- `POST /api/anthropic/summary`
- `GET /health`

## Deploy Shape

Deploy `bridge-worker.js` as a Cloudflare Worker or any Worker-compatible runtime. After deploy, copy the Worker URL into the plugin's `Bridge URL` setting.

No secrets are required on the Worker when the plugin provides per-request keys. You may optionally set `RECALL_API_KEY`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL` on the Worker to use server-side defaults.

Live transcripts are kept in the Worker's in-memory isolate unless `RECALL_TRANSCRIPTS` KV is bound. In-memory works for quick tests, but Cloudflare can route webhook and polling requests to different isolates. Bind KV if you want live transcript updates to be reliable during the meeting. Final transcript polling does not require KV; after the meeting, the bridge reads Recall's v1.11 `recordings[].media_shortcuts.transcript.data.download_url` and the plugin summarizes from that transcript.
