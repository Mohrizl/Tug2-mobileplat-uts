'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const S = {
  bg: '#0d0d0d', bg2: '#141414', bg3: '#1a1a1a',
  border: '#2a2a2a', border2: '#333',
  red: '#e63946', gold: '#c9a84c',
  text: '#f5f0eb', text2: '#a89f96', text3: '#6b6460',
};

const MOCK_NOTES = [
  { id: 1, title: 'Rencana minggu ini', category: 'Pekerjaan', color: '#dbeafe', accent: '#60a5fa', tags: ['kerja', 'penting'], content: 'Meeting jam 9, review sprint, deploy v2.1...' },
  { id: 2, title: 'Ide bisnis baru', category: 'Ide', color: '#dcfce7', accent: '#4ade80', tags: ['bisnis'], content: 'Platform marketplace untuk freelancer lokal...' },
  { id: 3, title: 'Bacaan bulan ini', category: 'Belajar', color: '#f3e8ff', accent: '#c084fc', tags: ['buku'], content: 'Atomic Habits, Deep Work, The Lean Startup...' },
  { id: 4, title: 'Catatan harian', category: 'Pribadi', color: '#ffedd5', accent: '#fb923c', tags: ['diary'], content: 'Hari ini cukup produktif, selesaikan 3 task utama...' },
];

const COLOR_BG = {
  '#dbeafe': '#101828', '#dcfce7': '#101e14',
  '#f3e8ff': '#160e1e', '#ffedd5': '#1e1408',
};

