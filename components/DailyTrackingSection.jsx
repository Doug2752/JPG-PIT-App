import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, RED } from '../utils/constants';
import {
  LOCATIONS, PIT_TIMES, ACTIVITY_TYPES, DISTANCE_ACTIVITIES,
  TERRAIN_OPTIONS, YOGA_TYPES, SWIM_ENVIRONMENTS, SWIM_STROKES,
  MEDITATION_DURATIONS, WORK_OPTS, DAYS_OF_WEEK,
} from '../utils/constants';
import { WAKE_TIMES, normalizeWakeTime, to12Hour } from '../utils/date';
import { emptyFitnessEntry } from '../utils/form';
import { card, secTitle, lbl, inp, sel } from './styles';

function isDistanceActivity(a) {
  return DISTANCE_ACTIVITIES.some(d => a && a.toLowerCase().includes(d.toLowerCase()));
}

export default function DailyTrackingSection({
  fd, upd, updMulti, updFitnessEntry, addFitnessEntry, removeFitnessEntry,
  recurringFitness = [], onAddRecurring, onUpdateRecurring, onRemoveRecurring, onSyncRecurring,
  isDayCompleteMarked,
}) {
  const showActivity = fd.fitnessYesterday === 'Yes';
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};
  const [fitnessTab, setFitnessTab] = useState('yesterday');

  // Wake Up combobox: local text buffer so free-text typing never writes a
  // bad value to storage. Re-sync (and convert any legacy 24-hr value to
  // 12-hr display) whenever the underlying stored value changes.
  const [wakeInput, setWakeInput] = useState(to12Hour(fd.wakeTime));
  const [wakeError, setWakeError] = useState('');
  useEffect(() => {
    setWakeInput(to12Hour(fd.wakeTime));
    setWakeError('');
  }, [fd.wakeTime]);

  function commitWake() {
    const val = wakeInput.trim();
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

  const goldLbl = { ...lbl, color: GOLD };
  const reqLbl  = { ...goldLbl };
  const dimLbl  = { ...lbl, color: 'rgba(255,255,255,0.5)', display: 'block', minHeight: 30, lineHeight: 1.25 };

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
          <button onClick={() => onRemoveRecurring(activity.id)} style={removeBtn}>Remove</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={goldLbl}>Activity Name</label>
            <input style={winp} value={activity.name || ''}
              onChange={e => onUpdateRecurring(activity.id, { name: e.target.value })}
              placeholder="e.g. AMDWR Morning Run" />
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
          <div>
            <label style={goldLbl}>Track By</label>
            <select style={wsel} value={activity.distanceOrDuration}
              onChange={e => onUpdateRecurring(activity.id, { distanceOrDuration: e.target.value })}>
              <option value="distance">Distance</option>
              <option value="duration">Duration</option>
              <option value="both">Both</option>
            </select>
          </div>
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
                {ACTIVITY_TYPES.map(a => <option key={a}>{a}</option>)}
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
        <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
          Required Fields *
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, alignItems: 'end', marginBottom: 10 }}>
          <div>
            <label style={reqLbl}>* Wake Up Time</label>
            <input list="wake-time-options" style={{ ...inp, height: 34, ...lockStyle }} value={wakeInput}
              onChange={e => { setWakeInput(e.target.value); if (wakeError) setWakeError(''); }}
              onBlur={commitWake} placeholder="e.g. 7:30 AM" disabled={isDayCompleteMarked} />
            <datalist id="wake-time-options">
              {WAKE_TIMES.map(t => <option key={t} value={t} />)}
            </datalist>
            {wakeError && <div style={{ color: RED, fontSize: 10, marginTop: 3, lineHeight: 1.3 }}>{wakeError}</div>}
          </div>
          <div>
            <label style={reqLbl}>* Weight (lbs)</label>
            <input style={{ ...inp, height: 34, ...lockStyle }} type="number" min="50" max="400" step="1"
              value={fd.weight} onChange={e => upd('weight', e.target.value)} placeholder="50–400 lbs" disabled={isDayCompleteMarked} />
          </div>
          <div>
            <label style={reqLbl}>* Work / Off</label>
            <select style={{ ...sel, ...lockStyle }} value={fd.workOff} onChange={e => upd('workOff', e.target.value)} disabled={isDayCompleteMarked}>
              <option value="">Select</option>
              {WORK_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={reqLbl}>
              * Sleep Score
              <span style={{ fontSize: 9, fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.7, marginLeft: 4, fontStyle: 'italic' }}>last night</span>
            </label>
            <input style={{ ...inp, height: 34, ...lockStyle }} type="number" min="0" max="100"
              value={fd.sleepScore} onChange={e => upd('sleepScore', e.target.value)} placeholder="0–100" disabled={isDayCompleteMarked} />
          </div>
        </div>
        {/* Fitness tab row */}
        <div style={{ display: 'flex', gap: 0, marginTop: 6, marginBottom: 10 }}>
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
                  if (v === 'Yes') updMulti([['fitnessYesterday', v]]);
                  else updMulti([['fitnessYesterday', v], ['fitnessEntries', [emptyFitnessEntry()]]]);
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
          <button onClick={addFitnessEntry} style={addBtn}>+ Add Fitness Activity</button>
        </div>
      )}

      {/* Additional Tracking */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
          Additional Tracking
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto auto auto', gap: '0 10px' }}>

          {/* Row 1 — Headers */}
          <div style={{ gridRow: 1, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 3 }}>Location</div>
          <div style={{ gridRow: 1, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 3 }}>PIT Time Frame</div>
          <div style={{ gridRow: 1, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 3 }}>Energy Level</div>
          <div style={{ gridRow: 1, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, paddingBottom: 3 }}>Mental Alignment</div>

          {/* Row 2 — Descriptions */}
          <div style={{ gridRow: 2, fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, paddingBottom: 5 }}>Where are you completing today's PIT?</div>
          <div style={{ gridRow: 2, fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, paddingBottom: 5 }}>Approx duration to complete PIT.</div>
          <div style={{ gridRow: 2, fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, paddingBottom: 5 }}>10 = highest energy.</div>
          <div style={{ gridRow: 2, fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, lineHeight: 1.3, paddingBottom: 5 }}>Completing all aspects of PIT makes this complete.</div>

          {/* Row 3 — Dropdowns */}
          <div style={{ gridRow: 3 }}>
            <select style={sel} value={fd.location} onChange={e => upd('location', e.target.value)}>
              <option value="">Select</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ gridRow: 3 }}>
            <select style={{ ...sel, width: '100%' }} value={fd.pitTimeFrame} onChange={e => upd('pitTimeFrame', e.target.value)}>
              <option value="">Select</option>
              {PIT_TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ gridRow: 3 }}>
            <select style={{ ...sel, width: '100%' }} value={fd.energyLevel} onChange={e => upd('energyLevel', e.target.value)}>
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={String(n)}>{n}</option>)}
            </select>
          </div>
          <div style={{ gridRow: 3 }}>
            <select style={{ ...sel, width: '100%' }} value={fd.meditation} onChange={e => updMulti([['meditation', e.target.value], ['meditationDuration', '']])}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}
