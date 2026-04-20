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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Password tidak cocok'); return; }
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setTokens(data.data.accessToken, data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      toast.success('Akun berhasil dibuat! Selamat datang 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally { setLoading(false); }
  };

  const str = (() => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  })();
  const strColor = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'][str];
  const strLabel = ['', 'Lemah', 'Cukup', 'Lumayan', 'Kuat', 'Sangat Kuat'][str];

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: 8,
    background: S.bg3, border: `1px solid ${S.border2}`,
    color: S.text, fontSize: 14, outline: 'none', fontFamily: 'Inter,sans-serif',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ flex: '0 0 420px', background: S.bg2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <span style={{ fontSize: 18, color: S.red }}>✦</span>
          <span style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 16, fontWeight: 700, color: S.text, letterSpacing: '0.05em' }}>Your Notes</span>
        </div>
        <div style={{ marginBottom: 'auto' }}>
          <h2 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 48, fontWeight: 800, color: S.text, lineHeight: 1.2, marginBottom: 16 }}>
            Ini Baru<br /><span style={{ color: S.gold }}>Permulaan</span>
          </h2>
          <p style={{ color: S.text3, fontSize: 14, lineHeight: 1.8 }}>
            Mulai perjalananmu<br />Setiap catatan adalah satu langkah maju
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['01', 'Buat akun gratis dalam 30 detik'], ['02', 'Tulis catatan pertamamu'], ['03', 'Nikmati semua fitur yang ada']].map(([num, label]) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 13, color: S.red, fontWeight: 700, minWidth: 24 }}>{num}</span>
              <span style={{ color: S.text3, fontSize: 13 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: S.text3, fontSize: 13, textDecoration: 'none', marginBottom: 40 }}>
            ← Kembali
          </Link>
          <h1 style={{ fontFamily: 'Shippori Mincho,serif', fontSize: 32, fontWeight: 700, color: S.text, marginBottom: 6 }}>Buat Akun</h1>
          <p style={{ color: S.text3, fontSize: 14, marginBottom: 36 }}>Mulai mendaftar untuk mencatat ide-idemu</p>

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', type: 'text', label: 'Nama Lengkap', ph: 'Nama kamu', min: 2 },
              { key: 'email', type: 'email', label: 'Email', ph: 'kamu@email.com', min: 0 },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.text3, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inp} required minLength={f.min || undefined}
                  autoFocus={f.key === 'name'}
                  onFocus={e => e.target.style.borderColor = S.red}
                  onBlur={e => e.target.style.borderColor = S.border2} />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.text3, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 karakter" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ ...inp, paddingRight: 48 }} required minLength={6}
                  onFocus={e => e.target.style.borderColor = S.red}
                  onBlur={e => e.target.style.borderColor = S.border2} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.text3, display: 'flex', alignItems: 'center', padding: 0 }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{ height: 3, flex: 1, borderRadius: 99, background: i <= str ? strColor : S.border2, transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strColor, fontWeight: 600 }}>{strLabel}</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: S.text3, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  style={{ ...inp, paddingRight: 48, borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : S.border2 }}
                  required
                  onFocus={e => e.target.style.borderColor = S.red}
                  onBlur={e => e.target.style.borderColor = form.confirm && form.confirm !== form.password ? '#ef4444' : S.border2} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.text3, display: 'flex', alignItems: 'center', padding: 0 }}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontWeight: 500 }}>Password tidak cocok</p>
              )}
            </div>

            <button type="submit" disabled={loading || !!(form.confirm && form.confirm !== form.password)} style={{
              width: '100%', padding: '13px', background: loading ? '#8a1a22' : S.red, color: 'white',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter,sans-serif', boxShadow: `0 4px 20px rgba(230,57,70,0.3)`
            }}>
              {loading ? 'Membuat akun...' : 'Daftar Sekarang →'}
            </button>
          </form>

          <div style={{ marginTop: 28, paddingTop: 28, borderTop: `1px solid ${S.border}`, textAlign: 'center' }}>
            <p style={{ color: S.text3, fontSize: 13 }}>
              Sudah punya akun?{' '}
              <Link href="/login" style={{ color: S.red, fontWeight: 600, textDecoration: 'none' }}>Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}