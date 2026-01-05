import UserModel from '../models/UserModel.js';
import RoleModel from '../models/RoleModel.js';
import { validateRequired, validateEmail } from '../middleware/validator.js';

class UserService {
  async getAllUsers() {
    return await UserModel.findAll();
  }

  async getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData) {
    const { role_id, role_name, name, email, password } = userData;

    // Validate required fields
    validateRequired(['name', 'email', 'password'], userData);
    validateEmail(email);

    // Resolve role_id
    let resolvedRoleId = role_id;
    if (!resolvedRoleId && role_name) {
      let role = await RoleModel.findByName(role_name);
      if (!role) {
        role = await RoleModel.create(role_name);
      }
      resolvedRoleId = role.id;
    } else if (!resolvedRoleId) {
      throw new Error('role_id or role_name is required');
    }

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    return await UserModel.create({
      role_id: resolvedRoleId,
      name,
      email,
      password,
    });
  }
}

export default new UserService();

