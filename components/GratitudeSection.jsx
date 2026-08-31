import React from 'react';
import { card, secTitle, inp } from './styles';
import { parseGratitudeAI } from '../services/ai';

export default function GratitudeSection({ fd, upd, updMulti, isDayCompleteMarked, gratitudeParseMsg }) {
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  const handleGratitudeBlur = async () => {
    const text = fd.gratitudeText ?? '';
    if (!text.trim()) return;
    const result = await parseGratitudeAI(text);
    updMulti({ thankful1: result.thankful1, thankful2: result.thankful2, thankful3: result.thankful3 });
  };

  return (
    <div style={card}>
      <div style={secTitle}>Thankful For *</div>
      <textarea
        style={{ ...inp, minHeight: 80, resize: 'vertical', ...lockStyle }}
        value={fd.gratitudeText ?? ''}
        onChange={e => upd('gratitudeText', e.target.value)}
        onBlur={handleGratitudeBlur}
        placeholder="I am thankful for (item 1), (item 2), (item 3)"
        disabled={isDayCompleteMarked}
      />
      {gratitudeParseMsg && (
        <div style={{ color: '#b8860b', fontSize: 13, marginTop: 4 }}>{gratitudeParseMsg}</div>
      )}
    </div>
  );
}
