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
        <div style={{ flex: 1 }}>
          <div style={tTitle}>What is PIT?</div>
          <div style={tBody}>PIT stands for Personal Investment Time — your daily check-in with yourself. Complete it once per day at a consistent time, ideally on a computer.</div>
        </div>
      </div>

      {/* HOW TO USE IT */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>How to use it</div>
          <div style={{ ...tBody, marginBottom: 6 }}>Complete the 12 required fields each day. Additional sections are optional but valuable. Required fields in order:</div>
          <div style={groupLbl}>Daily Tracking (1–8)</div>
          <ol style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0, paddingLeft: 32, marginTop: 0 }}>
            <li>Time Asleep Last Night</li>
            <li>Wake Up Time</li>
            <li>Sleep Score</li>
            <li>Weight</li>
            <li>Energy Level</li>
            <li>Work / Off</li>
            <li>Location</li>
            <li>Fitness Yesterday</li>
          </ol>
          <div style={{ ...groupLbl, marginTop: 6 }}>Reflection &amp; Priorities (9–12)</div>
          <ol start={9} style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0, paddingLeft: 32, marginTop: 0 }}>
            <li>Thankful For #1</li>
            <li>Thankful For #2</li>
            <li>Thankful For #3</li>
            <li>Notes — Ideas — Thoughts</li>
          </ol>
          <div style={{ ...tBody, marginTop: 6 }}>One Thing is also required and is found in the To Accomplish section. Total Hours Slept is auto-calculated.</div>
        </div>
      </div>

      {/* FITNESS */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Fitness Yesterday</div>
          <div style={tBody}>Log yesterday's fitness activity in plain text — for example, "Ran 3 miles, 28 minutes." PIT will parse the activity type and duration automatically when you leave the field. Select Rest Day only if you intentionally rested. If you had a planned fitness day and missed it, select No.</div>
        </div>
      </div>

      {/* NEVER TWICE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Never Twice</div>
          <div style={tBody}>Check the box each day confirming you have read and committed to never missing the same action twice in a row.</div>
        </div>
      </div>

      {/* TO ACCOMPLISH */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>To Accomplish</div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>One Thing</div>
                <div style={tBody}>The single task that, if completed, makes everything else easier or unnecessary. Required for Day Complete.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Daily Tasks</div>
                <div style={tBody}>Up to two additional tasks for today. Unchecked items carry forward automatically.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 0 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Future Tasks</div>
                <div style={tBody}>Items not tied to today. Use Move to relocate any task between One Thing, Daily, or Future slots.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OPTIONAL SECTIONS */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Optional Sections</div>
          <div style={tBody}>Daily Devotional, Book Study, Important Discoveries, Quotes &amp; Inspiration, and Appointments. Complete as many as are useful — there is value in going beyond the minimum.</div>
        </div>
      </div>

      {/* DAY COMPLETE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Day Complete</div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Mark Day Complete</div>
                <div style={tBody}>Active only when all 12 required fields are filled. Locks required fields to read-only for the day.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Unlock</div>
                <div style={tBody}>Reverses the lock — all required fields become editable and the day returns to incomplete.</div>
              </div>
            </div>
            <div style={subItem}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Archive</div>
                <div style={tBody}>Days marked complete show a gold ✓ in the Archive list.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT TO COACH */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Submit to Coach</div>
          <div style={tBody}>Unlocks after 7 complete days. Use Partial Submit to send fewer days if needed.</div>
        </div>
      </div>

      {/* AUTOSAVE */}
      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Autosave</div>
          <div style={tBody}>Everything saves automatically — there is no Save button. Access past days via the Archive tab.</div>
        </div>
      </div>

    </div>
  );
}
