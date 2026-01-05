import MembershipModel from '../models/MembershipModel.js';
import UserModel from '../models/UserModel.js';
import { validateRequired } from '../middleware/validator.js';

class MembershipService {
  async getAllMemberships() {
    return await MembershipModel.findAll();
  }

  async createMembership(membershipData) {
    const { user_id, monthly_amount, start_date, status } = membershipData;

    validateRequired(['user_id', 'monthly_amount', 'start_date'], membershipData);

    // Validate user exists
    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has a membership
    const existingMembership = await MembershipModel.findByUserId(user_id);
    if (existingMembership) {
      throw new Error('User already has a membership');
    }

    // Validate monthly_amount
    if (monthly_amount <= 0) {
      throw new Error('Monthly amount must be greater than 0');
    }

    return await MembershipModel.create({
      user_id,
      monthly_amount,
      start_date,
      status: status || 'active',
    });
  }
}

export default new MembershipService();

