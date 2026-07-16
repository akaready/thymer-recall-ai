# The Bridge — put it online in ~2 minutes

**You need this. It's free, and you don't need a terminal.**

## What is it, and why do I need one?

The Thymer plugin runs inside your web browser. Browsers are not allowed to call the
Recall and Claude services directly — the browser blocks the request before it ever
leaves your computer. (If you skip this step, Thymer just says **"Failed to fetch"**, and
Recall will show that your API key was never used.)

The **bridge** is a tiny program that sits on the internet and passes those requests along
for you. Thymer talks to your bridge, and your bridge talks to Recall and Claude.

You host it yourself, so **your Recall and Claude keys stay yours** — the bridge does not retain
them. It just forwards whatever the plugin sends it. You can optionally store Recall's workspace
webhook-verification secret on the Worker so forged realtime events are rejected.

We'll put it on **Cloudflare Workers**, which is free for this.

---

## Step 1 — Make a free Cloudflare account

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up. The free plan is
plenty. You do **not** need to buy a domain.

## Step 2 — Create a Worker

1. In the sidebar, go to **Build → Compute → Workers & Pages**. (There's no top-level
   "Workers" item — it lives under Build.)
2. Click **Create application** (or just **Create**).
3. Choose the **"Hello World"** starter template.
4. Give it a name — something like `thymer-recall-bridge`.
5. Click **Deploy**.

Cloudflare now has a working (but useless) worker. We're about to replace its code with ours.

## Step 3 — Paste in the bridge code

1. Click **Edit code** (this opens a code editor right in your browser).
2. Open <a href="./bridge-worker.js" target="_blank" rel="noopener noreferrer"><code>bridge-worker.js</code></a> from this folder — it opens in a new tab so you don't lose these steps.
3. Copy **the whole file** — every line, top to bottom.
4. Back in Cloudflare's editor: select everything that's there (Ctrl+A / Cmd+A), delete it,
   and paste in what you copied.
5. Click **Deploy**.

## Step 4 — Copy your bridge address

Cloudflare gives your worker a web address that looks like:

```
https://thymer-recall-bridge.your-name.workers.dev
```

Copy it.

## Step 5 — Check that it's alive

Paste your address into a browser tab and add `/health` on the end:

```
https://thymer-recall-bridge.your-name.workers.dev/health
```

You should see a response shaped like this:

```json
{"ok":true,"bridgeVersion":"1.22.1","capabilities":["append-only-realtime","bridge-checks","participant-artifact","parser-diagnostics","scheduled-bot-cancel","signed-realtime"],"kv":"MISSING","webhookVerification":"compatibility"}
```

That's it — your bridge is alive. 🎉 (Your browser may show it with a "Pretty-print"
checkbox above it. That's normal — it's just how browsers display JSON.)

If you get an error page instead, the code didn't deploy. Go back to Step 3 and make sure you
pasted the **entire** file.

## Step 6 — Tell the plugin about it

In Thymer, open **Plugin: Recall.ai Meetings** and paste the address (the one **without**
`/health`) into the **Bridge URL** box.

That's it — you're done.

---

## Add storage for live transcripts

The finalized post-meeting transcript works without this. Add KV if you want the transcript to fill
in reliably *while the meeting is still happening*. Setup Doctor intentionally flags a missing KV
binding because live rows otherwise disappear when Cloudflare routes the poll to another isolate.

Cloudflare may run your bridge on different machines from one moment to the next, which can
make it forget the live transcript lines it's holding. Giving it a small bit of storage fixes
that:

There are two halves: **make** the storage, then **connect** it to your worker. The second half
is the one people get wrong.

### Part 1 — Make the storage

1. In Cloudflare, go to **Build → Storage & Databases → KV**.
2. Click **Create** (a small dialog appears asking for a name).
3. Name it anything you like — `recall-transcripts` is fine. **The namespace's own name does not
   matter**; nothing ever reads it. Confirm.

### Part 2 — Connect it to your worker

This is the part that actually matters.

4. Go to **Build → Compute → Workers & Pages** and click your worker
   (`thymer-recall-bridge`).
