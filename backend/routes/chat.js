import express from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { streamChat } from '../services/ollama.js';

const router = express.Router();
router.use(requireAuth);

// List all conversations for the logged-in user
router.get('/conversations', (req, res) => {
  const rows = db.prepare(
    'SELECT id, title, created_at FROM conversations WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.userId);
  res.json(rows);
});

// Create a new conversation
router.post('/conversations', (req, res) => {
  const result = db.prepare('INSERT INTO conversations (user_id, title) VALUES (?, ?)').run(
    req.userId,
    req.body.title || 'New Chat'
  );
  res.json({ id: result.lastInsertRowid, title: req.body.title || 'New Chat' });
});

// Get messages for a conversation (memory)
router.get('/conversations/:id/messages', (req, res) => {
  const convo = db.prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  const messages = db.prepare(
    'SELECT role, content, attachment_name, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC'
  ).all(req.params.id);
  res.json(messages);
});

// Delete a conversation
router.delete('/conversations/:id', (req, res) => {
  db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(req.params.id);
  db.prepare('DELETE FROM conversations WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ ok: true });
});

// Send a message and stream the assistant's reply via SSE
router.post('/conversations/:id/messages', async (req, res) => {
  const { content, attachmentName, attachmentText } = req.body;
  const convo = db.prepare('SELECT * FROM conversations WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  // Save user message (memory persists to DB)
  const userContent = attachmentText
    ? `${content}\n\n[Attached file: ${attachmentName}]\n${attachmentText}`
    : content;
  db.prepare(
    'INSERT INTO messages (conversation_id, role, content, attachment_name) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, 'user', content, attachmentName || null);

  // Auto-title new conversations from first message
  if (convo.title === 'New Chat') {
    const title = content.slice(0, 40);
    db.prepare('UPDATE conversations SET title = ? WHERE id = ?').run(title, req.params.id);
  }

  // Build history for context/memory
  const priorMessages = db.prepare(
    'SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id ASC'
  ).all(req.params.id);
  const history = priorMessages.map((m, i) =>
    i === priorMessages.length - 1 && attachmentText
      ? { role: m.role, content: userContent }
      : { role: m.role, content: m.content }
  );

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const fullText = await streamChat(history, (token) => {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });

    db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)').run(
      req.params.id,
      'assistant',
      fullText
    );

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;
