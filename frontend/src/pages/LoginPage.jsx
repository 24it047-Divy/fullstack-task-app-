import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, handleDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user?.name || 'Engineer'}!`, 'success');
        navigate('/tasks');
      } else {
        setFormError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onQuickDemo = async () => {
    setIsSubmitting(true);
    try {
      const res = await handleDemoLogin();
      if (res.success) {
        showToast('Logged in as Divy Mangukiya (24IT047)', 'success');
        navigate('/tasks');
      } else {
        setFormError('Demo login could not be completed.');
      }
    } catch (err) {
      setFormError('Demo login error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header-section">
          <div className="auth-icon-circle">
            <LogIn size={26} />
          </div>
          <h2>Sign In to TaskPulse</h2>
          <p>Access your task workspace, AI generator, and system analytics</p>
        </div>

        {formError && (
          <div className="field-error" style={{ justifyContent: 'center', fontSize: '0.825rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 24it047.divy@charusat.edu.in"
                className="form-input icon-padding"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input icon-padding"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block"
            style={{ minHeight: '44px' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="auth-divider">Or Evaluator Access</div>

        <button
          type="button"
          onClick={onQuickDemo}
          disabled={isSubmitting}
          className="btn-demo-quick"
        >
          <Sparkles size={16} className="text-amber-400" />
          <span>⚡ Quick Demo as Divy Mangukiya (24IT047)</span>
        </button>

        <div className="auth-switch-prompt">
          Don't have an account?
          <Link to="/register">Create an account</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '-0.5rem' }}>
          <Link to="/" className="text-xs text-slate-400 flex items-center justify-center gap-1 hover:text-white">
            <ArrowLeft size={13} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
