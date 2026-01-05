import database from '../config/database.js';

class MembershipModel {
  async findAll() {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.all(
        `SELECT m.id, m.user_id, u.name AS user_name, u.email AS user_email,
                m.monthly_amount, m.start_date, m.status
         FROM memberships m
         LEFT JOIN users u ON m.user_id = u.id`,
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
        `SELECT m.*, u.name AS user_name, u.email AS user_email
         FROM memberships m
         LEFT JOIN users u ON m.user_id = u.id
         WHERE m.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.get('SELECT * FROM memberships WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(membershipData) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const { user_id, monthly_amount, start_date, status } = membershipData;
      const self = this;
      db.run(
        'INSERT INTO memberships (user_id, monthly_amount, start_date, status) VALUES (?, ?, ?, ?)',
        [user_id, monthly_amount, start_date, status || 'active'],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }
          try {
            const membership = await self.findById(this.lastID);
            resolve(membership);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}

export default new MembershipModel();

