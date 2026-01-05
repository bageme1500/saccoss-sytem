import MonthlyContributionService from '../services/MonthlyContributionService.js';

class MonthlyContributionController {
  async getAllContributions(req, res, next) {
    try {
      const contributions = await MonthlyContributionService.getAllContributions();
      res.json(contributions);
    } catch (error) {
      next(error);
    }
  }

  async createContribution(req, res, next) {
    try {
      const contribution = await MonthlyContributionService.createContribution(req.body);
      res.status(201).json(contribution);
    } catch (error) {
      next(error);
    }
  }
}

export default new MonthlyContributionController();

