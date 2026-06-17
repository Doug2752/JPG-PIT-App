import React from 'react';
import { GOLD, DARK, RED } from '../utils/constants';
import { gbtn, inp, lbl, sel } from './styles';

const LOGO_SRC = '/jpglogo.png';

export default function LoginScreen({ loginId, setLI, loginPw, setLP, loginErr, onLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at center, #d4a437 0%, ${GOLD} 55%, #8a6508 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'sans-serif', padding: 20,
    }}>
      <img src={LOGO_SRC} alt="Jones Performance Group" style={{ width: 260, display: 'block', marginBottom: 24 }} />

      <div style={{
        background: '#fff', borderRadius: 12, padding: '36px 40px',
        width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.25)', boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 46, fontWeight: 900, color: '#000', letterSpacing: 6, marginBottom: 6, lineHeight: 1 }}>PIT</div>
          <div style={{ fontSize: 11, color: '#bbb', fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 }}>
            Personal Investment Time
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ ...lbl, color: DARK }}>Performer / User</label>
          <select
            style={{ ...sel, background: '#e8e8e8', color: DARK, border: '1px solid #bbb', fontWeight: 600 }}
            value={loginId}
            onChange={e => setLI(e.target.value)}
          >
            <option value="doug">Doug</option>
            <option value="test">Test</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ ...lbl, color: DARK }}>Password</label>
          <input
            style={{ ...inp, background: '#e8e8e8', color: DARK, border: '1px solid #bbb', fontWeight: 600 }}
            type="password"
            value={loginPw}
            onChange={e => setLP(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onLogin()}
            placeholder="Enter password"
          />
        </div>

        {loginErr && <div style={{ color: RED, fontSize: 11, marginBottom: 10 }}>{loginErr}</div>}

        <button style={gbtn({ width: '100%', padding: 11, fontSize: 14 })} onClick={onLogin}>
          Enter PIT
        </button>

        <div style={{ marginTop: 14, fontSize: 10, color: '#bbb', textAlign: 'center' }}>
          Doug: jpg2026 &nbsp;|&nbsp; Test: test123
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 10, color: '#fff', opacity: 0.9, textAlign: 'center', letterSpacing: 0.5, fontWeight: 600 }}>
        JPG-PIT-001-v9 · Jones Performance Group LLC · Personal Investment Time · CONFIDENTIAL
      </div>
    </div>
  );
}
