import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './OrderDetailPage.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * OrderDetailPage — /orders/:id
 * Displays full confirmation and details for an individual order.
 */
function OrderDetailPage() {
  const { id } = useParams();
  const { token, isLoggedIn } = useAuth();

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id || !isLoggedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/orders/${id}`, {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || `Failed to load order #${id}`);
        }

        if (!cancelled) {
          setOrder(json.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error loading order details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id, token, isLoggedIn]);

  /* ── 1. Logged Out State ────────────────────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.centerCard} role="status">
            <span className={styles.largeIcon} aria-hidden="true">🔒</span>
            <h1 className={styles.title}>Sign In Required</h1>
            <p className={styles.subtitle}>
              Please sign in to view this order.
            </p>
            <Link id="order-auth-login-btn" to="/login" className={styles.primaryBtn}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── 2. Loading State ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.loadingWrapper} aria-label="Loading order details…">
            <div className={styles.skLine} style={{ height: '36px', width: '250px', marginBottom: '24px' }} />
            <div className={styles.skLine} style={{ height: '140px', marginBottom: '24px' }} />
            <div className={styles.skLine} style={{ height: '240px' }} />
          </div>
        </div>
      </main>
    );
  }

  /* ── 3. Error State ─────────────────────────────────────────────────────── */
  if (error || !order) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.centerCard} role="alert">
            <AlertTriangle className={styles.largeIcon} aria-hidden="true" size={48} />
            <h1 className={styles.title}>Order Not Found</h1>
            <p className={styles.subtitle}>{error || 'The requested order could not be found.'}</p>
            <div className={styles.btnRow}>
              <Link to="/orders" className={styles.primaryBtn}>
                View My Orders
              </Link>
              <Link to="/" className={styles.secondaryBtn}>
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── 4. Main Order View ─────────────────────────────────────────────────── */
  return (
    <main className={styles.page}>
      <div className="container">

        {/* ── Back Navigation ─────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/orders" className={styles.backLink} id="back-to-orders">
            <ArrowLeft className={styles.backArrow} size={16} />
            Back to Orders
          </Link>
        </nav>

        {/* Success Banner */}
        <div className={styles.successBanner} role="status">
          <div className={styles.bannerContent}>
            <span className={styles.checkIcon} aria-hidden="true">🎉</span>
            <div>
              <h1 className={styles.bannerHeading}>Thank you for your order!</h1>
              <p className={styles.bannerSubtext}>
                Your order <strong>#{order.id}</strong> has been received and is currently marked as{' '}
                <span className={styles.statusBadge}>{order.status}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.layout}>

          {/* Left: Order Items */}
          <section className={styles.itemsSection} aria-label="Ordered items list">
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Ordered Items ({order.items.length})</h2>

              <ul className={styles.itemList}>
                {order.items.map((item) => (
                  <li key={item.orderItemId} className={styles.itemRow}>
                    <img
                      src={item.image || 'https://placehold.co/100x80/e2e8f0/94a3b8?text=Product'}
                      alt={item.name}
                      className={styles.itemImg}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/100x80/e2e8f0/94a3b8?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemUnit}>
                        Unit Price: ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className={styles.itemQtyCol}>
                      <span className={styles.itemQtyLabel}>Qty</span>
                      <span className={styles.itemQtyValue}>{item.quantity}</span>
                    </div>

                    <div className={styles.itemSubtotalCol}>
                      <span className={styles.itemSubtotalLabel}>Subtotal</span>
                      <span className={styles.itemSubtotalValue}>
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Right: Order & Shipping Summary */}
          <aside className={styles.summarySection} aria-label="Order summary and shipping details">

            {/* Shipping Information Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Shipping Details</h2>
              <dl className={styles.metaList}>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Recipient</dt>
                  <dd className={styles.metaValue}>{order.shippingName}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Address</dt>
                  <dd className={styles.metaValue}>{order.shippingAddress}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>City</dt>
                  <dd className={styles.metaValue}>{order.shippingCity}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Postal Code</dt>
                  <dd className={styles.metaValue}>{order.shippingPostalCode}</dd>
                </div>
              </dl>
            </div>

            {/* Financial Summary Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Summary</h2>
              <dl className={styles.metaList}>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Order Number</dt>
                  <dd className={styles.metaValue}>#{order.id}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Date Placed</dt>
                  <dd className={styles.metaValue}>{order.createdAt}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Status</dt>
                  <dd className={styles.metaValue}>
                    <span className={styles.statusBadge}>{order.status}</span>
                  </dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Shipping</dt>
                  <dd className={styles.freeBadge}>FREE</dd>
                </div>
                <div className={`${styles.metaRow} ${styles.totalRow}`}>
                  <dt className={styles.totalLabel}>Total Amount</dt>
                  <dd className={styles.totalValue}>${order.totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            {/* Action buttons */}
            <div className={styles.actionBtns}>
              <Link id="view-orders-btn" to="/orders" className={styles.primaryBtn}>
                View Order History
              </Link>
              <Link id="continue-shopping-btn" to="/" className={styles.secondaryBtn}>
                Continue Shopping
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default OrderDetailPage;
