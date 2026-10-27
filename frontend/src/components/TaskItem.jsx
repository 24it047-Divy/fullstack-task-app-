import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  User,
} from 'lucide-react';

export const TaskItem = ({ task, onToggleComplete, onEdit, onDeleteTrigger }) => {
  const isCompleted = task.status === 'completed';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-high">High</span>;
      case 'low':
        return <span className="badge badge-low">Low</span>;
      default:
        return <span className="badge badge-medium">Medium</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-status-completed">Completed</span>;
      case 'in-progress':
        return <span className="badge badge-status-progress">In Progress</span>;
      default:
        return <span className="badge badge-status-pending">Pending</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedDueDate = formatDate(task.dueDate);
  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className={`task-card ${isCompleted ? 'task-card-completed' : ''}`}>
      <div className="task-header">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className={`complete-toggle-btn ${
            isCompleted ? 'toggle-active' : ''
          }`}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="text-emerald-400" size={22} />
          ) : (
            <Circle className="text-slate-400" size={22} />
          )}
        </button>

        <div className="task-title-area">
          <h3 className={`task-title ${isCompleted ? 'line-through text-muted' : ''}`}>
            {task.title}
          </h3>
          <div className="task-badges">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>

        <div className="task-actions flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="action-btn edit-btn"
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteTrigger(task)}
            className="action-btn delete-btn"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`task-desc ${isCompleted ? 'text-muted' : ''}`}>
          {task.description}
        </p>
      )}

      <div className="task-footer">
        {formattedDueDate ? (
          <div className={`task-date ${isOverdue ? 'date-overdue' : ''}`}>
            {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
            <span>Due {formattedDueDate}</span>
          </div>
        ) : (
          <span className="task-date-empty">No due date</span>
        )}

        {task.assignedUser && (
          <span className="task-assigned-user flex items-center gap-1 text-xs text-indigo-300">
            <User size={12} /> {task.assignedUser}
          </span>
        )}

        <span className="task-created">
          <Clock size={12} /> {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};
