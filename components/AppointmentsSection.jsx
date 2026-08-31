import React from 'react';
import { BORDER } from '../utils/constants';
import { card, secTitle, inp } from './styles';

export default function AppointmentsSection({ appointmentText, updAppointmentText, parsedAppointments, apptParseMsg, onApptBlur, isDayCompleteMarked }) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  return (
    <div style={card}>
      <div style={secTitle}>Appointments</div>
      <textarea
        rows={4}
        style={{ ...inp, resize: 'vertical', ...lockStyle }}
        value={appointmentText ?? ''}
        onChange={e => updAppointmentText(e.target.value)}
        onBlur={onApptBlur}
        placeholder="Add appointments — e.g. Monday Sept 8 at 2pm, dentist on Friday at 10am"
        disabled={isDayCompleteMarked}
      />
      {apptParseMsg && (
        <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>{apptParseMsg}</div>
      )}
      {parsedAppointments && parsedAppointments.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {parsedAppointments.map((a, i) => (
            <div key={i} style={{ background: '#f8f8f6', border: `1px solid ${BORDER}`, borderRadius: 6, padding: 10, marginTop: 6, fontSize: 12, lineHeight: 1.6 }}>
              {a.title    && <div><strong>Title:</strong> {a.title}</div>}
              {a.date     && <div><strong>Date:</strong> {a.date}</div>}
              {a.time     && <div><strong>Time:</strong> {a.time}</div>}
              {a.location && <div><strong>Location:</strong> {a.location}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
