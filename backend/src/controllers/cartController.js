const Cart    = require('../models/Cart');
const Product = require('../models/Product');

/* ── Helper ──────────────────────────────────────────────────────────────── */

/** Build the response shape: items + totals */
function buildCartResponse(userId) {
  const items = Cart.findByUser(userId);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return {
    items,
    itemCount:  items.reduce((sum, item) => sum + item.quantity, 0),
    total:      Math.round(total * 100) / 100,
  };
}

/* ── GET /api/cart ───────────────────────────────────────────────────────── */
const getCart = (req, res) => {
  try {
    res.status(200).json({ success: true, data: buildCartResponse(req.user.id) });
  } catch (err) {
    console.error('getCart error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load cart.' });
  }
};

/* ── POST /api/cart ──────────────────────────────────────────────────────── */
const addToCart = (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // ── Validate inputs ─────────────────────────────────────────────────────
    if (!productId || isNaN(productId) || parseInt(productId) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid productId is required.' });
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number.' });
    }

    // ── Product exists? ─────────────────────────────────────────────────────
    const product = Product.findById(parseInt(productId));
    if (!product) {
      return res.status(404).json({ success: false, message: `Product with ID ${productId} not found.` });
    }

    // ── Stock check — consider what's already in cart ───────────────────────
    const existingItem  = Cart.findItem(req.user.id, parseInt(productId));
    const currentInCart = existingItem ? existingItem.quantity : 0;
    if (currentInCart + qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock - currentInCart} more unit(s) available.`,
      });
    }

    Cart.upsert(req.user.id, parseInt(productId), qty);
    res.status(200).json({
      success: true,
      message: `${product.name} added to cart.`,
      data:    buildCartResponse(req.user.id),
    });
  } catch (err) {
    console.error('addToCart error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
};

/* ── PUT /api/cart/:productId ────────────────────────────────────────────── */
const updateCartItem = (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const qty       = parseInt(req.body.quantity);

    if (Number.isNaN(productId) || productId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }
    if (Number.isNaN(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a non-negative number.' });
    }

    // Treat qty === 0 as a remove request (common cart convention)
    if (qty === 0) {
      Cart.removeItem(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart.',
        data:    buildCartResponse(req.user.id),
      });
    }

    const product = Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot set quantity to ${qty}. Only ${product.stock} unit(s) available.`,
      });
    }

    const result = Cart.setQuantity(req.user.id, productId, qty);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated.',
      data:    buildCartResponse(req.user.id),
    });
  } catch (err) {
    console.error('updateCartItem error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update cart item.' });
  }
};

/* ── DELETE /api/cart/:productId ─────────────────────────────────────────── */
const removeCartItem = (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    Cart.removeItem(req.user.id, productId);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      data:    buildCartResponse(req.user.id),
    });
  } catch (err) {
    console.error('removeCartItem error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
};

/* ── DELETE /api/cart ────────────────────────────────────────────────────── */
const clearCart = (req, res) => {
  try {
    Cart.clearCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      data:    buildCartResponse(req.user.id),
    });
  } catch (err) {
    console.error('clearCart error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
