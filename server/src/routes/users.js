import express from 'express';
import { query } from '../db.js';
import { mockAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(mockAuth);

// List possible resolvers (role RESOLVER) for assignment - admin only
router.get('/resolvers', requireRole(['ADMIN']), async (req, res) => {
  const { rows } = await query('SELECT id, name, email FROM users WHERE role = $1 ORDER BY name', ['RESOLVER']);
  res.json({ resolvers: rows });
});

export default router;
