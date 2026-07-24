const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

/**
 * Streams a chat completion from Ollama.
 * `history` is an array of { role, content } messages (memory/context).
 * `onToken` is called with each incremental text chunk.
 * Returns the full assembled response text.
 */
export async function streamChat(history, onToken) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: history,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line for next chunk

    for (const line of lines) {
      if (!line.trim()) continue;
      const json = JSON.parse(line);
      if (json.message?.content) {
        fullText += json.message.content;
        onToken(json.message.content);
      }
      if (json.done) return fullText;
    }
  }

  return fullText;
}
