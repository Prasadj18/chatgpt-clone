import React, { useRef, useState } from 'react';
import { uploadFile } from '../api.js';

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null); // { filename, text }
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setAttachment(result);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() && !attachment) return;
    onSend(text, attachment);
    setText('');
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      {attachment && (
        <div className="attachment-chip">
          📎 {attachment.filename}
          <button type="button" onClick={() => setAttachment(null)}>×</button>
        </div>
      )}
      <div className="input-row">
        <button type="button" className="attach-btn" onClick={() => fileRef.current.click()} disabled={uploading}>
          {uploading ? '...' : '📎'}
        </button>
        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message ChatClone..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled}>Send</button>
      </div>
    </form>
  );
}
