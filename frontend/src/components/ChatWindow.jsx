import React, { useEffect, useRef, useState } from 'react';
import { getMessages, sendMessageStream } from '../api.js';
import MessageInput from './MessageInput.jsx';

export default function ChatWindow({ conversationId, onFirstMessage }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    if (!conversationId) return;
    getMessages(conversationId).then(setMessages);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text, attachment) {
    const userMsg = { role: 'user', content: text, attachment_name: attachment?.filename };
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setStreaming(true);

    sendMessageStream(
      conversationId,
      { content: text, attachmentName: attachment?.filename, attachmentText: attachment?.text },
      (token) => {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: copy[copy.length - 1].content + token,
          };
          return copy;
        });
      },
      () => {
        setStreaming(false);
        onFirstMessage?.();
      },
      (err) => {
        setStreaming(false);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: `⚠️ Error: ${err}` };
          return copy;
        });
      }
    );
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 && <div className="empty-state">Start a conversation.</div>}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="message-role">{m.role === 'user' ? 'You' : 'Assistant'}</div>
            <div className="message-content">
              {m.attachment_name && <div className="attachment-tag">📎 {m.attachment_name}</div>}
              {m.content || (streaming && i === messages.length - 1 ? '▋' : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
