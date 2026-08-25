<div align="center">

# 🛒 TechStore — CodeAlpha E-Commerce Platform

**A full-stack electronics e-commerce web application with JWT authentication, persistent cart management, and complete order processing.**

**CodeAlpha Internship — Full Stack Web Development | Task 1**

[![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Build Tool](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![API](https://img.shields.io/badge/API-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Authentication](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🌐 **[Live Demo](YOUR_VERCEL_URL)** &nbsp;•&nbsp; 📦 **[GitHub Repository](YOUR_GITHUB_REPOSITORY_URL)**

</div>

---

## 📖 Overview

**TechStore** is a full-stack electronics e-commerce platform built with **React + Vite** on the frontend and **Node.js + Express + SQLite** on the backend.

The application delivers a complete shopping experience — product browsing, authentication, persistent shopping carts, secure checkout, order history, responsive layouts, and light/dark theme support.

This project was developed as **Task 1 of the CodeAlpha Full Stack Web Development Internship**, with a focus on building, testing, and deploying a complete, production-ready full-stack web application.

---

## ✨ Key Features

### 🛍️ Product Catalog
- 25+ realistic consumer technology products
- Multiple categories: Audio, Computer Accessories, Workspace, Mobile Accessories, Wearables, Gaming, and Networking
- Category filtering chips with keyboard-accessible navigation
- Horizontal scroll snapping for category navigation
- Interactive product cards with whole-card navigation and dedicated CTA buttons

### 📦 Product Details
- High-resolution product images
- Real-time stock indicators
- Quantity selectors
- Detailed product information and pricing
- Warranty and free-shipping value propositions
- Add-to-cart feedback banners with direct navigation to the cart

### 🔐 Authentication & Security
- User registration and login
- JSON Web Token (JWT) authentication
- Password hashing with `bcryptjs`
- Security-question setup during registration
- Three-step password recovery flow (email verification → security-question verification → password reset)
- Protected cart and order routes

### 🛒 Shopping Cart
- Persistent shopping cart
- Real-time stock validation preventing over-ordering
- Quantity controls and individual line-item removal
- Full cart clearing and total calculation
- Empty-cart state with clear calls-to-action
- Support for authenticated and guest shopping experiences

### 💳 Checkout & Order Processing
- Shipping-address form with validation
- Atomic order creation using SQLite transactions
- Product prices captured at time of checkout
- Automatic cart clearing after successful order creation
- User-isolated order history with individual order receipt/detail views

### 🎨 Design System & UX
- Light and dark theme support, persisted via `localStorage`
- Zero flash-of-unformatted-content (FOUC) during theme loading
- Custom UI built with CSS Modules
- Consistent design tokens with a 4px/8px spacing rhythm
- Three-level elevation system
- `lucide-react` iconography
- Responsive layouts for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Lucide React, CSS Modules |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | SQLite via `better-sqlite3` (WAL mode) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Version Control** | Git & GitHub |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |

---

## 🏗️ Architecture

```text
                 ┌──────────────────────┐
                 │        USER          │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   React + Vite       │
                 │      Frontend        │
                 │      (Vercel)        │
                 └──────────┬───────────┘
                            │
                      HTTP / REST API
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Node.js + Express   │
                 │       Backend        │
                 │       (Render)       │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │       SQLite         │
                 │    better-sqlite3    │
                 └──────────────────────┘
```

---

## 📁 Project Structure

```text
CodeAlpha_Ecommerce/
├── backend/
│   ├── data/
│   │   └── store.db              # Auto-generated SQLite database (gitignored)
│   ├── src/
│   │   ├── controllers/          # Auth, cart, order & product controllers
│   │   ├── database/             # Database initialization & seed data
│   │   ├── middleware/           # JWT authentication middleware
│   │   ├── models/               # User, Product, Cart & Order data models
│   │   ├── routes/                # Express API route definitions
│   │   └── server.js             # API entry point & health check
│   ├── .env.example              # Backend environment template
│   └── package.json
├── frontend/
│   ├── public/                   # Static assets & favicons
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/               # Auth, Cart & Theme contexts
│   │   ├── hooks/                 # Product-related custom hooks
│   │   ├── pages/                 # Application pages
│   │   ├── App.jsx               # Application routing & layout
│   │   ├── index.css              # Global styles & design tokens
│   │   └── main.jsx               # React DOM entry point
│   ├── .env.example              # Frontend environment template
│   ├── index.html                 # HTML shell & theme initialization
│   └── package.json
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
└── LICENSE                       # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git**

Verify your installation:

```bash
node --version
npm --version
git --version
```

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CodeAlpha_Ecommerce
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

**macOS / Linux:**
```bash
cp .env.example .env
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

Configure `.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=7d
```

Start the backend:

```bash
npm run dev
```

Backend API: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

**macOS / Linux:**
```bash
cp .env.example .env
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

Configure the frontend environment according to the backend API URL.

Start the frontend:

```bash
npm run dev
```

The application will normally be available at: `http://localhost:5173`

---

## 💾 Database Setup & Auto-Seeding

TechStore uses an embedded **SQLite database** through `better-sqlite3`. No external database server is required for local development.

When the backend starts for the first time:

1. The SQLite database is automatically created.
2. The database schema is initialized.
3. Required tables are created.
4. Seed data is inserted when the product catalog is empty.

The database includes the following tables:

- `products`
- `users`
- `cart_items`
- `orders`
- `order_items`

The generated database is stored at `backend/data/store.db` and is excluded from Git version control via `.gitignore`.

---

## 📡 API Reference

### Health Check

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/api/health` | Returns server status and environment information | ❌ |

### Products

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve all products | ❌ |
| `GET` | `/api/products/:id` | Retrieve a specific product | ❌ |

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | ❌ |
| `POST` | `/api/auth/security-question` | Retrieve security question | ❌ |
| `POST` | `/api/auth/verify-security-answer` | Verify security answer | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password using reset token | ❌ |

### Shopping Cart

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/api/cart` | Retrieve current user's cart | 🔒 JWT |
| `POST` | `/api/cart` | Add product to cart | 🔒 JWT |
| `PUT` | `/api/cart/:productId` | Update cart item quantity | 🔒 JWT |
| `DELETE` | `/api/cart/:productId` | Remove an item from cart | 🔒 JWT |
| `DELETE` | `/api/cart` | Clear the current user's cart | 🔒 JWT |

### Orders & Checkout

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/api/orders` | Create order from current cart | 🔒 JWT |
| `GET` | `/api/orders` | Retrieve authenticated user's orders | 🔒 JWT |
| `GET` | `/api/orders/:id` | Retrieve individual order details | 🔒 JWT |

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets** — sensitive configuration is managed through environment variables
- **Password Hashing** — passwords and security answers are hashed using `bcryptjs`
- **JWT Authentication** — protected API requests require a valid JWT token
- **Route Protection** — cart and order endpoints are protected by authentication middleware
- **Git Protection** — `.env`, SQLite database files, `node_modules`, and build artifacts are excluded from version control

---

## 🌍 Deployment

The application uses a separate frontend and backend deployment architecture:

```text
                       GitHub
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
          Vercel                    Render
             │                         │
             ▼                         ▼
     React Frontend             Express Backend
             │                         │
             └────────────┬────────────┘
                           │
                           ▼
                          API
```

### Frontend — Vercel
The React + Vite frontend is deployed on **Vercel**.
🌐 **Live Application:** [Open TechStore](YOUR_VERCEL_URL)

### Backend — Render
The Node.js + Express backend is deployed on **Render**. The production frontend communicates with the deployed backend through the configured API URL.

---

## 📸 Screenshots

> Store screenshots inside a `screenshots/` folder in the repository so the images below render correctly on GitHub.

### 🏠 Home / Product Catalog
![TechStore Home](screenshots/home.png)

### 📦 Product Details
![Product Details](screenshots/product-details.png)

### 🛒 Shopping Cart
![Shopping Cart](screenshots/cart.png)

### 🔐 Authentication
![Authentication](screenshots/login.png)

### 💳 Checkout
![Checkout](screenshots/checkout.png)

---

## 🧪 Testing

The application was tested across the major user workflows.

**Functional Testing**

- [x] User registration
- [x] User login
- [x] Password recovery
- [x] Product loading
- [x] Product browsing
- [x] Category filtering
- [x] Product details
- [x] Add to cart
- [x] Update cart quantity
- [x] Remove cart items
- [x] Clear cart
- [x] Checkout
- [x] Order creation
- [x] Order history
- [x] Order details
- [x] Frontend/backend communication
- [x] Production API communication

**Responsive Testing**

- 📱 Mobile
- 📟 Tablet
- 💻 Desktop

**Deployment Testing**

- Frontend availability
- Backend availability
- API communication
- Product loading
- Authentication flow
- Cart functionality
- Checkout functionality

---

## 🧑‍💻 Development Workflow

```text
Local Development
       │
       ▼
Feature Development
       │
       ▼
Local Testing
       │
       ▼
Git Commit
       │
       ▼
GitHub
       │
       ├──────────────► Vercel ──► Frontend Deploy
       │
       └──────────────► Render ──► Backend Deploy
```

This workflow keeps the project version-controlled while supporting deployment of both the frontend and backend.

---

## 🎯 Learning Outcomes

This project provided practical, hands-on experience with:

- Full-stack web development and component-based architecture
- React 19, Vite configuration, React Router, and the Context API
- Custom React hooks
- REST API development with Express.js
- SQLite integration and database transactions
- JWT authentication, password hashing, and middleware
- CORS and environment variable management
- Git and GitHub workflows
- Responsive web design and production debugging
- Vercel and Render deployment
- Frontend/backend integration

---

## 🔮 Future Improvements

The following are potential enhancements and are **not yet implemented**:

- 💳 Online payment gateway integration
- ❤️ Wishlist functionality
- 🔎 Advanced product search
- 🏷️ Advanced filtering and sorting
- ⭐ Product reviews and ratings
- 👤 User profile management
- 📊 Admin dashboard
- 📈 Sales analytics
- 📦 Advanced order tracking
- 📧 Email notifications
- 🔔 Order-status notifications
- 🖼️ Advanced product image management
- 🌐 Internationalization and multiple currencies
- ♿ Further accessibility improvements

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository
2. Create a feature branch:
```bash
   git checkout -b feature/your-feature
```
3. Make your changes
4. Commit your changes:
```bash
   git commit -m "feat: add your feature"
```
5. Push your branch:
```bash
   git push origin feature/your-feature
```
6. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this project according to the terms of the license.

See the [LICENSE](LICENSE) file for the complete license text.

---

## 👨‍💻 Author

**YOUR NAME**
B.E. Information Technology Student

- 🐙 GitHub: [YOUR_GITHUB_PROFILE](YOUR_GITHUB_PROFILE_URL)
- 💼 LinkedIn: [YOUR_LINKEDIN_PROFILE](YOUR_LINKEDIN_PROFILE_URL)

---

## 🏆 CodeAlpha Internship

**CodeAlpha Internship Program — Task 1: Full Stack E-Commerce Website**

This project demonstrates the development, testing, and deployment of a complete full-stack e-commerce application using modern JavaScript technologies.

---

## ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

<p align="center">
  Built with ❤️ using React, Node.js, Express, SQLite and modern web technologies.
</p>

<p align="center">
  <strong>CodeAlpha Internship • Task 1 • Full Stack Web Development</strong>
</p>
