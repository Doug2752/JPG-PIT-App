import React from 'react';
import { GOLD, RED, BORDER, MID, GOLD_LIGHT } from '../utils/constants';
import { card, secTitle, lbl, inp } from './styles';

export default function ToAccomplishSection({ fd, upd, updTask }) {
  return (
    <div style={card}>
      <div style={secTitle}>To Accomplish</div>

      {/* The One Thing */}
      <div style={{ background: '#fff5f5', border: `2px solid ${RED}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <input
            type="checkbox"
            checked={fd.oneThingDone}
            onChange={e => upd('oneThingDone', e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: RED }}
          />
          <span style={{ fontWeight: 900, fontSize: 13, color: RED, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            * #1 — The One Thing
          </span>
        </div>
        <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginBottom: 8 }}>
          By completing this one thing, everything else becomes easier or unnecessary.
        </div>
        <input
          style={{ ...inp, fontSize: 15, fontWeight: 700, borderColor: RED }}
          value={fd.oneThing}
          onChange={e => upd('oneThing', e.target.value)}
          placeholder="The ONE THING I must accomplish today..."
        />
        <div style={{ marginTop: 8 }}>
          <label style={lbl}>First Action / Set-Up</label>
          <input
            style={inp}
            value={fd.oneThingSetup}
            onChange={e => upd('oneThingSetup', e.target.value)}
            placeholder="The first action to begin this..."
          />
        </div>
      </div>

      {/* Daily Tasks #2-3 */}
      <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px dashed ${BORDER}` }}>
        <div style={{ ...lbl, color: GOLD, marginBottom: 8 }}>Daily Tasks (2-3)</div>
        {[0, 1].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <input type="checkbox" checked={fd.tasks[i].done}
              onChange={e => updTask(i, 'done', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: GOLD }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, minWidth: 22 }}>#{i + 2}</span>
            <input style={inp} value={fd.tasks[i].text}
              onChange={e => updTask(i, 'text', e.target.value)}
              placeholder={`Daily task ${i + 2}`} />
          </div>
        ))}
      </div>

      {/* Future Tasks #4-6 */}
      <div>
        <div style={{ ...lbl, color: '#aaa', marginBottom: 8 }}>Future Tasks (4-6) — not tied to today</div>
        {(() => {
          const visibleFuture = Math.max(
            fd.futureTasksVisible ?? 1,
            (fd.tasks[4]?.text || fd.tasks[4]?.done) ? 3 :
            (fd.tasks[3]?.text || fd.tasks[3]?.done) ? 2 : 1
          );
          return (
            <>
              {fd.tasks.slice(2, 2 + visibleFuture).map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                  <input type="checkbox" checked={t.done}
                    onChange={e => updTask(i + 2, 'done', e.target.checked)}
                    style={{ width: 14, height: 14, cursor: 'pointer' }} />
                  <span style={{ fontSize: 11, color: '#aaa', minWidth: 22 }}>#{i + 4}</span>
                  <input style={{ ...inp, fontSize: 12 }} value={t.text}
                    onChange={e => updTask(i + 2, 'text', e.target.value)}
                    placeholder={`Future task ${i + 4}`} />
                </div>
              ))}
              {visibleFuture < 3 && (
                <button
                  onClick={() => upd('futureTasksVisible', visibleFuture + 1)}
                  style={{ width: '100%', padding: '9px', borderRadius: 5, border: `1.5px dashed ${GOLD}`, background: 'transparent', color: GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, marginTop: 6 }}
                >
                  + Add Future Task
                </button>
              )}
            </>
          );
        })()}
        <div style={{ marginTop: 10, padding: '8px 12px', background: GOLD_LIGHT, borderRadius: 5, fontSize: 11, color: MID }}>
          Three future tasks max. These are reference — not required today.
        </div>
      </div>
    </div>
  );
}
