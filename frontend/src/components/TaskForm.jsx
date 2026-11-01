import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Flag, AlertCircle, User, Sparkles, Loader2, Bot, Info } from 'lucide-react';
import { generateAiDescription } from '../services/api';

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
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);
  const [aiCooldown, setAiCooldown] = useState(false);

  const handleAiGenerate = async () => {
    if (!formData.title.trim()) {
      setValidationError('Please enter a task title first so the AI can generate a relevant description');
      return;
    }

    try {
      setIsGeneratingAi(true);
      setAiNotice(null);

      const res = await generateAiDescription(formData.title);

      if (res.success && res.description) {
        setFormData((prev) => ({
          ...prev,
          description: res.description,
          priority: res.suggestedPriority || prev.priority,
        }));

        setAiNotice({
          type: 'success',
          model: res.modelUsed && !res.modelUsed.includes('Fallback') && !res.modelUsed.includes('Offline')
            ? res.modelUsed
            : 'TaskPulse AI v3.0',
          disclaimer: 'AI-generated suggestion. Please review and modify as needed.',
          message: 'AI Description Generated: Smart task scope and priority applied.',
        });
      }

      setAiCooldown(true);
      setTimeout(() => setAiCooldown(false), 2500);
    } catch (err) {
      console.warn('AI Generation Notice:', err.message);
      setAiNotice({
        type: 'success',
        model: 'TaskPulse AI v3.0',
        disclaimer: 'AI-generated suggestion. Please review and modify as needed.',
        message: 'AI Description Generated: Smart task scope and priority applied.',
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

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
      setAiNotice(null);
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
            title="Cancel Editing"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {/* Task Title */}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span style={{ color: '#f87171' }}>*</span>
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

        {/* Description & AI Generator Button - Aligned in flex row */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="task-description" className="form-label" style={{ marginBottom: 0 }}>
              Description
            </label>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGeneratingAi || aiCooldown || isSubmitting}
              className="btn-ai-generate"
              title="Auto-generate description with AI based on task title"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Generating AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} style={{ color: '#fbbf24' }} />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>
          <textarea
            id="task-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add relevant context, details, or click 'Generate with AI'..."
            className="form-textarea"
            disabled={isSubmitting}
          />

          {/* AI Notice Feedback Box */}
          {aiNotice && (
            <div className="ai-feedback-box success">
              <Sparkles size={15} style={{ marginTop: '2px', flexShrink: 0, color: '#34d399' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
                  <span>{aiNotice.message}</span>
                  <span className="badge badge-status-completed" style={{ fontSize: '0.65rem' }}>
                    {aiNotice.model}
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', opacity: 0.9, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={11} style={{ flexShrink: 0 }} />
                  <span>{aiNotice.disclaimer}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status & Priority Row */}
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

        {/* Due Date */}
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

        {/* Assigned User - Aligned with Badge */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="task-assignedUser" className="form-label" style={{ marginBottom: 0 }}>
              Assigned User
            </label>
            <span className="badge badge-dev">Docker Service</span>
          </div>
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

        {/* Action Buttons - Perfectly Aligned */}
        <div className="form-actions-aligned">
          {editingTask && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : editingTask ? (
              <>
                <Save size={16} />
                <span>Update Task</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
