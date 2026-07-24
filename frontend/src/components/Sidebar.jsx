import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }) {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNew}>+ New Chat</button>
      <div className="conversation-list">
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`conversation-item ${c.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <span>{c.title}</span>
            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}>×</button>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <span>{user?.email}</span>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
}
