import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetMode) {
      // Handle password reset
      try {
        setError('');
        setResetMessage('');
        setLoading(true);
        await resetPassword(email);
        setResetMessage('Password reset email sent! Check your inbox.');
      } catch (err) {
        setError('Failed to reset password. ' + err.message);
      }
      setLoading(false);
      return;
    }

    // Handle login
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="background-gradient"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1 className="auth-title">
            {resetMode ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="auth-subtitle">
            {resetMode 
              ? 'Enter your email to receive a reset link' 
              : 'Sign in to your Smart Tracker account'
            }
          </p>
        </div>

        {error && (
          <div className="auth-alert error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="auth-alert success">
            <span className="alert-icon">✓</span>
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!resetMode && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <span>{loading ? 'Processing...' : (resetMode ? 'Send Reset Link' : 'Sign In')}</span>
            <span className="btn-icon">→</span>
          </button>
        </form>

        <div className="auth-links">
          <button 
            onClick={() => {
              setResetMode(!resetMode);
              setError('');
              setResetMessage('');
            }}
            className="link-button"
          >
            {resetMode ? '← Back to Sign In' : 'Forgot Password?'}
          </button>
        </div>

        {!resetMode && (
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/signup" className="link-primary">
              Create Account →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}