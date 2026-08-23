const db = require('../database/db');

/**
 * Cart model
 * All database queries related to cart_items live here.
 */
const Cart = {
  /**
   * Get all cart items for a user, joined with product data.
   * Returns: Array of { cartItemId, productId, name, price, image, category, stock, quantity, subtotal }
   */
  findByUser(userId) {
    return db.prepare(`
      SELECT
        ci.id           AS cartItemId,
        ci.productId,
        ci.quantity,
        p.name,
        p.price,
        p.image,
        p.category,
        p.stock,
        ROUND(p.price * ci.quantity, 2) AS subtotal
      FROM   cart_items ci
      JOIN   products   p  ON p.id = ci.productId
      WHERE  ci.userId = ?
      ORDER  BY ci.id ASC
    `).all(userId);
  },

  /**
   * Get a single cart item for a user+product combination.
   */
  findItem(userId, productId) {
    return db.prepare(
      'SELECT * FROM cart_items WHERE userId = ? AND productId = ?'
    ).get(userId, productId);
  },

  /**
   * Add a product or increment its quantity if already present.
   * Returns the updated row count.
   */
  upsert(userId, productId, quantityToAdd) {
    // Use INSERT OR IGNORE + UPDATE pattern (atomic with a transaction)
    const upsertTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO cart_items (userId, productId, quantity)
        VALUES (?, ?, ?)
        ON CONFLICT(userId, productId)
        DO UPDATE SET quantity = quantity + excluded.quantity
      `).run(userId, productId, quantityToAdd);
    });
    upsertTx();
  },

  /**
   * Set the quantity of a cart item to an exact value.
   */
  setQuantity(userId, productId, quantity) {
    return db.prepare(
      'UPDATE cart_items SET quantity = ? WHERE userId = ? AND productId = ?'
    ).run(quantity, userId, productId);
  },

  /**
   * Remove a single product from the cart.
   */
  removeItem(userId, productId) {
    return db.prepare(
      'DELETE FROM cart_items WHERE userId = ? AND productId = ?'
    ).run(userId, productId);
  },

  /**
   * Remove all items from a user's cart.
   */
  clearCart(userId) {
    return db.prepare('DELETE FROM cart_items WHERE userId = ?').run(userId);
  },
};

module.exports = Cart;
