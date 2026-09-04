import React from 'react';
import { GOLD, DARK } from '../utils/constants';

export default function TaskDetailOverlay({ taskName, detailText, onChange, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 1200,
    }}>
      <div style={{
        background: DARK, borderRadius: 10, padding: 24,
        maxWidth: 480, width: '90%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        border: `1.5px solid ${GOLD}`,
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.6)', fontSize: 18,
            cursor: 'pointer', lineHeight: 1, padding: '2px 6px',
          }}
          aria-label="Close"
        >✕</button>
        <div style={{
          fontSize: 13, fontWeight: 700, color: GOLD,
          textTransform: 'uppercase', letterSpacing: 1,
          marginBottom: 12, paddingRight: 28, lineHeight: 1.3,
        }}>
          {taskName}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
          Notes &amp; Details — auto-saves as you type
        </div>
        <textarea
          autoFocus
          rows={6}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6, color: '#fff', fontSize: 14,
            padding: '10px 12px', resize: 'vertical', lineHeight: 1.5,
            outline: 'none', fontFamily: 'inherit',
          }}
          value={detailText}
          onChange={e => onChange(e.target.value)}
          placeholder="Add notes, context, links, or any detail about this task..."
        />
      </div>
    </div>
  );
}
