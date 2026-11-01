import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  User, 
  ShieldCheck, 
  Github, 
  ExternalLink, 
  Zap, 
  Container, 
  Activity, 
  Layers, 
  Database, 
  Server, 
  Cpu, 
  ArrowRight, 
  Sparkles,
  GitBranch,
  Terminal,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { user, isAuthenticated, handleDemoLogin, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onQuickDemo = async () => {
    const res = await handleDemoLogin();
    if (res.success) {
      showToast('Authenticated as Divy Mangukiya (24IT047)', 'success');
      navigate('/tasks');
    } else {
      showToast('Demo login unavailable', 'error');
    }
  };

  const competencies = [
    {
      title: 'React 18 & Vite',
      desc: 'Modern declarative frontend with code-splitting, lazy loaded views, and responsive CSS architecture.',
      category: 'Frontend Engineering',
      icon: <Layers size={20} className="text-indigo-400" />,
      bg: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: 'Node.js & Express',
      desc: 'Robust RESTful API design with modular routing, centralized error handlers, and JWT authentication.',
      category: 'Backend Architecture',
      icon: <Server size={20} className="text-emerald-400" />,
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'MongoDB & Mongoose',
      desc: 'NoSQL document store with strict schema validation, automated timestamps, and indexing.',
      category: 'Data Persistence',
      icon: <Database size={20} className="text-amber-400" />,
      bg: 'rgba(245, 158, 11, 0.15)'
    },
    {
      title: 'Docker & Compose',
      desc: 'Multi-stage Dockerfiles and container orchestration uniting frontend Nginx, Node API, and MongoDB.',
      category: 'DevOps & Containers',
      icon: <Container size={20} className="text-blue-400" />,
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      title: 'In-Memory Caching',
      desc: 'Sub-millisecond read optimization with node-cache, 60s TTL, and write-through cache invalidation.',
      category: 'Performance Tuning',
      icon: <Zap size={20} className="text-amber-400" />,
      bg: 'rgba(245, 158, 11, 0.15)'
    },
    {
      title: 'Event-Driven Engine',
      desc: 'Asynchronous event bus built upon native Node.js EventEmitter for decoupled background processing.',
      category: 'System Design',
      icon: <Activity size={20} className="text-rose-400" />,
      bg: 'rgba(244, 63, 94, 0.15)'
    },
    {
      title: 'Automated CI/CD Pipeline',
      desc: 'Continuous integration workflow with GitHub Actions running automated Supertest & Jest suites on every push.',
      category: 'Software Quality',
      icon: <GitBranch size={20} className="text-purple-400" />,
      bg: 'rgba(168, 85, 247, 0.15)'
    },
    {
      title: 'Intelligent AI Scoping',
      desc: 'Dual-model AI assistant with Gemini & OpenAI APIs, providing contextual task scoping and graceful degradation.',
      category: 'AI Integration',
      icon: <Sparkles size={20} className="text-cyan-400" />,
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  ];

  const architectures = [
    {
      title: 'In-Memory Cache & Query Acceleration',
      description: 'Caches frequent MongoDB database reads into process memory. Reduces API response times from 30ms to under 0.5ms with automatic cache key invalidation on POST, PUT, and DELETE operations.',
      link: '/cache',
      linkText: 'Open Cache Benchmark',
      icon: <Zap size={22} className="text-amber-400" />,
      bg: 'rgba(245, 158, 11, 0.12)'
    },
    {
      title: 'Asynchronous Event Notification Engine',
      description: 'Native EventEmitter decoupling client-facing HTTP responses from background logging, metrics calculation, and alert dispatches for maximum throughput.',
      link: '/events',
      linkText: 'Inspect Event Logs',
      icon: <Activity size={22} className="text-rose-400" />,
      bg: 'rgba(244, 63, 94, 0.12)'
    },
    {
      title: 'Multi-Container Docker Architecture',
      description: 'Production-ready container deployment isolating frontend Nginx reverse proxy, Node.js API runtime, and MongoDB service inside a private Docker bridge network.',
      link: '/docker',
      linkText: 'View Docker Setup',
      icon: <Container size={22} className="text-blue-400" />,
      bg: 'rgba(59, 130, 246, 0.12)'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Student Portfolio Profile */}
      <section className="portfolio-hero-card">
        <div className="hero-glow-bg"></div>
        
        <div className="portfolio-header-content">
          <div className="portfolio-identity">
            <div className="portfolio-avatar-box">
              <div className="portfolio-avatar-inner">DM</div>
              <div className="status-active-badge" title="Active Engineering Session"></div>
            </div>

            <div className="portfolio-details">
              <h2>
                <span>Divy Mangukiya</span>
                <span className="badge-id flex items-center gap-1">
                  <ShieldCheck size={13} /> 24IT047
                </span>
                <span className="badge-it-role">IT Engineer</span>
              </h2>

              <p className="portfolio-tagline">
                Information Technology Engineer &amp; Full-Stack Architect
              </p>

              <p className="portfolio-bio">
                Passionate Information Technology student specialized in engineering scalable web platforms, 
                containerized microservice architectures with Docker, ultra-fast in-memory caching systems, 
                asynchronous event streams, and AI-augmented developer workflows.
              </p>
            </div>
          </div>

          {/* Action Buttons Row - Fully aligned */}
          <div className="portfolio-actions">
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/tasks')} 
                className="btn btn-primary"
              >
                <CheckSquare size={16} /> Open Tasks Workspace
              </button>
            ) : (
              <>
                <button 
                  onClick={onQuickDemo} 
                  disabled={loading}
                  className="btn btn-primary"
                  title="One-click demo evaluation"
                >
                  <Sparkles size={16} /> Quick Demo as Divy
                </button>
                <Link to="/login" className="btn btn-secondary">
                  <User size={15} /> Sign In
                </Link>
              </>
            )}

            <a
              href="https://github.com/24it047-Divy/fullstack-task-app-"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Github size={15} /> GitHub Repo <ExternalLink size={12} className="ml-1 opacity-70" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Engineering Competencies */}
      <section className="competencies-section">
        <div className="section-heading-row">
          <h3>
            <Code2 size={20} className="text-indigo-400" />
            Core Engineering Competencies &amp; Arsenal
          </h3>
          <span className="text-xs text-slate-400 font-mono">Full-Stack System Stack</span>
        </div>

        <div className="competencies-grid">
          {competencies.map((item, index) => (
            <div key={index} className="competency-card">
              <div className="competency-icon-box" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <h4 className="competency-title">{item.title}</h4>
              <p className="competency-desc">{item.desc}</p>
              <div className="competency-tech">{item.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* System Architecture Highlights */}
      <section className="competencies-section">
        <div className="section-heading-row">
          <h3>
            <Cpu size={20} className="text-amber-400" />
            System Architecture Highlights
          </h3>
          <span className="text-xs text-slate-400 font-mono">Production Engineering</span>
        </div>

        <div className="architecture-showcase-grid">
          {architectures.map((arch, index) => (
            <div key={index} className="arch-feature-card">
              <div className="arch-card-top">
                <div className="arch-icon-wrapper" style={{ background: arch.bg }}>
                  {arch.icon}
                </div>
                <div>
                  <h4>{arch.title}</h4>
                  <p>{arch.description}</p>
                </div>
              </div>

              <Link to={arch.link} className="btn btn-secondary btn-sm flex items-center justify-between">
                <span>{arch.linkText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

