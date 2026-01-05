import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.get('/', UserController.getAllUsers.bind(UserController));
router.get('/:id', UserController.getUserById.bind(UserController));
router.post('/', UserController.createUser.bind(UserController));

export default router;

