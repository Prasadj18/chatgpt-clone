const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getConversations() {
  const res = await fetch(`${BASE}/chat/conversations`, { headers: authHeaders() });
  return res.json();
}

export async function createConversation() {
  const res = await fetch(`${BASE}/chat/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function deleteConversation(id) {
  await fetch(`${BASE}/chat/conversations/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export async function getMessages(conversationId) {
  const res = await fetch(`${BASE}/chat/conversations/${conversationId}/messages`, { headers: authHeaders() });
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: authHeaders(), // don't set Content-Type; browser sets multipart boundary
    body: formData,
  });
  return res.json();
}

// Streams a message reply via SSE. onToken(text) fires per chunk, onDone() at the end.
export function sendMessageStream(conversationId, payload, onToken, onDone, onError) {
  fetch(`${BASE}/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then(async (res) => {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop();

      for (const part of parts) {
        if (!part.startsWith('data: ')) continue;
        const data = JSON.parse(part.slice(6));
        if (data.error) return onError(data.error);
        if (data.done) return onDone();
        if (data.token) onToken(data.token);
      }
    }
    onDone();
  }).catch(onError);
}
