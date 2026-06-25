import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { ToastContainer } from './components/Toast';

const API_BASE = 'http://localhost:5000/api';

// Inline SVGs for toolbar
const SearchIcon = () => (
  <svg className="search-icon-inside" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, percentCompleted: 0 });
  const [toasts, setToasts] = useState([]);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Filter States
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, dueDate, priority, title

  // Add toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  // Remove toast helper
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch Tasks with query filters
  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      params.append('sortBy', sortBy);

      const response = await fetch(`${API_BASE}/tasks?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
      } else {
        addToast(data.message || 'Failed to load tasks', 'error');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      addToast('Cannot connect to API server.', 'error');
    }
  }, [statusFilter, searchQuery, categoryFilter, sortBy, addToast]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, []);

  // Sync data on load and when filters change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Create Task Action
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      
      if (data.success) {
        addToast('New task added successfully.', 'success');
        fetchTasks();
        fetchStats();
      } else {
        addToast(data.message || 'Failed to add task.', 'error');
      }
    } catch (error) {
      addToast('Network error while adding task.', 'error');
    }
  };

  // Update Task Action (Check, Edit, etc)
  const handleUpdateTask = async (id, updatedFields) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const data = await response.json();
      
      if (data.success) {
        fetchTasks();
        fetchStats();
      } else {
        addToast(data.message || 'Failed to update task.', 'error');
      }
    } catch (error) {
      addToast('Network error while updating task.', 'error');
    }
  };

  // Delete Task Action
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        addToast('Task deleted.', 'info');
        fetchTasks();
        fetchStats();
      } else {
        addToast(data.message || 'Failed to delete task.', 'error');
      }
    } catch (error) {
      addToast('Network error while deleting task.', 'error');
    }
  };

  // Clear All Completed Tasks
  const handleClearCompleted = async () => {
    if (stats.completed === 0) {
      addToast('No completed tasks to clear.', 'info');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tasks/clear-completed`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        addToast(`Cleared ${data.deletedCount} completed tasks.`, 'info');
        fetchTasks();
        fetchStats();
      } else {
        addToast(data.message || 'Failed to clear tasks.', 'error');
      }
    } catch (error) {
      addToast('Network error while clearing completed tasks.', 'error');
    }
  };

  return (
    <>
      {/* Header Panel */}
      <header className="app-header">
        <div className="brand-section">
          <div className="logo-icon" aria-hidden="true" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="brand-title">Focus Flow</h1>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </header>

      {/* Dashboard Section */}
      <Dashboard stats={stats} />

      {/* Input Form Section */}
      <TaskForm onAddTask={handleAddTask} addToast={addToast} />

      {/* Search and Filters Toolbar Section */}
      <section className="glass-panel toolbar-section">
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search tasks by title or details..."
              className="search-input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filters-scroll-row">
          {/* Status Pills */}
          <div className="status-pill-list">
            {['all', 'active', 'completed'].map((status) => (
              <button
                key={status}
                className={`status-pill ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="filter-meta-controls">
            {/* Category Filter */}
            <select
              className="select-input"
              style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health & Fitness</option>
              <option value="Finance">Finance</option>
              <option value="Ideas">Ideas & Notes</option>
              <option value="Other">Other</option>
            </select>

            {/* Sort Dropdown */}
            <select
              className="select-input"
              style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Alphabetical</option>
            </select>

            {/* Clear Completed Action */}
            <button className="clear-completed-btn" onClick={handleClearCompleted}>
              Clear Completed
            </button>
          </div>
        </div>
      </section>

      {/* Task Listing Cards Grid */}
      <main>
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          addToast={addToast}
        />
      </main>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
