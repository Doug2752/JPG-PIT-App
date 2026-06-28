import React from 'react';
import { GOLD, DARK, MID, BORDER } from '../utils/constants';

export default function HelpPanel({ onClose }) {
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
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>What is PIT?</strong> PIT stands for Personal Investment Time — your daily check-in with yourself and mental alignment. While DOP (Daily Operational Process) is your roadmap for what to do each day — including both AM and PM components — PIT is where you internalize your day's actions and invest a small amount of time in reflection, planning, and personal growth. This is done once per day. It works best when done at a consistent time, ideally on a computer rather than your phone, so you can give it real attention.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 4 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>How to use it:</strong> Each day, complete the 10 Required Fields and any additional fields you choose. There is substantial personal value in going above the 10, but that is your choice. Fields marked with an asterisk (*) are required to mark a day complete. The 10 Required Fields, in order:
      </p>
      <ol style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8, paddingLeft: 32, marginTop: 0 }}>
        <li>Wake Up Time</li>
        <li>Weight</li>
        <li>Work / Off</li>
        <li>Sleep Score</li>
        <li>Fitness Yesterday</li>
        <li>Thankful For #1</li>
        <li>Thankful For #2</li>
        <li>Thankful For #3</li>
        <li>The One Thing</li>
        <li>Notes — Ideas — Thoughts</li>
      </ol>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Never Twice</strong> — check the box each day confirming you've read and committed to never missing the same action twice in a row.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 4 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>To Accomplish</strong> — your daily task list, in priority order:
      </p>
      <div style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8, paddingLeft: 16 }}>
        <div>- <strong>The One Thing:</strong> the single task that, if completed, makes everything else easier or unnecessary. Include a First Action/Set-Up step to define exactly how you'll begin.</div>
        <div>- <strong>Daily Tasks:</strong> up to two additional tasks for today.</div>
        <div>- <strong>Future Tasks:</strong> reference items not tied to today, capped at 3. Use the Add button to reveal each one as needed.</div>
      </div>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Thankful For</strong> — add the first 3 things that come to mind.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Notes — Ideas — Thoughts</strong> — a space to clear mental stress and mental noise by physically writing down your thoughts. Anything can go in here — jot down the first things that come to mind. Action items will often surface during this process; capture them here. Some clients keep a parallel notepad for items they'll later move into Future Tasks, Appointments, or Quotes.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Daily Devotional / Silence &amp; Reflection</strong> — choose either a Two-Minute Prayer or Silence &amp; Reflection, mark it complete, and add any reflections. Use Scripture Search / Reflection Search to find a topic, passage, or theme to focus on.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Daily Book Study</strong> — track the book you're currently reading: page, author, and topic. Use Notes for key takeaways, and Ask About This Book to explore concepts or questions about it. Quotes discovered while reading are often worth adding to the Quotes &amp; Inspiration section below, referenced by author. Check "Finished book" only once you complete it, to add it to your log.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Quotes &amp; Inspiration</strong> — capture quotes that stand out to you today, or use Quote and Inspiration Research to search by topic, feeling, or author.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Today's Appointments</strong> — track up to 5 appointments, each with a title, time, duration, location, and prep needed. SMS reminders send to the phone number in your client profile. Use the Add button to create new ones.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>AI Summary</strong> — generates a summary of today plus your last 7 archived days.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <span style={{ color: GOLD, fontWeight: 700 }}>•</span> <strong>Submit to Coach</strong> — once you have 7 complete days in the week, the submit button unlocks. Use Partial Submit if you need to send fewer days.
      </p>
      <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.07)', borderRadius: 4, fontSize: 11, color: MID, fontStyle: 'italic', lineHeight: 1.6 }}>
        <strong style={{ fontStyle: 'normal' }}>NOTE:</strong> Everything you enter in PIT saves automatically as you go — there is no Save button anywhere in this app. Saved information can be accessed with the Archive tab at the top of the page.
      </div>
    </div>
  );
}
