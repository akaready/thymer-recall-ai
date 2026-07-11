# Recall.ai Meetings

Collection plugin for a Thymer Meetings collection. It sends a Recall.ai bot to the meeting URL on a record, polls Recall for the transcript, and writes a Claude-generated summary after the meeting.

Recall settings autosave locally in the browser, overriding defaults from `custom.recallAi` in the plugin JSON. If direct browser requests are blocked, set `Bridge URL` to a hosted copy of the bridge in `backend/bridge-worker.js`.

Plugins are made with 🤍 for the Thymer community. Free to use, fork, and hack on for <a href="LICENSE" target="_blank" rel="noopener noreferrer">non-commercial use</a>.

Plug-ins take effort, hours, and credits to build. If you find them helpful for you and your workflows, a star ⭐ on the repo, a <a href="https://buymeacoffee.com/akaready" target="_blank" rel="noopener noreferrer">coffee</a> ☕, and a link back to <a href="https://akaready.com" target="_blank" rel="noopener noreferrer">@akaready</a> 🔗 all go a long way. Optional of course, but always appreciated.

Enjoy! 🙏

<p align="left">
  <a href="https://buymeacoffee.com/akaready" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="40" alt="Buy me a coffee">
  </a>
</p>

![Recall.ai plugin UI](./recall-ai.png)

&nbsp;

## 📦 Install

**Recommended:** Use the <a href="https://github.com/ahpatel/thymer-plugins-manager" target="_blank" rel="noopener noreferrer">Thymer Plugins Manager</a> and install via <a href="https://github.com/akaready/thymer-[^"]*" target="_blank" rel="noopener noreferrer">this repo's URL</a> for auto updates.

**Manual:** copy <a href="plugin.js" target="_blank" rel="noopener noreferrer"><code>plugin.js</code></a> and <a href="plugin.json" target="_blank" rel="noopener noreferrer"><code>plugin.json</code></a> from this repo into Thymer's plugin editor.


&nbsp;

## 📋 Fields

- `Meeting URL` is the meeting link sent to Recall.
- `Join At` is optional; when set, it is passed as Recall `join_at`.
- `Transcript` receives the fetched Recall transcript.
- `Summary` receives the Claude summary.
- `Recall Bot ID`, `Recall Status`, and `Last Error` track integration state.


















&nbsp;

## 🛠️ Setup

Open `Plugin: Recall.ai Meetings` from the command palette and set:

- Recall API key
- Recall region
- Anthropic API key
- Claude model
- Bridge URL, when browser requests are blocked before Recall sees the key
- Field mappings for Meeting URL, Transcript, and Summary if your collection uses existing properties instead of the defaults
- Bot name
- Bot image JPEG URL, optional. The bridge downloads it and sends it as Recall `automatic_video_output`; use a public HTTPS JPEG, 16:9, ideally 1280x720 and under 1.3MB.
- Optional join chat message
- Poll interval
- Summary prompt

There is no Save button in the settings panel. Edits autosave locally after a short debounce so the plugin does not trigger Thymer's collection settings preview/save flow.

Then open a Meeting record with a `Meeting URL` and click `Transcribe`. Inline references to Meeting records also get a small microphone button when visible in the editor.


















&nbsp;

## 🔄 How Polling Works

After a bot is created, the plugin periodically calls Recall directly or through the bridge:

```text
GET /api/v1/bot/{bot_id}/
GET recordings[].media_shortcuts.transcript.data.download_url from the bot response
```

The default interval is 30 seconds. You can also click `Sync` later on a Meeting record with a `Recall Bot ID` to fetch the final transcript and generate the summary.

When `Bridge URL` is set, the plugin also asks Recall to send real-time `transcript.data` events to `POST /api/recall/realtime` on the bridge. The bridge keeps a short transcript buffer so polling can write live speaker-attributed transcript lines into Thymer while the meeting is running. Bind a Cloudflare KV namespace named `RECALL_TRANSCRIPTS` if you want live updates to survive Worker isolate changes; final post-meeting transcript and summary polling works without KV. Recall perfect diarization is enabled with `recording_config.transcript.diarization.use_separate_streams_when_available`.


















&nbsp;

## 🌉 Bridge

If Recall shows the API key was never used and Thymer shows `Failed to fetch`, the browser request was blocked before it reached Recall. Deploy `backend/bridge-worker.js` to a hosted Worker and paste that URL into `Bridge URL`. The bridge forwards the plugin's per-request keys to Recall/Anthropic.


&nbsp;

## 📊 Anonymous Usage Counter

This plugin pings a <a href="https://www.goatcounter.com/" target="_blank" rel="noopener noreferrer">privacy-respecting counter</a> on first install and once per day of active use. It exists so I can see which plugins are worth continuing to invest in — both "did anyone install it" and "is anyone still using it after a week." Combined with the coffee donations, this is what tells me whether to keep building. It tracks the plugin slug only, no other telemetry or user data, and you can see exactly what I see on the <a href="https://thymer-plugins.goatcounter.com" target="_blank" rel="noopener noreferrer">public dashboard</a>.

**Opt out:** Do Not Track, or `localStorage.setItem('tps-telemetry-opt-out','1')` in the console.
