import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, AlertTriangle, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './OrderHistoryPage.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * OrderHistoryPage — /orders
 * Displays list of all past orders placed by the authenticated user.
 */
function OrderHistoryPage() {
  const { token, isLoggedIn } = useAuth();

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchOrders = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Failed to fetch order history');
      }

      setOrders(json.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, isLoggedIn]);

  /* ── 1. Logged Out State ────────────────────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.centerCard} role="status">
            <Lock className={styles.largeIcon} size={56} />
            <h1 className={styles.title}>Sign In Required</h1>
            <p className={styles.subtitle}>
              Please sign in to view your previous orders.
            </p>
            <Link id="orders-login-btn" to="/login" className={styles.primaryBtn}>
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
          <h1 className={styles.pageTitle}>My Orders</h1>
          <div className={styles.loadingWrapper} aria-label="Loading orders…">
            <div className={styles.skLine} style={{ height: '90px', marginBottom: '16px' }} />
            <div className={styles.skLine} style={{ height: '90px', marginBottom: '16px' }} />
            <div className={styles.skLine} style={{ height: '90px' }} />
          </div>
        </div>
      </main>
    );
  }

  /* ── 3. Error State ─────────────────────────────────────────────────────── */
  if (error) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.centerCard} role="alert">
            <AlertTriangle className={styles.largeIcon} size={56} />
            <h1 className={styles.title}>Could Not Load Orders</h1>
            <p className={styles.subtitle}>{error}</p>
            <button id="retry-orders-btn" onClick={fetchOrders} className={styles.primaryBtn}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ── 4. Empty State ─────────────────────────────────────────────────────── */
  if (orders.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.centerCard}>
            <Package className={styles.largeIcon} size={64} />
            <h1 className={styles.title}>No Orders Yet</h1>
            <p className={styles.subtitle}>
              You haven't placed any orders with TechStore yet.
            </p>
            <Link id="orders-start-shopping-btn" to="/" className={styles.primaryBtn}>
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ── 5. Populated Order List ────────────────────────────────────────────── */
  return (
    <main className={styles.page}>
      <div className="container">

        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Orders</h1>
            <p className={styles.pageSubtitle}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Link to="/" className={styles.continueLink}>
            <ArrowLeft size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}} /> Continue Shopping
          </Link>
        </header>

        <div className={styles.orderList} role="feed" aria-label="Past orders">
          {orders.map((order) => (
            <article key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderNumber}>Order #{order.id}</span>
                  <span className={styles.orderDate}>Placed on {order.createdAt}</span>
                </div>
                <span className={styles.statusBadge}>{order.status}</span>
              </div>

              <div className={styles.orderBody}>
                <div className={styles.detailCol}>
                  <span className={styles.detailLabel}>Recipient</span>
                  <span className={styles.detailValue}>{order.shippingName}</span>
                </div>

                <div className={styles.detailCol}>
                  <span className={styles.detailLabel}>Destination</span>
                  <span className={styles.detailValue}>{order.shippingCity}</span>
                </div>

                <div className={styles.detailCol}>
                  <span className={styles.detailLabel}>Items</span>
                  <span className={styles.detailValue}>
                    {order.totalUnits || order.itemCount || 1} unit(s)
                  </span>
                </div>

                <div className={styles.detailCol}>
                  <span className={styles.detailLabel}>Total</span>
                  <span className={styles.orderTotal}>${order.totalAmount.toFixed(2)}</span>
                </div>

                <div className={styles.actionCol}>
                  <Link
                    id={`view-order-${order.id}`}
                    to={`/orders/${order.id}`}
                    className={styles.viewOrderBtn}
                  >
                    View Details <ArrowRight size={16} style={{display: 'inline', verticalAlign: 'text-bottom'}} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}

export default OrderHistoryPage;
