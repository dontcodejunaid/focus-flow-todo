import React, { useState } from 'react';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function TaskForm({ onAddTask, addToast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('Task title is required!', 'error');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Personal');
    setDueDate('');
    
    // Close the panel
    setIsOpen(false);
  };

  return (
    <div className="glass-panel">
      <div className="form-header-row" onClick={() => setIsOpen(!isOpen)}>
        <h3>
          <PlusIcon /> Add New Task
        </h3>
        <svg
          className={`collapse-icon ${isOpen ? 'open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className={`expandable-form-container ${isOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="input-group">
            <label className="input-label" htmlFor="task-title">What needs to be done? *</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Design app interface dashboard"
              className="text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              placeholder="Describe details, steps, or goals..."
              className="text-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row-grid">
            <div className="input-group">
              <label className="input-label">Priority</label>
              <div className="priority-selector-grid">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-option-btn ${p} ${priority === p ? 'active' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="task-category">Category</label>
              <select
                id="task-category"
                className="select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health & Fitness</option>
                <option value="Finance">Finance</option>
                <option value="Ideas">Ideas & Notes</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="task-date">
                <CalendarIcon /> Due Date
              </label>
              <input
                id="task-date"
                type="date"
                className="date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
