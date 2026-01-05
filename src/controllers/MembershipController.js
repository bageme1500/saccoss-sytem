import MembershipService from '../services/MembershipService.js';

class MembershipController {
  async getAllMemberships(req, res, next) {
    try {
      const memberships = await MembershipService.getAllMemberships();
      res.json(memberships);
    } catch (error) {
      next(error);
    }
  }

  async createMembership(req, res, next) {
    try {
      const membership = await MembershipService.createMembership(req.body);
      res.status(201).json(membership);
    } catch (error) {
      next(error);
    }
  }
}

export default new MembershipController();

