# ChatGPT Clone 🤖

A full-stack AI chat application inspired by ChatGPT, built with a modern frontend and backend architecture. This project allows users to have real-time conversational interactions powered by an AI language model.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Screenshots](#-screenshots)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

- 💬 Real-time AI-powered chat interface
- 🔐 User authentication (sign up / login)
- 🗂️ Persistent chat history
- 🎨 Responsive, modern UI
- ⚡ Fast and lightweight performance
- 🌙 Dark mode support
- 📱 Mobile-friendly design

---

## 🛠️ Tech Stack

**Frontend**
- React.js / Next.js
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB / PostgreSQL
- OpenAI API

**Other Tools**
- JWT Authentication
- dotenv for environment configuration
- Git & GitHub for version control

---

## 📁 Project Structure

```
chatgpt-clone/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (if using a local database)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/chatgpt-clone.git
   cd chatgpt-clone
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `backend` folder and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_key
```

If your frontend also needs environment variables, create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ⚠️ **Never commit your `.env` files.** They are already excluded via `.gitignore`.

### Running the App

Open two terminal windows — one for the backend, one for the frontend.

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

The app should now be running at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 📸 Screenshots

> Add screenshots or a demo GIF of your app here.

| Chat Interface | Dark Mode |
|-----------------|-----------|
| _screenshot_ | _screenshot_ |

---

## 📡 API Reference

| Method | Endpoint             | Description                  |
|--------|-----------------------|-------------------------------|
| POST   | `/api/auth/register`  | Register a new user          |
| POST   | `/api/auth/login`     | Log in an existing user      |
| POST   | `/api/chat`            | Send a message to the AI     |
| GET    | `/api/chat/history`    | Fetch user's chat history     |

---

## 🗺️ Roadmap

- [ ] Voice input support
- [ ] File/image upload in chat
- [ ] Multi-language support
- [ ] Deploy to production (Vercel + Render/Railway)
- [ ] Add unit and integration tests

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

⭐️ If you found this project helpful, consider giving it a star on GitHub!
