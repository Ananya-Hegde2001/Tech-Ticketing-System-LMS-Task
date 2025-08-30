import express from 'express';
import { query } from '../db.js';
import { mockAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All ticket routes require mock auth
router.use(mockAuth);

// List tickets - employee sees own; admin sees all
router.get('/', async (req, res) => {
  const { role, id } = req.user;
  let sql =
    'SELECT t.*, u.name as created_by_name, a.name as assigned_to_name FROM tickets t ' +
    'JOIN users u ON u.id=t.created_by ' +
    'LEFT JOIN users a ON a.id=t.assigned_to ';
  let params = [];
  if (role === 'EMPLOYEE') {
    sql += 'WHERE t.created_by=$1 ORDER BY t.created_at DESC';
    params = [id];
  } else {
    sql += 'ORDER BY t.created_at DESC';
  }
  const { rows } = await query(sql, params);
  res.json({ tickets: rows });
});

// Create ticket (employee)
router.post('/', requireRole(['EMPLOYEE','ADMIN']), async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description required' });
  const { rows } = await query(
    'INSERT INTO tickets (title, description, created_by) VALUES ($1,$2,$3) RETURNING *',
    [title, description, req.user.id]
  );
  res.status(201).json({ ticket: rows[0] });
});

// Update ticket (admin can assign, set priority, deadline, status)
router.put('/:id', requireRole(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  const { assigned_to, priority, deadline, status, title, description } = req.body;
  const fields = [];
  const params = [];
  let idx = 1;

  const pushField = (col, val) => { fields.push(`${col}=$${idx++}`); params.push(val); };
  if (title) pushField('title', title);
  if (description) pushField('description', description);
  if (assigned_to !== undefined) pushField('assigned_to', assigned_to || null);
  if (priority) pushField('priority', priority);
  if (deadline) pushField('deadline', deadline);
  if (status) pushField('status', status);
  pushField('updated_at', new Date());

  if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

  const sql = `UPDATE tickets SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`;
  params.push(Number(id));

  try {
    const { rows } = await query(sql, params);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ ticket: rows[0] });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
