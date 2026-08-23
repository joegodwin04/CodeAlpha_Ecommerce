import styles from './EmptyState.module.css';

/**
 * EmptyState — shown when the API returns an empty products array.
 */
function EmptyState() {
  return (
    <div className={styles.wrapper} aria-live="polite">
      <span className={styles.icon} aria-hidden="true">📦</span>
      <h2 className={styles.title}>No products found</h2>
      <p className={styles.message}>
        There are no products in the store yet. Check back soon!
      </p>
    </div>
  );
}

export default EmptyState;
