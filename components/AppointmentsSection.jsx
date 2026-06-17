import React from 'react';
import { GOLD, BORDER, MID } from '../utils/constants';
import { SMS_TIMES } from '../utils/constants';
import { card, secTitle, lbl, inp, sel } from './styles';

export default function AppointmentsSection({ appointments, updAppt, addAppt, removeAppt }) {
  return (
    <div style={card}>
      <div style={secTitle}>Today's Appointments</div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 12, fontStyle: 'italic' }}>
        SMS reminders send to the phone number in your client profile.
      </div>

      {appointments.map((a, i) => (
        <div key={i} style={{ marginBottom: 12, padding: 12, background: '#f8f8f6', borderRadius: 6, border: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: GOLD, textTransform: 'uppercase', letterSpacing: 1 }}>
              Appointment {i + 1}
            </div>
            {appointments.length > 1 && (
              <button
                onClick={() => removeAppt(i)}
                style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 4, color: '#999', fontSize: 10, cursor: 'pointer', padding: '2px 8px', fontWeight: 600 }}
              >
                Remove
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Title</label>
              <input style={inp} value={a.title} onChange={e => updAppt(i, 'title', e.target.value)} placeholder="Description..." />
            </div>
            <div>
              <label style={lbl}>Time</label>
              <input style={inp} type="time" value={a.time || ''} onChange={e => updAppt(i, 'time', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Duration</label>
              <input style={inp} value={a.duration} onChange={e => updAppt(i, 'duration', e.target.value)} placeholder="1 hr" />
            </div>
            <div>
              <label style={lbl}>Location</label>
              <input style={inp} value={a.location} onChange={e => updAppt(i, 'location', e.target.value)} placeholder="Location" />
            </div>
            <div>
              <label style={lbl}>Prep Needed</label>
              <input style={inp} value={a.prep} onChange={e => updAppt(i, 'prep', e.target.value)} placeholder="Preparation needed..." />
            </div>
          </div>

          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 8, borderTop: `1px dashed ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={a.smsReminder || false}
                onChange={e => updAppt(i, 'smsReminder', e.target.checked)}
                style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: MID }}>SMS Reminder</span>
            </div>
            {a.smsReminder && (
              <select
                style={{ ...sel, width: 130, fontSize: 12, padding: '5px 8px' }}
                value={a.smsTime || ''}
                onChange={e => updAppt(i, 'smsTime', e.target.value)}
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
          style={{ width: '100%', padding: '9px', borderRadius: 5, border: `1.5px dashed ${GOLD}`, background: 'transparent', color: GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, marginTop: 6 }}
        >
          + Add Appointment
        </button>
      )}
    </div>
  );
}
