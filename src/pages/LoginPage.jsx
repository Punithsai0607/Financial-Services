import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />
      <div className="login-bg-grid" />

      <div className="login-container animate-fade-in-up">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Sparkles size={24} />
          </div>
          <h1 className="login-logo-text">Anti-Gravity</h1>
          <p className="login-logo-subtitle">Finance Hub</p>
        </div>

        {/* Login Card */}
        <div className="login-card glass-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error animate-fade-in">
                <Lock size={14} />
                {error}
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <div className="login-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Demo Accounts</span>
          </div>

          <div className="login-demo-accounts">
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => { setEmail('admin@zorvyn.com'); setPassword('admin123'); }}
            >
              <div className="login-demo-avatar admin-avatar">A</div>
              <div>
                <div className="login-demo-name">Admin Account</div>
                <div className="login-demo-email">admin@zorvyn.com</div>
              </div>
            </button>
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => { setEmail('viewer@zorvyn.com'); setPassword('viewer123'); }}
            >
              <div className="login-demo-avatar viewer-avatar">V</div>
              <div>
                <div className="login-demo-name">Viewer Account</div>
                <div className="login-demo-email">viewer@zorvyn.com</div>
              </div>
            </button>
          </div>
        </div>

        <p className="login-footer">
          © 2026 Anti-Gravity Finance. All rights reserved.
        </p>
      </div>
    </div>
  );
}
