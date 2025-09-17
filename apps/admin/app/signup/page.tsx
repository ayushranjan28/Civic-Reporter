"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const roles = [
  { label: 'Citizen', value: 'citizen' },
  { label: 'Admin', value: 'admin' },
  { label: 'Department Staff', value: 'department_staff' },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must be 8+ chars with letters and numbers';
    if (password !== confirm) return 'Passwords do not match';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) {
        const m = await res.json().catch(() => ({}));
        throw new Error(m.error || 'Signup failed');
      }
      setSuccess('Account created. Redirecting to login…');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'Inter, ui-sans-serif, system-ui', padding: 16,
      background: 'linear-gradient(135deg, #ecfeff 0%, #eef2ff 100%)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'white', padding: 24, borderRadius: 16,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>Create your account</div>
          <div style={{ color: '#6b7280', marginTop: 4 }}>Join Civic Reporter</div>
        </div>
        {error && <div style={{ color: '#991b1b', background: '#fee2e2', border: '1px solid #fecaca', padding: 10, borderRadius: 10, marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: '#065f46', background: '#d1fae5', border: '1px solid #a7f3d0', padding: 10, borderRadius: 10, marginBottom: 12 }}>{success}</div>}
        <form onSubmit={onSubmit}>
          <label style={{ fontSize: 12, color: '#374151' }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, marginBottom: 12 }} />

          <label style={{ fontSize: 12, color: '#374151' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, marginBottom: 12 }} />

          <label style={{ fontSize: 12, color: '#374151' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, marginBottom: 12 }} />

          <label style={{ fontSize: 12, color: '#374151' }}>Confirm Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, marginBottom: 12 }} />

          <label style={{ fontSize: 12, color: '#374151' }}>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, marginBottom: 12 }}>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#111827', color: 'white', borderRadius: 10 }}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 14 }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb' }}>Login here</a>
        </div>
      </div>
    </main>
  );
}


