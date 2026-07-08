import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, RED } from '../utils/constants';
import {
  LOCATIONS, PIT_TIMES, ACTIVITY_TYPES, DISTANCE_ACTIVITIES,
  TERRAIN_OPTIONS, YOGA_TYPES, SWIM_ENVIRONMENTS, SWIM_STROKES,
  MEDITATION_DURATIONS, WORK_OPTS,
} from '../utils/constants';
import { WAKE_TIMES, normalizeWakeTime, to12Hour } from '../utils/date';
import { emptyFitnessEntry } from '../utils/form';
import { card, secTitle, lbl, inp, sel } from './styles';

function isDistanceActivity(a) {
  return DISTANCE_ACTIVITIES.some(d => a && a.toLowerCase().includes(d.toLowerCase()));
}

export default function DailyTrackingSection({ fd, upd, updMulti, updFitnessEntry, addFitnessEntry, removeFitnessEntry }) {
  const showActivity = fd.fitnessYesterday === 'Yes';

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

  function renderFitnessEntry(entry, i) {
    const isDistance = isDistanceActivity(entry.fitnessActivity);
    const isYoga     = entry.fitnessActivity === 'Yoga';
    const isSwim     = entry.fitnessActivity === 'Swim';
    const isOther    = entry.fitnessActivity === 'Other';
    return (
      <div key={i} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1 }}>
            Entry {i + 1}
          </div>
          {fd.fitnessEntries.length > 1 && (
            <button onClick={() => removeFitnessEntry(i)} style={removeBtn}>Remove</button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'start' }}>
          <div>
            <label style={goldLbl}>Activity Type</label>
            <select style={sel} value={entry.fitnessActivity}
              onChange={e => updFitnessEntry(i, {
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
                value={entry.cardioDistance} onChange={e => updFitnessEntry(i, { cardioDistance: e.target.value })} placeholder="miles" />
            </div>
            <div>
              <label style={goldLbl}>Terrain</label>
              <select style={sel} value={entry.terrain} onChange={e => updFitnessEntry(i, { terrain: e.target.value })}>
                <option value="">Select</option>
                {TERRAIN_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </>}

          {isYoga && (
            <div>
              <label style={goldLbl}>Yoga Type</label>
              <select style={sel} value={entry.yogaType} onChange={e => updFitnessEntry(i, { yogaType: e.target.value })}>
                <option value="">Select</option>
                {YOGA_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          )}

          {isSwim && <>
            <div>
              <label style={goldLbl}>Environment</label>
              <select style={sel} value={entry.swimEnvironment} onChange={e => updFitnessEntry(i, { swimEnvironment: e.target.value })}>
                <option value="">Select</option>
                {SWIM_ENVIRONMENTS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={goldLbl}>Stroke / Type</label>
              <select style={sel} value={entry.swimStroke} onChange={e => updFitnessEntry(i, { swimStroke: e.target.value })}>
                <option value="">Select</option>
                {SWIM_STROKES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={goldLbl}>Distance (meters)</label>
              <input style={inp} type="number" min="0"
                value={entry.cardioDistance} onChange={e => updFitnessEntry(i, { cardioDistance: e.target.value })} placeholder="meters" />
            </div>
          </>}

          {isOther && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={goldLbl}>Describe Activity</label>
              <input style={inp} value={entry.fitnessActivityOther}
                onChange={e => updFitnessEntry(i, { fitnessActivityOther: e.target.value })} placeholder="What did you do?" />
            </div>
          )}
        </div>
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
            <input list="wake-time-options" style={{ ...inp, height: 34 }} value={wakeInput}
              onChange={e => { setWakeInput(e.target.value); if (wakeError) setWakeError(''); }}
              onBlur={commitWake} placeholder="e.g. 7:30 AM" />
            <datalist id="wake-time-options">
              {WAKE_TIMES.map(t => <option key={t} value={t} />)}
            </datalist>
            {wakeError && <div style={{ color: RED, fontSize: 10, marginTop: 3, lineHeight: 1.3 }}>{wakeError}</div>}
          </div>
          <div>
            <label style={reqLbl}>* Weight (lbs)</label>
            <input style={{ ...inp, height: 34 }} type="number" min="50" max="400" step="1"
              value={fd.weight} onChange={e => upd('weight', e.target.value)} placeholder="50–400 lbs" />
          </div>
          <div>
            <label style={reqLbl}>* Work / Off</label>
            <select style={sel} value={fd.workOff} onChange={e => upd('workOff', e.target.value)}>
              <option value="">Select</option>
              {WORK_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={reqLbl}>
              * Sleep Score
              <span style={{ fontSize: 9, fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.7, marginLeft: 4, fontStyle: 'italic' }}>last night</span>
            </label>
            <input style={{ ...inp, height: 34 }} type="number" min="0" max="100"
              value={fd.sleepScore} onChange={e => upd('sleepScore', e.target.value)} placeholder="0–100" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, alignItems: 'start' }}>
          <div>
            <label style={reqLbl}>* Fitness Yesterday</label>
            <select style={sel} value={fd.fitnessYesterday}
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
      </div>

      {/* Fitness Activity Details */}
      {showActivity && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
            Fitness Activity Details
          </div>
          {fd.fitnessEntries.map((entry, i) => renderFitnessEntry(entry, i))}
          <button onClick={addFitnessEntry} style={addBtn}>+ Add Fitness Activity</button>
        </div>
      )}

      {/* Additional Tracking */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
          Additional Tracking
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={dimLbl}>
              AM Fitness Today
              <span style={{ fontSize: '0.82em', fontWeight: 500, opacity: 0.9, display: 'block' }}>(non-negotiable)</span>
            </label>
            <select style={sel} value={fd.amWorkout} onChange={e => upd('amWorkout', e.target.value)}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
              <option>Rest Day</option>
            </select>
          </div>
          <div>
            <label style={dimLbl}>
              <span>Location</span>
              <span style={{ display: 'block', fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: 0, marginTop: 1 }}>
                Where are you completing today's PIT?
              </span>
            </label>
            <select style={sel} value={fd.location} onChange={e => upd('location', e.target.value)}>
              <option value="">Select</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={dimLbl}>PIT Time Frame</label>
            <select style={sel} value={fd.pitTimeFrame} onChange={e => upd('pitTimeFrame', e.target.value)}>
              <option value="">Select</option>
              {PIT_TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={dimLbl}>Meditation / Mental Alignment Today</label>
            <select style={sel} value={fd.meditation}
              onChange={e => updMulti([['meditation', e.target.value], ['meditationDuration', '']])}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          {fd.meditation === 'Yes' && (
            <div>
              <label style={dimLbl}>Med. Duration</label>
              <select style={sel} value={fd.meditationDuration} onChange={e => upd('meditationDuration', e.target.value)}>
                <option value="">Select</option>
                {MEDITATION_DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
