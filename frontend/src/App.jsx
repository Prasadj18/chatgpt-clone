import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { getConversations, createConversation, deleteConversation } from './api.js';

function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  async function refresh() {
    const list = await getConversations();
    setConversations(list);
    return list;
  }

  useEffect(() => {
    refresh().then((list) => {
      if (list.length > 0) setActiveId(list[0].id);
    });
  }, []);

  async function handleNew() {
    const convo = await createConversation();
    await refresh();
    setActiveId(convo.id);
  }

  async function handleDelete(id) {
    await deleteConversation(id);
    const list = await refresh();
    if (activeId === id) setActiveId(list[0]?.id || null);
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      {activeId ? (
        <ChatWindow conversationId={activeId} onFirstMessage={refresh} />
      ) : (
        <div className="chat-window empty-center">
          <button className="new-chat-btn" onClick={handleNew}>Start your first chat</button>
        </div>
      )}
    </div>
  );
}

function Root() {
  const { user } = useAuth();
  return user ? <ChatApp /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
