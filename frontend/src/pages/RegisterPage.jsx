import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Truck, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * RegisterPage — /register
 * Collects name, email, password, confirmPassword.
 * On success, stores the JWT and redirects to home.
 */
function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', securityQuestion: '', securityAnswer: ''
  });
  const [errors,  setErrors]  = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  /* ── Client-side validation ──────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    if (!form.securityQuestion)
      e.securityQuestion = 'Please select a security question.';
    if (!form.securityAnswer.trim())
      e.securityAnswer = 'Please provide an answer.';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field error on change
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
      const res  = await fetch(`${API_BASE}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     form.name.trim(),
          email:    form.email,
          password: form.password,
          securityQuestion: form.securityQuestion,
          securityAnswer: form.securityAnswer
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || 'Registration failed. Please try again.');
        return;
      }

      // Store token + user in context/localStorage
      login(data.token, data.user);
      setSuccess(`Welcome, ${data.user.name}! Redirecting…`);
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
            <h1 className={styles.visualTitle}>Join TechStore<br />today.</h1>
            <p className={styles.visualSubtitle}>
              Create your account to save your cart, track orders, and enjoy a faster checkout.
            </p>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><Shield size={16} strokeWidth={2.5} /></span>
                <span>Secure & private account</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><Truck size={16} strokeWidth={2.5} /></span>
                <span>Order tracking made easy</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}><Star size={16} strokeWidth={2.5} /></span>
                <span>Exclusive member benefits</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form Column */}
        <div className={styles.formCol}>
          <div className={styles.card}>
            {/* Header */}
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Create an Account</h2>
              <p className={styles.cardSubtitle}>Get started with TechStore</p>
            </div>

            {/* Success banner */}
            {success && (
              <div className={styles.successBanner} role="status" aria-live="polite">
                ✅ {success}
              </div>
            )}

            {/* API error banner */}
            {apiError && (
              <div className={styles.errorBanner} role="alert" aria-live="assertive">
                ⚠️ {apiError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
              </div>

              {/* Security Question */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-sec-q">Security Question</label>
                <select
                  id="reg-sec-q"
                  name="securityQuestion"
                  className={`${styles.input} ${errors.securityQuestion ? styles.inputError : ''}`}
                  value={form.securityQuestion}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="" disabled>Select a question...</option>
                  <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                  <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                  <option value="What was the name of your first school?">What was the name of your first school?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                  <option value="What was your favorite childhood food?">What was your favorite childhood food?</option>
                </select>
                {errors.securityQuestion && <span className={styles.fieldError}>{errors.securityQuestion}</span>}
              </div>

              {/* Security Answer */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-sec-a">Security Answer</label>
                <input
                  id="reg-sec-a"
                  name="securityAnswer"
                  type="text"
                  placeholder="Your answer"
                  className={`${styles.input} ${errors.securityAnswer ? styles.inputError : ''}`}
                  value={form.securityAnswer}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.securityAnswer && <span className={styles.fieldError}>{errors.securityAnswer}</span>}
              </div>

              {/* Email */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
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
                <label className={styles.label} htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-confirm">Confirm Password</label>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <span className={styles.fieldError}>{errors.confirmPassword}</span>
                )}
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <p className={styles.switchText}>
              Already have an account?{' '}
              <Link id="go-to-login" to="/login" className={styles.switchLink}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
