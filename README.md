# ChatClone

A full-stack ChatGPT-inspired AI chat application built with React, Node.js, Express, SQLite, and Ollama.

ChatClone provides a conversational AI experience with user authentication, real-time streaming responses, persistent conversation history, and PDF/text file uploads that can be used as contextual information during conversations.

---

## Features

- 🤖 AI-powered conversations using locally hosted Ollama models
- 🔐 User registration and login
- 🔑 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 💬 Persistent conversations and message history
- 🧠 Conversation memory using SQLite
- ⚡ Real-time AI response streaming using Server-Sent Events (SSE)
- 📄 PDF and text file uploads
- 📚 Uploaded file content used as context for AI responses
- 👤 User-specific conversations
- 📱 Responsive chat interface
- 🛡️ Protected backend API routes
- 🖥️ Separate React frontend and Node.js backend

---

## Demo

> Add your deployed application URL here after deployment.

**Live Demo:** Coming Soon

---

## Screenshots

> Add screenshots of your application here after deployment.

Example:

```text
screenshots/
├── login.png
├── chat.png
├── sidebar.png
└── file-upload.png

You can add screenshots to this README using:

![ChatClone Chat Interface](screenshots/chat.png)
Tech Stack
Frontend
React
Vite
JavaScript
CSS
Fetch API
Backend
Node.js
Express.js
JSON Web Tokens (JWT)
bcryptjs
Multer
Server-Sent Events (SSE)
Database
SQLite
AI
Ollama
Llama 3.1
File Processing
PDF text extraction
Plain text file processing
Development Tools
Git
GitHub
VS Code
npm
Project Architecture
                    ┌──────────────────────┐
                    │      User / Browser  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                     HTTP / SSE Requests
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └───────┬───────┬──────┘
                            │       │
              ┌─────────────┘       └──────────────┐
              ▼                                    ▼
     ┌─────────────────┐                  ┌─────────────────┐
     │     SQLite      │                  │     Ollama      │
     │ Users, Chats,   │                  │   Local LLM     │
     │    Messages     │                  │  AI Responses   │
     └─────────────────┘                  └─────────────────┘
Project Structure
ChatClone/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── upload.js
│   │
│   ├── services/
│   │   └── ollama.js
│   │
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
Prerequisites

Before running ChatClone locally, install the following:

Node.js 18+ recommended
npm
Git
Ollama

Download Ollama from:

https://ollama.com/download

Verify Node.js installation:

node --version

Verify npm:

npm --version

Verify Ollama:

ollama --version
Ollama Setup

ChatClone uses Ollama to run the AI model locally.

Pull the default model:

ollama pull llama3.1

Start the Ollama service:

ollama serve

By default, Ollama runs at:

http://localhost:11434

You can use another Ollama-supported model, such as:

Llama 3.1
Mistral
Phi
Gemma

Make sure the model configured in your backend environment matches the model installed in Ollama.

Backend Setup

Open a terminal in the backend directory:

cd backend

Install dependencies:

npm install

Create your environment file.

Windows PowerShell
Copy-Item .env.example .env
macOS / Linux
cp .env.example .env

Open the .env file and configure the required environment variables.

Example:

PORT=5000
JWT_SECRET=replace_with_a_strong_random_secret
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1

Never commit your .env file to GitHub.

Start the backend in development mode:

npm run dev

The backend should run on:

http://localhost:5000
Frontend Setup

Open a new terminal:

cd frontend

Install dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend should be available at:

http://localhost:5173

Open the URL in your browser.

Running the Application

To run the complete application locally, you need three services running:

Terminal 1 — Ollama
ollama serve
Terminal 2 — Backend
cd backend
npm run dev
Terminal 3 — Frontend
cd frontend
npm run dev

Then open:

http://localhost:5173

Register a new account and start chatting.

How ChatClone Works
1. Authentication

Users can register and log in through the React frontend.

The backend:

Receives the user's credentials.
Hashes passwords using bcryptjs.
Stores user information in SQLite.
Generates a JWT after successful authentication.
Returns the token to the frontend.

The frontend stores the authentication token and sends it with protected API requests using:

Authorization: Bearer <token>

Protected backend routes verify the JWT using authentication middleware.

2. AI Chat

When a user sends a message:

User
  ↓
React Frontend
  ↓
Express Backend
  ↓
Conversation History from SQLite
  ↓
Ollama
  ↓
AI Model

The backend retrieves the relevant conversation history and sends it to the Ollama model.

The generated response is then streamed back to the frontend.

3. Real-Time Streaming

ChatClone uses Server-Sent Events (SSE) to stream AI responses.

Instead of waiting for the entire response:

"Hello! How can I help you today?"

The frontend receives the response progressively:

Hello
Hello!
Hello! How
Hello! How can
Hello! How can I
...

This creates a more responsive ChatGPT-style user experience.

4. Conversation Memory

Chat messages are persisted in SQLite.

The database stores information related to:

Users
Conversations
Messages

When a user continues an existing conversation, the backend retrieves the previous messages and sends the conversation context to Ollama.

This allows the AI model to maintain context across multiple messages.

5. File Uploads

Users can upload supported files such as:

PDF files
Plain text files

The backend processes the uploaded file and extracts its text content.

The extracted content is then added to the user's message as context before the request is sent to Ollama.

For example:

User uploads PDF
        ↓
Backend extracts text
        ↓
Text is processed
        ↓
Relevant content is added as context
        ↓
Prompt sent to Ollama
        ↓
AI generates response

The extracted file context is limited to prevent excessively large prompts.

API Overview

The backend provides API routes for authentication, conversations, messages, and file uploads.

Authentication
POST /api/auth/register
POST /api/auth/login
Chat and Conversations
GET  /api/chat/conversations
POST /api/chat/conversations
GET  /api/chat/conversations/:id/messages
POST /api/chat/conversations/:id/messages
File Uploads
POST /api/upload

API routes may require JWT authentication depending on the endpoint.

Database

ChatClone currently uses SQLite for local development.

The database stores:

Users
  │
  └── Conversations
          │
          └── Messages

SQLite is convenient for local development because it requires minimal configuration.

For production deployment with multiple backend instances, a managed database such as PostgreSQL would be a better option.

Environment Variables

The backend uses environment variables for configuration.

Example:

PORT=5000
JWT_SECRET=your_secret_here
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
Important

Never commit secrets directly to GitHub.

The following files should remain local:

.env

Use the provided template instead:

.env.example
Security

ChatClone follows basic security practices including:

Password hashing using bcryptjs
JWT-based authentication
Protected API routes
Environment variables for secrets
.gitignore configuration to prevent accidental secret commits

For production deployment, additional security improvements should be considered, including:

HTTPS
Secure HTTP-only cookies
CSRF protection
Rate limiting
Input validation
File type and file size restrictions
Production database security
Secure CORS configuration
Strong production JWT secrets
Deployment

The application is designed with a separate frontend and backend architecture.

A typical production deployment can use:

                 Internet
                    │
                    ▼
          ┌──────────────────┐
          │ React Frontend   │
          │ Static Hosting   │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Node/Express API │
          │ Backend Hosting  │
          └───────┬─────┬────┘
                  │     │
                  ▼     ▼
             Database   AI Provider

For production deployment, the following changes may be required:

Configure frontend API URL
Configure production CORS
Configure production environment variables
Replace local SQLite with a managed database if required
Configure a production AI provider or remotely hosted Ollama instance
Configure HTTPS
Configure persistent file storage
Deploy frontend and backend separately if required

The current development configuration uses Ollama running locally at localhost:11434. A production deployment requires a publicly accessible or hosted AI inference solution.

Future Improvements

Planned improvements include:

 Deploy frontend and backend
 Add production AI inference
 Replace SQLite with PostgreSQL
 Add Markdown rendering
 Add syntax highlighting for code responses
 Add "Stop Generating" functionality
 Add AI model selection
 Add conversation renaming
 Add conversation deletion
 Add message regeneration
 Add dark/light theme support
 Add improved mobile responsiveness
 Add rate limiting
 Add stronger production security
 Add automated testing
 Add CI/CD pipeline
Learning Outcomes

This project demonstrates practical experience with:

Full-stack web development
React application architecture
REST API development
Node.js and Express
JWT authentication
Password hashing
Database design
SQLite
Server-Sent Events
Real-time response streaming
Local Large Language Models
Ollama integration
File upload handling
PDF text extraction
Context-aware AI applications
Git and GitHub
Production deployment concepts
License

This project is intended for educational and portfolio purposes.

Add your preferred license here if you plan to distribute the project publicly.

Author

Prasada

B.E. Information Science and Engineering Student

GitHub:
https://github.com/Prasadj18

LinkedIn:
https://www.linkedin.com/in/prasad-jahagirdar-5417032b4
