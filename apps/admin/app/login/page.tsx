"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error || 'Login failed');
      }
      const data = await res.json(); // { token, role }
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('admin_token', data.token);
      if (data.role === 'citizen') router.push('/citizen-dashboard');
      else if (data.role === 'admin') router.push('/admin-dashboard');
      else router.push('/department-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'Inter, ui-sans-serif, system-ui', padding: 16,
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #eef2ff 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(600px 200px at 10% 10%, rgba(16,185,129,.10), transparent), radial-gradient(500px 180px at 90% 20%, rgba(59,130,246,.10), transparent)' }} />
      <div style={{ width: '100%', maxWidth: 420, background: 'white', padding: 28, borderRadius: 20,
        boxShadow: '0 20px 45px rgba(16,185,129,0.15), 0 8px 20px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 700 }}>
            <span style={{ fontSize: 22 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, background: '#10b981', borderRadius: 9999, marginRight: 6 }} />
            </span>
            <span style={{ fontSize: 22 }}>Civic Reporter</span>
          </div>
          <div style={{ color: '#6b7280', marginTop: 6 }}>Jharkhand Civic Reporter</div>
        </div>
        {error && <div style={{ color: '#991b1b', background: '#fee2e2', border: '1px solid #fecaca', padding: 10, borderRadius: 10, marginBottom: 12 }}>{error}</div>}
        <form onSubmit={onSubmit}>
          <label style={{ fontSize: 12, color: '#374151' }}>Email</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 10px', marginTop: 4, marginBottom: 12 }}>
            <span style={{ color: '#10b981', marginRight: 8 }}>✉️</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ flex: 1, outline: 'none', border: 'none' }} />
          </div>

          <label style={{ fontSize: 12, color: '#374151' }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 10px', marginTop: 4, marginBottom: 12 }}>
            <span style={{ color: '#10b981', marginRight: 8 }}>🔒</span>
            <input type={loading ? 'password' : (show ? 'text' : 'password')} value={password} onChange={e => setPassword(e.target.value)} required style={{ flex: 1, outline: 'none', border: 'none' }} />
            <button type="button" onClick={() => setShow(s => !s)} style={{ fontSize: 12, color: '#2563eb' }}>{show ? 'Hide' : 'Show'}</button>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#10b981', color: 'white', borderRadius: 12, transition: 'all .2s', border: '1px solid #059669', boxShadow: '0 6px 14px rgba(16,185,129,0.25)' }}
            onMouseOver={e => (e.currentTarget.style.background = '#059669')}
            onMouseOut={e => (e.currentTarget.style.background = '#10b981')}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <a href="#" style={{ color: '#2563eb' }}>Forgot Password?</a>
          <a href="/signup" style={{ color: '#2563eb' }}>Create account</a>
        </div>
      </div>
    </main>
  );
}


