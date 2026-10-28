import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckSquare, FolderKanban, BarChart3, Mail, RefreshCw, Server, Database, Zap, Container } from 'lucide-react';

export function Navbar({ fetchTasks, loading }) {
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
        </div>
      </div>
    </header>
  );
}

