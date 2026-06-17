import React from 'react';
import { GOLD, DARK, BORDER } from '../utils/constants';
import { inp, gbtn } from './styles';
import { todayStr, makeDateLabel } from '../utils/date';

const LOGO_SRC = '/jpglogo.png';

export default function BrandBar({ fd, upd, showDatePicker, setShowDatePicker }) {
  return (
    <div
      style={{ background: '#fff', borderBottom: `4px solid ${GOLD}`, padding: '10px 20px' }}
      onClick={() => setShowDatePicker(false)}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>

        {/* Logo */}
        <img src={LOGO_SRC} alt="Jones Performance Group" style={{ height: 50, width: 'auto', display: 'block' }} />

        {/* Center: PIT title + date picker */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginBottom: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 900, color: '#000', lineHeight: 1 }}>P</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000', letterSpacing: 0.5, marginRight: 6 }}>ersonal</span>
            <span style={{ fontSize: 38, fontWeight: 900, color: '#000', lineHeight: 1 }}>I</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000', letterSpacing: 0.5, marginRight: 6 }}>nvestment</span>
            <span style={{ fontSize: 38, fontWeight: 900, color: '#000', lineHeight: 1 }}>T</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000', letterSpacing: 0.5 }}>ime</span>
          </div>

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowDatePicker(p => !p)}
              style={{ background: '#fff', border: `1px solid ${GOLD}`, borderRadius: 5, padding: '4px 14px', fontSize: 12, fontWeight: 600, color: DARK, cursor: 'pointer', letterSpacing: 0.3 }}
            >
              {makeDateLabel(fd.date)}
              <span style={{ marginLeft: 8, fontSize: 16, color: GOLD, lineHeight: 1 }}>▾</span>
            </button>

            {showDatePicker && (
              <div style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: 12, zIndex: 200, minWidth: 260 }}>
                <input
                  type="date"
                  value={fd.date}
                  onChange={e => { upd('date', e.target.value); setShowDatePicker(false); }}
                  style={{ ...inp, marginBottom: 8, textAlign: 'center', fontSize: 13 }}
                />
                <button
                  onClick={() => { upd('date', todayStr()); setShowDatePicker(false); }}
                  style={gbtn({ width: '100%', padding: '7px', fontSize: 12 })}
                >Today</button>
              </div>
            )}
          </div>

          {/* Never Twice */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: `1.5px solid ${GOLD}`, borderRadius: 5, padding: '5px 14px' }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#000', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Never Twice</span>
              <span style={{ fontSize: 8, fontWeight: 600, color: GOLD, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>Miss one — never miss the second.</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700, color: DARK, letterSpacing: 0.3, marginTop: 6, userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={fd.neverTwiceRead || false}
                onChange={e => upd('neverTwiceRead', e.target.checked)}
                style={{ width: 13, height: 13, cursor: 'pointer', accentColor: GOLD }}
              />
              I've read this. Never twice.
            </label>
          </div>
        </div>

        {/* Right spacer */}
        <div style={{ width: 76 }} />
      </div>
    </div>
  );
}
