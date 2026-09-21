import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import { useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { LoadingFallback } from './components/LoadingFallback';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';

// Supplementary Task: Minimum-delay lazy loading helper to avoid flickering fallback state
const lazyWithDelay = (importFn, minDelay = 250) => {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, minDelay))
    ]).then(([module]) => module)
  );
};

// Route-based Code Splitting using React.lazy()
const Home = lazyWithDelay(() => import('./pages/Home'));
const Projects = lazyWithDelay(() => import('./pages/Projects'));
const Analytics = lazyWithDelay(() => import('./pages/Analytics'));
const Contact = lazyWithDelay(() => import('./pages/Contact'));

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

  // Handle form submit
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

  // Filter & Sort Logic (Memoized to prevent unnecessary re-renders)
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
    <Router>
      <div className="app-container">
        <ToastContainer />

        {/* Global Navigation Header */}
        <Navbar fetchTasks={fetchTasks} loading={loading} />

        {/* Main Content Area wrapped in Suspense with Fallback UI */}
        <main className="main-content">
          <Suspense fallback={<LoadingFallback message="Loading requested page chunk..." />}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    tasks={tasks}
                    loading={loading}
                    error={error}
                    fetchTasks={fetchTasks}
                    handleFormSubmit={handleFormSubmit}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    isSubmitting={isSubmitting}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    priorityFilter={priorityFilter}
                    setPriorityFilter={setPriorityFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filteredTasks={filteredTasks}
                    handleToggleComplete={handleToggleComplete}
                    handlePromptDelete={handlePromptDelete}
                  />
                }
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analytics" element={<Analytics tasks={tasks} />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>Practical 8 • Code Splitting & Performance Optimization • React.lazy() + Suspense</p>
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
    </Router>
  );
}
