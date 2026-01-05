import database from '../config/database.js';

class RoleModel {
  async findByName(name) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.get('SELECT id, name FROM roles WHERE name = ?', [name], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      db.get('SELECT id, name FROM roles WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(name) {
    return new Promise((resolve, reject) => {
      const db = database.getConnection();
      const self = this;
      db.run('INSERT OR IGNORE INTO roles (name) VALUES (?)', [name], async function (err) {
        if (err) {
          reject(err);
          return;
        }
        // Get the created role
        try {
          const role = await self.findByName(name);
          resolve(role);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export default new RoleModel();

