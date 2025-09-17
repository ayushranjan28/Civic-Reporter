import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Local uploads (replace with S3/GCS in prod)
const upload = multer({ dest: path.join(process.cwd(), 'uploads') });
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Auth (minimal placeholder)
app.post('/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body as { email: string; password: string; name: string; role?: UserRole };
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name, role: (role as UserRole) ?? UserRole.CITIZEN } });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login (JWT)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '7d' });
    const roleMap: Record<UserRole, string> = {
      CITIZEN: 'citizen',
      ADMIN: 'admin',
      STAFF: 'department_staff',
    };
    return res.json({ token, role: roleMap[user.role] });
  } catch (e) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Sign Up (alias for register with API path)
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, role } = req.body as { email: string; password: string; name: string; role?: UserRole };
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name, role: (role as UserRole) ?? UserRole.CITIZEN } });
    return res.status(201).json({ id: user.id, role: user.role });
  } catch (e) {
    return res.status(400).json({ error: 'Signup failed' });
  }
});

// Reports
app.post('/reports', upload.single('media'), async (req, res) => {
  try {
    const { citizenId, title, description, category, latitude, longitude, address } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const report = await prisma.report.create({
      data: {
        citizenId,
        title,
        description,
        category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        mediaUrl,
      },
    });
    io.emit('report:new', report);
    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create report' });
  }
});

app.get('/reports', async (_req, res) => {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(reports);
});

app.patch('/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await prisma.report.update({ where: { id }, data: { status } });
    io.emit('report:update', updated);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

// Assignment
app.post('/assignments', async (req, res) => {
  const { reportId, departmentId, assigneeId, priority, notes } = req.body;
  try {
    const assignment = await prisma.taskAssignment.create({
      data: { reportId, departmentId, assigneeId, priority, notes },
    });
    res.status(201).json(assignment);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create assignment' });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});


