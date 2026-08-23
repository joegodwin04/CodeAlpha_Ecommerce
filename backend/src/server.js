require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importing the routes (this also triggers DB init + seeding on first run)
const productRoutes = require('./routes/productRoutes');
const authRoutes    = require('./routes/authRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from the Vite dev server (and any production origin later)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// ── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health check:    http://localhost:${PORT}/api/health`);
  console.log(`   Products API:    http://localhost:${PORT}/api/products`);
  console.log(`   Auth API:        http://localhost:${PORT}/api/auth`);
  console.log(`   Cart API:        http://localhost:${PORT}/api/cart`);
  console.log(`   Orders API:      http://localhost:${PORT}/api/orders`);
});
