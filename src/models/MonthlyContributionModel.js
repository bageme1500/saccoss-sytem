import database from '../config/database.js';

class MonthlyContributionModel {
  async findAll() {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.all(
        `SELECT mc.*, m.user_id, u.name AS user_name
         FROM monthly_contributions mc
         LEFT JOIN memberships m ON mc.membership_id = m.id
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
      db.get('SELECT * FROM monthly_contributions WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(contributionData) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const { membership_id, month, expected_amount, paid_amount } = contributionData;
      const paid = paid_amount || 0;
      const balance = Math.max(0, expected_amount - paid);
      const status = paid >= expected_amount ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
      const self = this;

      db.run(
        'INSERT INTO monthly_contributions (membership_id, month, expected_amount, paid_amount, balance, status) VALUES (?, ?, ?, ?, ?, ?)',
        [membership_id, month, expected_amount, paid, balance, status],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }
          try {
            const contribution = await self.findById(this.lastID);
            resolve(contribution);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async update(id, updates) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const { paid_amount, balance, status } = updates;
      const self = this;
      db.run(
        'UPDATE monthly_contributions SET paid_amount = ?, balance = ?, status = ? WHERE id = ?',
        [paid_amount, balance, status, id],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }
          try {
            const contribution = await self.findById(id);
            resolve(contribution);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}

export default new MonthlyContributionModel();

