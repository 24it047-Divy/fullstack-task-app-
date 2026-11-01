import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Sparkles, User, PlusCircle } from 'lucide-react';
import { StatsHeader } from '../components/StatsHeader';
import { TaskForm } from '../components/TaskForm';
import { TaskFilter } from '../components/TaskFilter';
import { TaskList } from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function TasksPage({
  tasks,
  loading,
  error,
  fetchTasks,
  handleFormSubmit,
  editingTask,
  setEditingTask,
  isSubmitting,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  filteredTasks,
  handleToggleComplete,
  handlePromptDelete
}) {
  const { isAuthenticated, handleDemoLogin, user } = useAuth();
  const { showToast } = useToast();

  const onQuickDemo = async () => {
    const res = await handleDemoLogin();
    if (res.success) {
      showToast('Authenticated as Divy Mangukiya (24IT047)', 'success');
    }
  };

  // If unauthenticated, show protected lock card
  if (!isAuthenticated) {
    return (
      <div className="tasks-lock-card">
        <div className="lock-shield-icon">
          <Lock size={32} />
        </div>
        <h2>Authentication Required</h2>
        <p>
          You must be logged in to view and manage tasks, create assignments, 
          and access the AI task description generator.
        </p>

        <div className="lock-actions-row">
          <button 
            type="button" 
            onClick={onQuickDemo} 
            className="btn btn-primary"
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>⚡ Quick Demo as Divy Mangukiya</span>
          </button>

          <Link to="/login" className="btn btn-secondary">
            <User size={15} /> Sign In to Existing Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page-container">
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
            onEdit={setEditingTask}
            onDeleteTrigger={handlePromptDelete}
          />
        </div>
      </div>
    </div>
  );
}

