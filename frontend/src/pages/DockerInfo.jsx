import React, { useState } from 'react';
import { Container, Server, Database, Globe, CheckCircle2, Terminal, Copy, Check } from 'lucide-react';

const services = [
  {
    name: 'frontend',
    label: 'React Frontend',
    icon: Globe,
    image: 'nginx:1.27-alpine',
    port: '80',
    color: 'indigo',
    description: 'React 18 + Vite built into a static bundle, served by Nginx with SPA routing and gzip compression.',
    dockerfile: 'Multi-stage: Node 20 builder → Nginx 1.27 runner',
  },
  {
    name: 'backend',
    label: 'Node.js API',
    icon: Server,
    image: 'node:20-alpine',
    port: '5000',
    color: 'emerald',
    description: 'Express REST API with EventEmitter notification engine. Waits for MongoDB via healthcheck before starting.',
    dockerfile: 'Multi-stage: deps install → non-root runtime',
  },
  {
    name: 'mongo',
    label: 'MongoDB',
    icon: Database,
    image: 'mongo:6',
    port: '27017 (internal)',
    color: 'amber',
    description: 'Official MongoDB 6 image with a named volume (taskpulse-mongo-data) for persistent data across restarts.',
    dockerfile: 'Official image (no custom Dockerfile)',
  },
];

function CopyBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative group">
      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-emerald-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        title="Copy"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function DockerInfo() {
  return (
    <div className="events-monitor-container">
      {/* Header */}
      <div className="events-header card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Container size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Containerization with Docker</h1>
                <span className="badge badge-amber font-mono">Docker Compose</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Dockerfiles for React (Nginx) & Node/Express backend, orchestrated with a single <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">docker-compose up</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Objective box */}
        <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300">
          <span className="font-semibold text-amber-400">Objective:</span>{' '}
          Write Dockerfiles for both the React frontend and Node/Express backend of the Task Management application.
          Create a Docker Compose file that orchestrates the frontend, backend, and MongoDB containers together.
          The entire application must run with a single{' '}
          <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">docker-compose up</code> command.
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {services.map(svc => {
          const Icon = svc.icon;
          const colorMap = {
            indigo: 'border-indigo-500/30 bg-indigo-500/5',
            emerald: 'border-emerald-500/30 bg-emerald-500/5',
            amber: 'border-amber-500/30 bg-amber-500/5',
          };
          const textMap = {
            indigo: 'text-indigo-400',
            emerald: 'text-emerald-400',
            amber: 'text-amber-400',
          };
          return (
            <div key={svc.name} className={`card border ${colorMap[svc.color]}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={20} className={textMap[svc.color]} />
                <h2 className="font-semibold text-white">{svc.label}</h2>
                <span className={`ml-auto text-xs font-mono ${textMap[svc.color]}`}>:{svc.port}</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">{svc.description}</p>
              <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
                <span className="text-slate-500">image: </span>{svc.image}
              </div>
              <div className="mt-2 p-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
                {svc.dockerfile}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture flow */}
      <div className="card mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={18} className="text-amber-400" />
          <h2 className="font-semibold text-white">Architecture & Startup Sequence</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-mono py-4">
          {[
            { label: 'mongo', note: 'starts first', color: 'text-amber-400 border-amber-500/40 bg-amber-500/5' },
            { label: '→', color: 'text-slate-500', arrow: true },
            { label: 'backend', note: 'waits for mongo healthcheck', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5' },
            { label: '→', color: 'text-slate-500', arrow: true },
            { label: 'frontend', note: 'waits for backend healthcheck', color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/5' },
          ].map((item, i) =>
            item.arrow ? (
              <span key={i} className="text-xl text-slate-600">→</span>
            ) : (
              <div key={i} className={`px-4 py-2 rounded-xl border ${item.color} text-center`}>
                <div className="font-bold">{item.label}</div>
                <div className="text-xs opacity-70 mt-0.5 max-w-[140px]">{item.note}</div>
              </div>
            )
          )}
        </div>
        <div className="mt-3 text-xs text-slate-400 text-center">
          Data persisted in named Docker volume <span className="font-mono text-slate-300">taskpulse-mongo-data</span> · All services on bridge network <span className="font-mono text-slate-300">taskpulse-network</span>
        </div>
      </div>

      {/* Run command */}
      <div className="card mt-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <h2 className="font-semibold text-white">How to Run</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-2">Build and start all containers (first time or after code changes):</p>
            <CopyBlock code="docker-compose up --build" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Start in detached (background) mode:</p>
            <CopyBlock code="docker-compose up -d" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Stop and remove containers:</p>
            <CopyBlock code="docker-compose down" />
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Stop and also remove persistent volume:</p>
            <CopyBlock code="docker-compose down -v" />
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-200">
            🌐 After <code className="font-mono">docker-compose up</code> — visit{' '}
            <span className="font-mono text-white">http://localhost</span> for the app
            and <span className="font-mono text-white">http://localhost:5000</span> for the API.
          </div>
        </div>
      </div>
    </div>
  );
}

