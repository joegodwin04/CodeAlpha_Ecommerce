import { Link, NavLink } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  User,
  Sun,
  Moon,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Header.module.css';

/**
 * Header — sticky frosted-glass navigation bar.
 */
function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* Logo + brand */}
        <Link to="/" className={styles.brand} aria-label="TechStore — go to homepage">
          <span className={styles.logoMark} aria-hidden="true">
            <Layers size={20} strokeWidth={2.5} />
          </span>
          <span className={styles.logoText}>TechStore</span>
        </Link>

        {/* Primary nav links */}
        <nav className={styles.navLinks} aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Products
          </NavLink>
        </nav>

        {/* Right-side actions */}
        <div className={styles.actions}>

          {/* Theme toggle */}
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode
              ? <Sun size={18} strokeWidth={2} />
              : <Moon size={18} strokeWidth={2} />
            }
          </button>

          {/* Cart */}
          <Link
            id="header-cart-link"
            to="/cart"
            className={styles.cartBtn}
            aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          >
            <span className={styles.cartIconWrap}>
              <ShoppingCart size={18} strokeWidth={2} />
              {itemCount > 0 && (
                <span id="cart-badge-count" className={styles.cartBadge} aria-hidden="true">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </span>
            <span className={styles.cartLabel}>Cart</span>
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className={styles.authGroup}>
              <Link
                id="header-orders-link"
                to="/orders"
                className={styles.ghostBtn}
                aria-label="View order history"
              >
                <Package size={16} strokeWidth={2} />
                <span>Orders</span>
              </Link>
              <div className={styles.userChip} title={user?.email}>
                <User size={14} strokeWidth={2.5} />
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              </div>
              <button
                id="logout-btn"
                className={styles.logoutBtn}
                onClick={logout}
                aria-label="Sign out of your account"
                title="Sign out"
              >
                <LogOut size={16} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link
                id="header-login-link"
                to="/login"
                className={styles.ghostBtn}
              >
                Sign In
              </Link>
              <Link
                id="header-register-link"
                to="/register"
                className={styles.primaryBtn}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
