import PaymentService from '../services/PaymentService.js';

class PaymentController {
  async getAllPayments(req, res, next) {
    try {
      const payments = await PaymentService.getAllPayments();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  async createPayment(req, res, next) {
    try {
      const result = await PaymentService.createPayment(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();

