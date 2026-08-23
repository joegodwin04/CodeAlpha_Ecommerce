const Order = require('../models/Order');

/**
 * Order Controller
 * Handles order placement, listing order history, and fetching individual orders.
 */

/* ── POST /api/orders ─────────────────────────────────────────────────────── */
const createOrder = (req, res) => {
  try {
    const { shippingName, shippingAddress, shippingCity, shippingPostalCode } = req.body;

    // ── Field validation ────────────────────────────────────────────────────
    if (!shippingName || !shippingName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required for shipping.' });
    }
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }
    if (!shippingCity || !shippingCity.trim()) {
      return res.status(400).json({ success: false, message: 'City is required for shipping.' });
    }
    if (!shippingPostalCode || !shippingPostalCode.trim()) {
      return res.status(400).json({ success: false, message: 'Postal / ZIP code is required.' });
    }

    const order = Order.createFromCart({
      userId:             req.user.id,
      shippingName:       shippingName.trim(),
      shippingAddress:    shippingAddress.trim(),
      shippingCity:       shippingCity.trim(),
      shippingPostalCode: shippingPostalCode.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data:    order,
    });
  } catch (err) {
    console.error('createOrder error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to place order. Please try again.',
    });
  }
};

/* ── GET /api/orders ──────────────────────────────────────────────────────── */
const getOrders = (req, res) => {
  try {
    const orders = Order.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      count:   orders.length,
      data:    orders,
    });
  } catch (err) {
    console.error('getOrders error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history.',
    });
  }
};

/* ── GET /api/orders/:id ──────────────────────────────────────────────────── */
const getOrderById = (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId) || orderId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    }

    const order = Order.findByIdAndUser(orderId, req.user.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found or you do not have permission to view it.`,
      });
    }

    res.status(200).json({
      success: true,
      data:    order,
    });
  } catch (err) {
    console.error('getOrderById error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details.',
    });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
