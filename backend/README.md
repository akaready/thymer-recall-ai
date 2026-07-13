# The Bridge — put it online in ~2 minutes

**You need this. It's free, and you don't need a terminal.**

## What is it, and why do I need one?

The Thymer plugin runs inside your web browser. Browsers are not allowed to call the
Recall and Claude services directly — the browser blocks the request before it ever
leaves your computer. (If you skip this step, Thymer just says **"Failed to fetch"**, and
Recall will show that your API key was never used.)

The **bridge** is a tiny program that sits on the internet and passes those requests along
for you. Thymer talks to your bridge, and your bridge talks to Recall and Claude.

You host it yourself, so **your keys stay yours** — the bridge holds no secrets of its own.
It just forwards whatever the plugin sends it.

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
2. Open [`bridge-worker.js`](./bridge-worker.js) from this folder.
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

If you see a short "ok" response, it's working. 🎉

## Step 6 — Tell the plugin about it

In Thymer, open **Plugin: Recall.ai Meetings** and paste the address (the one **without**
`/health`) into the **Bridge URL** box.

That's it — you're done.

---

## Optional: better live transcripts

Everything works without this. Skip it unless you want the transcript to fill in reliably
*while the meeting is still happening*.

Cloudflare may run your bridge on different machines from one moment to the next, which can
make it forget the live transcript lines it's holding. Giving it a small bit of storage fixes
that:

1. In Cloudflare, go to **Build → Storage & Databases → KV**.
2. Create a namespace. **Name it exactly `RECALL_TRANSCRIPTS`.**
3. Go back to your worker → **Settings → Bindings** → add a **KV namespace** binding, also
   named exactly `RECALL_TRANSCRIPTS`, pointing at the one you just made.
4. Deploy again.

Without this you still get the **full transcript and the summary** after the meeting ends —
you just may not see lines appear live during the call.

---

## Something went wrong

| What you see | What it means |
| --- | --- |
| Thymer says **"Failed to fetch"** | The Bridge URL is empty, wrong, or has a typo. Recall will also show the key was never used. |
| `/health` doesn't load | The worker didn't deploy. Re-check Step 3 — make sure you pasted the *entire* file. |
| **"Recall returned 401"** | The Recall key is wrong, or it belongs to a different region than the one selected in the plugin. Keys are per-region. |
| Transcript is empty during the meeting | Expected without the KV step above. The full transcript still arrives after the meeting. |

---

## Prefer the terminal?

If you'd rather use the CLI: rename `wrangler.toml.example` to `wrangler.toml`, then run
`npx wrangler login` followed by `npx wrangler deploy`. Same result.

## For the curious — what the bridge exposes

`POST /api/recall/bots`, `POST /api/recall/bot`, `POST /api/recall/transcript`,
`POST /api/recall/realtime`, `POST /api/anthropic/summary`, and `GET /health`.

The plugin sends its own Recall/Claude keys with each request and the bridge forwards them.
No secrets need to be stored on the worker. (You *may* optionally set `RECALL_API_KEY`,
`ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL` as worker variables to act as defaults.)
