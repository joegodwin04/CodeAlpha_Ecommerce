import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';
import useProduct from '../hooks/useProduct';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './ProductDetailPage.module.css';

/* ── Sub-components ─────────────────────────────────────────────────────── */

/** Skeleton loader — mirrors the real detail layout */
function DetailSkeleton() {
  return (
    <div className={styles.skeleton} aria-label="Loading product…" role="status">
      <div className={`${styles.skLine} ${styles.skImage}`} />
      <div className={styles.skBody}>
        <div className={`${styles.skLine} ${styles.skBadge}`} />
        <div className={`${styles.skLine} ${styles.skTitle}`} />
        <div className={`${styles.skLine} ${styles.skPrice}`} />
        <div className={`${styles.skLine} ${styles.skText}`} />
        <div className={`${styles.skLine} ${styles.skText}`} />
        <div className={`${styles.skLine} ${styles.skTextShort}`} />
        <div className={`${styles.skLine} ${styles.skStock}`} />
        <div className={`${styles.skLine} ${styles.skBtn}`} />
      </div>
    </div>
  );
}

/** Stock badge — reuses the same colour logic as ProductCard */
function StockBadge({ stock }) {
  const inStock  = stock > 0;
  const lowStock = stock > 0 && stock <= 10;
  const label    = !inStock  ? 'Out of Stock'
                 : lowStock  ? `Only ${stock} left in stock`
                 :             `In Stock (${stock} available)`;
  const cls      = !inStock  ? styles.stockOut
                 : lowStock  ? styles.stockLow
                 :             styles.stockIn;
  return <span className={`${styles.stockBadge} ${cls}`}>{label}</span>;
}

/* ── Main component ──────────────────────────────────────────────────────── */

/**
 * ProductDetailPage
 * Route: /products/:id
 * Fetches and displays a single product's full details and handles adding to cart.
 */
function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { isLoggedIn } = useAuth();
  const { addItem, loading: cartLoading } = useCart();

  const [quantity, setQuantity]       = useState(1);
  const [adding, setAdding]           = useState(false);
  const [feedback, setFeedback]       = useState(null); // { type: 'success'|'error'|'auth', message: string }

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    if (!isLoggedIn) {
      setFeedback({
        type: 'auth',
        message: 'Please sign in to add this item to your shopping cart.',
      });
      return;
    }

    setAdding(true);
    setFeedback(null);

    const res = await addItem(product.id, quantity);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${quantity} × "${product.name}" added to your cart!`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to add item to cart.',
      });
    }
    setAdding(false);
  };

  return (
    <main className={styles.page}>
      <div className="container">

        {/* ── Back navigation ─────────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.backLink} id="back-to-products">
            <ArrowLeft className={styles.backArrow} size={16} />
            Back to Products
          </Link>
        </nav>

        {/* ── Loading ─────────────────────────────────────────────────── */}
        {loading && <DetailSkeleton />}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className={styles.errorBox} role="alert" aria-live="assertive">
            <AlertTriangle className={styles.errorIcon} size={48} />
            <h1 className={styles.errorTitle}>Product Not Found</h1>
            <p className={styles.errorMessage}>{error}</p>
            <Link to="/" className={styles.errorBtn}>Browse All Products</Link>
          </div>
        )}

        {/* ── Product detail ───────────────────────────────────────────── */}
        {!loading && !error && product && (
          <article className={styles.detail}>

            {/* Left — image */}
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.image}
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/700x500/e2e8f0/94a3b8?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>
            </div>

            {/* Right — info */}
            <div className={styles.infoCol}>
              <h1 className={styles.name}>{product.name}</h1>

              <div className={styles.priceRow}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
                <StockBadge stock={product.stock} />
              </div>

              <p className={styles.description}>{product.description}</p>

              <dl className={styles.meta}>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Category</dt>
                  <dd className={styles.metaValue}>{product.category}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Stock</dt>
                  <dd className={styles.metaValue}>
                    {product.stock > 0 ? `${product.stock} units` : 'Unavailable'}
                  </dd>
                </div>
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Product ID</dt>
                  <dd className={styles.metaValue}>#{product.id}</dd>
                </div>
              </dl>

              {/* Feedback Banner */}
              {feedback && (
                <div
                  className={`${styles.feedbackBanner} ${
                    feedback.type === 'success' ? styles.feedbackSuccess :
                    feedback.type === 'auth'    ? styles.feedbackAuth :
                                                  styles.feedbackError
                  }`}
                  role="alert"
                >
                  <div className={styles.feedbackText}>
                    {feedback.type === 'success' && '✅ '}
                    {feedback.type === 'auth'    && '🔒 '}
                    {feedback.type === 'error'   && '⚠️ '}
                    {feedback.message}
                  </div>
                  {feedback.type === 'success' && (
                    <Link id="view-cart-link" to="/cart" className={styles.bannerCartLink}>
                      View Cart →
                    </Link>
                  )}
                  {feedback.type === 'auth' && (
                    <Link id="login-prompt-link" to="/login" className={styles.bannerLoginLink}>
                      Sign In Now
                    </Link>
                  )}
                </div>
              )}

              {/* Quantity selector & Add to Cart */}
              {product.stock > 0 && (
                <div className={styles.actionRow}>
                  <div className={styles.qtyPicker} aria-label="Select quantity to add">
                    <label htmlFor="product-qty" className={styles.qtyLabel}>Quantity:</label>
                    <div className={styles.qtyControl}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || adding}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.qtyDisplay} id="product-qty">{quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock || adding}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    id={`add-to-cart-${product.id}`}
                    type="button"
                    className={styles.cartBtn}
                    disabled={product.stock === 0 || adding || cartLoading}
                    onClick={handleAddToCart}
                    aria-label={`Add ${quantity} of ${product.name} to cart`}
                  >
                    <ShoppingCart className={styles.cartIcon} size={20} />
                    {adding ? 'Adding to Cart…' : 'Add to Cart'}
                  </button>
                </div>
              )}

              {/* Guarantees */}
              <div className={styles.guaranteeBox}>
                <div className={styles.guaranteeItem}>
                  <ShieldCheck size={18} />
                  <span>1 Year Warranty included</span>
                </div>
                <div className={styles.guaranteeItem}>
                  <Truck size={18} />
                  <span>Free shipping on all orders</span>
                </div>
              </div>

              {product.stock === 0 && (
                <button className={styles.cartBtn} disabled>
                  Out of Stock
                </button>
              )}

            </div>

          </article>
        )}

      </div>
    </main>
  );
}

export default ProductDetailPage;
