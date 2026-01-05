import MonthlyContributionModel from '../models/MonthlyContributionModel.js';
import MembershipModel from '../models/MembershipModel.js';
import { validateRequired } from '../middleware/validator.js';

class MonthlyContributionService {
  async getAllContributions() {
    return await MonthlyContributionModel.findAll();
  }

  async createContribution(contributionData) {
    const { membership_id, month, expected_amount, paid_amount } = contributionData;

    validateRequired(['membership_id', 'month', 'expected_amount'], contributionData);

    // Validate membership exists
    const membership = await MembershipModel.findById(membership_id);
    if (!membership) {
      throw new Error('Membership not found');
    }

    // Validate expected_amount
    if (expected_amount <= 0) {
      throw new Error('Expected amount must be greater than 0');
    }

    return await MonthlyContributionModel.create({
      membership_id,
      month,
      expected_amount,
      paid_amount: paid_amount || 0,
    });
  }
}

export default new MonthlyContributionService();

