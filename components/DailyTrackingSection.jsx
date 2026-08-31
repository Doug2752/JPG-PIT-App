import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, RED } from '../utils/constants';
import { LOCATIONS, WORK_OPTS } from '../utils/constants';
import { WAKE_TIMES, normalizeWakeTime, to12Hour } from '../utils/date';
import { card, secTitle, lbl, inp, sel } from './styles';
import { parseFitnessAI } from '../services/ai';

function calcHoursSlept(sleepTime, wakeTime) {
  if (!sleepTime || !wakeTime) return '';
  function toMinutes(t) {
    const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const period = m[3].toUpperCase();
    if (period === 'AM') { if (h === 12) h = 0; }
    else { if (h !== 12) h += 12; }
    return h * 60 + min;
  }
  const sMin = toMinutes(sleepTime);
  const wMin = toMinutes(wakeTime);
  if (sMin === null || wMin === null) return '';
  let diff = wMin - sMin;
  if (diff <= 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function DailyTrackingSection({
  fd, upd, updMulti,
  isDayCompleteMarked, fitnessParseMsg,
}) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  // Sleep time combobox: local buffer so free-text typing never writes a bad value to storage.
  const [sleepInput, setSleepInput] = useState(to12Hour(fd.sleepTime));
  const [sleepError, setSleepError] = useState('');
  useEffect(() => {
    setSleepInput(to12Hour(fd.sleepTime));
    setSleepError('');
  }, [fd.sleepTime]);

  function commitSleep(rawVal) {
    const val = (rawVal !== undefined ? String(rawVal) : sleepInput).trim();
    if (val === '') {
      setSleepError('');
      if (fd.sleepTime) upd('sleepTime', '');
      return;
    }
    const norm = normalizeWakeTime(val);
    if (norm) {
      setSleepError('');
      setSleepInput(norm);
      if (norm !== fd.sleepTime) upd('sleepTime', norm);
    } else {
      setSleepError('Enter time as H:MM AM/PM (minutes 00/15/30/45)');
    }
  }

  // Wake time combobox
  const [wakeInput, setWakeInput] = useState(to12Hour(fd.wakeTime));
  const [wakeError, setWakeError] = useState('');
  useEffect(() => {
    setWakeInput(to12Hour(fd.wakeTime));
    setWakeError('');
  }, [fd.wakeTime]);

  function commitWake(rawVal) {
    const val = (rawVal !== undefined ? String(rawVal) : wakeInput).trim();
    if (val === '') {
      setWakeError('');
      if (fd.wakeTime) upd('wakeTime', '');
      return;
    }
    const norm = normalizeWakeTime(val);
    if (norm) {
      setWakeError('');
      setWakeInput(norm);
      if (norm !== fd.wakeTime) upd('wakeTime', norm);
    } else {
      setWakeError('Enter time as H:MM AM/PM (minutes 00/15/30/45)');
    }
  }

  // Auto-calculate hoursSlept whenever sleep or wake time changes
  useEffect(() => {
    const result = calcHoursSlept(fd.sleepTime, fd.wakeTime);
    if (result !== fd.hoursSlept) upd('hoursSlept', result);
  }, [fd.sleepTime, fd.wakeTime]); // upd intentionally omitted — stable in practice, including it causes infinite re-renders

  const goldLbl      = { ...lbl, color: GOLD };
  const descStyle    = { fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, marginTop: 2, marginBottom: 4 };
  const reqFieldLbl  = { ...goldLbl, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const sleepTimeLbl = { ...reqFieldLbl, fontSize: 9 };

  const handleFitnessBlur = async () => {
    if (!(fd.fitnessNotesText || '').trim()) return;
    const result = await parseFitnessAI(fd.fitnessNotesText);
    updMulti({ fitnessActivityType: result.fitnessActivityType, fitnessDuration: result.fitnessDuration });
  };

  return (
    <div style={{ ...card, background: '#1a1a1a' }}>
      <div style={{ ...secTitle, color: GOLD, borderBottomColor: GOLD }}>
        Daily Tracking
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8, letterSpacing: 0 }}>
          * = required for day completion
        </span>
      </div>

      {/* Required Fields */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>
          Required Fields *
        </div>

        {/* Sleep row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, alignItems: 'start', marginBottom: 14 }}>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={sleepTimeLbl}>* Time Asleep Last Night</label>
              <div style={{ ...descStyle, marginBottom: 8 }}>Time you fell asleep last night</div>
            </div>
            <input list="sleep-time-options" style={{ ...inp, height: 34, ...lockStyle }} value={sleepInput}
              onChange={e => { setSleepInput(e.target.value); if (sleepError) setSleepError(''); }}
              onBlur={e => commitSleep(e.target.value)} placeholder="e.g. 11:00 PM" disabled={isDayCompleteMarked} />
            <datalist id="sleep-time-options">
              {WAKE_TIMES.map(t => <option key={t} value={t} />)}
            </datalist>
            {sleepError && <div style={{ color: RED, fontSize: 10, marginTop: 3, lineHeight: 1.3 }}>{sleepError}</div>}
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Wake Up Time</label>
              <div style={descStyle}>Time you woke up this morning</div>
            </div>
            <input list="wake-time-options" style={{ ...inp, height: 34, ...lockStyle }} value={wakeInput}
              onChange={e => { setWakeInput(e.target.value); if (wakeError) setWakeError(''); }}
              onBlur={e => commitWake(e.target.value)} placeholder="e.g. 7:30 AM" disabled={isDayCompleteMarked} />
            <datalist id="wake-time-options">
              {WAKE_TIMES.map(t => <option key={t} value={t} />)}
            </datalist>
            {wakeError && <div style={{ color: RED, fontSize: 10, marginTop: 3, lineHeight: 1.3 }}>{wakeError}</div>}
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Total Hours Slept</label>
              <div style={descStyle}>Auto calculated</div>
            </div>
            <div style={{ ...inp, height: 34, display: 'flex', alignItems: 'center', background: '#2a2a2a', color: calcHoursSlept(fd.sleepTime, fd.wakeTime) ? '#ffffff' : 'rgba(255,255,255,0.3)', fontSize: calcHoursSlept(fd.sleepTime, fd.wakeTime) ? 14 : 12, fontWeight: calcHoursSlept(fd.sleepTime, fd.wakeTime) ? 700 : 400 }}>
              {calcHoursSlept(fd.sleepTime, fd.wakeTime) || '—'}
            </div>
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Sleep Score</label>
              <div style={descStyle}>Sleep quality value</div>
            </div>
            <input style={{ ...inp, height: 34, ...lockStyle }} type="number" min="0" max="100"
              value={fd.sleepScore} onChange={e => upd('sleepScore', e.target.value)} placeholder="0–100" disabled={isDayCompleteMarked} />
          </div>
        </div>

        {/* Daily Baseline row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, alignItems: 'start', marginBottom: 0 }}>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Weight (lbs)</label>
              <div style={descStyle}>Today's body weight</div>
            </div>
            <input style={{ ...inp, height: 34, ...lockStyle }} type="number" min="50" max="400" step="1"
              value={fd.weight} onChange={e => upd('weight', e.target.value)} placeholder="50–400 lbs" disabled={isDayCompleteMarked} />
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Energy Level</label>
              <div style={descStyle}>10 equals highest energy</div>
            </div>
            <select style={{ ...sel, ...lockStyle }} value={fd.energyLevel} onChange={e => upd('energyLevel', e.target.value)} disabled={isDayCompleteMarked}>
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={String(n)}>{n}</option>)}
            </select>
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Work / Off</label>
              <div style={descStyle}>What is planned today</div>
            </div>
            <select style={{ ...sel, ...lockStyle }} value={fd.workOff} onChange={e => upd('workOff', e.target.value)} disabled={isDayCompleteMarked}>
              <option value="">Select</option>
              {WORK_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div style={{ minHeight: 36 }}>
              <label style={reqFieldLbl}>* Location</label>
              <div style={descStyle}>Where are you completing today's PIT</div>
            </div>
            <select style={{ ...sel, ...lockStyle }} value={fd.location} onChange={e => upd('location', e.target.value)} disabled={isDayCompleteMarked}>
              <option value="">Select</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Divider between baseline fields and fitness section */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }} />

        {/* Fitness Notes */}
        <div>
          <label style={goldLbl}>FITNESS ACTIVITY — YESTERDAY</label>
          <textarea
            style={{ ...inp, resize: 'vertical', ...lockStyle }}
            rows={3}
            value={fd.fitnessNotesText ?? ''}
            onChange={e => upd('fitnessNotesText', e.target.value)}
            onBlur={handleFitnessBlur}
            placeholder="Describe your fitness activity..."
            disabled={isDayCompleteMarked}
          />
          {fitnessParseMsg && (
            <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>{fitnessParseMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}
