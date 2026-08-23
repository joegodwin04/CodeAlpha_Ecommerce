import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { Lock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Security Q, 3: Reset PW
  
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // STEP 1: Verify Email
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/security-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Error finding account.');
        return;
      }
      
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Security Answer
  const handleVerifyAnswer = async (e) => {
    e.preventDefault();
    if (!securityAnswer) {
      setError('Please provide an answer.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-security-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Incorrect answer.');
        return;
      }
      
      setResetToken(data.resetToken);
      setStep(3);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Error resetting password.');
        return;
      }
      
      setSuccess('Password reset successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.splitContainer}>
        
        {/* Left Visual Column */}
        <div className={styles.visualCol}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
            <Lock size={48} color="white" />
            <h1 className={styles.visualTitle}>Secure your account.</h1>
            <p className={styles.visualSubtitle}>Follow the steps to reset your password and get back to shopping.</p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className={styles.formCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Reset Your Password</h2>
              <p className={styles.cardSubtitle}>
                {step === 1 && "Enter your email to continue."}
                {step === 2 && "Answer your security question."}
                {step === 3 && "Create a new password."}
              </p>
            </div>

            {error && (
              <div className={styles.errorBanner} role="alert">
                ⚠️ {error}
              </div>
            )}
            
            {success && (
              <div className={styles.successBanner} role="status">
                ✅ {success}
              </div>
            )}

            {step === 1 && (
              <form className={styles.form} onSubmit={handleVerifyEmail}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fp-email">Work Email</label>
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="jane@example.com"
                    className={styles.input}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Continuing...' : 'Continue'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form className={styles.form} onSubmit={handleVerifyAnswer}>
                <div className={styles.field}>
                  <label className={styles.label}>Security Question</label>
                  <div style={{ padding: '12px', background: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border)', fontSize: 'var(--text-sm)', color: 'var(--clr-text)', marginBottom: '8px' }}>
                    {securityQuestion}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fp-answer">Security Answer</label>
                  <input
                    id="fp-answer"
                    type="text"
                    placeholder="Your answer"
                    className={styles.input}
                    value={securityAnswer}
                    onChange={(e) => { setSecurityAnswer(e.target.value); setError(''); }}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Answer'}
                </button>
              </form>
            )}

            {step === 3 && (
              <form className={styles.form} onSubmit={handleResetPassword}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fp-new-password">New Password</label>
                  <input
                    id="fp-new-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className={styles.input}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    disabled={loading}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fp-confirm-password">Confirm New Password</label>
                  <input
                    id="fp-confirm-password"
                    type="password"
                    placeholder="Repeat password"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link to="/login" className={styles.switchLink}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
