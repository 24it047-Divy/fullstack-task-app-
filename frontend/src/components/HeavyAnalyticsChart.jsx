import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, PieChartIcon, Activity, Sparkles } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function HeavyAnalyticsChart({ tasks = [] }) {
  // Compute analytics data from tasks
  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const statusData = [
    { name: 'Pending', count: statusCounts.pending, color: '#f59e0b' },
    { name: 'In Progress', count: statusCounts.in_progress, color: '#3b82f6' },
    { name: 'Completed', count: statusCounts.completed, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'High Priority', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium Priority', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low Priority', value: tasks.filter(t => t.priority === 'low').length },
  ];

  const weeklyTrendData = [
    { day: 'Mon', completed: Math.max(1, Math.floor(tasks.length * 0.2)), created: Math.max(2, Math.floor(tasks.length * 0.3)) },
    { day: 'Tue', completed: Math.max(2, Math.floor(tasks.length * 0.35)), created: Math.max(3, Math.floor(tasks.length * 0.4)) },
    { day: 'Wed', completed: Math.max(3, Math.floor(tasks.length * 0.5)), created: Math.max(2, Math.floor(tasks.length * 0.25)) },
    { day: 'Thu', completed: Math.max(4, Math.floor(tasks.length * 0.6)), created: Math.max(4, Math.floor(tasks.length * 0.45)) },
    { day: 'Fri', completed: Math.max(5, Math.floor(tasks.length * 0.7)), created: Math.max(3, Math.floor(tasks.length * 0.35)) },
    { day: 'Sat', completed: Math.max(3, Math.floor(tasks.length * 0.4)), created: Math.max(1, Math.floor(tasks.length * 0.15)) },
    { day: 'Sun', completed: Math.max(4, Math.floor(tasks.length * 0.65)), created: Math.max(2, Math.floor(tasks.length * 0.2)) },
  ];

  return (
    <div className="heavy-chart-container">
      <div className="chart-banner">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={20} /> Heavy Third-Party Chart Library (Recharts)
            </h2>
            <p className="text-sm text-slate-400">
              This module was lazy-loaded via dynamic <code>import()</code> only when visiting the Analytics route.
            </p>
          </div>
          <span className="badge badge-success font-mono">Lazy-Loaded Chunk OK</span>
        </div>
      </div>

      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" /> Task Status Distribution
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={statusData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title flex items-center gap-2">
            <PieChartIcon size={18} className="text-emerald-400" /> Priority Breakdown
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="chart-card full-width">
          <h3 className="chart-card-title flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-400" /> Weekly Productivity & Velocity Trend
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={weeklyTrendData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="created" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
