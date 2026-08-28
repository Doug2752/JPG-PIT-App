import React from 'react';
import { GOLD, GOLD_LIGHT, DARK, MID } from '../utils/constants';
import { REQUIRED_TOTAL } from '../utils/form';
import { gbtn, inp } from './styles';
import { countComplete } from '../utils/form';

function firstName(name) {
  return name ? name.split(' ')[0] : '';
}

export default function Header({
  view, setView, archiveMode, backToday,
  streak, complete, fd, completedBooks,
  showHelp, onHelpToggle,
  currentUser, setCU,
  coachMsg, replyText, setRT, sendReply, dismissMsg,
  isDayCompleteMarked,
}) {
  return (
    <>
      {/* Sticky top nav */}
      <div style={{
        background: '#111',
        borderBottom: `2px solid ${GOLD}`,
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
        height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={(!archiveMode && view === 'form') ? { color: GOLD, fontWeight: 700, fontSize: 13, cursor: 'pointer', borderBottom: '2px solid #B8860B', paddingBottom: 2 } : { color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
              onClick={() => { if (archiveMode) backToday(); setView('form'); }}
            >Today</span>
            <span
              style={view === 'archive' ? { color: GOLD, fontWeight: 700, fontSize: 13, cursor: 'pointer', borderBottom: '2px solid #B8860B', paddingBottom: 2 } : { color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
              onClick={() => setView('archive')}
            >Archive</span>
            <span
              style={view === 'books' ? { color: GOLD, fontWeight: 700, fontSize: 13, cursor: 'pointer', borderBottom: '2px solid #B8860B', paddingBottom: 2 } : { color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
              onClick={() => setView('books')}
            >Book Log ({completedBooks.length})</span>
            {streak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 1.5, height: 16, background: 'rgba(255,255,255,0.25)' }} />
                <span style={{
                  color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 0.5
                }}>
                  {streak} Day Streak
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {archiveMode && (
            <span style={{ color: GOLD, fontSize: 11 }}>
              {fd.date}{' '}
              <button
                style={gbtn({ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}`, padding: '3px 8px' })}
                onClick={backToday}
              >Today</button>
            </span>
          )}
          <span
            onClick={onHelpToggle}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
          >
            {showHelp ? 'Close Help' : 'Set-Up and Instructions'}
          </span>
          <div style={{ width: 1.5, height: 16, background: 'rgba(255,255,255,0.25)' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            {firstName(currentUser.name)}
          </span>
          <div style={{ width: 1.5, height: 16, background: 'rgba(255,255,255,0.25)' }} />
          <span
            onClick={() => setCU(null)}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}
          >
            Logout
          </span>
        </div>
      </div>

      {/* Coach message banner */}
      {coachMsg.hasMessage && !coachMsg.dismissed && (
        <div style={{ background: GOLD, padding: '14px 20px', border: '1.5px solid #000' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: DARK, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
              Message from Coach
            </div>
            <div style={{ fontSize: 14, color: DARK, marginBottom: 12, lineHeight: 1.5 }}>
              {coachMsg.message}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                style={{ ...inp, flex: 1, minWidth: 200, maxWidth: 400 }}
                value={replyText}
                onChange={e => setRT(e.target.value)}
                placeholder="Reply to coach (optional)..."
              />
              <button style={gbtn({ background: DARK, color: '#fff', border: 'none' })} onClick={sendReply}>Send Reply</button>
              <button style={gbtn({ background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none' })} onClick={dismissMsg}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
