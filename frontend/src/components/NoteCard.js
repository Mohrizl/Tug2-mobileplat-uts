'use client';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const S = {
  bg2: '#141414', bg3: '#1a1a1a', border: '#2a2a2a', border2: '#333',
  red: '#e63946', gold: '#c9a84c',
  text: '#f5f0eb', text2: '#a89f96', text3: '#6b6460',
};

const COLOR_MAP = {
  '#ffffff': { bg: '#1e1e1e', accent: '#444' },
  '#fef9c3': { bg: '#1e1c10', accent: '#c9a84c' },
  '#dcfce7': { bg: '#101e14', accent: '#4ade80' },
  '#dbeafe': { bg: '#101828', accent: '#60a5fa' },
  '#fce7f3': { bg: '#1e1018', accent: '#f472b6' },
  '#f3e8ff': { bg: '#160e1e', accent: '#c084fc' },
  '#ffedd5': { bg: '#1e1408', accent: '#fb923c' },
  '#f1f5f9': { bg: '#161a1e', accent: '#94a3b8' },
};

// View Modal — read only, klik di luar atau X untuk tutup
function ViewModal({ note, onClose, onEdit }) {
  const cm = COLOR_MAP[note.color] || COLOR_MAP['#ffffff'];
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', background: cm.bg, border: `1px solid ${S.border2}`, borderTop: `3px solid ${cm.accent}`, borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', animation: 'scaleIn 0.2s ease-out' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: cm.accent, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{note.category}</span>
            {note.is_pinned && <span style={{ fontSize: 10, color: S.red, background: 'rgba(230,57,70,0.1)', border: `1px solid rgba(230,57,70,0.2)`, padding: '2px 8px', borderRadius: 4 }}>📌 Disematkan</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { onClose(); onEdit(note); }}
              style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${S.border2}`, background: 'transparent', color: S.text2, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = S.red; e.currentTarget.style.color = S.red; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = S.border2; e.currentTarget.style.color = S.text2; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${S.border2}`, background: 'transparent', color: S.text3, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 24px 20px' }}>
          <h2 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 26, fontWeight: 700, color: S.text, lineHeight: 1.3, marginBottom: 16 }}>
            {note.title}
          </h2>

          {note.content ? (
            <p style={{ color: S.text2, fontSize: 14, lineHeight: 1.85, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
              {note.content}
            </p>
          ) : (
            <p style={{ color: S.text3, fontSize: 14, fontStyle: 'italic', marginBottom: 20 }}>Tidak ada isi catatan.</p>
          )}

          {note.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {note.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, color: S.text3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border2}`, padding: '3px 10px', borderRadius: 4 }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px 20px', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          <p style={{ color: S.text3, fontSize: 11 }}>Terakhir diubah {timeAgo}</p>
        </div>
      </div>
      <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onArchive }) {
  const cm = COLOR_MAP[note.color] || COLOR_MAP['#ffffff'];
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });
  const [viewing, setViewing] = useState(false);

  return (
    <>
      <div
        onClick={() => setViewing(true)}
        className="tsuki-card"
        style={{
          background: cm.bg,
          border: `1px solid ${S.border}`,
          borderRadius: 12,
          padding: '18px 18px 14px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s',
          borderTop: `2px solid ${cm.accent}`,
        }}
      >
        {note.is_pinned && (
          <div style={{ position: 'absolute', top: 12, right: 12, width: 6, height: 6, borderRadius: '50%', background: S.red, boxShadow: `0 0 6px ${S.red}` }} />
        )}

        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: cm.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {note.category}
          </span>
        </div>

        <h3 style={{ color: S.text, fontWeight: 600, fontSize: 14, lineHeight: 1.5, marginBottom: 8, paddingRight: note.is_pinned ? 16 : 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {note.title}
        </h3>

        {note.content && (
          <p style={{ color: S.text3, fontSize: 13, lineHeight: 1.7, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {note.content}
          </p>
        )}

        {note.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: 10, color: S.text3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border2}`, padding: '2px 8px', borderRadius: 4 }}>#{tag}</span>
            ))}
            {note.tags.length > 3 && <span style={{ fontSize: 10, color: S.text3 }}>+{note.tags.length - 3}</span>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${S.border}` }}>
          <span style={{ fontSize: 11, color: S.text3 }}>{timeAgo}</span>

          <div className="tsuki-actions" style={{ display: 'flex', gap: 2, opacity: 0, transition: 'opacity 0.15s' }}>
            <button title={note.is_pinned ? 'Batal Sematkan' : 'Sematkan'}
              onClick={e => { e.stopPropagation(); onTogglePin(note.id, note.is_pinned); }}
              style={{ padding: '5px 6px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              📌
            </button>
            <button title="Edit"
              onClick={e => { e.stopPropagation(); onEdit && onEdit(note); }}
              style={{ padding: '5px 6px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              ✏️
            </button>
            <button title="Arsipkan"
              onClick={e => { e.stopPropagation(); onArchive && onArchive(note.id, note.is_archived); }}
              style={{ padding: '5px 6px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              🗄️
            </button>
            <button title="Hapus"
              onClick={e => { e.stopPropagation(); if (confirm('Hapus catatan ini?')) onDelete(note.id); }}
              style={{ padding: '5px 6px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              🗑️
            </button>
          </div>
        </div>

        <style>{`
          .tsuki-card:hover { border-color: #3a3a3a !important; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
          .tsuki-card:hover .tsuki-actions { opacity: 1 !important; }
        `}</style>
      </div >

      {viewing && (
        <ViewModal
          note={note}
          onClose={() => setViewing(false)}
          onEdit={(n) => { setViewing(false); onEdit(n); }}
        />
      )
      }
    </>
  );
}