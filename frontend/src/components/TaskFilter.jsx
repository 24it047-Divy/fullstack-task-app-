import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const TaskFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="filter-bar card">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="search-input"
        />
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">
            <Filter size={14} /> Status:
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-priority" className="filter-label">
            Priority:
          </label>
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-sort" className="filter-label">
            <ArrowUpDown size={14} /> Sort:
          </label>
          <select
            id="filter-sort"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
};
