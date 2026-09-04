import React from 'react';

const SECTIONS = [
  { key: 'tracking',     placeholder: 'Sleep time / Wake time / Sleep score / Weight / Energy level / Workday (yes or no) / Location' },
  { key: 'fitness',      placeholder: 'Fitness activity — type, duration' },
  { key: 'gratitude',    placeholder: 'What are you thankful for today? List three things.' },
  { key: 'oneThing',     placeholder: 'One Thing — your single most important task today' },
  { key: 'notes',        placeholder: 'Notes, ideas, thoughts — anything on your mind' },
  { key: 'devotional',   placeholder: 'Devotional or reflection notes' },
  { key: 'bookStudy',    placeholder: 'Book you are reading — title, author, notes' },
  { key: 'discoveries',  placeholder: 'Important discovery — something worth capturing' },
  { key: 'quotes',       placeholder: 'Quote or inspiration that landed today' },
  { key: 'appointments', placeholder: 'Appointments — day, time, what, where' },
];

function borderStyle(index, total) {
  const base = { borderLeft: '2px solid #000', borderRight: '2px solid #000' };
  if (index === 0) return { ...base, borderTop: 'none', borderBottom: 'none' };
  if (index === total - 1) return { ...base, borderTop: '1px solid #eee', borderBottom: '2px solid #000' };
  return { ...base, borderTop: '1px solid #eee', borderBottom: 'none' };
}

export default function OpenEntrySection({ sections, onSectionChange }) {
  return (
    <>
      <style>{`
        .pit-open-entry::placeholder { color: #999; opacity: 1; }
      `}</style>
      <div style={{ padding: '16px 0 24px' }}>
        <div style={{
          backgroundColor: '#000',
          color: '#B8860B',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '8px 0',
          borderRadius: '4px 4px 0 0',
          marginBottom: 0
        }}>
          PIT Daily Record
        </div>
        <div style={{ height: 3, backgroundColor: '#ddb94a' }} />
        {SECTIONS.map(({ key, placeholder }, index) => (
          <textarea
            key={key}
            className="pit-open-entry"
            style={{
              width: '100%',
              minHeight: 72,
              boxSizing: 'border-box',
              padding: '12px 16px',
              fontSize: 12,
              fontFamily: 'inherit',
              lineHeight: 1.7,
              resize: 'none',
              outline: 'none',
              backgroundColor: '#fff',
              color: '#000',
              display: 'block',
              ...borderStyle(index, SECTIONS.length),
            }}
            value={sections[key] || ''}
            placeholder={placeholder}
            onChange={e => onSectionChange(key, e.target.value)}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        ))}
      </div>
    </>
  );
}
