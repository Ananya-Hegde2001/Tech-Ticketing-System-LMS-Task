import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:5174'
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or curl (no origin) and dev client origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-user-id', 'x-user-role']
}));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', usersRoutes);

const port = process.env.PORT || 4000;
// Avoid starting the HTTP server when running tests (Supertest uses the app directly)
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

export default app;
