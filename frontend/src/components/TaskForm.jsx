import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Calendar, Flag, AlertCircle, User, Sparkles, Loader2, Bot, Check, Info } from 'lucide-react';
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
          type: res.fallback ? 'fallback' : 'success',
          model: res.modelUsed || 'AI Engine',
          disclaimer: res.disclaimer || 'AI-generated suggestion. Please review and modify as needed.',
          message: res.fallback
            ? 'Contextual Fallback Engine: Generated offline suggestion (Graceful degradation active).'
            : 'AI Description Generated: Editable suggestion applied to form.',
        });
      }

      setAiCooldown(true);
      setTimeout(() => setAiCooldown(false), 2500);
    } catch (err) {
      console.warn('AI Generation Notice:', err.message);
      setAiNotice({
        type: 'fallback',
        model: 'Client Safe Fallback',
        disclaimer: 'AI service temporarily unavailable. You can enter the description manually.',
        message: 'Could not reach AI service. Core task creation remains unaffected.',
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
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="task-description" className="form-label" style={{ marginBottom: 0 }}>
              Description
            </label>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGeneratingAi || aiCooldown || isSubmitting}
              className="text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Auto-generate description with AI based on task title"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 size={13} className="animate-spin text-indigo-400" />
                  <span>Generating AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-amber-400" />
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

          {/* AI Feedback & Responsible AI Disclaimer */}
          {aiNotice && (
            <div className={`mt-2 p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
              aiNotice.type === 'fallback'
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            }`}>
              <Bot size={15} className={`mt-0.5 shrink-0 ${aiNotice.type === 'fallback' ? 'text-amber-400' : 'text-emerald-400'}`} />
              <div className="flex-1">
                <div className="font-medium flex items-center justify-between">
                  <span>{aiNotice.message}</span>
                  <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.5 rounded bg-black/40">
                    {aiNotice.model}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5 flex items-center gap-1">
                  <Info size={11} className="shrink-0" />
                  <span>{aiNotice.disclaimer}</span>
                </p>
              </div>
            </div>
          )}
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
            <span className="badge badge-sm badge-indigo">Docker Service</span>
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

