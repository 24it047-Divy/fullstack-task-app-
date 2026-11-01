import React from 'react';
import { User, Award, Code2, Globe, Cpu, Terminal, ShieldCheck, Sparkles, ExternalLink, Github, Mail, Layers, Zap, Container } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function PortfolioCard() {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const studentName = user ? user.name : 'Divy Mangukiya';
  const studentRole = user ? user.role : 'IT Engineer & Full-Stack Architect';
  const studentEmail = user ? user.email : '24it047.divy@charusat.edu.in';

  const skillTags = [
    { name: 'React 18 & Vite', category: 'Frontend' },
    { name: 'Node.js & Express', category: 'Backend' },
    { name: 'MongoDB & Mongoose', category: 'Database' },
    { name: 'Docker & Compose', category: 'DevOps' },
    { name: 'In-Memory Caching', category: 'Optimization' },
    { name: 'Native EventEmitter', category: 'Architecture' },
    { name: 'GitHub Actions CI/CD', category: 'Automation' },
    { name: 'OpenAI & Gemini API', category: 'AI Services' },
  ];

  const practicalBadges = [
    { id: 'Prac 6', title: 'Full-Stack CRUD API', tech: 'React + Express + MongoDB', status: 'Completed' },
    { id: 'Prac 8', title: 'Lazy Loading & Optimization', tech: 'React.lazy + Code Splitting', status: 'Completed' },
    { id: 'Prac 9', title: 'In-Memory Caching', tech: 'node-cache (TTL 60s)', status: 'Completed' },
    { id: 'Prac 10', title: 'Event-Driven Architecture', tech: 'Native EventEmitter', status: 'Completed' },
    { id: 'Prac 11', title: 'Docker Containerization', tech: 'Multi-stage + Compose', status: 'Completed' },
    { id: 'Prac 12', title: 'Automated CI/CD Pipeline', tech: 'GitHub Actions + Jest', status: 'Completed' },
    { id: 'Prac 13', title: 'AI API Integration', tech: 'OpenAI + Gemini Fallback', status: 'Completed' },
  ];

  return (
    <div className="card portfolio-card mb-6 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex items-start justify-between flex-wrap gap-4 relative z-10 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          {/* Avatar with Status Ring */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-300 font-bold text-2xl font-mono">
                DM
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">{studentName}</h2>
              <span className="badge badge-emerald font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck size={12} /> ID: 24IT047
              </span>
              <span className="badge badge-indigo font-mono text-[11px]">IT Engineer</span>
            </div>
            <p className="text-xs text-indigo-300 font-medium mt-0.5 flex items-center gap-2">
              <span>{studentRole}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Web Development Frameworks (AWDF)</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Passionate Information Technology Engineer specializing in high-performance full-stack web applications, containerized microservices with Docker, asynchronous event-driven engines, and intelligent AI integrations.
            </p>
          </div>
        </div>

        {/* Quick Actions / Auth Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://github.com/24it047-Divy/fullstack-task-app-"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-xs flex items-center gap-1.5"
            title="View Project on GitHub"
          >
            <Github size={14} /> GitHub Repository <ExternalLink size={11} className="opacity-70" />
          </a>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-primary text-xs flex items-center gap-1.5"
            >
              <User size={14} /> Student Login / Demo
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Authenticated Session
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Body: Technical Skills & Academic Track Record */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 relative z-10">
        {/* Engineering Competencies */}
        <div className="lg:col-span-1 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Code2 size={14} className="text-amber-400" /> Engineering Competencies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillTags.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
              >
                {skill.name}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Focus:</span>
            <span className="text-amber-300 font-semibold font-mono">Full-Stack Systems & Architecture</span>
          </div>
        </div>

        {/* Academic Laboratory Milestones Completed */}
        <div className="lg:col-span-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-emerald-400" /> Laboratory Milestones Completed (100%)
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">7 / 7 Practicals Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {practicalBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold font-mono text-indigo-400">{badge.id}</span>
                  <div className="text-[11px] font-semibold text-slate-200 leading-tight mt-0.5">{badge.title}</div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800/60 truncate">
                  {badge.tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

