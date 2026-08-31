import React from 'react';
import { GOLD, BORDER } from '../utils/constants';
import { card, secTitle, inp, lbl } from './styles';

export default function AppointmentsSection({ appointmentText, updAppointmentText, parsedAppointments, apptParseMsg, onApptBlur, isDayCompleteMarked }) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  return (
    <div style={card}>
      <div style={secTitle}>Appointments</div>
      <textarea
        style={{ ...inp, minHeight: 100, resize: 'vertical', ...lockStyle }}
        value={appointmentText ?? ''}
        onChange={e => updAppointmentText(e.target.value)}
        onBlur={onApptBlur}
        placeholder="Enter your appointments here — e.g. Doctor Friday Jan 10 at 2pm downtown clinic. Add as many as you like, one per line or separated by commas."
        disabled={isDayCompleteMarked}
      />
      {apptParseMsg && (
        <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>{apptParseMsg}</div>
      )}
      {parsedAppointments && parsedAppointments.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {parsedAppointments.map((a, i) => (
            <div key={i} style={{ background: '#f8f8f6', border: `1px solid ${BORDER}`, borderRadius: 6, padding: 10, marginTop: 6, fontSize: 12 }}>
              {a.title    && <div><span style={{ fontWeight: 700 }}>Title: </span>{a.title}</div>}
              {a.date     && <div><span style={{ fontWeight: 700 }}>Date: </span>{a.date}</div>}
              {a.time     && <div><span style={{ fontWeight: 700 }}>Time: </span>{a.time}</div>}
              {a.location && <div><span style={{ fontWeight: 700 }}>Location: </span>{a.location}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
