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

export async function generateSummaryAI(entries, appointments = []) {
  const fmt = (e) => {
    const d   = e.data;
    const dop = e.dop;
    const morn = (dop && dop.morningEval != null) ? dop.morningEval : 'none';
    const even = (dop && dop.eveningEval != null) ? dop.eveningEval : 'none';
    const dailyTasks  = [0, 1]
      .map(i => d.tasks[i]?.text ? `- ${d.tasks[i].text} (${d.tasks[i].done ? 'done' : 'pending'})` : '')
      .filter(Boolean).join('\n') || 'none';
    const futureTasks = [2, 3, 4]
      .map(i => d.tasks[i]?.text ? `- ${d.tasks[i].text} (${d.tasks[i].done ? 'done' : 'pending'})` : '')
      .filter(Boolean).join('\n') || 'none';
    const book = d.bookName
      ? [
          `"${d.bookName}"`,
          d.bookAuthor && `by ${d.bookAuthor}`,
          d.bookPage   && `p.${d.bookPage}`,
          d.bookTopic  && `topic: ${d.bookTopic}`,
        ].filter(Boolean).join(', ')
      : 'none';
    return [
      `DATE: ${e.date}`,
      `MORNING RATING (1-10): ${morn}`,
      `EVENING RATING (1-10): ${even}`,
      `DAILY TRACKING: Wake Up: ${d.wakeTime || 'none'} | Weight: ${d.weight ? d.weight + ' lbs' : 'none'} | Work: ${d.workOff || 'none'} | Sleep Score: ${d.sleepScore || 'none'} | Fitness Yesterday: ${d.fitnessYesterday || 'none'}`,
      `THANKFUL FOR: 1) ${d.thankful1 || 'none'}  2) ${d.thankful2 || 'none'}  3) ${d.thankful3 || 'none'}`,
      `ONE THING: ${d.oneThing || 'none'} (${d.oneThingDone ? 'DONE' : 'NOT DONE'})`,
      `DAILY TASKS:\n${dailyTasks}`,
      `FUTURE TASKS:\n${futureTasks}`,
      `NOTES: ${d.nit || 'none'}`,
      `DEVOTIONAL NOTES: ${d.devotionalNotes || 'none'}`,
      `BOOK STUDY: ${book}${d.bookNotes ? '\n  Book Notes: ' + d.bookNotes : ''}`,
      `QUOTES: ${d.quotes || 'none'}`,
    ].join('\n');
  };

  const apptLines = appointments.length
    ? appointments.map(a =>
        `- ${a.date}: ${a.title || '(untitled)'}${a.time ? ' at ' + a.time : ''}${a.location ? ' @ ' + a.location : ''}${a.prep ? ' (Prep: ' + a.prep + ')' : ''}`
      ).join('\n')
    : 'none';

  const prompt = `Summarize PIT journal entries. TODAY first then prior days most recent to oldest. For each day cover: Morning/Evening Ratings (note trends), Daily Tracking stats, Thankful For, One Thing completion, Daily Tasks, Future Tasks, Notes, Devotional Notes, Book Study, and Quotes. At the bottom: UNFINISHED ONE THINGS with dates, open Future Tasks, rating trend across days, and Upcoming Appointments. Concise and structured.\n\nUPCOMING APPOINTMENTS:\n${apptLines}\n\n${entries.filter(Boolean).map(fmt).join('\n\n---\n\n')}`;
  console.log('[AI Summary Prompt]', prompt);
  return anthropic(prompt, 1500);
}
