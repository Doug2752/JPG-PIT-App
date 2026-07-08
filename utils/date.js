export function localDateStr(d) {
  d = d || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr() {
  return localDateStr();
}

export function makeDateLabel(dateStr) {
  const p = dateStr.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

// Full 24-hour range in 15-min increments (96 entries), displayed and
// stored as 12-hour with AM/PM, no leading zero on the hour ("1:00 AM").
const WAKE_TIMES = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const period = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    WAKE_TIMES.push(h12 + ':' + String(m).padStart(2, '0') + ' ' + period);
  }
}
export { WAKE_TIMES };

// Validate/normalize a free-text wake-time entry.
// Accepts "H:MM AM/PM" or "HH:MM AM/PM", case-insensitive on AM/PM,
// tolerant of spaces. Minutes must be 00/15/30/45. Returns the
// normalized "H:MM AM/PM" string, or null if invalid.
export function normalizeWakeTime(raw) {
  if (!raw) return null;
  const m = String(raw).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (h < 1 || h > 12) return null;
  if (![0, 15, 30, 45].includes(min)) return null;
  return h + ':' + String(min).padStart(2, '0') + ' ' + period;
}

// Convert a legacy 24-hour stored value ("07:30") to 12-hour display
// ("7:30 AM"). Values already in 12-hour form (or empty) pass through
// unchanged.
export function to12Hour(value) {
  const m = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return value;
  const h = parseInt(m[1], 10);
  const min = m[2];
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ':' + min + ' ' + period;
}
