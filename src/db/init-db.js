import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) console.error('Failed to enable foreign keys:', err.message);
  });

  const schemaSql = `
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  monthly_amount REAL NOT NULL CHECK (monthly_amount > 0),
  start_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS monthly_contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  membership_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  expected_amount REAL NOT NULL CHECK (expected_amount > 0),
  paid_amount REAL NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  balance REAL NOT NULL CHECK (balance >= 0),
  status TEXT NOT NULL DEFAULT 'unpaid',
  UNIQUE (membership_id, month),
  FOREIGN KEY (membership_id) REFERENCES memberships(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  monthly_contribution_id INTEGER NOT NULL,
  amount_paid REAL NOT NULL CHECK (amount_paid > 0),
  payment_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  method TEXT NOT NULL,
  reference TEXT,
  FOREIGN KEY (monthly_contribution_id) REFERENCES monthly_contributions(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_monthly_contributions_month
ON monthly_contributions(month);

CREATE INDEX IF NOT EXISTS idx_payments_date
ON payments(payment_date);
  `;

  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Failed to initialize database schema:', err.message);
      process.exit(1);
    }

    const seedSql = `
-- roles
INSERT OR IGNORE INTO roles (id, name) VALUES (1,'admin'),(2,'member');

-- users
INSERT OR IGNORE INTO users (role_id, name, email, password) VALUES
(1,'Alice Admin','alice@example.com','password1'),
(2,'Bob Member','bob@example.com','password2'),
(2,'Carol User','carol@example.com','password3');

-- memberships
INSERT OR IGNORE INTO memberships (user_id, monthly_amount, start_date, status) VALUES
((SELECT id FROM users WHERE email='alice@example.com'),100.0,'2024-01-01','active'),
((SELECT id FROM users WHERE email='bob@example.com'),50.0,'2024-01-01','active');

-- monthly contributions
INSERT OR IGNORE INTO monthly_contributions (membership_id, month, expected_amount, paid_amount, balance, status) VALUES
((SELECT id FROM memberships WHERE user_id=(SELECT id FROM users WHERE email='alice@example.com')),'2024-01',100.0,100.0,0.0,'paid'),
((SELECT id FROM memberships WHERE user_id=(SELECT id FROM users WHERE email='bob@example.com')),'2024-01',50.0,0.0,50.0,'unpaid');

-- payments
INSERT OR IGNORE INTO payments (monthly_contribution_id, amount_paid, method, reference) VALUES
((SELECT id FROM monthly_contributions WHERE month='2024-01' AND membership_id=(SELECT id FROM memberships WHERE user_id=(SELECT id FROM users WHERE email='alice@example.com'))),100.0,'cash','TXN-ALICE-001');
    `;

    db.exec(seedSql, (err2) => {
      if (err2) console.error('Failed to insert demo data:', err2.message);
      else console.log('Demo data inserted (or already present).');
    });
  });
});

db.close((err) => {
  if (err) console.error('Error closing database:', err.message);
  else console.log('Database connection closed');
});

