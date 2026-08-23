import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

/**
 * ProductCard — displays a single product in the listing grid.
 *
 * Props:
 *   product  { id, name, description, price, image, category, stock }
 */
function ProductCard({ product }) {
  const { id, name, description, price, image, category, stock } = product;

  const inStock    = stock > 0;
  const lowStock   = stock > 0 && stock <= 10;
  const stockLabel = !inStock   ? 'Out of Stock'
                   : lowStock   ? `Only ${stock} left`
                   :              'In Stock';

  return (
    <article className={`${styles.card} ${!inStock ? styles.cardDisabled : ''}`}>
      {/* Product image */}
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={name}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x400/e2e8f0/94a3b8?text=${encodeURIComponent(name)}`;
          }}
        />
        {/* Category badge */}
        <span className={styles.categoryBadge}>{category}</span>
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <h2 className={styles.name} title={name}>
          <Link to={`/products/${id}`} className={styles.stretchedLink} onClick={!inStock ? (e) => e.preventDefault() : undefined}>
            {name}
          </Link>
        </h2>
        <p className={styles.description}>{description}</p>

        {/* Price + stock row */}
        <div className={styles.meta}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          <span
            className={`${styles.stock} ${
              !inStock  ? styles.stockOut  :
              lowStock  ? styles.stockLow  :
                          styles.stockIn
            }`}
          >
            {stockLabel}
          </span>
        </div>

        {/* View Details — explicit button that works independently */}
        <Link
          to={inStock ? `/products/${id}` : '#'}
          onClick={!inStock ? (e) => e.preventDefault() : undefined}
          className={`${styles.btn} ${!inStock ? styles.btnDisabled : ''}`}
          aria-hidden="false"
        >
          {inStock ? 'View Details \u2192' : 'Out of Stock'}
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
