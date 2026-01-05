import express from 'express';
import RoleController from '../controllers/RoleController.js';

const router = express.Router();

router.post('/', RoleController.createRole.bind(RoleController));

export default router;

