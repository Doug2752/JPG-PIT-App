import React from 'react';
import { GOLD, DARK, MID, BG, BORDER } from '../utils/constants';
import { card, gbtn } from './styles';

function firstName(name) {
  return name ? name.split(' ')[0] : '';
}

export default function ArchiveView({ archive, weekData, completedBooks, streak, currentUser, setCU, setView, openArchive }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      {/* Nav */}
      <div style={{ background: '#111', borderBottom: `2px solid ${GOLD}`, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 58 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={gbtn({ background: '#333', fontSize: 12, color: '#fff', border: 'none' })} onClick={() => setView('form')}>Today</button>
            <button style={gbtn({ background: GOLD, fontSize: 12, color: '#fff', border: 'none' })}>Archive</button>
            <button style={gbtn({ background: '#333', fontSize: 12, color: '#fff', border: 'none' })} onClick={() => setView('books')}>
              Book Log ({completedBooks.length})
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {streak > 0 && (
            <div style={{ background: GOLD, color: '#000', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 900 }}>
              {streak} Day Streak
            </div>
          )}
          <span style={{ color: '#aaa', fontSize: 12 }}>{firstName(currentUser.name)}</span>
          <button style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 12 }} onClick={() => setCU(null)}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        {archive.slice(0, 30).length === 0 && (
          <div style={{ color: MID, textAlign: 'center', marginTop: 40, fontSize: 13 }}>
            No archived entries yet.
          </div>
        )}
        {archive.slice(0, 30).map(d => {
          const isSent = weekData.sentDates.includes(d);
          return (
            <div
              key={d}
              style={{ ...card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${isSent ? '#2ecc71' : GOLD}` }}
              onClick={() => openArchive(d)}
            >
              <div>
                <span style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>{d}</span>
                {isSent && (
                  <span style={{ marginLeft: 10, fontSize: 10, color: '#2ecc71', fontWeight: 700 }}>SUBMITTED</span>
                )}
              </div>
              <span style={{ color: GOLD, fontSize: 12, fontWeight: 700 }}>Open / Edit</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
