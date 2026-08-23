const db = require('../database/db');

/**
 * Product model
 * All database queries related to products live here.
 * Controllers call these functions; they never write SQL themselves.
 */
const Product = {
  /**
   * Fetch every product from the database.
   * @returns {Array} Array of product objects
   */
  findAll() {
    return db.prepare('SELECT * FROM products ORDER BY id ASC').all();
  },

  /**
   * Fetch a single product by its primary key.
   * @param {number|string} id
   * @returns {Object|undefined} Product object, or undefined if not found
   */
  findById(id) {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
};

module.exports = Product;
