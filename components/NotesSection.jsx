import React from 'react';
import { card, secTitle, inp } from './styles';

export default function NotesSection({ nit, upd }) {
  return (
    <div style={card}>
      <div style={secTitle}>Notes — Ideas — Thoughts *</div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontStyle: 'italic' }}>
        Clear mental noise here.
      </div>
      <textarea
        style={{ ...inp, minHeight: 110, resize: 'vertical' }}
        value={nit}
        onChange={e => upd('nit', e.target.value)}
        placeholder="Capture anything freely — notes, ideas, thoughts. Required for a complete day."
      />
    </div>
  );
}
