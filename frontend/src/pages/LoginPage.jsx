import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ShoppingBag, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';


const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * LoginPage — /login
 * Collects email and password.
 * On success, stores the JWT and redirects to home.
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState('');

  /* ── Client-side validation ──────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.password)
      e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[e.target.name]; return next; });
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || 'Login failed. Please try again.');
        return;
      }

      login(data.token, data.user);
      setSuccess(`Welcome back, ${data.user.name}! Redirecting…`);
      setTimeout(() => navigate('/'), 1200);
    } catch {
      setApiError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.splitContainer}>
        
        {/* Left Visual Column */}
        <div className={styles.visualCol}>
          <div className={styles.visualInner}>
            <div className={styles.visualLogo}>TS</div>
            <h1 className={styles.visualTitle}>Your tech,<br />one place.</h1>
            <p className={styles.visualSubtitle}>
              Discover premium electronics and accessories for your perfect setup.
            </p>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><Zap size={16} strokeWidth={2.5} /></span>
                <span>Curated, quality products</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><ShoppingBag size={16} strokeWidth={2.5} /></span>
                <span>Fast, frictionless checkout</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><Package size={16} strokeWidth={2.5} /></span>
                <span>Easy order tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form Column */}
        <div className={styles.formCol}>
          <div className={styles.card}>
            {/* Header */}
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Sign In</h2>
              <p className={styles.cardSubtitle}>Welcome back to TechStore</p>
            </div>

            {/* Success banner */}
            {success && (
              <div className={styles.successBanner} role="status" aria-live="polite">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            {/* API error banner */}
            {apiError && (
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                <AlertCircle size={16} />
                {apiError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="login-password">Password</label>
                  <Link to="/forgot-password" className={styles.switchLink}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
                {loading ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            <p className={styles.switchText}>
              Don&apos;t have an account?{' '}
              <Link id="go-to-register" to="/register" className={styles.switchLink}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
