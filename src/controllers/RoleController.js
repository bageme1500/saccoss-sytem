import RoleService from '../services/RoleService.js';

class RoleController {
  async createRole(req, res, next) {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json(role);
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();

