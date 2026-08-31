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

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>What is PIT?</div>
          <div style={tBody}>PIT stands for Personal Investment Time — your daily check-in with yourself and mental alignment. While DOP (Daily Operational Process) is your roadmap for what to do each day — including both AM and PM components — PIT is where you internalize your day's actions and invest a small amount of time in reflection, planning, and personal growth. This is done once per day. It works best when done at a consistent time, ideally on a computer rather than your phone, so you can give it real attention.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>How to use it:</div>
          <div style={{ ...tBody, marginBottom: 6 }}>Each day, complete the 12 Required Fields and any additional fields you choose. There is substantial personal value in going above the 12, but that is your choice. Fields marked with an asterisk (*) are required to mark a day complete. The 12 Required Fields, in order:</div>
          <div style={groupLbl}>Daily Tracking (Items 1–8, Required)</div>
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
          <div style={{ ...groupLbl, marginTop: 6 }}>Reflection &amp; Priorities (Items 9–12, Required)</div>
          <ol start={9} style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0, paddingLeft: 32, marginTop: 0 }}>
            <li>Thankful For #1</li>
            <li>Thankful For #2</li>
            <li>Thankful For #3</li>
            <li>Notes — Ideas — Thoughts</li>
          </ol>
          <div style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginTop: 6 }}>
            The One Thing is required for day completion and is listed
            in the To Accomplish section. Total Hours Slept is
            auto-calculated from your sleep and wake times.
          </div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Fitness</div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 0 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Fitness Yesterday</div>
                <div style={tBody}>Log what you did for fitness the previous day in the Fitness Notes field. Describe your activity in plain text — for example, "Ran 3 miles, 28 minutes" or "45-minute yoga session." When you leave the field, PIT will attempt to parse the activity type and duration automatically. Select Rest Day only if you intentionally took a rest day. If you had a planned fitness day and missed it, select No.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Never Twice</div>
          <div style={tBody}>Check the box each day confirming you've read and committed to never missing the same action twice in a row.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>To Accomplish</div>
          <div style={{ ...tBody, marginBottom: 6 }}>Your daily task list in priority order. Unchecked items carry forward automatically to the next day until resolved. Checking an item done memorializes it on the day it was completed and removes it from the following day.</div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>The One Thing:</div>
                <div style={tBody}>The single task that, if completed, makes everything else easier or unnecessary.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Daily Tasks:</div>
                <div style={tBody}>Up to two additional tasks for today.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 0 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Future Tasks:</div>
                <div style={tBody}>Future tasks are for items not directly tied to today. Use the Add button to create a new slot. Tasks can be moved in any direction. Use the Move button on any task to relocate it — One Thing, Daily Task, or Future Task — provided space is available in the destination.</div>
              </div>
            </div>
          </div>
          <div style={{ ...tBody, marginTop: 6 }}>Use Clear Items to remove all current To Accomplish items at once. Remember the difference — clearing all your items archives them back to the day they were created. This is different than using the check-off box next to each item, and may be important for your tracking purposes.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Thankful For</div>
          <div style={tBody}>Add the first 3 things that come to mind. Repeats are okay, but try to discover different things you are thankful for.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Notes — Ideas — Thoughts</div>
          <div style={tBody}>A space to clear mental stress and mental noise by physically writing down your thoughts. Anything can go in here — jot down the first things that come to mind. Action items will often surface during this process; capture them here. Some clients keep a parallel notepad for items they'll later move into Future Tasks, Appointments, or Quotes.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Additional Tracking</div>
          <div style={tBody}>Beyond the 12 required fields, PIT includes optional
          sections for deeper tracking: Daily Devotional, Book Study,
          Important Discoveries, Quotes &amp; Inspiration, and
          Appointments. Complete as many as are useful to you — there
          is substantial personal value in going beyond the minimum,
          but the choice is yours.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Daily Devotional / Silence &amp; Reflection</div>
          <div style={tBody}>Choose either a Two-Minute Prayer or Silence &amp; Reflection, mark it complete, and add any reflections. Use Scripture Search / Reflection Search to find a topic, passage, or theme to focus on. Whichever mode you choose will become your default each day going forward — you can switch back and forth anytime using the toggle.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Daily Book Study</div>
          <div style={tBody}>Track the book you're currently reading: page, author, and topic. Use Ask About This Book to explore concepts or questions about it. Quotes discovered while reading are often worth adding to the Quotes &amp; Inspiration section below, referenced by author. Check "Finished book" only once you complete it, to add it to your log.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Important Discoveries</div>
          <div style={tBody}>Use this section to capture insights, strategies, or information worth saving from your PIT session. Each discovery is tagged by topic and stored both in that day's record and in a running library that builds over time. This is where you put notes, things to remember, or powerful items worth holding onto. This section was built for ease of access — entries are organized by topic so they can be quickly searched and retrieved later.</div>
          <div style={{ ...tBody, marginTop: 6 }}>To add a discovery, select a topic tag from the dropdown and enter your text. Use Add Discovery to begin a new entry. Entries can be edited or removed after adding. When viewing past days in the Archive, this section is read-only.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Quotes &amp; Inspiration</div>
          <div style={tBody}>Capture quotes that stand out to you today, or use Quote and Inspiration Research to search by topic, feeling, or author.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Today's Appointments</div>
          <div style={tBody}>Track upcoming appointments by date. Each appointment includes a title, time, duration, location, and prep needed. Appointments persist going forward and will automatically drop off once their date has passed. If an appointment date passes without being resolved, it will carry forward with a Past Due badge until you check it off. Use the Add button to create a new appointment.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Day Complete</div>
          <div style={tBody}>
            Track your daily completion status and lock in your
            required fields when your PIT session is done.
          </div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Mark Day Complete</div>
                <div style={tBody}>
                  Appears at the bottom of PIT. Active only when all
                  12 required fields are filled. Clicking it locks
                  the required fields to read-only for the day —
                  your work is preserved.
                </div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Unlock</div>
                <div style={tBody}>
                  Appears next to the Mark Day Complete button once
                  the day is marked. Clicking Unlock reverses the
                  lock — all required fields become editable again
                  and the day returns to an incomplete state.
                </div>
              </div>
            </div>
            <div style={subItem}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Day Complete in Archive</div>
                <div style={tBody}>
                  Any day you marked complete shows a gold ✓ Day
                  Complete indicator in the Archive list, immediately
                  left of the Open / Edit button. Days not marked
                  complete show nothing in that spot.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...topItem, marginBottom: 8 }}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Submit to Coach</div>
          <div style={tBody}>Once you have 7 complete days in the week, the submit button unlocks. Use Partial Submit if you need to send fewer days.</div>
        </div>
      </div>

      <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.07)', borderRadius: 4, fontSize: 11, color: MID, fontStyle: 'italic', lineHeight: 1.6 }}>
        <strong style={{ fontStyle: 'normal' }}>NOTES:</strong>
        <ol style={{ margin: '4px 0 0 0', paddingLeft: 20 }}>
          <li style={{ marginBottom: 4 }}>Everything you enter in PIT saves automatically as you go — there is no Save button anywhere in this app. Saved information can be accessed with the Archive tab at the top of the page.</li>
          <li>For the most accurate Sleep Score, a wearable monitor is recommended. If you don't have one, many phone apps can provide a ballpark sleep score as an alternative.</li>
        </ol>
      </div>
    </div>
  );
}
