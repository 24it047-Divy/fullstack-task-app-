import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Shield, User, Mail, Lock, Briefcase, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function AuthModal() {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register, handleDemoLogin, loading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: 'Divy Mangukiya',
    email: '',
    password: '',
    role: 'IT Engineer & Full-Stack Architect',
    bio: 'Passionate Information Technology Engineer specializing in high-performance web systems and cloud automation.',
  });

  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authModalMode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        return;
      }
      const res = await login(formData.email, formData.password);
      if (res.success) {
        showToast(res.message || 'Logged in successfully', 'success');
      } else {
        setError(res.message);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please complete all required fields');
        return;
      }
      const res = await register(formData);
      if (res.success) {
        showToast('Account registered and signed in!', 'success');
      } else {
        setError(res.message);
      }
    }
  };

  const onQuickDemo = async () => {
    setError('');
    const res = await handleDemoLogin();
    if (res.success) {
      showToast('Logged in as Divy Mangukiya (IT Engineer Demo Profile)', 'success');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal} style={{ zIndex: 9999 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '92%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              {authModalMode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {authModalMode === 'login' ? 'Sign In to TaskPulse' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-slate-400">Secure JWT Authentication & Portfolio</p>
            </div>
          </div>
          <button onClick={closeAuthModal} className="btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Demo Profile Button (For Evaluation & Demo) */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" /> Evaluation Quick-Demo
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">1-Click</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Instant evaluation login pre-configured with <strong>Divy Mangukiya</strong> IT Engineer profile.
          </p>
          <button
            type="button"
            onClick={onQuickDemo}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : '⚡ Quick Demo as Divy Mangukiya (24IT047)'}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 pb-2 transition-all ${
              authModalMode === 'login'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            className={`flex-1 pb-2 transition-all ${
              authModalMode === 'register'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-indigo-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Divy Mangukiya"
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-indigo-400" /> Professional Title / Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. IT Engineer & Web Developer"
                  className="form-input text-xs"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail size={13} className="text-indigo-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="divy.mangukiya@example.com"
              className="form-input text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} className="text-indigo-400" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : authModalMode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
