import styles from './ErrorState.module.css';

/**
 * ErrorState — shown when the API request fails.
 *
 * Props:
 *   message   string  — error description
 *   onRetry   fn()    — retry callback
 */
function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.wrapper} role="alert" aria-live="assertive">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>
        {message || 'We could not load the products. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button id="retry-btn" className={styles.btn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
