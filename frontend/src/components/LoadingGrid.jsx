import styles from './LoadingGrid.module.css';

/**
 * SkeletonCard — animated placeholder mimicking a ProductCard.
 */
function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineFull}`} />
        <div className={`${styles.line} ${styles.lineMid}`} />
        <div className={styles.meta}>
          <div className={`${styles.line} ${styles.linePrice}`} />
          <div className={`${styles.line} ${styles.lineBadge}`} />
        </div>
        <div className={styles.btn} />
      </div>
    </div>
  );
}

/**
 * LoadingGrid — shows N skeleton cards while products are being fetched.
 */
function LoadingGrid({ count = 8 }) {
  return (
    <ul
      className={styles.grid}
      role="status"
      aria-live="polite"
      aria-label="Loading products…"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.item}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}

export default LoadingGrid;
