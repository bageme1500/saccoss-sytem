import database from '../config/database.js';

class PaymentModel {
  async findAll() {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.all(
        `SELECT p.*, mc.month, m.user_id, u.name AS user_name
         FROM payments p
         LEFT JOIN monthly_contributions mc ON p.monthly_contribution_id = mc.id
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
      db.get('SELECT * FROM payments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(paymentData) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const { monthly_contribution_id, amount_paid, method, reference } = paymentData;
      const self = this;
      db.run(
        'INSERT INTO payments (monthly_contribution_id, amount_paid, method, reference) VALUES (?, ?, ?, ?)',
        [monthly_contribution_id, amount_paid, method, reference],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }
          try {
            const payment = await self.findById(this.lastID);
            resolve(payment);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}

export default new PaymentModel();

