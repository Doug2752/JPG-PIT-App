import { BORDER, GOLD, DARK, MID } from '../utils/constants';

export const inp = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 5,
  border: `1px solid ${BORDER}`,
  fontSize: 13,
  fontFamily: 'sans-serif',
  boxSizing: 'border-box',
  background: '#fff',
};

export const sel = { ...inp, cursor: 'pointer', height: 34 };

export const lbl = {
  fontSize: 11,
  fontWeight: 700,
  color: MID,
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 3,
  display: 'block',
};

export const card = {
  background: '#fff',
  borderRadius: 8,
  padding: '18px 20px',
  marginBottom: 14,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export const secTitle = {
  fontWeight: 800,
  fontSize: 13,
  color: DARK,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  marginBottom: 14,
  paddingBottom: 8,
  borderBottom: `2px solid ${GOLD}`,
};

export const gbtn = (extra = {}) => ({
  padding: '8px 18px',
  borderRadius: 5,
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  background: GOLD,
  color: '#fff',
  letterSpacing: 0.5,
  whiteSpace: 'nowrap',
  ...extra,
});

export const dbtn = (extra = {}) => ({
  padding: '8px 18px',
  borderRadius: 5,
  border: `2px solid ${GOLD}`,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  background: 'transparent',
  color: GOLD,
  letterSpacing: 0.5,
  whiteSpace: 'nowrap',
  ...extra,
});
