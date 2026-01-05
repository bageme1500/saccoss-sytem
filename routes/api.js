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

// --- Create routes ---

router.post('/roles', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Role name is required' });

  db.run('INSERT OR IGNORE INTO roles (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT id, name FROM roles WHERE name = ?', [name], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

router.post('/users', (req, res) => {
  const { role_id, role_name, name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });

  const ensureRole = (cb) => {
    if (role_id) return cb(null, role_id);
    if (role_name) {
      db.run('INSERT OR IGNORE INTO roles (name) VALUES (?)', [role_name], (err) => {
        if (err) return cb(err);
        db.get('SELECT id FROM roles WHERE name = ?', [role_name], (err2, r) => {
          if (err2) return cb(err2);
          cb(null, r.id);
        });
      });
    } else {
      cb(new Error('role_id or role_name is required'));
    }
  };

  ensureRole((err, resolvedRoleId) => {
    if (err) return res.status(400).json({ error: err.message });
    db.run(
      'INSERT INTO users (role_id, name, email, password) VALUES (?, ?, ?, ?)',
      [resolvedRoleId, name, email, password],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT id, role_id, name, email, created_at FROM users WHERE id = ?', [this.lastID], (err3, user) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.status(201).json(user);
        });
      }
    );
  });
});

router.post('/memberships', (req, res) => {
  const { user_id, monthly_amount, start_date, status } = req.body;
  if (!user_id || !monthly_amount || !start_date) return res.status(400).json({ error: 'user_id, monthly_amount and start_date are required' });

  db.run(
    'INSERT INTO memberships (user_id, monthly_amount, start_date, status) VALUES (?, ?, ?, ?)',
    [user_id, monthly_amount, start_date, status || 'active'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM memberships WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(row);
      });
    }
  );
});

router.post('/monthly_contributions', (req, res) => {
  const { membership_id, month, expected_amount, paid_amount } = req.body;
  if (!membership_id || !month || !expected_amount) return res.status(400).json({ error: 'membership_id, month and expected_amount are required' });
  const paid = paid_amount || 0;
  const balance = Math.max(0, expected_amount - paid);

  db.run(
    'INSERT INTO monthly_contributions (membership_id, month, expected_amount, paid_amount, balance, status) VALUES (?, ?, ?, ?, ?, ?)',
    [membership_id, month, expected_amount, paid, balance, paid >= expected_amount ? 'paid' : (paid > 0 ? 'partial' : 'unpaid')],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM monthly_contributions WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(row);
      });
    }
  );
});

router.post('/payments', (req, res) => {
  const { monthly_contribution_id, amount_paid, method, reference } = req.body;
  if (!monthly_contribution_id || !amount_paid || !method) return res.status(400).json({ error: 'monthly_contribution_id, amount_paid and method are required' });

  // Transaction: insert payment, then update monthly_contributions
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      'INSERT INTO payments (monthly_contribution_id, amount_paid, method, reference) VALUES (?, ?, ?, ?)',
      [monthly_contribution_id, amount_paid, method, reference],
      function (err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        const paymentId = this.lastID;

        db.get('SELECT expected_amount, paid_amount FROM monthly_contributions WHERE id = ?', [monthly_contribution_id], (err2, mc) => {
          if (err2 || !mc) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err2 ? err2.message : 'Monthly contribution not found' });
          }

          const newPaid = (mc.paid_amount || 0) + amount_paid;
          const newBalance = Math.max(0, mc.expected_amount - newPaid);
          const newStatus = newBalance <= 0 ? 'paid' : (newPaid > 0 ? 'partial' : 'unpaid');

          db.run(
            'UPDATE monthly_contributions SET paid_amount = ?, balance = ?, status = ? WHERE id = ?',
            [newPaid, newBalance, newStatus, monthly_contribution_id],
            (err3) => {
              if (err3) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err3.message });
              }

              db.run('COMMIT');
              db.get('SELECT * FROM payments WHERE id = ?', [paymentId], (err4, paymentRow) => {
                if (err4) return res.status(500).json({ error: err4.message });
                res.status(201).json({ payment: paymentRow, updated_monthly_contribution: { id: monthly_contribution_id, paid_amount: newPaid, balance: newBalance, status: newStatus } });
              });
            }
          );
        });
      }
    );
  });
});

export default router;
