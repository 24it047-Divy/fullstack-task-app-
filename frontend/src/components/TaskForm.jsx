import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Flag, AlertCircle, User } from 'lucide-react';

export const TaskForm = ({ onSubmit, editingTask, onCancelEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedUser: 'Divy (24IT047)',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : '',
        assignedUser: editingTask.assignedUser || 'Divy (24IT047)',
      });
      setValidationError('');
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedUser: 'Divy (24IT047)',
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setValidationError('Please enter a task title');
      return;
    }

    await onSubmit(formData);

    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        assignedUser: 'Divy (24IT047)',
      });
    }
  };

  return (
    <div className="card form-card">
      <div className="form-header">
        <h2 className="form-title">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        {editingTask && (
          <button
            type="button"
            className="btn-icon"
            onClick={onCancelEdit}
            title="Cancel Edit"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className={`form-input ${validationError ? 'input-error' : ''}`}
            disabled={isSubmitting}
            autoFocus
          />
          {validationError && (
            <div className="field-error">
              <AlertCircle size={14} /> {validationError}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add relevant context, details, or sub-tasks..."
            className="form-textarea"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group col-half">
            <label htmlFor="task-status" className="form-label">
              Status
            </label>
            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group col-half">
            <label htmlFor="task-priority" className="form-label">
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-dueDate" className="form-label">
            Due Date
          </label>
          <div className="input-with-icon">
            <Calendar size={16} className="input-icon" />
            <input
              id="task-dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input icon-padding"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="task-assignedUser" className="form-label flex items-center justify-between">
            <span>Assigned User</span>
            <span className="badge badge-sm badge-indigo">Practical 10 Target</span>
          </label>
          <div className="input-with-icon">
            <User size={16} className="input-icon" />
            <input
              id="task-assignedUser"
              type="text"
              name="assignedUser"
              value={formData.assignedUser}
              onChange={handleChange}
              placeholder="e.g. Divy (24IT047)"
              className="form-input icon-padding"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          {editingTask && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="spinner-sm"></span>{' '}
                {editingTask ? 'Saving Changes...' : 'Creating Task...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {editingTask ? <Save size={18} /> : <Plus size={18} />}
                {editingTask ? 'Save Changes' : 'Add Task'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
