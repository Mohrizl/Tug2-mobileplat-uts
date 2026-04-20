'use client';
import { useState, useEffect, useRef } from 'react';

const S = {
  bg2: '#141414', bg3: '#1a1a1a',
  border: '#2a2a2a', border2: '#333',
  red: '#e63946', gold: '#c9a84c',
  text: '#f5f0eb', text2: '#a89f96', text3: '#6b6460',
};

const COLORS = [
  { hex: '#ffffff', label: 'Netral', accent: '#aaa' },
  { hex: '#fef9c3', label: 'Kuning', accent: '#c9a84c' },
  { hex: '#dcfce7', label: 'Hijau', accent: '#4ade80' },
  { hex: '#dbeafe', label: 'Biru', accent: '#60a5fa' },
  { hex: '#fce7f3', label: 'Pink', accent: '#f472b6' },
  { hex: '#f3e8ff', label: 'Ungu', accent: '#c084fc' },
  { hex: '#ffedd5', label: 'Oranye', accent: '#fb923c' },
  { hex: '#f1f5f9', label: 'Abu', accent: '#94a3b8' },
];

// ✅ Samakan dengan sidebar dashboard
const CATEGORIES = ['Umum', 'Pekerjaan', 'Pribadi', 'Ide', 'Belajar', 'Kesehatan', 'Keuangan', 'Hiburan'];

export default function NoteModal({ note, onSave, onClose }) {
  const isEdit = !!note?.id;
  const titleRef = useRef(null);
  const [form, setForm] = useState({
    title: note?.title || '', content: note?.content || '',
    category: note?.category || 'Umum', color: note?.color || '#ffffff',
    tags: note?.tags?.join(', ') || '', is_pinned: note?.is_pinned || false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    await onSave({ ...form, tags });
    setSaving(false);
  };

  const inp = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: S.bg3, border: `1px solid ${S.border2}`,
    color: S.text, fontSize: 13, outline: 'none', fontFamily: 'Inter,sans-serif',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', background: S.bg2, border: `1px solid ${S.border2}`, borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.7)', animation: 'scaleIn 0.2s ease-out' }}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${S.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, color: S.red }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.text2 }}>{isEdit ? 'Edit Catatan' : 'Catatan Baru'}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* ✅ Tombol sematkan sudah bahasa Indonesia */}
              <button type="button" onClick={() => setForm(p => ({ ...p, is_pinned: !p.is_pinned }))}
                style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${form.is_pinned ? S.red : S.border2}`, background: form.is_pinned ? 'rgba(230,57,70,0.1)' : 'transparent', color: form.is_pinned ? S.red : S.text3, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' }}>
                📌 {form.is_pinned ? 'Disematkan' : 'Sematkan'}
              </button>
              <button type="button" onClick={onClose}
                style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${S.border2}`, background: 'transparent', color: S.text3, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕</button>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <input ref={titleRef} type="text" placeholder="Judul catatan..."
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              style={{ width: '100%', fontSize: 22, fontWeight: 700, color: S.text, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Shippori Mincho,serif', marginBottom: 16, borderBottom: `1px solid ${S.border}`, paddingBottom: 12 }}
              required />

            <textarea placeholder="Tulis pikiranmu di sini..."
              value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              rows={8}
              style={{ width: '100%', fontSize: 13, color: S.text2, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: 'Inter,sans-serif', lineHeight: 1.8 }} />

            <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: S.text3, marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Kategori</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ ...inp, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = S.red}
                    onBlur={e => e.target.style.borderColor = S.border2}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: S.bg2 }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: S.text3, marginBottom: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Tag</label>
                  <input type="text" placeholder="penting, kerja, dll" value={form.tags}
                    onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = S.red}
                    onBlur={e => e.target.style.borderColor = S.border2} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: S.text3, marginBottom: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Warna Catatan</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {COLORS.map(c => (
                    <button key={c.hex} type="button" title={c.label}
                      onClick={() => setForm(p => ({ ...p, color: c.hex }))}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${form.color === c.hex ? S.red : 'transparent'}`, background: c.accent, cursor: 'pointer', transform: form.color === c.hex ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.15s', opacity: form.color === c.hex ? 1 : 0.5 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: `1px solid ${S.border}` }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${S.border2}`, background: 'transparent', color: S.text3, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
              Batal
            </button>
            <button type="submit" disabled={saving || !form.title.trim()}
              style={{ padding: '10px 24px', borderRadius: 8, background: S.red, color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: `0 4px 16px rgba(230,57,70,0.3)`, opacity: saving || !form.title.trim() ? 0.6 : 1, transition: 'opacity 0.15s' }}>
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Catatan'}
            </button>
          </div>
        </form>
        <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}