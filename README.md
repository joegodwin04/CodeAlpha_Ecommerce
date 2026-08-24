# CodeAlpha E-Commerce Store (TechStore)

> **CodeAlpha Internship — Full Stack Web Development Task 1**  
> A modern, full-stack electronics e-commerce web application featuring a curated product catalog, JWT authentication with security question recovery, persistent shopping cart, and complete order processing.

---

## 📸 Overview

**TechStore** is an e-commerce platform built with **React + Vite** on the frontend and **Node.js + Express + SQLite** on the backend. It offers a shopping experience with dark/light theme switching, responsive design, and end-to-end purchasing workflows.

---

## ✨ Features

- **Product Catalog:**
  - 25+ realistic consumer technology products across multiple categories (*Audio, Computer Accessories, Workspace, Mobile Accessories, Wearables, Gaming, Networking*).
  - Category filtering chips with keyboard accessibility and horizontal scroll snapping.
  - Interactive product cards supporting whole-card navigation as well as dedicated CTA buttons.

- **Product Details:**
  - High-resolution product images, real-time stock indicators, and quantity selectors.
  - Value propositions (*Warranty, Free Shipping guarantees*).
  - Feedback banners on adding items to cart with direct cart navigation.

- **Authentication & Security:**
  - User registration and login using JSON Web Tokens (JWT) and `bcryptjs` password hashing.
  - Security question setup during registration.
  - 3-step Forgot Password recovery flow (*Email verification → Security question challenge → Password reset*).

- **Shopping Cart:**
  - Real-time stock validation preventing users from exceeding available inventory.
  - Quantity controls, line-item removal, and complete cart clearing.
  - Empty-state illustrations and calls-to-action for both authenticated and guest users.

- **Checkout & Order Processing:**
  - Shipping address form with validation.
  - Atomic order creation backed by SQLite transactions, automatically capturing product prices at checkout.
  - User-isolated order history and individual order receipt views.

- **Design System & UX:**
  - Light & Dark mode support with persistent `localStorage` preference and zero flash-of-unformatted-content (FOUC) on load.
  - Custom UI built with vanilla CSS Modules and strict design tokens (4/8px spacing rhythm, 3-level elevation).
  - Iconography powered by `lucide-react`.
  - Fully responsive across mobile, tablet, and desktop breakpoints.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Lucide Icons, CSS Modules |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | SQLite via `better-sqlite3` (WAL mode enabled) |
| **Auth & Security** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`) |

---

## 📁 Project Structure

```
CodeAlpha_Ecommerce/
├── backend/
│   ├── data/                 # Auto-generated SQLite database (gitignored)
│   ├── src/
│   │   ├── controllers/      # Route handler controllers (auth, cart, order, product)
│   │   ├── database/         # SQLite schema initialization (db.js) & seed data (seed.js)
│   │   ├── middleware/       # JWT authMiddleware
│   │   ├── models/           # Data access models (User, Product, Cart, Order)
│   │   ├── routes/           # Express route definitions
│   │   └── server.js         # API entry point & health check
│   ├── .env.example          # Backend environment variables template
│   └── package.json
├── frontend/
│   ├── public/               # Static assets & favicons
│   ├── src/
│   │   ├── components/       # Header, ProductCard, ProductGrid, LoadingGrid, ErrorState, EmptyState
│   │   ├── context/          # AuthContext, CartContext, ThemeContext
│   │   ├── hooks/            # useProducts, useProduct
│   │   ├── pages/            # ProductsPage, ProductDetailPage, CartPage, CheckoutPage, etc.
│   │   ├── App.jsx           # Application routing & layout
│   │   ├── index.css         # Global design tokens, typography, and dark mode theme
│   │   └── main.jsx          # React DOM entry point
│   ├── .env.example          # Frontend environment variables template
│   ├── index.html            # HTML shell with blocking theme script
│   └── package.json
├── .gitignore                # Production-grade gitignore rules
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodeAlpha_Ecommerce
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. Configure `.env` if necessary:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES=7d
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will start at: `http://localhost:5000`

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5173`

---

## 💾 Database Setup & Auto-Seeding

The project uses an embedded **SQLite** database via `better-sqlite3`.

- When the backend starts for the first time, `backend/src/database/db.js` automatically creates `backend/data/store.db`.
- The database schema is initialized (`products`, `users`, `cart_items`, `orders`, `order_items`).
- Sample data from `seed.js` is automatically populated into the `products` table if the catalog is empty.
- **No manual SQL migrations or database setup commands are required.**

---

## 📡 API Reference

### Health Check
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Server status and environment check | No |

### Products
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve all products in the catalog | No |
| `GET` | `/api/products/:id` | Retrieve details for a single product | No |

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token | No |
| `POST` | `/api/auth/security-question` | Retrieve security question for password reset | No |
| `POST` | `/api/auth/verify-security-answer` | Verify answer and receive reset token | No |
| `POST` | `/api/auth/reset-password` | Reset password using verified reset token | No |

### Shopping Cart
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart` | Retrieve current user's cart items and total | `Bearer <token>` |
| `POST` | `/api/cart` | Add product to cart with quantity | `Bearer <token>` |
| `PUT` | `/api/cart/:productId` | Update item quantity in cart | `Bearer <token>` |
| `DELETE` | `/api/cart/:productId` | Remove a specific item from cart | `Bearer <token>` |
| `DELETE` | `/api/cart` | Clear all items from current user's cart | `Bearer <token>` |

### Orders & Checkout
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Create an order from current cart & clear cart | `Bearer <token>` |
| `GET` | `/api/orders` | Retrieve authenticated user's order history | `Bearer <token>` |
| `GET` | `/api/orders/:id` | Retrieve single order details and line items | `Bearer <token>` |

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets:** All secrets (JWT secret keys, database paths, port numbers) are managed via environment variables.
- **Password Hashing:** Passwords and security answers are hashed using `bcryptjs` with salt rounds.
- **Route Protection:** Cart and Order endpoints are protected with strict JWT verification middleware.
- **Sanitized Gitignore:** SQLite database files, `.env` configurations, `node_modules`, and build artifacts are strictly excluded from version control.

---

## 📜 License & Acknowledgments

Developed as part of the **CodeAlpha Internship Program** — Task 1 (Full Stack E-Commerce Development).

<!-- Deployment pipeline verified -->