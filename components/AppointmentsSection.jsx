import React from 'react';
import { GOLD, GOLD_LIGHT, BORDER, MID } from '../utils/constants';
import { SMS_TIMES } from '../utils/constants';
import { card, secTitle, lbl, inp, sel } from './styles';

export default function AppointmentsSection({ appointments, updAppt, addAppt, removeAppt }) {
  return (
    <div style={card}>
      <div style={secTitle}>Appointments</div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 12, fontStyle: 'italic' }}>
        SMS reminders are coming soon — checking the box and setting a reminder time saves your preference for when that feature is ready.
      </div>

      {appointments.map((a, i) => (
        <div key={a.id} style={{ marginBottom: 12, padding: 12, background: '#f8f8f6', borderRadius: 6, border: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: GOLD, textTransform: 'uppercase', letterSpacing: 1 }}>
              Appointment {i + 1}
            </div>
            <button
              onClick={() => removeAppt(a.id)}
              style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 4, color: '#999', fontSize: 10, cursor: 'pointer', padding: '2px 8px', fontWeight: 600 }}
            >
              Remove
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Date</label>
              <input style={inp} type="date" value={a.date || ''} onChange={e => updAppt(a.id, 'date', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Title</label>
              <input style={inp} value={a.title} onChange={e => updAppt(a.id, 'title', e.target.value)} placeholder="Description..." />
            </div>
            <div>
              <label style={lbl}>Time</label>
              <input style={inp} type="time" value={a.time || ''} onChange={e => updAppt(a.id, 'time', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Duration</label>
              <input style={inp} value={a.duration} onChange={e => updAppt(a.id, 'duration', e.target.value)} placeholder="1 hr" />
            </div>
            <div>
              <label style={lbl}>Location</label>
              <input style={inp} value={a.location} onChange={e => updAppt(a.id, 'location', e.target.value)} placeholder="Location" />
            </div>
            <div>
              <label style={lbl}>Prep Needed</label>
              <input style={inp} value={a.prep} onChange={e => updAppt(a.id, 'prep', e.target.value)} placeholder="Preparation needed..." />
            </div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 8, borderTop: `1px dashed ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={a.smsReminder || false}
                onChange={e => updAppt(a.id, 'smsReminder', e.target.checked)}
                style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: MID }}>SMS Reminder</span>
            </div>
            {a.smsReminder && (
              <select
                style={{ ...sel, width: 130, fontSize: 12, padding: '5px 8px' }}
                value={a.smsTime || ''}
                onChange={e => updAppt(a.id, 'smsTime', e.target.value)}
              >
                <option value="">How early?</option>
                {SMS_TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            )}
          </div>
        </div>
      ))}

      {appointments.length < 5 && (
        <button
          onClick={addAppt}
          style={{ width: '100%', padding: '9px', borderRadius: 5, border: '1.5px solid #000', background: GOLD_LIGHT, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, marginTop: 6 }}
        >
          + Add Appointment
        </button>
      )}
    </div>
  );
}
