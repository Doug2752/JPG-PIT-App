import React from 'react';
import { card, secTitle, lbl, inp } from './styles';

export default function GratitudeSection({ fd, updMulti, gratitudeParseMsg, onGratitudeBlur, isDayCompleteMarked }) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  return (
    <div style={card}>
      <div style={secTitle}>Thankful For</div>
      <div style={{ ...lbl, marginBottom: 8 }}>* Required for Day Complete</div>
      <textarea
        rows={3}
        style={{ ...inp, resize: 'vertical', ...lockStyle }}
        value={fd.gratitudeText ?? ''}
        onChange={e => updMulti({ gratitudeText: e.target.value })}
        onBlur={onGratitudeBlur}
        placeholder="I am thankful for (item 1), (item 2), (item 3)"
        disabled={isDayCompleteMarked}
      />
      {gratitudeParseMsg && (
        <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>{gratitudeParseMsg}</div>
      )}
    </div>
  );
}
