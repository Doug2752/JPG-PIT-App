import React from 'react';
import { GOLD_LIGHT, MID, BORDER } from '../utils/constants';
import { isDayComplete } from '../utils/form';

export default function SummarySection({ fd, submitting, submitMsg, doSubmit, setSMsg, isDayCompleteMarked, onMarkDayComplete, onUnlockDay }) {
  const canMarkComplete = isDayComplete(fd);

  return (
    <>
      {/* Mark Day Complete / Unlock */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, marginBottom: 8 }}>
        {!isDayCompleteMarked && (
          <button
            onClick={onMarkDayComplete}
            disabled={!canMarkComplete || isDayCompleteMarked}
            style={{
              background: GOLD_LIGHT, color: '#000', border: '3px solid #000',
              borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 700,
              cursor: (!canMarkComplete || isDayCompleteMarked) ? 'not-allowed' : 'pointer',
              opacity: (!canMarkComplete || isDayCompleteMarked) ? 0.4 : 1,
            }}
          >
            Mark Day Complete
          </button>
        )}
        {isDayCompleteMarked && (
          <button
            onClick={onUnlockDay}
            style={{
              background: GOLD_LIGHT, color: '#000', border: '3px solid #000',
              borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Unlock
          </button>
        )}
      </div>

      {/* Partial submit */}
      <div style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8, textAlign: 'center' }}>
          Need to send fewer than 7 days? Use partial submission below.
        </div>
        <button
          style={{ width: '100%', padding: '10px', borderRadius: 5, border: '1px solid #ccc', background: '#f5f5f5', color: '#888', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          onClick={() => {
            setSMsg('No complete days available to submit.');
            setTimeout(() => setSMsg(''), 3000);
          }}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Send Partial Week'}{' '}
          (no complete days yet)
        </button>
        {submitMsg && (
          <div style={{ marginTop: 8, fontSize: 11, color: MID, textAlign: 'center' }}>{submitMsg}</div>
        )}
      </div>
    </>
  );
}
