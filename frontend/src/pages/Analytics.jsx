import React, { lazy, Suspense } from 'react';
import { BarChart3, ShieldCheck, Zap, Activity } from 'lucide-react';
import { LoadingFallback } from '../components/LoadingFallback';

// Supplementary Task: Lazy load a heavy third-party component
const HeavyAnalyticsChart = lazy(() => import('../components/HeavyAnalyticsChart'));

export default function Analytics({ tasks = [] }) {
  return (
    <div className="analytics-page-container">
      <div className="page-header-card mb-6">
        <span className="badge badge-dev font-mono mb-2 inline-block">Supplementary Problem Solution</span>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-indigo-400" size={24} /> Performance & Product Analytics
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Visualizing MongoDB task metrics using a heavy third-party charting engine (Recharts) code-split into an isolated chunk.
        </p>
      </div>

      {/* Metrics Summary Row */}
      <div className="metrics-row mb-6">
        <div className="metric-box">
          <div className="metric-label">Total Task Records</div>
          <div className="metric-value">{tasks.length}</div>
          <div className="metric-sub text-emerald-400">Synced from MongoDB</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Completed Tasks</div>
          <div className="metric-value text-emerald-400">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <div className="metric-sub">
            {tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}% Completion Rate
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Pending / In-Progress</div>
          <div className="metric-value text-amber-400">
            {tasks.filter(t => t.status !== 'completed').length}
          </div>
          <div className="metric-sub text-amber-400/80">Requires Attention</div>
        </div>
      </div>

      {/* Heavy Chart Lazy Loaded inside Suspense */}
      <Suspense fallback={<LoadingFallback message="Loading heavy charting bundle chunk (Recharts)..." />}>
        <HeavyAnalyticsChart tasks={tasks} />
      </Suspense>
    </div>
  );
}
