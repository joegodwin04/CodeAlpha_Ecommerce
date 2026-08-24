require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importing the routes (this also triggers DB init + seeding on first run)
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://codealpha-ecommerce-two.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        origin.endsWith('.vercel.app') &&
        origin.includes('codealpha-ecommerce')
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ── Routes ──────────────────────────────────────────────────────────────────

// Health check — confirms the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is up and running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Product routes
app.use('/api/products', productRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Cart routes (protected — require JWT)
app.use('/api/cart', cartRoutes);

// Order routes (protected — require JWT)
app.use('/api/orders', orderRoutes);

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
// Must have exactly 4 parameters so Express recognises it as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again.',
  });
});

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health check:    http://localhost:${PORT}/api/health`);
  console.log(`   Products API:    http://localhost:${PORT}/api/products`);
  console.log(`   Auth API:        http://localhost:${PORT}/api/auth`);
  console.log(`   Cart API:        http://localhost:${PORT}/api/cart`);
  console.log(`   Orders API:      http://localhost:${PORT}/api/orders`);
});

// Gracefully handle port-already-in-use and other listen errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Is another server running?`);
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
