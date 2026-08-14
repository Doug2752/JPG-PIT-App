import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, RED } from '../utils/constants';
import {
  LOCATIONS, ACTIVITY_TYPES, DISTANCE_ACTIVITIES,
  TERRAIN_OPTIONS, YOGA_TYPES, SWIM_ENVIRONMENTS, SWIM_STROKES,
  WORK_OPTS, DAYS_OF_WEEK,
} from '../utils/constants';
import { WAKE_TIMES, normalizeWakeTime, to12Hour } from '../utils/date';
import { emptyFitnessEntry } from '../utils/form';
import { card, secTitle, lbl, inp, sel } from './styles';

function isDistanceActivity(a) {
  return DISTANCE_ACTIVITIES.some(d => a && a.toLowerCase().includes(d.toLowerCase()));
}

function calcHoursSlept(sleepTime, wakeTime) {
  console.log('[calcHoursSlept] called with:', sleepTime, wakeTime);
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
  fd, upd, updMulti, updFitnessEntry, addFitnessEntry, removeFitnessEntry,
  recurringFitness = [], onAddRecurring, onUpdateRecurring, onRemoveRecurring, onSyncRecurring,
  isDayCompleteMarked,
}) {
  const showActivity = fd.fitnessYesterday === 'Yes';
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};
  const [fitnessTab, setFitnessTab] = useState('yesterday');

  // Sleep time combobox: local buffer so free-text typing never writes a bad value to storage.
  const [sleepInput, setSleepInput] = useState(to12Hour(fd.sleepTime));
  const [sleepError, setSleepError] = useState('');
  useEffect(() => {
    setSleepInput(to12Hour(fd.sleepTime));
    setSleepError('');
  }, [fd.sleepTime]);

  function commitSleep(rawVal) {
    console.log('[commitSleep] rawVal received:', rawVal);
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
    console.log('[commitWake] rawVal received:', rawVal);
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

  const goldLbl   = { ...lbl, color: GOLD };
  const reqLbl    = { ...goldLbl };
  const dimLbl    = { ...lbl, color: 'rgba(255,255,255,0.5)', display: 'block', minHeight: 30, lineHeight: 1.25 };
  const descStyle   = { fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, marginTop: 2, marginBottom: 4 };
  const reqFieldLbl  = { ...goldLbl, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const sleepTimeLbl = { ...reqFieldLbl, fontSize: 9 };

  const removeBtn = { background: 'transparent', border: '1px solid #ccc', borderRadius: 4, color: '#999', fontSize: 10, cursor: 'pointer', padding: '2px 8px', fontWeight: 600 };
  const addBtn    = { width: '100%', padding: '9px', borderRadius: 5, border: '1.5px solid #000', background: GOLD_LIGHT, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, marginTop: 6 };

  const tabBtn = (active) => ({
    background: active ? GOLD : '#666666',
    color: active ? '#000000' : '#ffffff',
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    padding: '6px 16px',
    border: '1px solid #333',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    marginRight: 4,
  });

  function renderRecurringActivity(activity) {
    const isDistance = isDistanceActivity(activity.activityType);
    const isOther = activity.activityType === 'Other';
    const pref = activity.distanceOrDuration || 'distance';
    const showDistance = pref === 'distance' || pref === 'both';
    const showDuration = pref === 'duration' || pref === 'both';
    const winp = { ...inp, background: '#ffffff' };
    const wsel = { ...sel, background: '#ffffff' };
    return (
      <div key={activity.id} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1 }}>
            {activity.name || 'New Activity'}
          </div>
          <button onClick={() => { if (window.confirm('Remove this recurring activity?')) onRemoveRecurring(activity.id); }} style={removeBtn}>Remove</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={goldLbl}>Activity Name</label>
            <input style={winp} value={activity.name || ''}
              onChange={e => onUpdateRecurring(activity.id, { name: e.target.value })}
              placeholder="e.g. Morning Run" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={goldLbl}>Days of Week (Gold = selected days)</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {DAYS_OF_WEEK.map(day => {
                const selected = Array.isArray(activity.daysOfWeek) && activity.daysOfWeek.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const current = Array.isArray(activity.daysOfWeek) ? activity.daysOfWeek : [];
                      const updated = selected ? current.filter(d => d !== day) : [...current, day];
                      onUpdateRecurring(activity.id, { daysOfWeek: updated });
                    }}
                    style={{
                      width: 40, height: 24, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                      borderRadius: 4, cursor: 'pointer',
                      background: selected ? '#B8860B' : '#333',
                      color: selected ? '#000' : '#999',
                      border: selected ? '1.5px solid #000' : '1px solid #555',
                    }}
                  >{day}</button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={goldLbl}>Activity Type</label>
            <select style={wsel} value={activity.activityType || ''}
              onChange={e => onUpdateRecurring(activity.id, { activityType: e.target.value, terrain: '' })}>
              <option value="">Select</option>
              {ACTIVITY_TYPES.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          {isOther && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={goldLbl}>Describe Activity</label>
              <input style={winp} value={activity.fitnessActivityOther || ''}
                onChange={e => onUpdateRecurring(activity.id, { fitnessActivityOther: e.target.value })}
                placeholder="What did you do?" />
            </div>
          )}
          {isDistance && (
            <div>
              <label style={goldLbl}>Terrain</label>
              <select style={wsel} value={activity.terrain || ''}
                onChange={e => onUpdateRecurring(activity.id, { terrain: e.target.value })}>
                <option value="">Select</option>
                {TERRAIN_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}
          {activity.activityType !== 'Rest and Recovery' && (
            <div>
              <label style={goldLbl}>Track By</label>
              <select style={wsel} value={activity.distanceOrDuration}
                onChange={e => onUpdateRecurring(activity.id, { distanceOrDuration: e.target.value })}>
                <option value="distance">Distance</option>
                <option value="duration">Duration</option>
                <option value="both">Both</option>
              </select>
            </div>
          )}
          {(showDistance || showDuration) && (
            <div style={pref === 'both' ? { display: 'flex', gap: 12 } : undefined}>
              {showDistance && (
                <div style={pref === 'both' ? { flex: 1 } : undefined}>
                  <label style={goldLbl}>Distance</label>
                  <input style={{ ...winp, boxSizing: 'border-box', width: '100%' }} value={activity.defaultDistance || ''}
                    onChange={e => onUpdateRecurring(activity.id, { defaultDistance: e.target.value })}
                    placeholder="e.g. 3.1" />
                </div>
              )}
              {showDuration && (
                <div style={pref === 'both' ? { flex: 1 } : undefined}>
                  <label style={goldLbl}>Time</label>
                  <input style={{ ...winp, boxSizing: 'border-box', width: '100%' }} value={activity.defaultDuration || ''}
                    onChange={e => onUpdateRecurring(activity.id, { defaultDuration: e.target.value })}
                    placeholder="e.g. 45 min" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderFitnessEntry(entry, i) {
    const origIdx = fd.fitnessEntries.findIndex(e => e === entry);
    const isDistance = isDistanceActivity(entry.fitnessActivity);
    const isYoga     = entry.fitnessActivity === 'Yoga';
    const isSwim     = entry.fitnessActivity === 'Swim';
    const isOther    = entry.fitnessActivity === 'Other';
    return (
      <div key={i} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1 }}>
            {entry.recurringId ? `Recurring Fitness ${i + 1}` : `Entry ${i + 1}`}
          </div>
          {fd.fitnessEntries.length > 1 && !entry.recurringId && (
            <button onClick={() => removeFitnessEntry(origIdx)} style={removeBtn}>Remove</button>
          )}
        </div>
        {entry.recurringId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={!!entry.confirmedDone}
              onChange={e => updFitnessEntry(
                entry.recurringId,
                { confirmedDone: e.target.checked },
                true
              )}
              style={{ accentColor: '#B8860B', width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 700, fontSize: 13, color: '#ffffff' }}>
              Check if {entry.recurringName || entry.fitnessActivity} done yesterday
            </span>
          </div>
        )}
        {!entry.recurringId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'start' }}>
            <div>
              <label style={goldLbl}>Activity Type</label>
              <select style={sel} value={entry.fitnessActivity}
                onChange={e => updFitnessEntry(origIdx, {
                  fitnessActivity: e.target.value, fitnessActivityOther: '',
                  cardioDistance: '', terrain: '', yogaType: '', swimEnvironment: '', swimStroke: '',
                })}>
                <option value="">Select</option>
                {['Rest and Recovery', ...ACTIVITY_TYPES].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {isDistance && <>
              <div>
                <label style={goldLbl}>Distance (miles)</label>
                <input style={{ ...inp, height: 34 }} type="number" min="0" step="0.1"
                  value={entry.cardioDistance} onChange={e => updFitnessEntry(origIdx, { cardioDistance: e.target.value })} placeholder="miles" />
              </div>
              <div>
                <label style={goldLbl}>Terrain</label>
                <select style={sel} value={entry.terrain} onChange={e => updFitnessEntry(origIdx, { terrain: e.target.value })}>
                  <option value="">Select</option>
                  {TERRAIN_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </>}

            {isYoga && (
              <div>
                <label style={goldLbl}>Yoga Type</label>
                <select style={sel} value={entry.yogaType} onChange={e => updFitnessEntry(origIdx, { yogaType: e.target.value })}>
                  <option value="">Select</option>
                  {YOGA_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {isSwim && <>
              <div>
                <label style={goldLbl}>Environment</label>
                <select style={sel} value={entry.swimEnvironment} onChange={e => updFitnessEntry(origIdx, { swimEnvironment: e.target.value })}>
                  <option value="">Select</option>
                  {SWIM_ENVIRONMENTS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={goldLbl}>Stroke / Type</label>
                <select style={sel} value={entry.swimStroke} onChange={e => updFitnessEntry(origIdx, { swimStroke: e.target.value })}>
                  <option value="">Select</option>
                  {SWIM_STROKES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={goldLbl}>Distance (meters)</label>
                <input style={inp} type="number" min="0"
                  value={entry.cardioDistance} onChange={e => updFitnessEntry(origIdx, { cardioDistance: e.target.value })} placeholder="meters" />
              </div>
            </>}

            {isOther && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={goldLbl}>Describe Activity</label>
                <input style={inp} value={entry.fitnessActivityOther}
                  onChange={e => updFitnessEntry(origIdx, { fitnessActivityOther: e.target.value })} placeholder="What did you do?" />
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={goldLbl}>Notes</label>
              <textarea style={{ ...inp, resize: 'vertical' }} rows={2}
                value={entry.notes || ''}
                onChange={e => updFitnessEntry(origIdx, { notes: e.target.value })}
                placeholder="Workout details, how it felt, etc." />
            </div>
          </div>
        )}
      </div>
    );
  }

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
            {console.log('[render] fd.sleepTime:', fd.sleepTime, 'fd.wakeTime:', fd.wakeTime, 'calc:', calcHoursSlept(fd.sleepTime, fd.wakeTime))}
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

        {/* Fitness tab row */}
        <div style={{ display: 'flex', gap: 0, marginTop: 0, marginBottom: 10 }}>
          <button style={tabBtn(fitnessTab === 'yesterday')} onClick={() => { setFitnessTab('yesterday'); onSyncRecurring?.(); }}>
            Fitness Yesterday
          </button>
          <button style={tabBtn(fitnessTab === 'configure')} onClick={() => setFitnessTab('configure')}>
            Configure Recurring Fitness
          </button>
        </div>

        {fitnessTab === 'yesterday' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, alignItems: 'start' }}>
            <div>
              <label style={reqLbl}>* Fitness Yesterday</label>
              <select style={{ ...sel, ...lockStyle }} value={fd.fitnessYesterday} disabled={isDayCompleteMarked}
                onChange={e => {
                  const v = e.target.value;
                  if (v === 'Yes') {
                    updMulti([['fitnessYesterday', v]]);
                  } else {
                    const hasEnteredData = (fd.fitnessEntries || []).some(entry =>
                      !entry.recurringId && (
                        (entry.fitnessActivity || '').trim() !== '' ||
                        (entry.cardioDistance || '').toString().trim() !== '' ||
                        (entry.notes || '').trim() !== ''
                      )
                    );
                    if (hasEnteredData && !window.confirm('Changing this will clear your entered fitness data. Continue?')) return;
                    updMulti([['fitnessYesterday', v], ['fitnessEntries', [emptyFitnessEntry()]]]);
                  }
                }}>
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
                <option>Rest Day</option>
              </select>
            </div>
          </div>
        )}

        {fitnessTab === 'configure' && (
          <div>
            {recurringFitness.map(a => renderRecurringActivity(a))}
            <button onClick={onAddRecurring} style={addBtn}>+ Add Recurring Activity</button>
            <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 8 }}>
              All changes are automatically saved.
            </div>
          </div>
        )}
      </div>

      {/* Fitness Activity Details */}
      {fitnessTab === 'yesterday' && showActivity && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
            Fitness Activity Details
          </div>
          {[...fd.fitnessEntries]
            .sort((a, b) => (a.recurringId ? 0 : 1) - (b.recurringId ? 0 : 1))
            .map((entry, i) => renderFitnessEntry(entry, i))}
          <button onClick={addFitnessEntry} style={addBtn}>+ Add Another Activity</button>
        </div>
      )}
    </div>
  );
}
