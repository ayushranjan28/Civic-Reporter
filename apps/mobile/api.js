import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';

export async function register(phone, name) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, name })
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function verify(phone, otp) {
  const res = await fetch(`${BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  if (!res.ok) throw new Error('Failed to verify OTP');
  return res.json();
}

export async function createReport(token, { description, location, category, priority = 'Medium', tags = [], photoUrl, voiceNoteUrl }) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ description, location, category, priority, tags, photoUrl, voiceNoteUrl })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to create report: ${res.status} ${txt}`);
  }
  return res.json();
}

export const api = { register, verify, createReport };


