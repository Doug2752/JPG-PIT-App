import { ANTHROPIC_API_KEY } from '../utils/constants';

const MODEL = 'claude-sonnet-4-20250514';

function apiHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'PASTE_YOUR_API_KEY_HERE') {
    h['x-api-key'] = ANTHROPIC_API_KEY;
    h['anthropic-version'] = '2023-06-01';
    h['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return h;
}

async function anthropic(prompt, maxTokens = 1000) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const d = await r.json();
  return d.content ? d.content.map(b => b.text || '').join('') : 'No response.';
}

export async function fetchScriptureAI(query) {
  return anthropic(
    `Biblical scholar: Provide 3-4 scripture passages about: "${query}". Reference and full text (NIV). Clear and direct. No preamble.`
  );
}

export async function fetchBookAI(query, bookName, bookAuthor, bookTopic) {
  const ctx = [
    bookName  && `Book: ${bookName}`,
    bookAuthor && `Author: ${bookAuthor}`,
    bookTopic  && `Topic: ${bookTopic}`,
  ].filter(Boolean).join(', ');
  return anthropic(
    `${ctx ? `Context: ${ctx}. ` : ''}Question: ${query}\n\nAnswer helpfully and concisely. No preamble.`
  );
}

export async function fetchQuotesInspirationAI(query) {
  return anthropic(
    `Quote and inspiration research: "${query}"\n\nProvide: (1) 3-4 powerful relevant quotes with attribution, (2) a brief inspiring reflection on the topic. Be direct and impactful. No preamble.`
  );
}

export async function generateSummaryAI(entries) {
  const fmt = (e) => {
    const d = e.data;
    const dop = e.dop;
    const morn = (dop && dop.morningEval != null) ? dop.morningEval : 'none';
    const even = (dop && dop.eveningEval != null) ? dop.eveningEval : 'none';
    return `DATE: ${e.date}\nMORNING RATING (1-10): ${morn}\nEVENING RATING (1-10): ${even}\nONE THING: ${d.oneThing || 'none'} (${d.oneThingDone ? 'DONE' : 'NOT DONE'})\nNOTES: ${d.nit || 'none'}\nDEVOTIONAL NOTES: ${d.devotionalNotes || 'none'}\nTASKS:\n${d.tasks.map((t, i) => t.text ? `- #${i + 2}: ${t.text} (${t.done ? 'done' : 'pending'})` : '').filter(Boolean).join('\n') || 'none'}`;
  };
  return anthropic(
    `Summarize PIT journal entries. TODAY first then prior days most recent to oldest. For each: Morning/Evening Ratings (call out trends), ONE THING, Key Notes, Devotional Notes (if present), Tasks. Bottom: UNFINISHED ONE THINGS with dates, plus rating trend across days. Concise and structured.\n\n${entries.filter(Boolean).map(fmt).join('\n\n---\n\n')}`,
    1000
  );
}
