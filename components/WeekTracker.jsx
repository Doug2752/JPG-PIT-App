import React from 'react';
import { GOLD, BORDER } from '../utils/constants';
import { gbtn } from './styles';

export default function WeekTracker({ weekData, submitting, doSubmit, submitMsg }) {
  const { completeDays, canSend } = weekData;
  const filled = completeDays.length;
  const pct = Math.min(filled / 7, 1);

  return (
    <div style={{
      background: canSend ? '#f0f8f0' : '#1a1a1a',
      borderRadius: 8,
      padding: '18px 20px',
      marginBottom: 14,
      border: canSend ? '2px solid #2ecc71' : `1px solid ${BORDER}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 13, color: canSend ? '#2ecc71' : GOLD, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          {canSend ? 'Week Complete — Ready to Submit' : 'Weekly Progress'}
        </span>
        <span style={{ fontWeight: 700, fontSize: 14, color: canSend ? '#2ecc71' : GOLD }}>
          {filled} / 7 days
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, height: 10, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%', width: `${pct * 100}%`,
          background: canSend ? '#2ecc71' : GOLD,
          borderRadius: 20, transition: 'width 0.4s ease',
        }} />
      </div>

      {canSend && (
        <button
          style={{ ...gbtn({ width: '100%', padding: '12px', fontSize: 14, background: '#2ecc71', letterSpacing: 1, color: '#fff', border: 'none' }), boxShadow: '0 0 16px rgba(46,204,113,0.5)' }}
          onClick={() => doSubmit(false)}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Send Week to Coach'}
        </button>
      )}

      {!canSend && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Complete {7 - filled} more day{7 - filled !== 1 ? 's' : ''} to unlock submission
        </div>
      )}

      {submitMsg && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 5, fontSize: 12, color: GOLD, textAlign: 'center' }}>
          {submitMsg}
        </div>
      )}
    </div>
  );
}
