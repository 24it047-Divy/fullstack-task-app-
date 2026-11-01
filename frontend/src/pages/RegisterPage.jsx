import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Sparkles, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role: 'IT Engineer',
        studentId: '24IT047',
      });

      if (res.success) {
        showToast(`Account created! Welcome, ${res.user?.name || name}`, 'success');
        navigate('/tasks');
      } else {
        setFormError(res.message || 'Registration failed. Email might already exist.');
      }
    } catch (err) {
      setFormError(err.message || 'Network error during registration.');
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
            <UserPlus size={26} />
          </div>
          <h2>Create TaskPulse Account</h2>
          <p>Join the IT engineering workspace &amp; task management platform</p>
        </div>

        {formError && (
          <div className="field-error" style={{ justifyContent: 'center', fontSize: '0.825rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-fields">
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name
            </label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divy Mangukiya"
                className="form-input icon-padding"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                id="register-email"
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

          <div className="form-row">
            <div className="form-group col-half">
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="form-input icon-padding"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group col-half">
              <label className="form-label" htmlFor="register-confirm">
                Confirm
              </label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="register-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  className="form-input icon-padding"
                  disabled={isSubmitting}
                />
              </div>
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
                <span>Registering account...</span>
              </>
            ) : (
              <span>Create Account</span>
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
          Already have an account?
          <Link to="/login">Sign in here</Link>
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

