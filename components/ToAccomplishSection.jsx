import React, { useState } from 'react';
import { GOLD, RED, BORDER, MID, GOLD_LIGHT } from '../utils/constants';
import { card, secTitle, lbl, inp } from './styles';

export default function ToAccomplishSection({
  fd, upd, updTask, removeTask, promoteFutureTask,
  showClearModal, onClearModalOpen, clearModalItems = [],
  onClearConfirm, onClearCancel, toastMessage,
  archiveMode, archiveDateStr, isDayCompleteMarked,
}) {
  const [checkedSlots, setCheckedSlots] = useState({});
  const lockStyle = isDayCompleteMarked ? { opacity: 0.6, cursor: 'not-allowed' } : {};

  // Both daily slots filled? (same rule as rebuildToAccomplishItems)
  const dailyFilled = (t) =>
    ((t?.text || '').trim() !== '') || t?.done === true;
  const dailySlotsFull =
    dailyFilled(fd.tasks[0]) && dailyFilled(fd.tasks[1]);

  const hasContent = (fd.oneThing || '').trim() !== '' ||
    [0, 1, 2, 3, 4].some(i => (fd.tasks[i]?.text || '').trim() !== '');

  function isCarriedUnresolved(slotKey) {
    if (!archiveMode) return false;
    if (!archiveDateStr || !fd.toAccomplishItems) return false;
    const item = fd.toAccomplishItems.find(it => it && it.slot === slotKey);
    return !!(item && item.origin_date < archiveDateStr && item.resolution_status === null);
  }

  function toggleSlot(slot) {
    setCheckedSlots(prev => ({ ...prev, [slot]: !prev[slot] }));
  }

  function openModal() {
    setCheckedSlots({});
    onClearModalOpen();
  }

  function confirmClear() {
    const selected = clearModalItems.map(it => it.slot).filter(slot => checkedSlots[slot]);
    onClearConfirm(selected);
    setCheckedSlots({});
  }

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={secTitle}>To Accomplish</div>
        {hasContent && (
          <button
            onClick={openModal}
            style={{ background: GOLD_LIGHT, border: '1.5px solid #000', borderRadius: 5, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '4px 10px' }}
          >
            Clear Items
          </button>
        )}
      </div>

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
            * The One Thing
          </span>
        </div>
        <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginBottom: 8 }}>
          By completing this one thing, everything else becomes easier or unnecessary.
        </div>
        <input
          style={{ ...inp, fontSize: 15, fontWeight: 700, borderColor: RED, ...lockStyle }}
          value={fd.oneThing}
          onChange={e => upd('oneThing', e.target.value)}
          placeholder="The ONE THING I must accomplish today..."
          disabled={isDayCompleteMarked}
        />
        {isCarriedUnresolved('one_thing') && (
          <div style={{ fontStyle: 'italic', fontSize: 12, color: '#888', marginTop: 3 }}>
            carried, unresolved
          </div>
        )}
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
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={fd.tasks[i].done}
                onChange={e => updTask(i, 'done', e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: GOLD }} />
              <input style={inp} value={fd.tasks[i].text}
                onChange={e => updTask(i, 'text', e.target.value)}
                placeholder={`Daily task ${i + 2}`} />
            </div>
            {isCarriedUnresolved(`daily_${i + 2}`) && (
              <div style={{ fontStyle: 'italic', fontSize: 12, color: '#888', marginTop: 3 }}>
                carried, unresolved
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Future Tasks #4-6 */}
      <div>
        <div style={{ ...lbl, color: '#aaa', marginBottom: 8 }}>Future Tasks — not tied to today</div>
        {(() => {
          let visibleFuture = fd.futureTasksVisible ?? 1;
          for (let j = 2; j <= 19; j++) {
            if (fd.tasks[j]?.text || fd.tasks[j]?.done) {
              visibleFuture = Math.max(visibleFuture, j - 1);
            }
          }
          if (visibleFuture > 18) visibleFuture = 18;
          return (
            <>
              {fd.tasks.slice(2, 2 + visibleFuture).map((t, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" checked={t.done}
                      onChange={e => updTask(i + 2, 'done', e.target.checked)}
                      style={{ width: 14, height: 14, cursor: 'pointer' }} />
                    <input style={{ ...inp, fontSize: 12 }} value={t.text}
                      onChange={e => updTask(i + 2, 'text', e.target.value)}
                      placeholder={`Future task ${i + 4}`} />
                    <button
                      onClick={() => promoteFutureTask(i + 2)}
                      style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 4, color: '#999', fontSize: 10, cursor: dailySlotsFull ? 'not-allowed' : 'pointer', padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap', opacity: dailySlotsFull ? 0.4 : 1 }}
                    >Move to Daily Task</button>
                    <button
                      onClick={() => removeTask(i + 2)}
                      style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 4, color: '#999', fontSize: 10, cursor: 'pointer', padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >Remove</button>
                  </div>
                  {isCarriedUnresolved(`future_${i + 4}`) && (
                    <div style={{ fontStyle: 'italic', fontSize: 12, color: '#888', marginTop: 3 }}>
                      carried, unresolved
                    </div>
                  )}
                </div>
              ))}
              {visibleFuture < 18 && (
                <button
                  onClick={() => upd('futureTasksVisible', visibleFuture + 1)}
                  style={{ width: '100%', padding: '9px', borderRadius: 5, border: '1.5px solid #000', background: GOLD_LIGHT, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, marginTop: 6 }}
                >
                  + Add Future Task
                </button>
              )}
            </>
          );
        })()}
      </div>

      {showClearModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, maxWidth: 420, width: '90%', border: `2px solid ${GOLD}`, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={secTitle}>Clear Items</div>
            <div style={{ fontSize: 11, color: MID, marginBottom: 12 }}>
              Select the items you want to clear. Carried items are memorialized on their origin day.
            </div>
            {clearModalItems.length === 0 && (
              <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>No items to clear.</div>
            )}
            {clearModalItems.map(it => (
              <label key={it.slot} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!checkedSlots[it.slot]}
                  onChange={() => toggleSlot(it.slot)}
                  style={{ width: 16, height: 16, marginTop: 2, cursor: 'pointer', accentColor: GOLD }}
                />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 0.5 }}>{it.label}</div>
                  <div style={{ fontSize: 13, color: '#333' }}>{it.text}</div>
                  <div style={{ fontSize: 10, color: '#999' }}>Origin: {it.originDay}</div>
                </div>
              </label>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button
                onClick={onClearCancel}
                style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: 5, color: '#666', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 14px' }}
              >Cancel</button>
              <button
                onClick={confirmClear}
                style={{ background: GOLD_LIGHT, border: '1.5px solid #000', borderRadius: 5, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '6px 14px' }}
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: GOLD, color: '#000', borderRadius: 5, padding: '10px 20px', fontSize: 13, fontWeight: 700, zIndex: 1100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