export default function LandingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activeNote, setActiveNote] = useState(0);

  useEffect(() => {
    try { if (localStorage.getItem('accessToken')) { router.replace('/dashboard'); return; } } catch { }
    setReady(true);
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setActiveNote(p => (p + 1) % MOCK_NOTES.length), 2500);
    return () => clearInterval(t);
  }, []);

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: `2px solid ${S.border2}`, borderTopColor: S.red, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter,system-ui,sans-serif', color: S.text }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: `1px solid ${S.border}`, position: 'sticky', top: 0, background: `${S.bg}ee`, backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, color: S.red }}>✦</span>
          <span style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>Your Notes</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${S.border2}`, color: S.text2, fontWeight: 500, fontSize: 13, textDecoration: 'none' }}>Masuk</Link>
          <Link href="/register" style={{ padding: '9px 20px', borderRadius: 8, background: S.red, color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none', boxShadow: `0 4px 16px rgba(230,57,70,0.3)` }}>Mulai Gratis →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 48px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(230,57,70,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${S.border2}`, borderRadius: 6, padding: '6px 14px', marginBottom: 28, fontSize: 12, color: S.text3, letterSpacing: '0.1em' }}>
              <span style={{ color: S.red }}>●</span> GRATIS & OPEN SOURCE
            </div>
            <h1 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Tulis semua<br /><span style={{ color: S.red }}>pikiranmu</span>
            </h1>
            <p style={{ color: S.text3, fontSize: 15, lineHeight: 1.8, marginBottom: 40, maxWidth: 420 }}>
              Aplikasi catatan dengan tampilan gelap yang elegan. Tulis, organisir, dan arsipkan semua ide-idemu dengan mudah
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/register" style={{ padding: '13px 32px', borderRadius: 8, background: S.red, color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: `0 8px 24px rgba(230,57,70,0.3)` }}>
                Buat Akun Sekarang
              </Link>
              <Link href="/login" style={{ padding: '13px 24px', borderRadius: 8, border: `1px solid ${S.border2}`, color: S.text2, fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
                Sudah punya akun
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 40, marginTop: 48, paddingTop: 40, borderTop: `1px solid ${S.border}` }}>
              {[['JWT', 'Aman & Terenkripsi'], ['CRUD', 'Fitur Lengkap'], ['MySQL', 'Database Handal']].map(([val, label]) => (
                <div key={val}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Shippori Mincho,serif' }}>{val}</div>
                  <div style={{ fontSize: 11, color: S.text3, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mock notes preview */}
          <div style={{ position: 'relative' }}>
            {/* Main active note card */}
            <div style={{ background: COLOR_BG[MOCK_NOTES[activeNote].color] || S.bg3, borderRadius: 16, padding: 28, border: `1px solid ${S.border2}`, borderTop: `3px solid ${MOCK_NOTES[activeNote].accent}`, boxShadow: `0 32px 64px rgba(0,0,0,0.5)`, transition: 'all 0.5s ease', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: MOCK_NOTES[activeNote].accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                {MOCK_NOTES[activeNote].category}
              </div>
              <h3 style={{ color: S.text, fontWeight: 700, fontSize: 18, marginBottom: 10, fontFamily: 'Shippori Mincho,serif' }}>
                {MOCK_NOTES[activeNote].title}
              </h3>
              <p style={{ color: S.text3, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
                {MOCK_NOTES[activeNote].content}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {MOCK_NOTES[activeNote].tags.map(t => (
                  <span key={t} style={{ fontSize: 10, color: S.text3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border2}`, padding: '3px 10px', borderRadius: 4 }}>#{t}</span>
                ))}
              </div>
            </div>

            {/* Mini note cards below */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              {MOCK_NOTES.filter((_, i) => i !== activeNote).slice(0, 2).map(n => (
                <div key={n.id} style={{ background: COLOR_BG[n.color] || S.bg3, borderRadius: 10, padding: '14px 16px', border: `1px solid ${S.border}`, borderTop: `2px solid ${n.accent}`, opacity: 0.6, transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 9, color: n.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{n.category}</div>
                  <div style={{ color: S.text2, fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
              {MOCK_NOTES.map((_, i) => (
                <div key={i} style={{ width: i === activeNote ? 20 : 6, height: 6, borderRadius: 99, background: i === activeNote ? S.red : S.border2, transition: 'all 0.3s' }} />
              ))}
            </div>

            {/* Floating badge */}
            <div style={{ position: 'absolute', top: -16, right: -16, background: S.bg2, border: `1px solid ${S.border2}`, borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600, color: S.text, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'float 4s ease-in-out infinite' }}>
              🔒 JWT Aman
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: S.red, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>FITUR</p>
            <h2 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 40, fontWeight: 700 }}>Semua yang kamu butuhkan</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {[
              { icon: '🔐', title: 'Autentikasi JWT', desc: 'Access token 15 menit + refresh token 7 hari dengan rotasi otomatis' },
              { icon: '📌', title: 'Sematkan Catatan', desc: 'Sematkan catatan penting agar selalu muncul di atas daftar' },
              { icon: '🎨', title: 'Warna Catatan', desc: '8 pilihan warna untuk organisasi visual yang mudah dibaca' },
              { icon: '🏷️', title: 'Tag & Kategori', desc: 'Sistem tag fleksibel untuk mengorganisir semua catatan' },
              { icon: '🔍', title: 'Pencarian', desc: 'Cari berdasarkan judul atau isi catatan secara instan' },
              { icon: '🗄️', title: 'Arsip', desc: 'Simpan catatan lama di arsip tanpa menghapus permanen' },
            ].map((f, i) => (
              <div key={f.title} style={{ padding: '28px 24px', background: i % 2 === 0 ? S.bg2 : S.bg3, border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ color: S.red, fontSize: 10, letterSpacing: '0.12em', marginBottom: 6, textTransform: 'uppercase' }}>Fitur</div>
                <div style={{ color: S.text, fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: S.text3, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${S.border}`, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: S.text3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: S.red }}>✦</span>
          <span style={{ fontFamily: 'Shippori Mincho,serif' }}>Your Notes</span>
        </div>
        <span>Pengembangan Aplikasi Berbasis Platform</span>
      </footer>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} @keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>
    </div>
  );
}