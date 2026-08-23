const db = require('../database/db');

/**
 * User model
 * All database queries related to users live here.
 */
const User = {
  /**
   * Find a user by their email address.
   * @param {string} email
   * @returns {Object|undefined}
   */
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  /**
   * Find a user by their primary key (used to build JWT payload).
   * @param {number} id
   * @returns {Object|undefined}
   */
  findById(id) {
    return db.prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?').get(id);
  },

  /**
   * Create a new user and return the inserted record (without the password).
   * @param {{ name: string, email: string, password: string, securityQuestion: string, securityAnswer: string }} data
   * @returns {{ id, name, email, createdAt }}
   */
  create({ name, email, password, securityQuestion, securityAnswer }) {
    const stmt   = db.prepare('INSERT INTO users (name, email, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, email, password, securityQuestion || null, securityAnswer || null);
    return this.findById(result.lastInsertRowid);
  },

  /**
   * Update user's password
   * @param {string} email 
   * @param {string} newPasswordHash 
   */
  updatePassword(email, newPasswordHash) {
    const stmt = db.prepare('UPDATE users SET password = ? WHERE email = ?');
    stmt.run(newPasswordHash, email);
  }
};

module.exports = User;
