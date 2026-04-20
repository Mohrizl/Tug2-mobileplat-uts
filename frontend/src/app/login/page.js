'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api, { setTokens } from '@/lib/api';

const S = {
  bg: '#0d0d0d', bg2: '#141414', bg3: '#1a1a1a',
  border: '#2a2a2a', border2: '#333',
  red: '#e63946', gold: '#c9a84c',
  text: '#f5f0eb', text2: '#a89f96', text3: '#6b6460',
};

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setTokens(data.data.accessToken, data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      toast.success(`Selamat datang kembali, ${data.data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally { setLoading(false); }
  };

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: 8,
    background: S.bg3, border: `1px solid ${S.border2}`,
    color: S.text, fontSize: 14, outline: 'none', fontFamily: 'Inter,sans-serif',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Panel kiri */}
      <div style={{ flex: '0 0 420px', background: S.bg2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <span style={{ fontSize: 18, color: S.red }}>✦</span>
          <span style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 16, fontWeight: 700, color: S.text, letterSpacing: '0.05em' }}>Your Notes</span>
        </div>
        <div style={{ marginBottom: 'auto' }}>
          <h2 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 48, fontWeight: 800, color: S.text, lineHeight: 1.2, marginBottom: 16 }}>
            Selamat<br /><span style={{ color: S.red }}>datang</span>
          </h2>
          <p style={{ color: S.text3, fontSize: 14, lineHeight: 1.8 }}>
            Setiap pikiranmu itu berharga<br />Jangan biarkan satu pun terlewatkan
          </p>
        </div>
        <div style={{ borderLeft: `2px solid ${S.red}`, paddingLeft: 16 }}>
          <p style={{ color: S.text3, fontSize: 13, fontStyle: 'italic', lineHeight: 1.7 }}>
            "Tinta yang paling pudar lebih baik<br />dari ingatan yang paling tajam"
          </p>
          <p style={{ color: S.text3, fontSize: 11, marginTop: 6, letterSpacing: '0.08em' }}>— Pepatah dari Seseorang</p>
        </div>
      </div>

      {/* Panel kanan */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: S.text3, fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
            ← Kembali
          </Link>
          <h1 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 32, fontWeight: 700, color: S.text, marginBottom: 6 }}>Masuk</h1>
          <p style={{ color: S.text3, fontSize: 14, marginBottom: 36 }}>Masuk ke akunmu untuk melanjutkan</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.text3, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Email</label>
              <input type="email" placeholder="kamu@email.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inp} required autoFocus
                onFocus={e => e.target.style.borderColor = S.red}
                onBlur={e => e.target.style.borderColor = S.border2} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.text3, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ ...inp, paddingRight: 48 }} required
                  onFocus={e => e.target.style.borderColor = S.red}
                  onBlur={e => e.target.style.borderColor = S.border2} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.text3, display: 'flex', alignItems: 'center', padding: 0 }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: loading ? '#8a1a22' : S.red, color: 'white',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter,sans-serif', boxShadow: `0 4px 20px rgba(230,57,70,0.3)`
            }}>
              {loading ? 'Memproses...' : 'Masuk →'}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 28, borderTop: `1px solid ${S.border}`, textAlign: 'center' }}>
            <p style={{ color: S.text3, fontSize: 13 }}>
              Belum punya akun?{' '}
              <Link href="/register" style={{ color: S.red, fontWeight: 600, textDecoration: 'none' }}>Daftar gratis</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}