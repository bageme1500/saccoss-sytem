import express from 'express';
import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

router.get('/', PaymentController.getAllPayments.bind(PaymentController));
router.post('/', PaymentController.createPayment.bind(PaymentController));

export default router;

