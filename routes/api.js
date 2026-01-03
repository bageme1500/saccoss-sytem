import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/users', (req, res) => {
  db.all('SELECT id, role_id, name, email, created_at FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get(
    `SELECT u.id, u.name, u.email, u.created_at, r.name AS role
     FROM users u LEFT JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'User not found' });
      res.json(row);
    }
  );
});

router.get('/memberships', (req, res) => {
  db.all(
    `SELECT m.id, m.user_id, u.name AS user_name, u.email AS user_email,
            m.monthly_amount, m.start_date, m.status
     FROM memberships m
     LEFT JOIN users u ON m.user_id = u.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.get('/monthly_contributions', (req, res) => {
  db.all(
    `SELECT mc.*, m.user_id, u.name AS user_name
     FROM monthly_contributions mc
     LEFT JOIN memberships m ON mc.membership_id = m.id
     LEFT JOIN users u ON m.user_id = u.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.get('/payments', (req, res) => {
  db.all(
    `SELECT p.*, mc.month, m.user_id, u.name AS user_name
     FROM payments p
     LEFT JOIN monthly_contributions mc ON p.monthly_contribution_id = mc.id
     LEFT JOIN memberships m ON mc.membership_id = m.id
     LEFT JOIN users u ON m.user_id = u.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

export default router;
