import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  LayoutDashboard, 
  Zap, 
  Activity, 
  Container, 
  User, 
  LogIn, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Server,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Navbar({ fetchTasks, loading }) {
  const { user, isAuthenticated, logout, handleDemoLogin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleQuickDemoClick = async () => {
    const res = await handleDemoLogin();
    if (res.success) {
      showToast('Logged in as Divy Mangukiya (24IT047)', 'success');
      navigate('/tasks');
    }
  };

  const handleLogoutClick = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Logo & Profile Tagline */}
        <Link to="/" className="brand-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon-bg">
            <CheckSquare size={22} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="brand-name flex items-center gap-2">
              <span>TaskPulse</span>
              <span className="badge badge-dev font-mono" style={{ fontSize: '0.65rem' }}>
                Full-Stack
              </span>
            </h1>
            <p className="brand-sub">Divy Mangukiya (24IT047) • IT Engineer</p>
          </div>
        </Link>

        {/* Clean Modern Navigation Tabs (No Academic Prac Jargon) */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <CheckSquare size={15} />
            <span>Tasks</span>
          </NavLink>

          <NavLink
            to="/cache"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Zap size={15} style={{ color: '#fbbf24' }} />
            <span>Cache Analytics</span>
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Activity size={15} style={{ color: '#f43f5e' }} />
            <span>Events Engine</span>
          </NavLink>

          <NavLink
            to="/docker"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Container size={15} style={{ color: '#60a5fa' }} />
            <span>Docker</span>
          </NavLink>
        </nav>

        {/* User Authentication & Session Control */}
        <div className="system-status" style={{ gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="navbar-user-badge">
                <div className="navbar-user-avatar">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DM'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span className="navbar-user-name">{user?.name || 'Divy Mangukiya'}</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    {user?.studentId || '24IT047'} • {user?.role || 'IT Engineer'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogoutClick}
                className="btn btn-secondary btn-sm"
                title="Log out from TaskPulse"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickDemoClick}
                className="btn btn-primary btn-sm"
                title="1-Click Evaluation Login as Divy Mangukiya"
              >
                <Sparkles size={14} style={{ color: '#fbbf24' }} />
                <span>⚡ Quick Demo</span>
              </button>

              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={14} />
                <span>Sign In</span>
              </Link>

              <Link to="/register" className="btn btn-secondary btn-sm">
                <User size={14} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
