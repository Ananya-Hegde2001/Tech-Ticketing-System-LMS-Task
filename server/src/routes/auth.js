import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Mock login: checks plaintext password in DB (for demo only)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const { rows } = await query('SELECT id, name, email, role, password_hash FROM users WHERE email=$1', [email]);
  const user = rows[0];
  if (!user || user.password_hash !== password) return res.status(401).json({ error: 'Invalid credentials' });
  delete user.password_hash;
  res.json({ user });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const userRole = role && ['EMPLOYEE','ADMIN','RESOLVER'].includes(role) ? role : 'EMPLOYEE';
  try {
    const { rows } = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
      [name, email, password, userRole]
    );
    res.status(201).json({ user: rows[0] });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
