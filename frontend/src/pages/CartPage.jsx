import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, ShieldCheck, Trash2, LogIn, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

/**
 * CartPage — /cart
 * Displays the logged-in user's shopping cart with full item management.
 */
function CartPage() {
  const { isLoggedIn } = useAuth();
  const { items, itemCount, total, loading, error, updateItem, removeItem, clearCart, fetchCart } = useCart();

  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId]   = useState(null);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleIncrease = async (item) => {
    if (item.quantity >= item.stock) {
      setActionError(`Cannot add more. Only ${item.stock} unit(s) available in stock.`);
      return;
    }
    setActionError('');
    setUpdatingId(item.productId);
    const res = await updateItem(item.productId, item.quantity + 1);
    if (!res.success) setActionError(res.message);
    setUpdatingId(null);
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      // If decreasing from 1, confirm removal or simply remove
      handleRemove(item.productId);
      return;
    }
    setActionError('');
    setUpdatingId(item.productId);
    const res = await updateItem(item.productId, item.quantity - 1);
    if (!res.success) setActionError(res.message);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setActionError('');
    setUpdatingId(productId);
    const res = await removeItem(productId);
    if (!res.success) setActionError(res.message);
    setUpdatingId(null);
  };

  const handleClear = async () => {
    setActionError('');
    const res = await clearCart();
    if (!res.success) setActionError(res.message);
  };

  /* ── 1. Logged-out State ────────────────────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <main className={styles.loggedOutPage}>
        <div className={styles.loggedOutContainer}>
          <div className={styles.loggedOutVisual}>
            <div className={styles.visualCircles}></div>
            <Lock className={styles.loggedOutIcon} size={64} />
          </div>
          <h1 className={styles.loggedOutTitle}>Your Shopping Cart</h1>
          <p className={styles.loggedOutSubtitle}>
            Your cart is waiting for something awesome.
            <br />
            Sign in to access your saved cart and continue shopping.
          </p>
          <div className={styles.loggedOutActions}>
            <Link to="/login" className={styles.loginBtn}>
              Sign In
            </Link>
            <Link to="/register" className={styles.createAccountBtn}>
              Create Account
            </Link>
          </div>
          <Link to="/" className={styles.loggedOutContinue}>
            &larr; Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* ── 2. Loading State (initial) ─────────────────────────────────────────── */
  if (loading && items.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.pageTitle}>Shopping Cart</h1>
          <div className={styles.skeletonWrapper} aria-label="Loading your cart…">
            <div className={styles.skLine} style={{ height: '80px', marginBottom: '16px' }} />
            <div className={styles.skLine} style={{ height: '80px', marginBottom: '16px' }} />
            <div className={styles.skLine} style={{ height: '80px' }} />
          </div>
        </div>
      </main>
    );
  }

  /* ── 3. Error State ─────────────────────────────────────────────────────── */
  if (error && items.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyCard} role="alert">
            <AlertTriangle className={styles.largeIcon} size={56} />
            <h1 className={styles.title}>Failed to Load Cart</h1>
            <p className={styles.subtitle}>{error}</p>
            <button id="cart-retry-btn" className={styles.primaryBtn} onClick={fetchCart}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── 4. Empty Cart State ────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.emptyCard}>
            <ShoppingBag className={styles.largeIcon} size={64} />
            <h1 className={styles.title}>Your Cart is Empty</h1>
            <p className={styles.subtitle}>
              Your cart is waiting for something awesome.
            </p>
            <Link id="start-shopping-btn" to="/" className={styles.primaryBtn}>
              Explore Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── 5. Populated Cart State ────────────────────────────────────────────── */
  return (
    <main className={styles.page}>
      <div className="container">

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Shopping Cart</h1>
            <p className={styles.itemCountText}>
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            id="clear-cart-btn"
            className={styles.clearBtn}
            onClick={handleClear}
            disabled={loading}
            aria-label="Clear all items from cart"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </header>

        {/* Feedback banners */}
        {actionError && (
          <div className={styles.errorBanner} role="alert">
            ⚠️ {actionError}
          </div>
        )}

        <div className={styles.layout}>

          {/* Left: Items list */}
          <section className={styles.itemsSection} aria-label="Cart items">
            <ul className={styles.itemList}>
              {items.map((item) => {
                const isItemUpdating = updatingId === item.productId;
                const isMaxStock     = item.quantity >= item.stock;

                return (
                  <li key={item.productId} className={styles.itemCard}>
                    {/* Image */}
                    <Link to={`/products/${item.productId}`} className={styles.imageLink}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/120x100/e2e8f0/94a3b8?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                    </Link>

                    {/* Info */}
                    <div className={styles.itemDetails}>
                      <span className={styles.categoryBadge}>{item.category}</span>
                      <Link to={`/products/${item.productId}`} className={styles.itemName}>
                        {item.name}
                      </Link>
                      <span className={styles.unitPrice}>
                        ${item.price.toFixed(2)} each
                      </span>
                      {isMaxStock && (
                        <span className={styles.stockLimitNote}>
                          Max stock reached ({item.stock} available)
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className={styles.quantityCol}>
                      <div className={styles.quantityControl} aria-label="Quantity controls">
                        <button
                          id={`decrease-qty-${item.productId}`}
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleDecrease(item)}
                          disabled={loading || isItemUpdating}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.qtyValue} aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          id={`increase-qty-${item.productId}`}
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleIncrease(item)}
                          disabled={loading || isItemUpdating || isMaxStock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        id={`remove-item-${item.productId}`}
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(item.productId)}
                        disabled={loading || isItemUpdating}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className={styles.subtotalCol}>
                      <span className={styles.subtotalLabel}>Subtotal</span>
                      <span className={styles.subtotalValue}>
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Back link */}
            <div className={styles.bottomNav}>
              <Link id="continue-shopping-link" to="/" className={styles.continueShoppingLink}>
                ← Continue Shopping
              </Link>
            </div>
          </section>

          {/* Right: Order Summary */}
          <aside className={styles.summaryCard} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Estimated Shipping</span>
                <span className={styles.freeBadge}>FREE</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span className={styles.totalValue}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              id="checkout-btn"
              to="/checkout"
              className={styles.checkoutBtn}
            >
              Proceed to Checkout
            </Link>

            <p className={styles.checkoutNote}>
              <ShieldCheck size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}}/> Secure 256-bit SSL encrypted checkout
            </p>
          </aside>

        </div>

      </div>
    </main>
  );
}

export default CartPage;
