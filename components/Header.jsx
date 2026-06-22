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
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={gbtn({ background: (!archiveMode && view === 'form') ? GOLD : '#333', fontSize: 12 })}
              onClick={() => { if (archiveMode) backToday(); setView('form'); }}
            >Today</button>
            <button
              style={gbtn({ background: view === 'archive' ? GOLD : '#333', fontSize: 12 })}
              onClick={() => setView('archive')}
            >Archive</button>
            <button
              style={gbtn({ background: view === 'books' ? GOLD : '#333', fontSize: 12 })}
              onClick={() => setView('books')}
            >Book Log ({completedBooks.length})</button>
          </div>
        </div>

        <div style={{
          background: complete && !fd.sent ? GOLD : '#444',
          color: '#fff',
          borderRadius: 6,
          padding: '5px 14px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.3,
          transition: 'background 0.3s ease',
          whiteSpace: 'nowrap',
          marginLeft: 120,
          marginRight: 16,
        }}>
          {complete && !fd.sent ? 'Day Complete' : `${countComplete(fd)} of ${REQUIRED_TOTAL} Days Done`}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {streak > 0 && (
            <div style={{ background: GOLD, color: '#000', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>
              {streak} Day Streak
            </div>
          )}
          {archiveMode && (
            <span style={{ color: GOLD, fontSize: 11 }}>
              {fd.date}{' '}
              <button
                style={gbtn({ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}`, padding: '3px 8px' })}
                onClick={backToday}
              >Today</button>
            </span>
          )}
          <button
            style={{ padding: '6px 14px', borderRadius: 5, border: `1.5px solid ${GOLD}`, background: 'transparent', color: GOLD, fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5, whiteSpace: 'nowrap' }}
            onClick={onHelpToggle}
          >
            {showHelp ? 'Close Help' : 'Set-Up and Instructions'}
          </button>
          <span style={{ color: '#aaa', fontSize: 12 }}>{firstName(currentUser.name)}</span>
          <button style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 12 }} onClick={() => setCU(null)}>
            Logout
          </button>
        </div>
      </div>

      {/* Coach message banner */}
      {coachMsg.hasMessage && !coachMsg.dismissed && (
        <div style={{ background: GOLD, padding: '14px 20px', borderBottom: `2px solid ${DARK}` }}>
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
              <button style={gbtn({ background: DARK })} onClick={sendReply}>Send Reply</button>
              <button style={gbtn({ background: 'rgba(0,0,0,0.3)' })} onClick={dismissMsg}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
