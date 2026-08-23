const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  getOrderById,
} = require('../controllers/orderController');

// All order endpoints require a valid JWT
router.use(authMiddleware);

router.post('/',    createOrder);   // POST /api/orders
router.get('/',     getOrders);     // GET  /api/orders
router.get('/:id',  getOrderById);  // GET  /api/orders/:id

module.exports = router;
