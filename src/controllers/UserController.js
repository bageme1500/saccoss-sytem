import UserService from '../services/UserService.js';

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

