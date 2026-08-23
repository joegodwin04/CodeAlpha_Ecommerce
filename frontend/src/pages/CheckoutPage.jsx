import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './CheckoutPage.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * CheckoutPage — /checkout
 * Collects shipping details and submits the order created from the user's cart.
 */
function CheckoutPage() {
  const { user, token, isLoggedIn } = useAuth();
  const { items, itemCount, total, loading: cartLoading, fetchCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingName:       user?.name || '',
    shippingAddress:    '',
    shippingCity:       '',
    shippingPostalCode: '',
  });

  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill name if user becomes available
  useEffect(() => {
    if (user?.name && !form.shippingName) {
      setForm((prev) => ({ ...prev, shippingName: user.name }));
    }
  }, [user]);

  /* ── Validation ──────────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.shippingName.trim() || form.shippingName.trim().length < 2) {
      e.shippingName = 'Please enter your full name (at least 2 characters).';
    }
    if (!form.shippingAddress.trim() || form.shippingAddress.trim().length < 5) {
      e.shippingAddress = 'Please enter a valid street address (at least 5 characters).';
    }
    if (!form.shippingCity.trim() || form.shippingCity.trim().length < 2) {
      e.shippingCity = 'Please enter a city name.';
    }
    if (!form.shippingPostalCode.trim() || form.shippingPostalCode.trim().length < 3) {
      e.shippingPostalCode = 'Please enter a valid postal or ZIP code.';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (items.length === 0) {
      setApiError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || 'Failed to place order. Please try again.');
        setSubmitting(false);
        return;
      }

      // Refresh cart state (cart was cleared on the server)
      await fetchCart();

      // Navigate to the order confirmation page
      navigate(`/orders/${data.data.id}`);
    } catch {
      setApiError('Unable to connect to the server. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  /* ── 1. Logged Out State ────────────────────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.noticeCard} role="status">
            <Lock className={styles.noticeIcon} size={56} />
            <h1 className={styles.noticeTitle}>Sign In to Checkout</h1>
            <p className={styles.noticeSubtitle}>
              Please sign in or create an account to complete your order.
            </p>
            <div className={styles.authBtnGroup}>
              <Link id="checkout-login-btn" to="/login" className={styles.primaryBtn}>
                Sign In
              </Link>
              <Link id="checkout-register-btn" to="/register" className={styles.secondaryBtn}>
                Create Account
              </Link>
            </div>
            <Link to="/cart" className={styles.backLink}>
              ← Return to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── 2. Empty Cart State ────────────────────────────────────────────────── */
  if (!cartLoading && items.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.noticeCard}>
            <ShoppingCart className={styles.noticeIcon} size={64} />
            <h1 className={styles.noticeTitle}>Your Cart is Empty</h1>
            <p className={styles.noticeSubtitle}>
              There are no items in your cart to checkout.
            </p>
            <Link id="empty-checkout-shop-btn" to="/" className={styles.primaryBtn}>
              Explore Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── 3. Main Checkout Flow ──────────────────────────────────────────────── */
  return (
    <main className={styles.page}>
      <div className="container">

        {/* Back navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/cart" className={styles.cartBackLink} id="back-to-cart">
            <ArrowLeft className={styles.backArrow} size={16} />
            Back to Cart
          </Link>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Checkout</h1>
          <p className={styles.pageSubtitle}>
            Complete your shipping details to place your order.
          </p>
        </header>

        {apiError && (
          <div className={styles.errorBanner} role="alert">
            ⚠️ {apiError}
          </div>
        )}

        <div className={styles.layout}>

          {/* Left: Shipping Form */}
          <section className={styles.formSection} aria-label="Shipping information">
            <div className={styles.card}>
              <h2 className={styles.cardHeading}>
                <span className={styles.stepNumber}>1</span> Shipping Information
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} noValidate className={styles.form}>

                {/* Full Name */}
                <div className={styles.field}>
                  <label htmlFor="shippingName" className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    id="shippingName"
                    name="shippingName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Jane Smith"
                    value={form.shippingName}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${styles.input} ${errors.shippingName ? styles.inputError : ''}`}
                  />
                  {errors.shippingName && (
                    <span className={styles.fieldError}>{errors.shippingName}</span>
                  )}
                </div>

                {/* Street Address */}
                <div className={styles.field}>
                  <label htmlFor="shippingAddress" className={styles.label}>
                    Street Address *
                  </label>
                  <input
                    id="shippingAddress"
                    name="shippingAddress"
                    type="text"
                    autoComplete="street-address"
                    placeholder="e.g. 123 Tech Avenue, Apt 4B"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${styles.input} ${errors.shippingAddress ? styles.inputError : ''}`}
                  />
                  {errors.shippingAddress && (
                    <span className={styles.fieldError}>{errors.shippingAddress}</span>
                  )}
                </div>

                {/* City & Postal Code Row */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="shippingCity" className={styles.label}>
                      City *
                    </label>
                    <input
                      id="shippingCity"
                      name="shippingCity"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="e.g. San Francisco"
                      value={form.shippingCity}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`${styles.input} ${errors.shippingCity ? styles.inputError : ''}`}
                    />
                    {errors.shippingCity && (
                      <span className={styles.fieldError}>{errors.shippingCity}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="shippingPostalCode" className={styles.label}>
                      Postal / ZIP Code *
                    </label>
                    <input
                      id="shippingPostalCode"
                      name="shippingPostalCode"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="e.g. 94107"
                      value={form.shippingPostalCode}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`${styles.input} ${errors.shippingPostalCode ? styles.inputError : ''}`}
                    />
                    {errors.shippingPostalCode && (
                      <span className={styles.fieldError}>{errors.shippingPostalCode}</span>
                    )}
                  </div>
                </div>

                {/* Payment Simulation Note */}
                <div className={styles.paymentNotice}>
                  <div className={styles.paymentNoticeHeader}>
                    <span className={styles.stepNumber}>2</span> Payment Method
                  </div>
                  <div className={styles.paymentBadge}>
                    <ShieldCheck size={18} /> Standard Checkout (Simulation)
                  </div>
                  <p className={styles.paymentSubtext}>
                    This internship store simulates payment. No real credit card or payment charges will occur.
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={submitting}
                  className={styles.placeOrderBtn}
                >
                  {submitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      Placing Order…
                    </>
                  ) : (
                    `Place Order • $${total.toFixed(2)}`
                  )}
                </button>

              </form>
            </div>
          </section>

          {/* Right: Order Summary */}
          <aside className={styles.summarySection} aria-label="Order summary">
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>
                Order Summary ({itemCount} item{itemCount !== 1 ? 's' : ''})
              </h2>

              <ul className={styles.summaryItemList} aria-label="Cart products list">
                {items.map((item) => (
                  <li key={item.productId} className={styles.summaryItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.summaryItemImg}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/80x60/e2e8f0/94a3b8?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                    <div className={styles.summaryItemDetails}>
                      <span className={styles.summaryItemName}>{item.name}</span>
                      <span className={styles.summaryItemMeta}>
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <span className={styles.summaryItemSubtotal}>
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.summaryTotals}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.freeBadge}>FREE</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Order Total</span>
                  <span className={styles.totalValue}>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.guaranteeBox}>
                <span><Shield size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}} /> Satisfaction Guaranteed</span>
                <span><Truck size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}} /> Fast &amp; Reliable Delivery</span>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </main>
  );
}

export default CheckoutPage;
