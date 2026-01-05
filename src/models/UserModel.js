import database from '../config/database.js';

class UserModel {
  async findAll() {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.all(
        'SELECT id, role_id, name, email, created_at FROM users',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.get(
        `SELECT u.id, u.name, u.email, u.created_at, r.name AS role
         FROM users u LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(userData) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const { role_id, name, email, password } = userData;
      const self = this;
      db.run(
        'INSERT INTO users (role_id, name, email, password) VALUES (?, ?, ?, ?)',
        [role_id, name, email, password],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }
          try {
            const user = await self.findById(this.lastID);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}

export default new UserModel();

