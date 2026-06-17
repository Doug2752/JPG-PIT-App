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

const WAKE_TIMES = [];
for (let h = 2; h <= 10; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 10 && m > 0) break;
    WAKE_TIMES.push(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
  }
}
export { WAKE_TIMES };
