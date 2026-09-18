import React, { useRef, useCallback, useEffect } from 'react';

const SECTIONS = [
  { key: 'tracking',     ghost: 'Sleep time / Wake time / Sleep score / Weight / Energy level / Workday (yes or no) / Location — required', required: true },
  { key: 'fitness',      ghost: 'Fitness activity — type, duration', required: false },
  { key: 'gratitude',    ghost: 'What are you thankful for today? List three things. — required', required: true },
  { key: 'oneThing',     ghost: 'One Thing — your single most important task today — required', required: true },
  { key: 'notes',        ghost: 'Notes, ideas, thoughts — anything on your mind — required', required: true },
  { key: 'devotional',   ghost: 'Devotional or reflection notes', required: false },
  { key: 'bookStudy',    ghost: 'Book you are reading — title, author, notes', required: false },
  { key: 'discoveries',  ghost: 'Important discovery — something worth capturing', required: false },
  { key: 'quotes',       ghost: 'Quote or inspiration that landed today', required: false },
  { key: 'appointments', ghost: 'Appointments — day, time, what, where', required: false },
];

function borderStyle(index, total) {
  const base = { borderLeft: '2px solid #000', borderRight: '2px solid #000' };
  if (index === 0) return { ...base, borderTop: 'none', borderBottom: 'none' };
  if (index === total - 1) return { ...base, borderTop: '1px solid #eee', borderBottom: '2px solid #000' };
  return { ...base, borderTop: '1px solid #eee', borderBottom: 'none' };
}

function EntryBox({ sectionKey, ghost, required, initialValue, onChange, borderSty }) {
  const ghostRef = useRef(null);
  const taRef = useRef(null);

  const setGhost = useCallback((show) => {
    if (ghostRef.current) ghostRef.current.style.display = show ? 'block' : 'none';
  }, []);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.value = initialValue || '';
      taRef.current.style.height = 'auto';
      taRef.current.style.height = taRef.current.scrollHeight + 'px';
    }
    setGhost(!initialValue || initialValue.trim().length === 0);
  }, []);

  const handleFocus = useCallback(() => setGhost(true), [setGhost]);

  const handleBlur = useCallback(() => {
    const val = taRef.current ? taRef.current.value : '';
    setGhost(val.trim().length === 0);
  }, [setGhost]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    onChange(sectionKey, val);
  }, [sectionKey, onChange]);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', ...borderSty }}>
      <textarea ref={taRef} defaultValue={initialValue || ''}
        style={{ width: '100%', minHeight: 72, boxSizing: 'border-box',
          padding: '12px 16px 4px 16px', fontSize: 12, fontFamily: 'inherit',
          lineHeight: 1.7, resize: 'none', outline: 'none', border: 'none',
          backgroundColor: 'transparent', color: '#000', display: 'block' }}
        onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
      <div ref={ghostRef} style={{ display: 'block', padding: '0 16px 10px 16px',
        fontSize: 11, color: '#bbb', fontStyle: 'italic', lineHeight: 1.6,
        pointerEvents: 'none', userSelect: 'none' }}>
        {required ? <strong style={{ fontWeight: 700, color: '#999' }}>{ghost}</strong> : ghost}
      </div>
    </div>
  );
}

export default function OpenEntrySection({ sections, onSectionChange }) {
  return (
    <div style={{ padding: '16px 0 24px' }}>
      <div style={{ backgroundColor: '#000', color: '#B8860B', fontSize: 13,
        fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase',
        textAlign: 'center', padding: '8px 0', borderRadius: '4px 4px 0 0', marginBottom: 0 }}>
        PIT Daily Record</div>
      <div style={{ height: 3, backgroundColor: '#ddb94a' }} />
      {SECTIONS.map(({ key, ghost, required }, index) => (
        <EntryBox key={key} sectionKey={key} ghost={ghost} required={required}
          initialValue={sections[key]}
          onChange={onSectionChange}
          borderSty={borderStyle(index, SECTIONS.length)} />
      ))}
    </div>
  );
}
