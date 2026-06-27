import React from 'react';
import { GOLD, GOLD_LIGHT, DARK, MID } from '../utils/constants';
import { card, secTitle, lbl, inp, gbtn, dbtn } from './styles';

export default function DevotionalSection({ fd, upd, updMulti, fetchScripture, aiLoadScripture }) {
  return (
    <div style={card}>
      <div style={secTitle}>Daily Devotional or Silence and Reflection</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={fd.prayerDone}
            onChange={e => upd('prayerDone', e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: GOLD }}
          />
          <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>
            {fd.prayerType === 'prayer'
              ? 'Two-Minute Prayer — Completed'
              : 'Two-Minute Silence and Self-Reflection — Completed'}
          </span>
        </div>
        <button
          style={{ ...dbtn({ padding: '4px 12px', fontSize: 10 }), marginLeft: 'auto' }}
          onClick={() => upd('prayerType', fd.prayerType === 'prayer' ? 'silence' : 'prayer')}
        >
          Switch to: {fd.prayerType === 'prayer' ? 'Silence & Reflection' : 'Prayer'}
        </button>
      </div>

      <label style={lbl}>Notes</label>
      <textarea
        style={{ ...inp, minHeight: 80, resize: 'vertical' }}
        value={fd.devotionalNotes}
        onChange={e => upd('devotionalNotes', e.target.value)}
        placeholder="Reflections..."
      />

      {/* Scripture Search */}
      <div style={{ marginTop: 14, padding: 14, background: GOLD_LIGHT, borderRadius: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: DARK, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Scripture Search / Reflection Search
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inp, flex: 1 }}
            value={fd.scriptureQuery}
            onChange={e => upd('scriptureQuery', e.target.value)}
            placeholder="Topic, passage, or reflection theme..."
            onKeyDown={e => e.key === 'Enter' && fetchScripture()}
          />
          <button style={gbtn()} onClick={fetchScripture} disabled={aiLoadScripture}>
            {aiLoadScripture ? '...' : 'Search'}
          </button>
        </div>

        {fd.scriptureResult && (
          <div style={{ marginTop: 10, background: '#fff', borderRadius: 5, padding: 12, fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: MID, position: 'relative' }}>
            <button
              onClick={() => updMulti([['scriptureQuery', ''], ['scriptureResult', '']])}
              style={{ position: 'absolute', top: 6, right: 8, width: 22, height: 22, border: 'none', background: 'transparent', color: MID, fontSize: 18, lineHeight: 1, cursor: 'pointer', fontWeight: 700, padding: 0 }}
              title="Close"
            >×</button>
            <div style={{ paddingRight: 22 }}>{fd.scriptureResult}</div>
          </div>
        )}
      </div>
    </div>
  );
}
