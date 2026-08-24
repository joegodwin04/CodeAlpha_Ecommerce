const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const seed = require('./seed');

// The database file lives at backend/data/store.db
// better-sqlite3 creates the file automatically if it doesn't exist.
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'store.db');

// Create the data/ directory if it doesn't exist yet
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better read/write performance
db.pragma('journal_mode = WAL');

// ── Create tables ────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL,
    price       REAL    NOT NULL,
    image       TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    createdAt   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT    NOT NULL,
    email            TEXT    NOT NULL UNIQUE,
    password         TEXT    NOT NULL,
    securityQuestion TEXT,
    securityAnswer   TEXT,
    createdAt        TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    userId     INTEGER NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    productId  INTEGER NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
    quantity   INTEGER NOT NULL DEFAULT 1 CHECK(quantity >= 1),
    createdAt  TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(userId, productId)
  );
`);

// ── Migration: Add securityQuestion and securityAnswer if they don't exist
const tableInfo = db.prepare('PRAGMA table_info(users)').all();
const hasSecurityQuestion = tableInfo.some(col => col.name === 'securityQuestion');
if (!hasSecurityQuestion) {
  db.exec('ALTER TABLE users ADD COLUMN securityQuestion TEXT;');
  db.exec('ALTER TABLE users ADD COLUMN securityAnswer TEXT;');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    userId             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    totalAmount        REAL    NOT NULL,
    status             TEXT    NOT NULL DEFAULT 'Placed',
    shippingName       TEXT    NOT NULL,
    shippingAddress    TEXT    NOT NULL,
    shippingCity       TEXT    NOT NULL,
    shippingPostalCode TEXT    NOT NULL,
    createdAt          TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId    INTEGER NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
    productId  INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity   INTEGER NOT NULL CHECK(quantity >= 1),
    price      REAL    NOT NULL,
    createdAt  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed sample data on first run ─────────────────────────────────────────────
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  console.log('🌱 Seeding database with sample products...');
  // Reset the AUTOINCREMENT counter so IDs always start from 1
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'products'").run();
  seed(db);
  console.log('✅ Database seeded successfully.');
}

module.exports = db;
