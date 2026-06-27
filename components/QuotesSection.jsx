import React from 'react';
import { GOLD, DARK, MID } from '../utils/constants';
import { card, secTitle, lbl, inp, gbtn } from './styles';

export default function QuotesSection({ fd, upd, updMulti, fetchQuotesInspiration, aiLoadQuotes }) {
  return (
    <div style={card}>
      <div style={secTitle}>Quotes &amp; Inspiration</div>

      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>My Quotes — From Reading or Study Today</label>
        <textarea
          style={{ ...inp, minHeight: 80, resize: 'vertical' }}
          value={fd.quotes}
          onChange={e => upd('quotes', e.target.value)}
          placeholder="Write quotes that stand out today..."
        />
      </div>

      {fd.quotesInspirationResult && (
        <div style={{ background: GOLD, border: '1.5px solid #000', borderRadius: 6, padding: 14, fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#000', marginBottom: 14, position: 'relative' }}>
          <button
            onClick={() => updMulti([['quotesInspirationQuery', ''], ['quotesInspirationResult', '']])}
            style={{ position: 'absolute', top: 6, right: 8, width: 22, height: 22, border: 'none', background: 'transparent', color: MID, fontSize: 18, lineHeight: 1, cursor: 'pointer', fontWeight: 700, padding: 0 }}
            title="Close"
          >×</button>
          <div style={{ paddingRight: 22 }}>{fd.quotesInspirationResult}</div>
        </div>
      )}

      <div style={{ padding: 14, background: GOLD, border: '1.5px solid #000', borderRadius: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: DARK, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Quote and Inspiration Research
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inp, flex: 1 }}
            value={fd.quotesInspirationQuery}
            onChange={e => upd('quotesInspirationQuery', e.target.value)}
            placeholder='Search by topic, feeling, or author — e.g. "resilience" or "Aurelius"'
            onKeyDown={e => e.key === 'Enter' && fetchQuotesInspiration()}
          />
          <button style={gbtn()} onClick={fetchQuotesInspiration} disabled={aiLoadQuotes}>
            {aiLoadQuotes ? '...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
}
