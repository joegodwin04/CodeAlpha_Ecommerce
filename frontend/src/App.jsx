import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import './App.css';

/**
 * App — root component with client-side routing.
 *
 * Routes:
 *   /               → ProductsPage (product listing)
 *   /products/:id   → ProductDetailPage (product detail)
 *   /login          → LoginPage
 *   /register       → RegisterPage
 *   /forgot-password → ForgotPasswordPage
 *   /cart           → CartPage (shopping cart)
 *   /checkout       → CheckoutPage (shipping & order placement)
 *   /orders         → OrderHistoryPage (order list)
 *   /orders/:id     → OrderDetailPage (order confirmation & receipt)
 *   *               → ProductsPage (catch-all)
 */
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="*" element={<ProductsPage />} />
      </Routes>
    </>
  );
}

export default App;
// Automatic deployment test