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

  const { login, loginWithGoogle, resetPassword } = useAuth();
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
    <div className="fixed inset-0 bg-[#060e20] font-body text-white overflow-auto">
      {/* Antigravity Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#69f6b8]/10 blur-[120px] animate-float mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] animate-float-reverse mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[120px] animate-float mix-blend-screen" style={{ animationDelay: '2s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-[20%] left-[20%] w-24 h-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm animate-float rotate-12" />
        <div className="absolute bottom-[20%] right-[20%] w-32 h-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm animate-float-reverse -rotate-12" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[10%] w-16 h-16 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm animate-float rotate-45" style={{ animationDelay: '3s' }} />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">
          {/* Branding */}
          <div className="mb-8 text-center animate-float-slow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl border border-[#69f6b8]/30 rounded-2xl mb-6 shadow-[0_0_40px_rgba(105,246,184,0.3)] animate-pulse-glow">
              <span className="material-symbols-outlined text-[#69f6b8] text-3xl drop-shadow-[0_0_10px_rgba(105,246,184,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">The Ledger</h1>
            <p className="font-label text-[13px] uppercase tracking-[0.3em] text-[#69f6b8] font-semibold drop-shadow-[0_0_8px_rgba(105,246,184,0.5)]">Wealth Architecture</p>
          </div>

          {/* Card */}
          <div className="bg-[#0f1930]/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-[#69f6b8]/20 shadow-[0_0_50px_rgba(105,246,184,0.1)] hover:shadow-[0_0_60px_rgba(105,246,184,0.15)] transition-shadow duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#69f6b8] to-transparent opacity-50"></div>
            <h2 className="font-headline text-xl font-bold text-white mb-5 drop-shadow-md">
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

            {!resetMode && (
              <>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full h-11 flex items-center justify-center gap-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm mb-4"
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Sign in with Google
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-[#a3aac4] font-medium uppercase tracking-wider">Or</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-label text-[11px] font-semibold text-[#a3aac4] uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-11 px-3.5 bg-[#192540]/80 border-none rounded-lg text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#69f6b8]/50 transition-all"
                  placeholder="name@firm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {!resetMode && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="font-label text-[11px] font-semibold text-[#a3aac4] uppercase tracking-wider">
                      Password
                    </label>
                    <button type="button" onClick={() => { setResetMode(true); setError(''); setResetMessage(''); }}
                      className="font-label text-[11px] font-semibold text-[#69f6b8] hover:text-[#06b77f] transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="w-full h-11 px-3.5 bg-[#192540]/80 border-none rounded-lg text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#69f6b8]/50 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#69f6b8] to-[#06b77f] text-[#005027] font-headline font-extrabold text-[15px] rounded-full hover:opacity-100 hover:shadow-[0_0_25px_rgba(105,246,184,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(105,246,184,0.3)] mt-4">
                {loading ? 'Processing...' : (resetMode ? 'Send Reset Link' : 'Log In')}
              </button>
            </form>

            {resetMode && (
              <div className="mt-5 text-center">
                <button onClick={() => { setResetMode(false); setError(''); setResetMessage(''); }}
                  className="text-[#69f6b8] font-bold text-sm hover:underline">
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

          {!resetMode && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[#a3aac4]">
                New to the platform?
                <Link to="/signup" className="text-[#69f6b8] font-bold hover:underline ml-1">Get Started</Link>
              </p>
            </div>
          )}

          <p className="font-label text-[9px] uppercase tracking-[0.15em] text-[#6d758c] text-center mt-8">
            © 2026 The Ledger. Wealth Architecture.
          </p>
        </div>
      </div>
    </div>
  );
}