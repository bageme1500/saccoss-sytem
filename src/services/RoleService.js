import RoleModel from '../models/RoleModel.js';
import { validateRequired } from '../middleware/validator.js';

class RoleService {
  async createRole(roleData) {
    const { name } = roleData;
    validateRequired(['name'], roleData);

    // Check if role already exists
    const existingRole = await RoleModel.findByName(name);
    if (existingRole) {
      return existingRole;
    }

    return await RoleModel.create(name);
  }
}

export default new RoleService();

