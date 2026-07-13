import React, { useState } from 'react';
import { GOLD, GOLD_LIGHT, MID, BORDER } from '../utils/constants';
import { isDayComplete } from '../utils/form';
import { card, secTitle, gbtn } from './styles';

export default function SummarySection({ fd, genSummary, onLimitHit, aiLoadSummary, weekData, submitting, submitMsg, doSubmit, setSMsg, isDayCompleteMarked, onMarkDayComplete, onUnlockDay }) {
  const { completeDays } = weekData;
  const [limitMsg, setLimitMsg] = useState('');
  const canMarkComplete = isDayComplete(fd);

  return (
    <>
      <div style={card}>
        <div style={secTitle}>AI Summary</div>
        <div style={{ marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            style={gbtn()}
            onClick={() => {
              setLimitMsg('');
              genSummary(d => setLimitMsg(`AI Summary is available once per week — next available: ${d}`));
            }}
            disabled={aiLoadSummary}
          >
            {aiLoadSummary ? 'Generating...' : 'Generate Summary'}
          </button>
          <span style={{ fontSize: 11, color: '#888' }}>Pulls today + last 7 archived days automatically.</span>
        </div>
        {limitMsg && (
          <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 4 }}>{limitMsg}</div>
        )}
        {fd.aiSummary && (
          <div style={{ background: GOLD, border: '1.5px solid #000', borderRadius: 6, padding: 14, fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#000' }}>
            {fd.aiSummary}
          </div>
        )}
      </div>

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
            if (completeDays.length === 0) {
              setSMsg('No complete days available to submit.');
              setTimeout(() => setSMsg(''), 3000);
            } else {
              doSubmit(true);
            }
          }}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Send Partial Week'}{' '}
          {completeDays.length > 0
            ? `(${completeDays.length} day${completeDays.length !== 1 ? 's' : ''} available)`
            : '(no complete days yet)'}
        </button>
        {submitMsg && (
          <div style={{ marginTop: 8, fontSize: 11, color: MID, textAlign: 'center' }}>{submitMsg}</div>
        )}
      </div>
    </>
  );
}
