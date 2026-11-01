import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckSquare, FolderKanban, BarChart3, Mail, RefreshCw, Server, Database, Zap, Container, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ fetchTasks, loading }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-logo">
          <div className="logo-icon-bg">
            <CheckSquare size={22} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="brand-name flex items-center gap-2">
              TaskPulse <span className="badge badge-emerald font-mono text-xs">v3.0 Docker</span>
            </h1>
            <p className="brand-sub">Event-Driven Architecture & Node.js EventEmitter</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <CheckSquare size={16} />
            <span>Tasks</span>
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Zap size={16} className="text-amber-400" />
            <span>Events</span>
            <span className="lazy-tag event">Async</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <FolderKanban size={16} />
            <span>Projects</span>
            <span className="lazy-tag">Lazy</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
            <span className="lazy-tag heavy">Heavy</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Mail size={16} />
            <span>Contact</span>
            <span className="lazy-tag">Lazy</span>
          </NavLink>

          <NavLink
            to="/docker"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Container size={16} className="text-blue-400" />
            <span>Docker</span>
            <span className="lazy-tag" style={{background:'rgba(59,130,246,0.15)',color:'#60a5fa',borderColor:'rgba(59,130,246,0.3)'}}>W11</span>
          </NavLink>

          <NavLink
            to="/cache"
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <Zap size={16} className="text-amber-400" />
            <span>Cache</span>
            <span className="lazy-tag" style={{background:'rgba(245,158,11,0.15)',color:'#fbbf24',borderColor:'rgba(245,158,11,0.3)'}}>RAM</span>
          </NavLink>
        </nav>

        <div className="system-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text flex items-center gap-1">
              <Server size={13} /> localhost:5000 <Database size={13} className="ml-1" /> MongoDB
            </span>
          </div>
          <button
            onClick={() => fetchTasks && fetchTasks(true)}
            className="btn btn-secondary btn-sm"
            title="Refresh Tasks from Backend"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
          </button>

          {/* User Auth Section */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs">
                    {user.name ? user.name.charAt(0) : 'D'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold text-slate-200 leading-tight">{user.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">IT Engineer</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="btn-icon text-slate-400 hover:text-rose-400"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn btn-secondary btn-sm text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <LogIn size={13} /> Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="btn btn-primary btn-sm text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

