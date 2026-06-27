import React from 'react';
import { GOLD, GOLD_LIGHT, DARK, MID } from '../utils/constants';
import { card, secTitle, lbl, inp, gbtn } from './styles';

export default function BookSection({ fd, upd, updMulti, markBookComplete, fetchBookAI, aiLoadBook }) {
  return (
    <div style={card}>
      <div style={{ ...secTitle, marginBottom: 12 }}>Daily Book Study</div>

      <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginBottom: 6, paddingLeft: 2 }}>
        Check this box only when you finish the book entered below.
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        padding: '10px 14px',
        background: fd.bookCompleted ? '#f0f8f0' : GOLD_LIGHT,
        borderRadius: 6,
        border: `1px solid ${fd.bookCompleted ? '#2ecc71' : GOLD}`,
        cursor: fd.bookName.trim() ? 'pointer' : 'not-allowed',
        opacity: (!fd.bookName.trim() && !fd.bookCompleted) ? 0.6 : 1,
      }}>
        <input
          type="checkbox"
          checked={fd.bookCompleted}
          onChange={e => {
            if (e.target.checked && fd.bookName.trim()) markBookComplete();
            else if (!e.target.checked) upd('bookCompleted', false);
          }}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: GOLD }}
          disabled={!fd.bookName.trim() && !fd.bookCompleted}
        />
        <span style={{ fontSize: 12, fontWeight: 700, color: fd.bookCompleted ? '#2ecc71' : MID }}>
          Finished book. Add to my log
        </span>
        {fd.bookCompleted && (
          <span style={{ background: '#2ecc71', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700, marginLeft: 'auto' }}>
            Completed ✓
          </span>
        )}
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Current Book Reading</label>
          <div style={{ fontSize: 11, color: '#888', marginTop: -4, marginBottom: 6, fontStyle: 'italic' }}>
            Book you are actively reading right now
          </div>
          <input style={inp} value={fd.bookName} onChange={e => upd('bookName', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Author</label>
          <input style={inp} value={fd.bookAuthor} onChange={e => upd('bookAuthor', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Page</label>
          <input style={inp} type="number" value={fd.bookPage} onChange={e => upd('bookPage', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Topic</label>
          <input style={inp} value={fd.bookTopic} onChange={e => upd('bookTopic', e.target.value)} />
        </div>
      </div>

      <label style={lbl}>Notes</label>
      <textarea
        style={{ ...inp, minHeight: 80, resize: 'vertical', marginBottom: 14 }}
        value={fd.bookNotes}
        onChange={e => upd('bookNotes', e.target.value)}
        placeholder="Key takeaways, highlights..."
      />

      {/* Book AI */}
      <div style={{ padding: 14, background: GOLD_LIGHT, borderRadius: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: DARK, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Ask About This Book
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inp, flex: 1 }}
            value={fd.bookAiQuery}
            onChange={e => upd('bookAiQuery', e.target.value)}
            placeholder="Ask anything about the book, concepts, author..."
            onKeyDown={e => e.key === 'Enter' && fetchBookAI()}
          />
          <button style={gbtn()} onClick={fetchBookAI} disabled={aiLoadBook}>
            {aiLoadBook ? '...' : 'Ask'}
          </button>
        </div>

        {fd.bookAiResult && (
          <div style={{ marginTop: 10, background: '#fff', borderRadius: 5, padding: 12, fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: MID, position: 'relative' }}>
            <button
              onClick={() => updMulti([['bookAiQuery', ''], ['bookAiResult', '']])}
              style={{ position: 'absolute', top: 6, right: 8, width: 22, height: 22, border: 'none', background: 'transparent', color: MID, fontSize: 18, lineHeight: 1, cursor: 'pointer', fontWeight: 700, padding: 0 }}
              title="Close"
            >×</button>
            <div style={{ paddingRight: 22 }}>{fd.bookAiResult}</div>
          </div>
        )}
      </div>
    </div>
  );
}
