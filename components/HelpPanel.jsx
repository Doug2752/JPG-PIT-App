import React from 'react';
import { GOLD, DARK, MID, BORDER } from '../utils/constants';

export default function HelpPanel() {
  return (
    <div style={{ background: '#fff', border: `2px solid ${GOLD}`, borderRadius: 8, padding: '18px 20px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: DARK, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${GOLD}` }}>
        PIT — Set-Up and Instructions
      </div>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        PIT stands for Personal Investment Time. Complete it daily — it is your structured time to track, reflect, plan, and study.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <strong>10 Required Fields</strong> must be completed to mark a day done: Wake Time, Weight, Work/Off, Sleep Score, Fitness Yesterday, 3 Gratitude items, One Thing, and Notes.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <strong>Never Twice</strong> — check the box each day confirming you have read and committed to never missing the same day twice.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 8 }}>
        <strong>Appointments</strong> — add up to 5 blocks. Each block persists until you remove it. Use the Add button to create new blocks.
      </p>
      <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, marginBottom: 0 }}>
        <strong>Submit to Coach</strong> — once you have 7 complete days in the week, the submit button unlocks. Use Partial Submit if you need to send fewer days.
      </p>
    </div>
  );
}
