'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api, { clearTokens } from '@/lib/api';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';

const S = {
  bg: '#0d0d0d', bg2: '#141414', bg3: '#1a1a1a',
  border: '#2a2a2a', border2: '#333',
  red: '#e63946', gold: '#c9a84c',
  text: '#f5f0eb', text2: '#a89f96', text3: '#6b6460',
};

const CATEGORIES = ['Semua', 'Umum', 'Pekerjaan', 'Pribadi', 'Ide', 'Belajar', 'Kesehatan', 'Keuangan', 'Hiburan',];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState({ open: false, note: null });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  const fetchNotes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'Semua') params.set('category', category);
      if (showArchived) params.set('archived', 'true');
      const { data } = await api.get(`/notes?${params}`);
      setNotes(data.data.notes);
    } catch (err) {
      if (err.response?.status !== 401) toast.error('Gagal memuat catatan');
    }
  }, [search, category, showArchived]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/notes/stats');
      setStats(data.data);
    } catch { }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    Promise.all([fetchNotes(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchNotes, fetchStats, router]);

  const handleSave = async (formData) => {
    try {
      if (modal.note?.id) {
        const { data } = await api.put(`/notes/${modal.note.id}`, formData);
        setNotes(prev => prev.map(n => n.id === modal.note.id ? data.data.note : n));
        toast.success('Catatan diperbarui');
      } else {
        const { data } = await api.post('/notes', formData);
        setNotes(prev => [data.data.note, ...prev]);
        toast.success('Catatan dibuat');
      }
      setModal({ open: false, note: null });
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success('Catatan dihapus');
      fetchStats();
    } catch { toast.error('Gagal menghapus'); }
  };

  const handleArchive = async (id, isArchived) => {
    try {
      await api.put(`/notes/${id}`, { is_archived: !isArchived });
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success(!isArchived ? 'Catatan diarsipkan' : 'Catatan dipulihkan');
      fetchStats();
    } catch { toast.error('Gagal'); }
  };

  const handleTogglePin = async (id, isPinned) => {
    try {
      await api.patch(`/notes/${id}/pin`);
      setNotes(prev => prev.map(n => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
      toast.success(isPinned ? 'Batal disematkan' : 'Berhasil disematkan');
      fetchNotes();
    } catch { toast.error('Gagal'); }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch { }
    clearTokens();
    router.push('/');
    toast.success('Berhasil keluar');
  };

  const pinnedNotes = notes.filter(n => n.is_pinned);
  const unpinnedNotes = notes.filter(n => !n.is_pinned);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 16, opacity: 0.4, color: S.red }}>✦</div>
        <div style={{ width: 24, height: 24, border: `2px solid ${S.border2}`, borderTopColor: S.red, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
        <p style={{ color: S.text3, fontSize: 12, marginTop: 12, letterSpacing: '0.08em' }}>Memuat catatan...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', fontFamily: 'Inter,system-ui,sans-serif', color: S.text }}>

      <aside style={{ width: sidebarOpen ? 220 : 0, flexShrink: 0, background: S.bg2, borderRight: `1px solid ${S.border}`, transition: 'width 0.3s ease', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ minWidth: 220, height: '100%', display: 'flex', flexDirection: 'column', padding: 20 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${S.border}` }}>
            <span style={{ fontSize: 16, color: S.red }}>✦</span>
            <span style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 15, fontWeight: 700, letterSpacing: '0.05em' }}>Your Notes</span>
          </div>

          <button onClick={() => setModal({ open: true, note: null })} style={{
            width: '100%', padding: '10px 14px', background: S.red, color: 'white', border: 'none',
            borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginBottom: 20,
            fontFamily: 'Inter,sans-serif', letterSpacing: '0.02em',
            boxShadow: `0 4px 16px rgba(230,57,70,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            ✏️ Catatan Baru
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 24 }}>
            {[['Semua', stats.total || 0], ['Disematkan', stats.pinned || 0], ['Arsip', stats.archived || 0]].map(([label, val]) => (
              <div key={label} style={{ background: S.bg3, borderRadius: 8, padding: '10px 4px', textAlign: 'center', border: `1px solid ${S.border}` }}>
                <div style={{ color: S.text, fontWeight: 700, fontSize: 17, lineHeight: 1 }}>{val}</div>
                <div style={{ color: S.text3, fontSize: 9, marginTop: 3, letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 9, fontWeight: 700, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Kategori</p>

          <nav style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {CATEGORIES.map(cat => {
              const active = category === cat && !showArchived;
              return (
                <button key={cat} onClick={() => { setCategory(cat); setShowArchived(false); }}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
                    color: active ? S.red : S.text3,
                    fontWeight: active ? 600 : 400, fontSize: 13, fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                  }}>
                  {cat}
                </button>
              );
            })}
            <button onClick={() => { setShowArchived(true); setCategory('Semua'); }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: showArchived ? 'rgba(230,57,70,0.12)' : 'transparent',
                color: showArchived ? S.red : S.text3,
                fontWeight: showArchived ? 600 : 400, fontSize: 13, fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                marginTop: 8, borderTop: `1px solid ${S.border}`, paddingTop: 12,
              }}>
              🗄️ Arsip
            </button>
          </nav>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(230,57,70,0.15)', border: `1px solid rgba(230,57,70,0.3)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.red, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: S.text, fontSize: 12, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ color: S.text3, fontSize: 10, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Keluar"
              style={{ background: 'none', border: 'none', color: S.text3, cursor: 'pointer', fontSize: 14, padding: 4, borderRadius: 6, flexShrink: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = S.red}
              onMouseLeave={e => e.currentTarget.style.color = S.text3}>
              ↪
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 10, background: `${S.bg}ee`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            padding: '7px 10px', background: 'transparent', border: `1px solid ${S.border2}`,
            borderRadius: 7, cursor: 'pointer', color: S.text3, fontSize: 11, fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = S.red}
            onMouseLeave={e => e.currentTarget.style.borderColor = S.border2}>
            {sidebarOpen ? '◀' : '▶'}
          </button>

          <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: S.text3, fontSize: 13 }}>🔍</span>
            <input type="text" placeholder="Cari catatan..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 14px 9px 36px', background: S.bg3, border: `1px solid ${S.border2}`, borderRadius: 8, color: S.text, fontSize: 13, fontFamily: 'Inter,sans-serif', outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = S.red}
              onBlur={e => e.target.style.borderColor = S.border2} />
          </div>

          <button onClick={() => setModal({ open: true, note: null })} style={{
            padding: '9px 18px', background: S.red, color: 'white', border: 'none',
            borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
            boxShadow: `0 4px 12px rgba(230,57,70,0.3)`, letterSpacing: '0.02em',
          }}>
            + Baru
          </button>
        </header>

        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 30, fontWeight: 700, color: S.text, margin: 0 }}>
              {showArchived ? 'Arsip' : category === 'Semua' ? 'Semua Catatan' : category}
            </h1>
            <p style={{ color: S.text3, fontSize: 12, marginTop: 4 }}>
              {notes.length} catatan{search && ` — pencarian "${search}"`}
            </p>
          </div>

          {notes.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.1, fontFamily: 'Shippori Mincho,serif', color: S.text }}></div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: S.text2, marginBottom: 6, fontFamily: 'Shippori Mincho,serif' }}>
                {search ? 'Tidak ditemukan' : 'Belum ada catatan'}
              </h3>
              <p style={{ color: S.text3, fontSize: 13, marginBottom: 24 }}>
                {search ? `"${search}" tidak cocok dengan catatan apapun` : 'Mulai tulis pikiran pertamamu'}
              </p>
              {!search && !showArchived && (
                <button onClick={() => setModal({ open: true, note: null })} style={{
                  padding: '11px 24px', background: S.red, color: 'white', border: 'none',
                  borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                  boxShadow: `0 4px 16px rgba(230,57,70,0.3)`,
                }}>
                  ✏️ Tulis Catatan Pertama
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {pinnedNotes.length > 0 && (
                <section>
                  <p style={{ fontSize: 10, fontWeight: 600, color: S.red, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: S.red, display: 'inline-block' }} />
                    Disematkan
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                    {pinnedNotes.map(note => (
                      <NoteCard key={note.id} note={note}
                        onEdit={n => setModal({ open: true, note: n })}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                        onArchive={handleArchive}
                      />
                    ))}
                  </div>
                </section>
              )}

              {unpinnedNotes.length > 0 && (
                <section>
                  {pinnedNotes.length > 0 && (
                    <p style={{ fontSize: 10, fontWeight: 600, color: S.text3, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>
                      Lainnya
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                    {unpinnedNotes.map(note => (
                      <NoteCard key={note.id} note={note}
                        onEdit={n => setModal({ open: true, note: n })}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                        onArchive={handleArchive}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {modal.open && (
        <NoteModal note={modal.note} onSave={handleSave} onClose={() => setModal({ open: false, note: null })} />
      )}
    </div>
  );
}