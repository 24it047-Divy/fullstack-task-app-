import React, { useState } from 'react';
import { FolderKanban, Layers, CheckCircle2, Clock, Users, ArrowUpRight, Plus, Sparkles, Container } from 'lucide-react';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');

  const initialProjects = [
    {
      id: 'p1',
      title: 'TaskPulse Full-Stack Core',
      category: 'Backend & Frontend',
      description: 'MongoDB persistence, Express REST endpoints, and React optimistic updates architecture.',
      progress: 100,
      tasksCount: 14,
      completedTasks: 14,
      team: ['Alex M.', 'Sarah K.', 'Devin P.'],
      tag: 'Core Tasks'
    },
    {
      id: 'p2',
      title: 'Performance Optimization & Code Splitting',
      category: 'Frontend Engineering',
      description: 'Route-based React.lazy(), Suspense fallbacks, and dynamic third-party chart chunking.',
      progress: 100,
      tasksCount: 8,
      completedTasks: 8,
      team: ['Divy V.', 'AI Assistant'],
      tag: 'Frontend Tasks'
    },
    {
      id: 'p3',
      title: 'Event-Driven Architecture',
      category: 'Backend Engineering',
      description: 'Native Node.js EventEmitter for asynchronous decoupled task notifications without external queue dependencies.',
      progress: 100,
      tasksCount: 10,
      completedTasks: 10,
      team: ['Sarah K.', 'Alex M.'],
      tag: 'Backend Tasks'
    },
    {
      id: 'p4',
      title: 'Containerization with Docker & Docker Compose',
      category: 'DevOps & Infrastructure',
      description: 'Multi-stage Dockerfiles for React (Nginx) and Node.js backend, orchestrated with Docker Compose — single docker-compose up launches the entire stack.',
      progress: 100,
      tasksCount: 6,
      completedTasks: 6,
      team: ['Divy V.', 'DevOps Team'],
      tag: 'DevOps Tasks'
    },
    {
      id: 'p5',
      title: 'Automated CI/CD with GitHub Actions',
      category: 'DevOps & Automation',
      description: 'Continuous Integration workflow executing automated unit and integration tests on push with live status reporting.',
      progress: 100,
      tasksCount: 4,
      completedTasks: 4,
      team: ['Divy V.', 'QA Automation'],
      tag: 'CI/CD Tasks'
    }
  ];

  const filtered = activeTab === 'all'
    ? initialProjects
    : initialProjects.filter(p => p.tag.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="projects-page-container">
      <div className="page-header-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="badge badge-dev font-mono mb-2 inline-block">Lazy Loaded Route Component</span>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="text-indigo-400" size={24} /> Projects & Workspaces
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Organize tasks across multi-tier software projects and track team velocity.
            </p>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> New Workspace
          </button>
        </div>

        {/* Filter Pills */}
        <div className="tab-filters mt-6 flex gap-2 flex-wrap">
          {['all', 'core tasks', 'frontend tasks', 'backend tasks', 'devops tasks', 'ci/cd tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`filter-chip ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid mt-6">
        {filtered.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-card-header">
              <span className="project-tag">{project.tag}</span>
              <span className="project-category">{project.category}</span>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            <div className="project-progress-block">
              <div className="progress-labels">
                <span className="text-xs text-slate-400">Completion</span>
                <span className="text-xs font-bold text-indigo-400">{project.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>

            <div className="project-meta-footer">
              <div className="tasks-stat flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{project.completedTasks} / {project.tasksCount} Tasks</span>
              </div>

              <div className="team-avatars flex items-center gap-1">
                <Users size={14} className="text-slate-400" />
                <span className="text-xs text-slate-300">{project.team.length} Contributors</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
