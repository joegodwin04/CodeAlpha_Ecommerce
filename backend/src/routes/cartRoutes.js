const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

// All cart routes require a valid JWT
router.use(authMiddleware);

router.get   ('/',            getCart);        // GET    /api/cart
router.post  ('/',            addToCart);       // POST   /api/cart
router.put   ('/:productId',  updateCartItem);  // PUT    /api/cart/:productId
router.delete('/:productId',  removeCartItem);  // DELETE /api/cart/:productId
router.delete('/',            clearCart);       // DELETE /api/cart

module.exports = router;
