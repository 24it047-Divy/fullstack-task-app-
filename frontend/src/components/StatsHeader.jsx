import React from 'react';
import { CheckCircle2, Clock, ListTodo, Activity } from 'lucide-react';

export const StatsHeader = ({ tasks = [] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-total">
          <ListTodo size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-pending">
          <Clock size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pending}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-progress">
          <Activity size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgress}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper stat-completed">
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Completed ({percentage}%)</span>
          <span className="stat-value">{completed}</span>
        </div>
      </div>
    </div>
  );
};
