import express from 'express';
import MembershipController from '../controllers/MembershipController.js';

const router = express.Router();

router.get('/', MembershipController.getAllMemberships.bind(MembershipController));
router.post('/', MembershipController.createMembership.bind(MembershipController));

export default router;

