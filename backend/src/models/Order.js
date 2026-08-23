const db = require('../database/db');

/**
 * Order model
 * Handles transactional order creation, querying order history,
 * and fetching specific order details with order items.
 */
const Order = {
  /**
   * Create an order from the user's current cart inside an atomic transaction.
   *
   * @param {{
   *   userId: number,
   *   shippingName: string,
   *   shippingAddress: string,
   *   shippingCity: string,
   *   shippingPostalCode: string
   * }} orderData
   * @returns {Object} The complete created order including order items.
   */
  createFromCart({ userId, shippingName, shippingAddress, shippingCity, shippingPostalCode }) {
    // 1. Fetch current cart items with latest product prices and stocks
    const cartItems = db.prepare(`
      SELECT
        ci.id         AS cartItemId,
        ci.productId,
        ci.quantity,
        p.name,
        p.price,
        p.stock,
        p.image,
        p.category
      FROM   cart_items ci
      JOIN   products   p  ON p.id = ci.productId
      WHERE  ci.userId = ?
      ORDER  BY ci.id ASC
    `).all(userId);

    if (!cartItems || cartItems.length === 0) {
      const err = new Error('Your cart is empty. Please add products to your cart before checking out.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate stock availability & calculate total
    let calculatedTotal = 0;
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        const err = new Error(
          `Insufficient stock for "${item.name}". Requested ${item.quantity}, but only ${item.stock} unit(s) available.`
        );
        err.statusCode = 400;
        throw err;
      }
      calculatedTotal += item.price * item.quantity;
    }
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // 3. Execute atomic transaction
    const executeOrderTransaction = db.transaction(() => {
      // a. Insert order
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (
          userId,
          totalAmount,
          status,
          shippingName,
          shippingAddress,
          shippingCity,
          shippingPostalCode
        ) VALUES (?, ?, 'Placed', ?, ?, ?, ?)
      `);

      const orderResult = insertOrderStmt.run(
        userId,
        calculatedTotal,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPostalCode
      );

      const orderId = orderResult.lastInsertRowid;

      // b. Insert order items & reduce stock
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (orderId, productId, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      const reduceStockStmt = db.prepare(`
        UPDATE products
        SET    stock = stock - ?
        WHERE  id = ?
      `);

      for (const item of cartItems) {
        insertItemStmt.run(orderId, item.productId, item.quantity, item.price);
        reduceStockStmt.run(item.quantity, item.productId);
      }

      // c. Clear the user's cart
      db.prepare('DELETE FROM cart_items WHERE userId = ?').run(userId);

      return orderId;
    });

    const newOrderId = executeOrderTransaction();

    // 4. Return the newly created order
    return this.findByIdAndUser(newOrderId, userId);
  },

  /**
   * Find all orders belonging to a specific user.
   *
   * @param {number} userId
   * @returns {Array} List of orders with item summary.
   */
  findByUser(userId) {
    const orders = db.prepare(`
      SELECT
        o.*,
        (SELECT COUNT(*) FROM order_items WHERE orderId = o.id) AS itemCount,
        (SELECT SUM(quantity) FROM order_items WHERE orderId = o.id) AS totalUnits
      FROM   orders o
      WHERE  o.userId = ?
      ORDER  BY o.id DESC
    `).all(userId);

    return orders;
  },

  /**
   * Find a specific order belonging to a specific user, including order items.
   *
   * @param {number} orderId
   * @param {number} userId
   * @returns {Object|null}
   */
  findByIdAndUser(orderId, userId) {
    const order = db.prepare(`
      SELECT *
      FROM   orders
      WHERE  id = ? AND userId = ?
    `).get(orderId, userId);

    if (!order) return null;

    // Fetch items with joined product information
    const items = db.prepare(`
      SELECT
        oi.id AS orderItemId,
        oi.productId,
        oi.quantity,
        oi.price,
        ROUND(oi.price * oi.quantity, 2) AS subtotal,
        p.name,
        p.image,
        p.category
      FROM   order_items oi
      LEFT JOIN products p ON p.id = oi.productId
      WHERE  oi.orderId = ?
      ORDER  BY oi.id ASC
    `).all(orderId);

    return {
      ...order,
      items,
    };
  },
};

module.exports = Order;
