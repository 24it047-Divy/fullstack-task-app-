import React from 'react';
import { TaskItem } from './TaskItem';
import { RefreshCw, Inbox, AlertOctagon } from 'lucide-react';

export const TaskList = ({
  tasks,
  loading,
  error,
  onRetry,
  onToggleComplete,
  onEdit,
  onDeleteTrigger,
}) => {
  if (loading) {
    return (
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card error-card">
        <AlertOctagon size={48} className="text-rose-400 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to Load Tasks</h3>
        <p className="error-message mb-4">{error}</p>
        <p className="text-xs text-slate-400 mb-4">
          Please check if the Express backend server is running on <code>http://localhost:5000</code> and MongoDB is active.
        </p>
        <button onClick={onRetry} className="btn btn-primary">
          <RefreshCw size={16} /> Retry Fetching Tasks
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card empty-card">
        <Inbox size={48} className="text-slate-500 mb-3" />
        <h3 className="empty-title">No Tasks Found</h3>
        <p className="empty-subtitle">
          Get started by adding a task on the form or try adjusting your search/filter parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDeleteTrigger={onDeleteTrigger}
        />
      ))}
    </div>
  );
};
