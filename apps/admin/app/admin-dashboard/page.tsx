"use client";
import React from 'react';

export default function Page() {
  const [token, setToken] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const t = window.localStorage.getItem('admin_token') || '';
    setToken(t);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (category) params.append('category', category);
      const res = await fetch(`http://localhost:4000/api/reports?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load reports');
      const json = await res.json();
      setReports(json.data.reports || []);
    } catch (e: any) {
      alert(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Admin Dashboard</h1>

      <section style={{ marginTop: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Auth</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="Paste admin JWT token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px' }}
          />
          <button onClick={() => window.localStorage.setItem('admin_token', token)} style={{ padding: '8px 12px' }}>Save</button>
        </div>
      </section>

      <section style={{ marginTop: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Filters</h2>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px' }}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px' }}>
            <option value="">All Categories</option>
            <option value="Pothole">Pothole</option>
            <option value="Street Light">Street Light</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leak">Water Leak</option>
            <option value="Sewage">Sewage</option>
            <option value="Traffic Signal">Traffic Signal</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Tree Fall">Tree Fall</option>
            <option value="Electricity">Electricity</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={fetchReports} disabled={loading || !token} style={{ padding: '8px 12px' }}>{loading ? 'Loading...' : 'Load Reports'}</button>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>ID</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Category</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Priority</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td style={{ borderBottom: '1px solid #fafafa', padding: 8 }}>{r._id}</td>
                <td style={{ borderBottom: '1px solid #fafafa', padding: 8 }}>{r.category}</td>
                <td style={{ borderBottom: '1px solid #fafafa', padding: 8 }}>{r.status}</td>
                <td style={{ borderBottom: '1px solid #fafafa', padding: 8 }}>{r.priority}</td>
                <td style={{ borderBottom: '1px solid #fafafa', padding: 8 }}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#888' }}>No reports</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}


