import React from 'react';
import { GOLD, GOLD_LIGHT } from '../utils/constants';
import {
  LOCATIONS, PIT_TIMES, ACTIVITY_TYPES, DISTANCE_ACTIVITIES,
  TERRAIN_OPTIONS, YOGA_TYPES, SWIM_ENVIRONMENTS, SWIM_STROKES,
  MEDITATION_DURATIONS, WORK_OPTS,
} from '../utils/constants';
import { WAKE_TIMES } from '../utils/date';
import { card, secTitle, lbl, inp, sel } from './styles';

function isDistanceActivity(a) {
  return DISTANCE_ACTIVITIES.some(d => a && a.toLowerCase().includes(d.toLowerCase()));
}

export default function DailyTrackingSection({ fd, upd, updMulti }) {
  const showActivity        = fd.fitnessYesterday === 'Yes';
  const showDistanceTerrain = showActivity && isDistanceActivity(fd.fitnessActivity);
  const showYoga            = showActivity && fd.fitnessActivity === 'Yoga';
  const showSwim            = showActivity && fd.fitnessActivity === 'Swim';
  const showOther           = showActivity && fd.fitnessActivity === 'Other';

  const goldLbl = { ...lbl, color: GOLD_LIGHT };
  const reqLbl  = { ...goldLbl };
  const dimLbl  = { ...lbl, color: 'rgba(255,255,255,0.5)', display: 'block', minHeight: 30, lineHeight: 1.25 };

  return (
    <div style={{ ...card, background: '#1a1a1a' }}>
      <div style={{ ...secTitle, color: GOLD_LIGHT, borderBottomColor: GOLD }}>
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
            <select style={sel} value={fd.wakeTime} onChange={e => upd('wakeTime', e.target.value)}>
              <option value="">Select</option>
              {WAKE_TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
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
              onChange={e => updMulti([
                ['fitnessYesterday', e.target.value], ['fitnessActivity', ''], ['fitnessActivityOther', ''],
                ['cardioDistance', ''], ['terrain', ''], ['yogaType', ''], ['swimEnvironment', ''], ['swimStroke', ''],
              ])}>
              <option value="">Select</option>
              <option>Yes</option>
              <option>No</option>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 10, alignItems: 'start' }}>
            <div>
              <label style={goldLbl}>Activity Type</label>
              <select style={sel} value={fd.fitnessActivity}
                onChange={e => updMulti([
                  ['fitnessActivity', e.target.value], ['fitnessActivityOther', ''],
                  ['cardioDistance', ''], ['terrain', ''], ['yogaType', ''], ['swimEnvironment', ''], ['swimStroke', ''],
                ])}>
                <option value="">Select</option>
                {ACTIVITY_TYPES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {showDistanceTerrain && <>
              <div>
                <label style={goldLbl}>Distance (miles)</label>
                <input style={{ ...inp, height: 34 }} type="number" min="0" step="0.1"
                  value={fd.cardioDistance} onChange={e => upd('cardioDistance', e.target.value)} placeholder="miles" />
              </div>
              <div>
                <label style={goldLbl}>Terrain</label>
                <select style={sel} value={fd.terrain} onChange={e => upd('terrain', e.target.value)}>
                  <option value="">Select</option>
                  {TERRAIN_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </>}

            {showYoga && (
              <div>
                <label style={goldLbl}>Yoga Type</label>
                <select style={sel} value={fd.yogaType} onChange={e => upd('yogaType', e.target.value)}>
                  <option value="">Select</option>
                  {YOGA_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {showSwim && <>
              <div>
                <label style={goldLbl}>Environment</label>
                <select style={sel} value={fd.swimEnvironment} onChange={e => upd('swimEnvironment', e.target.value)}>
                  <option value="">Select</option>
                  {SWIM_ENVIRONMENTS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={goldLbl}>Stroke / Type</label>
                <select style={sel} value={fd.swimStroke} onChange={e => upd('swimStroke', e.target.value)}>
                  <option value="">Select</option>
                  {SWIM_STROKES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={goldLbl}>Distance (meters)</label>
                <input style={inp} type="number" min="0"
                  value={fd.cardioDistance} onChange={e => upd('cardioDistance', e.target.value)} placeholder="meters" />
              </div>
            </>}

            {showOther && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={goldLbl}>Describe Activity</label>
                <input style={inp} value={fd.fitnessActivityOther}
                  onChange={e => upd('fitnessActivityOther', e.target.value)} placeholder="What did you do?" />
              </div>
            )}
          </div>
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
