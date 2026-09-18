import React from 'react';
import { GOLD, DARK, MID, BORDER } from '../utils/constants';

export default function HelpPanel({ onClose }) {
  const tTitle  = { fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 3 };
  const tBody   = { fontSize: 12, color: MID, lineHeight: 1.7 };
  const sTitle  = { fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 2 };
  const topItem = { marginBottom: 10, display: 'flex', alignItems: 'flex-start' };
  const bul     = { color: GOLD, fontWeight: 700, minWidth: 14, flexShrink: 0 };
  const subItem = { display: 'flex', alignItems: 'flex-start' };
  const hyp     = { minWidth: 16, flexShrink: 0, color: MID, fontSize: 14, lineHeight: 1, marginRight: 4 };
  const groupLbl = { fontSize: 11, fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 };

  return (
    <div style={{ background: '#E0E0E0', border: `2px solid ${GOLD}`, borderRadius: 8, padding: '18px 20px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: DARK, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${GOLD}` }}>
        PIT — Set-Up and Instructions
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 16, background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: DARK, fontWeight: 700, lineHeight: 1, padding: 0 }}
          aria-label="Close"
        >
          ✕
        </button>
      )}

      {/* WHAT IS PIT */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>What is PIT?</div>
          <div style={tBody}>
            PIT stands for Personal Investment Time — your daily check-in with yourself. Complete it once per day at a consistent time, ideally on a computer.
          </div>
        </div>
      </div>

      {/* HOW TO USE IT */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>How to use it</div>
          <div style={tBody}>
            Ten open text boxes. No required format. Write whatever is useful to you in each section. The ghost text in each box shows what the section is intended for — use it as a guide. Four sections are required to mark a day complete — they are shown in bold.
          </div>
        </div>
      </div>

      {/* REQUIRED SECTIONS */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>Required sections — all four must have content for Day Complete to activate</div>
          <div style={{ marginTop: 4 }}>
            <div style={subItem}>
              <span style={hyp}>—</span>
              <div style={tBody}><strong>Tracking</strong> — Sleep time, wake time, sleep score, weight, energy level, workday yes or no, location.</div>
            </div>
            <div style={subItem}>
              <span style={hyp}>—</span>
              <div style={tBody}><strong>Gratitude</strong> — What are you thankful for today? List three things.</div>
            </div>
            <div style={subItem}>
              <span style={hyp}>—</span>
              <div style={tBody}><strong>One Thing</strong> — Your single most important task today.</div>
            </div>
            <div style={subItem}>
              <span style={hyp}>—</span>
              <div style={tBody}><strong>Notes</strong> — Notes, ideas, thoughts — anything on your mind.</div>
            </div>
          </div>
        </div>
      </div>

      {/* THE TEN SECTIONS */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>The Ten Sections</div>
          <div style={tBody}>
            Tracking, Fitness, Gratitude, One Thing, Notes, Devotional, Book Study, Discoveries, Quotes, Appointments. Write freely — no fields, no dropdowns, no required format beyond the four required sections.
          </div>
        </div>
      </div>

      {/* NEVER TWICE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>Never Twice</div>
          <div style={tBody}>
            Check the box each day confirming you have read and committed to never missing the same action twice in a row.
          </div>
        </div>
      </div>

      {/* DAY COMPLETE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>Day Complete</div>
          <div style={tBody}>
            Active only when all four required sections have content. Clicking it processes your entry through AI and locks the day. Use Unlock to edit again.
          </div>
        </div>
      </div>

      {/* AUTOSAVE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ marginLeft: 8 }}>
          <div style={tTitle}>Autosave</div>
          <div style={tBody}>
            Everything saves automatically — there is no Save button.
          </div>
        </div>
      </div>

    </div>
  );
}
