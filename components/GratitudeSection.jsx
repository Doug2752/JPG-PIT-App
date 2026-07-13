import React from 'react';
import { card, secTitle, lbl, inp } from './styles';

export default function GratitudeSection({ thankful1, thankful2, thankful3, upd, isDayCompleteMarked }) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};
  return (
    <div style={card}>
      <div style={secTitle}>Thankful For *</div>
      {[1, 2, 3].map(n => (
        <div key={n} style={{ marginBottom: 10 }}>
          <label style={lbl}>{n}.</label>
          <input
            style={{ ...inp, ...lockStyle }}
            value={[thankful1, thankful2, thankful3][n - 1]}
            onChange={e => upd(`thankful${n}`, e.target.value)}
            placeholder="I am thankful for..."
            disabled={isDayCompleteMarked}
          />
        </div>
      ))}
    </div>
  );
}
