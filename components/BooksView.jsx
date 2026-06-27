import React from 'react';
import { GOLD, DARK, MID, BG } from '../utils/constants';
import { card, gbtn } from './styles';

function firstName(name) {
  return name ? name.split(' ')[0] : '';
}

export default function BooksView({ completedBooks, streak, currentUser, setCU, setView }) {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      {/* Nav */}
      <div style={{ background: '#111', borderBottom: `2px solid ${GOLD}`, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 58 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={gbtn({ background: '#333', fontSize: 12, color: '#fff', border: 'none' })} onClick={() => setView('form')}>Today</button>
            <button style={gbtn({ background: '#333', fontSize: 12, color: '#fff', border: 'none' })} onClick={() => setView('archive')}>Archive</button>
            <button style={gbtn({ background: GOLD, fontSize: 12, color: '#fff', border: 'none' })}>Book Log ({completedBooks.length})</button>
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
        {completedBooks.length === 0 && (
          <div style={{ color: MID, textAlign: 'center', marginTop: 40, fontSize: 13 }}>
            No completed books logged yet.
          </div>
        )}
        {completedBooks.map((b, i) => (
          <div key={i} style={{ ...card, borderLeft: `4px solid ${GOLD}` }}>
            <div style={{ fontWeight: 700, color: DARK, fontSize: 15 }}>{b.title}</div>
            {b.author && <div style={{ fontSize: 12, color: MID, marginTop: 2 }}>by {b.author}</div>}
            <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>Completed: {b.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
