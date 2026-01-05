import express from 'express';
import MonthlyContributionController from '../controllers/MonthlyContributionController.js';

const router = express.Router();

router.get('/', MonthlyContributionController.getAllContributions.bind(MonthlyContributionController));
router.post('/', MonthlyContributionController.createContribution.bind(MonthlyContributionController));

export default router;

