import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import { useToast } from './context/ToastContext';
import { StatsHeader } from './components/StatsHeader';
import { TaskForm } from './components/TaskForm';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { CheckSquare, RefreshCw, Server, Database, Sparkles } from 'lucide-react';

export function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Confirmation Modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  // Fetch tasks from Node/Express/MongoDB API
  const fetchTasks = useCallback(async (showNotification = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTasks();
      if (response && response.success) {
        setTasks(response.data);
        if (showNotification) {
          showToast('Tasks synchronized with MongoDB server', 'success');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Fetch Tasks Error:', err);
      setError(err.message || 'Unable to connect to backend server');
      showToast(err.message || 'Error fetching tasks from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const response = await createTask(taskData);
      if (response && response.success) {
        // Re-fetch or append to state (synchronize UI with server)
        setTasks((prev) => [response.data, ...prev]);
        showToast('Task created successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to create task');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task edit/update
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      const response = await updateTask(editingTask._id, taskData);
      if (response && response.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? response.data : t))
        );
        setEditingTask(null);
        showToast('Task updated successfully!', 'success');
      } else {
        throw new Error(response.message || 'Failed to update task');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submit (router between Create & Update)
  const handleFormSubmit = async (formData) => {
    if (editingTask) {
      await handleUpdateTask(formData);
    } else {
      await handleCreateTask(formData);
    }
  };

  // Toggle completion status with Optimistic UI update
  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    try {
      const response = await updateTask(task._id, { status: newStatus });
      if (response && response.success) {
        showToast(
          `Task marked as ${newStatus === 'completed' ? 'completed' : 'pending'}`,
          'info'
        );
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      // Rollback on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
      );
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  // Trigger Delete confirmation modal
  const handlePromptDelete = (task) => {
    setTaskToDelete(task);
  };

  // Confirm delete task
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    try {
      const response = await deleteTask(taskToDelete._id);
      if (response && response.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        showToast('Task deleted successfully', 'success');
        setTaskToDelete(null);
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' ? true : task.status === statusFilter;

        const matchesPriority =
          priorityFilter === 'all' ? true : task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority') {
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="app-container">
      <ToastContainer />

      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-logo">
            <div className="logo-icon-bg">
              <CheckSquare size={22} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="brand-name flex items-center gap-2">
                TaskPulse <span className="badge badge-dev font-mono">Prac 6</span>
              </h1>
              <p className="brand-sub">React + Express + MongoDB Full-Stack Integration</p>
            </div>
          </div>

          <div className="system-status">
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-text flex items-center gap-1">
                <Server size={13} /> localhost:5000 <Database size={13} className="ml-1" /> MongoDB
              </span>
            </div>
            <button
              onClick={() => fetchTasks(true)}
              className="btn btn-secondary btn-sm"
              title="Refresh Tasks from Backend"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Visual Stats Overview */}
        <StatsHeader tasks={tasks} />

        {/* Content Layout */}
        <div className="content-grid">
          {/* Left Column: Form */}
          <div className="form-column">
            <TaskForm
              onSubmit={handleFormSubmit}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: List & Filters */}
          <div className="list-column">
            <TaskFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            <TaskList
              tasks={filteredTasks}
              loading={loading}
              error={error}
              onRetry={() => fetchTasks(true)}
              onToggleComplete={handleToggleComplete}
              onEdit={(task) => {
                setEditingTask(task);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeleteTrigger={handlePromptDelete}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Practical 6 Full-Stack Integration • CO1, CO2 / PO3, PO5 • Node.js + Express + Mongoose + React</p>
      </footer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action will permanently remove it from MongoDB and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
