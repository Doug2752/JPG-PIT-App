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
          <div style={{ ...tBody, marginBottom: 6 }}>Each day, complete the 10 Required Fields and any additional fields you choose. There is substantial personal value in going above the 10, but that is your choice. Fields marked with an asterisk (*) are required to mark a day complete. The 10 Required Fields, in order:</div>
          <div style={groupLbl}>Daily Trackables (Items 1–5, Required)</div>
          <ol style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0, paddingLeft: 32, marginTop: 0 }}>
            <li>Wake Up Time</li>
            <li>Weight</li>
            <li>Work / Off</li>
            <li>Sleep Score</li>
            <li>Fitness Yesterday</li>
          </ol>
          <div style={{ ...groupLbl, marginTop: 6 }}>Reflection &amp; Priorities (Items 6–10, Required)</div>
          <ol start={6} style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0, paddingLeft: 32, marginTop: 0 }}>
            <li>Thankful For #1</li>
            <li>Thankful For #2</li>
            <li>Thankful For #3</li>
            <li>The One Thing</li>
            <li>Notes — Ideas — Thoughts</li>
          </ol>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Fitness</div>
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Fitness Yesterday</div>
                <div style={tBody}>Log what you did for fitness the previous day. Use the + Add Fitness Activity button if you have more than one activity to log. Select Rest Day only if you intentionally took a rest day. If you had a planned fitness day and missed it, select No.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 0 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Recurring Fitness</div>
                <div style={tBody}>Use the Configure tab to set up activities that repeat on a schedule. To get started, open the Configure tab and add a recurring activity. Give it a name, select the activity type, and choose which days of the week it should appear. Once saved, that activity will automatically show up on your Fitness Yesterday screen on its scheduled days. On those days you will see a confirm-done checkbox — check it if you completed the activity. To stop an activity from appearing or to change its scheduled days, return to the Configure tab. Recurring activities cannot be removed from the daily screen.</div>
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
                <div style={tBody}>The single task that, if completed, makes everything else easier or unnecessary. Include a First Action/Set-Up step to define exactly how you'll begin.</div>
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
                <div style={tBody}>Reference items not tied to today, capped at 3. Use the Add button to create a new slot as needed.</div>
              </div>
            </div>
          </div>
          <div style={{ ...tBody, marginTop: 6 }}>Use Clear Items to remove all current To Accomplish items at once. Remember the difference — clearing all your items will memorialize them to the day they were created. This is different than using the check-off box next to each item, and may be important for your tracking purposes.</div>
        </div>
      </div>

      <div style={topItem}>
        <span style={bul}>•</span>
        <div style={{ flex: 1 }}>
          <div style={tTitle}>Thankful For</div>
          <div style={tBody}>Add the first 3 things that come to mind.</div>
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
          <div style={{ paddingLeft: 16 }}>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Location:</div>
                <div style={tBody}>Where you completed PIT today. Location matters more than it seems — if you always work at home, try going outside when you're able. Mixing up your environment can sharpen focus and shift your mental state.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>PIT Time Frame:</div>
                <div style={tBody}>Approximate time spent on PIT. Helps you balance and memorialize the days you're able to commit more time to the process.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 6 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Energy Level:</div>
                <div style={tBody}>Rate your energy 1–10. 10 is highest.</div>
              </div>
            </div>
            <div style={{ ...subItem, marginBottom: 0 }}>
              <span style={hyp}>–</span>
              <div style={{ flex: 1 }}>
                <div style={sTitle}>Mental Alignment:</div>
                <div style={tBody}>Completing PIT in full is sufficient to mark this positive. Some clients also incorporate personal practices such as meditation or other routines as their own baseline — that is entirely up to you.</div>
              </div>
            </div>
          </div>
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
          <div style={tBody}>Track the book you're currently reading: page, author, and topic. Use Notes for key takeaways, and Ask About This Book to explore concepts or questions about it. Quotes discovered while reading are often worth adding to the Quotes &amp; Inspiration section below, referenced by author. Check "Finished book" only once you complete it, to add it to your log.</div>
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
          <div style={tTitle}>AI Summary</div>
          <div style={tBody}>Generates a summary pulling from every section of your PIT entry — today plus your last 7 days. Available once per week.</div>
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
