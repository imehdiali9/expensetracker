import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      try {
        setError(''); setResetMessage(''); setLoading(true);
        await resetPassword(email);
        setResetMessage('Password reset email sent! Check your inbox.');
      } catch (err) {
        setError('Failed to reset password. ' + err.message);
      }
      setLoading(false);
      return;
    }
    try {
      setError(''); setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#f7f9ff] font-body text-on-background overflow-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary-container/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-surface-container-high/40 blur-[100px]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-primary-container rounded-xl mb-4" style={{ boxShadow: '0 8px 24px -6px rgba(0,109,55,0.15)' }}>
              <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-1">The Ledger</h1>
            <p className="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/60">Wealth Architecture</p>
          </div>

          {/* Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_24px_-4px_rgba(9,29,46,0.08)]">
            <h2 className="font-headline text-lg font-bold text-on-surface mb-5">
              {resetMode ? 'Reset Password' : 'Welcome back'}
            </h2>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                <span className="text-xs">{error}</span>
              </div>
            )}
            {resetMessage && (
              <div className="mb-5 p-3 rounded-lg bg-secondary-container text-on-secondary-container text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-base flex-shrink-0">check_circle</span>
                <span className="text-xs">{resetMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-11 px-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="name@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {!resetMode && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                      Password
                    </label>
                    <button type="button" onClick={() => { setResetMode(true); setError(''); setResetMessage(''); }}
                      className="font-label text-[11px] font-semibold text-primary hover:text-primary-container transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full h-11 px-3.5 bg-surface-container-low border-none rounded-lg text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-sm rounded-full hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-primary/10 mt-2">
                {loading ? 'Processing...' : (resetMode ? 'Send Reset Link' : 'Log In')}
              </button>
            </form>

            {resetMode && (
              <div className="mt-5 text-center">
                <button onClick={() => { setResetMode(false); setError(''); setResetMessage(''); }}
                  className="text-primary font-bold text-sm hover:underline">
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

          {!resetMode && (
            <div className="mt-6 text-center">
              <p className="text-sm text-on-surface-variant">
                New to the platform?
                <Link to="/signup" className="text-primary font-bold hover:underline ml-1">Get Started</Link>
              </p>
            </div>
          )}

          <p className="font-label text-[9px] uppercase tracking-[0.15em] text-outline/60 text-center mt-8">
            © 2024 The Ledger. Wealth Architecture.
          </p>
        </div>
      </div>
    </div>
  );
}