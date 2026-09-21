import React from 'react';
import { StatsHeader } from '../components/StatsHeader';
import { TaskForm } from '../components/TaskForm';
import { TaskFilter } from '../components/TaskFilter';
import { TaskList } from '../components/TaskList';

export default function Home({
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
  return (
    <div className="home-page-container">
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
    </div>
  );
}
