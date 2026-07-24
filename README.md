# ChatClone

A self-hosted ChatGPT clone: React frontend, Node/Express backend, and a local LLM served through Ollama — no subscriptions, no API costs, runs entirely on your own machine.

**Features**
- 🔐 Auth — register/login with JWT, passwords hashed with bcrypt
- 💬 Streaming responses — token-by-token, Server-Sent Events (SSE)
- 🧠 Memory — full conversation history persisted per chat in SQLite, replayed to the model each turn for context
- 📎 File uploads — attach `.pdf` or text files; extracted content is added as context to your message
- 🗂️ Multiple conversations — sidebar with create/switch/delete, like ChatGPT's chat list

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | `node:sqlite` (Node's built-in SQLite — no native compilation needed) |
| LLM | Ollama, running a local model (this project defaults to `phi3`) |
| Auth | JWT + bcrypt |
| Streaming | Server-Sent Events (SSE) |
| File parsing | `multer` (upload) + `pdf-parse` (PDF text extraction) |

---

## Prerequisites

- **Node.js 22.5+** (Node 24.x recommended — `node:sqlite` needs 22.5 or newer)
- **Ollama** installed — [ollama.com/download](https://ollama.com/download)
- A pulled local model. This project is configured for **`phi3`** (~2GB, runs comfortably on 8GB RAM), but any local Ollama model works — just update `OLLAMA_MODEL` in `.env`.

---

## Setup

### 1. Install a model in Ollama

Open the Ollama app (or `ollama pull phi3` in a terminal) and pull a model. `phi3` is a good default: small, fast, and solid quality for a chat clone.

> **Low on disk space?** Ollama's Settings screen has a **Model location** field with a Browse button — point it at whichever drive has more room before pulling.

Leave Ollama running in the background — it serves on `http://localhost:11434` by default.

### 2. Backend

```powershell
cd backend
copy .env.example .env
```

Open `.env` and make sure `JWT_SECRET` is set to any random string (this is required — the server will crash on startup without it):

```
PORT=5000
JWT_SECRET=replace_this_with_any_random_string
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=phi3
```

Install and run:

```powershell
npm install
npm run dev
```

You should see:
```
Backend running on http://localhost:5000
```

### 3. Frontend

In a **separate terminal**, leaving the backend running:

```powershell
cd frontend
npm install
npm run dev
```

You should see a local URL, typically:
```
➜  Local:   http://localhost:5173/
```

Open that URL in your browser, register an account, and start chatting.

---

## Troubleshooting

**`Failed to execute 'json' on 'Response': Unexpected end of JSON input`**
The frontend couldn't get a valid response from the backend — almost always means the backend isn't running or crashed. Check the backend terminal for errors.

**Backend crashes with `Error: secretOrPrivateKey must have a value`**
`JWT_SECRET` is missing from `backend/.env`. Make sure the file is named exactly `.env` (not `.env.example`) and has a non-empty `JWT_SECRET` value.

**`npm install` fails on `better-sqlite3` with node-gyp / Visual Studio errors**
This project uses Node's built-in `node:sqlite` module specifically to avoid this — it requires zero native compilation. If you're hitting this, make sure `backend/package.json` does **not** list `better-sqlite3` as a dependency (it should only use built-in `node:sqlite`, imported in `db.js`).

**`rmdir /s /q node_modules` fails in PowerShell**
That's Command Prompt syntax. In PowerShell, use:
```powershell
Remove-Item -Recurse -Force node_modules
```

**Blank white/dark screen at `localhost:5173`**
Usually means the dev servers aren't currently running — they stop when you close the terminal. Restart both (`npm run dev` in `backend`, then in `frontend`) and refresh. If it's still blank, open the browser console (F12 → Console tab) to see the actual JS error.

**Model download shows a subscription/403 error**
That means you selected a `:cloud` model from Ollama's dropdown (e.g. `glm-5.2:cloud`) rather than a local one. Cloud models need a paid Ollama subscription. Switch the model selector to a local (non-`:cloud`) model instead.

**Low RAM (8GB) — which model to use?**
Stick to small models: `phi3` (~2GB) or `gemma2:2b`. A 12B+ parameter model will fit on disk but likely runs slowly and strains RAM alongside your OS, browser, and dev servers.

---

## How it works

- **Auth**: `bcryptjs` hashes passwords on register; `jsonwebtoken` issues a 7-day token on login/register, stored in the browser's `localStorage`, sent as `Authorization: Bearer <token>` on every request.
- **Streaming**: the backend calls Ollama's `/api/chat` endpoint with `stream: true`, reads the response as a stream, and forwards each token to the frontend over SSE. The frontend appends tokens live to the last message as they arrive.
- **Memory**: every message (user and assistant) is saved to SQLite. On each new message, the full conversation history for that chat is pulled from the database and sent to Ollama, so the model has full context of the conversation so far.
- **File uploads**: `multer` handles the upload. PDFs go through `pdf-parse` to extract text; plain text files are read directly. Extracted text is capped at 8,000 characters and appended to your message as context before it reaches the model.

---

## Project structure

```
chatgpt-clone/
├── backend/
│   ├── server.js              Express app entry point
│   ├── db.js                  SQLite schema (users, conversations, messages)
│   ├── .env.example           Copy to .env and fill in
│   ├── routes/
│   │   ├── auth.js             POST /register, /login
│   │   ├── chat.js             conversations CRUD + SSE message streaming
│   │   └── upload.js           file upload + text extraction
│   ├── services/
│   │   └── ollama.js           streaming client for Ollama's /api/chat
│   └── middleware/
│       └── auth.js             JWT verification
│
└── frontend/
    ├── index.html
    ├── vite.config.js          proxies /api to localhost:5000
    └── src/
        ├── App.jsx              top-level layout, auth gate
        ├── api.js                all fetch calls to the backend
        ├── styles.css            dark theme, ChatGPT-style layout
        ├── context/
        │   └── AuthContext.jsx    login state, token storage
        └── components/
            ├── Login.jsx           login/register form
            ├── Sidebar.jsx         conversation list
            ├── ChatWindow.jsx      message list, streaming state
            └── MessageInput.jsx    text box + file attach button
```

---

## Extending this project

- **Markdown/code rendering** — add `react-markdown` + `react-syntax-highlighter` in `ChatWindow.jsx` so code blocks and formatting render properly instead of as plain text.
- **Stop generating button** — abort the SSE fetch stream mid-response.
- **Model picker in the UI** — send a `model` field per-request instead of a fixed `.env` value, so you can switch models without restarting the backend.
- **Swap the LLM backend** — replace `services/ollama.js` with a call to the Anthropic API (or any other provider) if you'd rather not run a model locally. The SSE streaming contract to the frontend stays the same either way.
- **Multi-device deployment** — swap `node:sqlite` for Postgres if you outgrow a single-file local database.
