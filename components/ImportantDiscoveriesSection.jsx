import React, { useState } from 'react';
import { GOLD, GOLD_LIGHT, DARK } from '../utils/constants';

const DISCOVERY_TAGS = [
  'General Info', 'Business', 'Personal Development', 'Education & Learning',
  'Hobby', 'Relationship', 'Religious', 'Inspiration',
  'Health & Fitness', 'Leadership', 'Finance', 'Mindset', 'Other'
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const tagPill = {
  display: 'inline-block',
  background: '#000',
  color: GOLD,
  fontSize: 9,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 1,
  borderRadius: 20,
  padding: '2px 10px',
  marginBottom: 6,
  border: `1px solid ${GOLD}`,
};

const removeBtn = {
  background: 'transparent',
  border: '1px solid #ccc',
  borderRadius: 4,
  color: '#999',
  fontSize: 10,
  cursor: 'pointer',
  padding: '2px 8px',
  fontWeight: 600,
};

const editBtn = {
  background: 'transparent',
  border: '1px solid #888',
  borderRadius: 4,
  color: '#ccc',
  fontSize: 10,
  cursor: 'pointer',
  padding: '2px 8px',
  fontWeight: 600,
  marginRight: 6,
};

const sel = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: 4,
  border: '1px solid #555',
  background: '#fff',
  color: '#000',
  fontSize: 12,
  cursor: 'pointer',
  height: 34,
};

const textarea = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 4,
  border: '1px solid #555',
  background: '#fff',
  color: '#000',
  fontSize: 12,
  minHeight: 72,
  resize: 'vertical',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function ImportantDiscoveriesSection({ fd, archiveMode, onAdd, onUpdate, onRemove }) {
  const discoveries = fd.discoveries || [];
  const [newTag, setNewTag] = useState('');
  const [newText, setNewText] = useState('');
  const [newTagOther, setNewTagOther] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTag, setEditTag] = useState('');
  const [editText, setEditText] = useState('');
  const [editTagOther, setEditTagOther] = useState('');

  function handleAdd() {
    if (!newTag || !newText.trim()) return;
    const resolvedTag = newTag === 'Other'
      ? newTagOther.trim()
      : newTag;
    if (newTag === 'Other' && !resolvedTag) return;
    const entry = {
      id: generateId(),
      tag: resolvedTag,
      text: newText.trim(),
      timestamp: new Date().toISOString(),
    };
    onAdd(entry);
    setNewTag('');
    setNewTagOther('');
    setNewText('');
  }

  function handleEditStart(d) {
    const isCustom = !DISCOVERY_TAGS.includes(d.tag);
    setEditingId(d.id);
    setEditTag(isCustom ? 'Other' : d.tag);
    setEditTagOther(isCustom ? d.tag : '');
    setEditText(d.text);
  }

  function handleEditSave(id) {
    if (!editTag || !editText.trim()) return;
    const resolvedTag = editTag === 'Other'
      ? editTagOther.trim()
      : editTag;
    if (editTag === 'Other' && !resolvedTag) return;
    onUpdate(id, { tag: resolvedTag, text: editText.trim() });
    setEditingId(null);
    setEditTagOther('');
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditTagOther('');
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header bar */}
      <div style={{
        background: '#000',
        padding: '10px 16px',
        borderRadius: '6px 6px 0 0',
        borderBottom: `2px solid ${GOLD}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Important Discoveries
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginTop: 3 }}>
          Repository for insights, strategies, and general information found during PIT sessions, saved for later access.
        </div>
      </div>

      {/* Entries container */}
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: 14 }}>

        {/* Scrollable entries list */}
        {discoveries.length > 0 && (
          <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 14 }}>
            {discoveries.map(d => (
              <div key={d.id} style={{ background: '#111', border: `1px solid ${GOLD}`, borderRadius: 6, padding: 12, marginBottom: 8 }}>
                {editingId === d.id ? (
                  <div>
                    <select style={{ ...sel, marginBottom: 8 }} value={editTag} onChange={e => setEditTag(e.target.value)}>
                      <option value="">Select topic</option>
                      {DISCOVERY_TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {editTag === 'Other' && (
                      <input
                        style={{ ...sel, marginBottom: 8 }}
                        placeholder="Enter your own category..."
                        value={editTagOther}
                        onChange={e => setEditTagOther(e.target.value)}
                      />
                    )}
                    <textarea style={{ ...textarea, marginBottom: 8 }} value={editText} onChange={e => setEditText(e.target.value)} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ ...editBtn, color: GOLD, border: `1px solid ${GOLD}` }} onClick={() => handleEditSave(d.id)}>Save</button>
                      <button style={removeBtn} onClick={handleEditCancel}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={tagPill}>{d.tag}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{d.text}</div>
                    {!archiveMode && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={editBtn} onClick={() => handleEditStart(d)}>Edit</button>
                        <button style={removeBtn} onClick={() => onRemove(d.id)}>Remove</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add new entry — hidden in archive mode */}
        {!archiveMode && (
          <div>
            <select style={{ ...sel, marginBottom: 8 }} value={newTag} onChange={e => setNewTag(e.target.value)}>
              <option value="">Select topic tag...</option>
              {DISCOVERY_TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
            {newTag === 'Other' && (
              <input
                style={{ ...sel, marginBottom: 8 }}
                placeholder="Enter your own category..."
                value={newTagOther}
                onChange={e => setNewTagOther(e.target.value)}
              />
            )}
            <textarea
              style={{ ...textarea, marginBottom: 8 }}
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Write your discovery here..."
            />
            <button
              style={{
                width: '100%', padding: '9px', borderRadius: 5,
                border: '1.5px solid #000', background: GOLD_LIGHT,
                color: '#000', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', letterSpacing: 0.5,
              }}
              onClick={handleAdd}
            >
              + Add Discovery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
