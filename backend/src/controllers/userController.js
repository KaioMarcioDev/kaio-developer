import { UserModel } from '../models/userModel.js';

export const UserController = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await UserModel.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create user
  async createUser(req, res) {
    try {
      const user = await UserModel.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const user = await UserModel.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      await UserModel.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};