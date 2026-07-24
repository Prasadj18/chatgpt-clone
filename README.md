# ChatClone

A full-featured ChatGPT clone: React frontend, Node/Express backend, local LLM via Ollama.

**Features:** auth (JWT), streaming responses (SSE), conversation memory (SQLite), file uploads (PDF/text extraction as context).

## 1. Install Ollama & pull a model

```bash
# https://ollama.com/download
ollama pull llama3.1
ollama serve   # runs on http://localhost:11434
```

Swap `llama3.1` for any model you like (`mistral`, `phi3`, `gemma2`, etc.) — just update `OLLAMA_MODEL` in `.env`.

## 2. Backend setup

```bash
cd backend
cp .env.example .env      # edit JWT_SECRET to a random string
npm install
npm run dev                # http://localhost:5000
```

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start chatting.

## How it works

- **Auth**: `bcryptjs` hashes passwords, `jsonwebtoken` issues 7-day tokens, stored in `localStorage` and sent as `Authorization: Bearer <token>`.
- **Streaming**: backend proxies Ollama's `/api/chat` stream and forwards tokens to the frontend over Server-Sent Events; the frontend appends tokens live to the last message.
- **Memory**: every message is saved to SQLite (`chat.db`), and the full conversation history is replayed to Ollama on each turn so it has context.
- **File uploads**: `multer` handles the upload; PDFs go through `pdf-parse`, plain text files are read directly, then the extracted text (capped at 8000 chars) is appended to your message as context before hitting the model.

## Project structure

```
backend/
  server.js          entry point
  db.js               SQLite schema (users, conversations, messages)
  routes/auth.js       register/login
  routes/chat.js        conversations + SSE message streaming
  routes/upload.js       file upload + text extraction
  services/ollama.js      streaming client for Ollama
  middleware/auth.js       JWT verification

frontend/
  src/App.jsx               top-level layout/auth switch
  src/components/Login.jsx    login/register form
  src/components/Sidebar.jsx   conversation list
  src/components/ChatWindow.jsx message list + streaming state
  src/components/MessageInput.jsx text box + file attach
  src/api.js                    all fetch calls to backend
  src/context/AuthContext.jsx    login state
```

## Next steps to extend

- Swap SQLite for Postgres if you need multi-instance deployment.
- Add markdown/code-block rendering (`react-markdown` + `react-syntax-highlighter`) in `ChatWindow.jsx`.
- Add a "stop generating" button by aborting the fetch stream.
- Add model picker in the UI (send `model` per-request instead of a fixed `.env` value).
