import PaymentModel from '../models/PaymentModel.js';
import MonthlyContributionModel from '../models/MonthlyContributionModel.js';
import database from '../config/database.js';
import { validateRequired } from '../middleware/validator.js';

class PaymentService {
  async getAllPayments() {
    return await PaymentModel.findAll();
  }

  async createPayment(paymentData) {
    const { monthly_contribution_id, amount_paid, method, reference } = paymentData;

    validateRequired(['monthly_contribution_id', 'amount_paid', 'method'], paymentData);

    // Validate amount
    if (amount_paid <= 0) {
      throw new Error('Amount paid must be greater than 0');
    }

    // Get the monthly contribution
    const contribution = await MonthlyContributionModel.findById(monthly_contribution_id);
    if (!contribution) {
      throw new Error('Monthly contribution not found');
    }

    // Use transaction to ensure data consistency
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert payment
        db.run(
          'INSERT INTO payments (monthly_contribution_id, amount_paid, method, reference) VALUES (?, ?, ?, ?)',
          [monthly_contribution_id, amount_paid, method, reference],
          async function (err) {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
              return;
            }

            const paymentId = this.lastID;

            try {
              // Update monthly contribution
              const newPaid = (contribution.paid_amount || 0) + amount_paid;
              const newBalance = Math.max(0, contribution.expected_amount - newPaid);
              const newStatus = newBalance <= 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';

              db.run(
                'UPDATE monthly_contributions SET paid_amount = ?, balance = ?, status = ? WHERE id = ?',
                [newPaid, newBalance, newStatus, monthly_contribution_id],
                async (err2) => {
                  if (err2) {
                    db.run('ROLLBACK');
                    reject(err2);
                    return;
                  }

                  db.run('COMMIT');

                  try {
                    const payment = await PaymentModel.findById(paymentId);
                    const updatedContribution = await MonthlyContributionModel.findById(monthly_contribution_id);
                    resolve({
                      payment,
                      updated_monthly_contribution: updatedContribution,
                    });
                  } catch (error) {
                    reject(error);
                  }
                }
              );
            } catch (error) {
              db.run('ROLLBACK');
              reject(error);
            }
          }
        );
      });
    });
  }
}

export default new PaymentService();

