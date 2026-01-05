import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, '../../database.sqlite');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
          console.error('Database connection error:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database at', dbFile);
          // Enable foreign keys
          this.db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
              console.error('Failed to enable foreign keys:', err.message);
            }
          });
          resolve(this.db);
        }
      });
    });
  }

  getConnection() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

const database = new Database();
export default database;