5. Open **Settings**, find **Bindings**, and click **Add binding**.
6. A panel slides out asking what *kind* of binding you want. Pick **KV namespace** from the list.
7. It then asks you for **two** things — and people mix these up:

   | Field | What to put |
   | --- | --- |
   | **Variable name** | Type exactly **`RECALL_TRANSCRIPTS`** — in capitals, no spaces. |
   | **KV namespace** | Choose the namespace you made in Part 1 from the dropdown. |

   > ⚠️ **The Variable name is the one that must be exact.** It's the name the bridge's code
   > looks for (`env.RECALL_TRANSCRIPTS`). It does *not* have to match what you called the
   > namespace. Get this wrong and nothing breaks or warns you — the bridge just quietly keeps
   > using memory, and you'll wonder why live transcripts still aren't reliable.

8. Save the binding.
9. **Deploy the worker again.** A binding only takes effect on a *new* deployment. Cloudflare
   usually prompts you to redeploy — if it doesn't, click **Deploy** yourself.

### Did it work?

Nothing visibly changes, which is unnerving. To check: go back to **Settings → Bindings** and you
should see `RECALL_TRANSCRIPTS` listed as a KV namespace binding. That's all there is to see.

Without this you still get the **full transcript and the summary** after the meeting ends — you
just may not see lines appear live during the call. With bridge 1.22+, each webhook is stored under
its own idempotent key for seven days, so simultaneous deliveries no longer race through one shared
session object.

---

## Optional: verify Recall webhooks

Recall can sign realtime requests with a workspace verification secret. This is optional during the
upgrade: if the Worker variable is absent, the bridge stays in compatibility mode and Setup Doctor
shows a warning.

1. In Recall, open **Developers → API Keys & Secrets** and create/copy the workspace verification
   secret. It starts with `whsec_`.
2. In Cloudflare, open the Worker → **Settings → Variables and Secrets** and add an encrypted secret
   named exactly `RECALL_WORKSPACE_VERIFICATION_SECRET`.
3. Redeploy the Worker and run Setup Doctor again.

The bridge verifies the raw request body plus `webhook-id`, `webhook-timestamp`, and every `v1`
signature in `webhook-signature`. It accepts Recall's rotated multi-signature headers and rejects
missing, invalid, or stale signed requests before storing anything.

---

## Something went wrong

| What you see | What it means |
| --- | --- |
| Thymer says **"Failed to fetch"** | The Bridge URL is empty, wrong, or has a typo. Recall will also show the key was never used. |
| `/health` doesn't load | The worker didn't deploy. Re-check Step 3 — make sure you pasted the *entire* file. |
| **"Recall returned 401"** | The Recall key is wrong, or it belongs to a different region than the one selected in the plugin. Keys are per-region. |
| Transcript is empty during the meeting | Run Setup Doctor and Meeting Diagnostics. `webhooks > 0, rows = 0` means parsing; `webhooks = 0` means delivery/configuration. The final transcript still arrives after the meeting. |
| Realtime webhooks return 401 | The configured workspace verification secret does not match Recall, or Recall's signed timestamp is stale. |

---

## Prefer the terminal?

If you'd rather use the CLI: rename `wrangler.toml.example` to `wrangler.toml`, then run
`npx wrangler login` followed by `npx wrangler deploy`. Same result.

## For the curious — what the bridge exposes

`POST /api/recall/bots`, `POST /api/recall/check`, `POST /api/recall/bot`,
`POST /api/recall/diagnostics`, `POST /api/recall/transcript`, `POST /api/recall/participants`,
`POST /api/recall/leave`, `POST /api/recall/cancel`, `POST /api/recall/realtime`,
`POST /api/anthropic/check`, `POST /api/anthropic/summary`, and
`GET /health`.

The plugin sends its own Recall/Claude keys with each request and the bridge forwards them.
No Recall or Claude API keys need to be stored on the worker. (You *may* optionally set
`RECALL_API_KEY`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL` as worker variables to act as defaults.)
`RECALL_WORKSPACE_VERIFICATION_SECRET` is used only to authenticate incoming Recall requests.
