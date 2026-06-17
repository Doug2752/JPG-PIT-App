import { WEBAPP_URL } from '../utils/constants';

export async function callSheet(payload) {
  if (WEBAPP_URL === 'PASTE_YOUR_WEBAPP_URL_HERE') return null;
  try {
    const r = await fetch(WEBAPP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
    return await r.json();
  } catch {
    return null;
  }
}
