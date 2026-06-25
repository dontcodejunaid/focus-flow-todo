import React, { useState } from 'react';

// Custom inline SVG icons
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg className="checkbox-check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function TaskCard({ task, onUpdateTask, onDeleteTask, addToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  // Overdue status check
  const checkOverdue = () => {
    if (!task.dueDate || task.isCompleted) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Split date string to avoid timezone parsing deviations
    const [year, month, day] = task.dueDate.split('-');
    const taskDate = new Date(year, month - 1, day);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today;
  };

  const isOverdue = checkOverdue();

  const handleToggleComplete = () => {
    const nextStatus = !task.isCompleted;
    onUpdateTask(task.id, { isCompleted: nextStatus });
    addToast(
      nextStatus ? 'Task completed! Keep it up!' : 'Task set back to active.',
      nextStatus ? 'success' : 'info'
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      addToast('Task title cannot be empty!', 'error');
      return;
    }

    onUpdateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    });

    setIsEditing(false);
    addToast('Task updated successfully.', 'success');
  };

  const handleCancel = () => {
    // Reset values to original task state
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setCategory(task.category);
    setDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Format YYYY-MM-DD to localized date format
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`task-card-item priority-${task.priority}`}>
      {isEditing ? (
        <div className="task-card-edit-form">
          <div className="input-group">
            <label className="input-label">Task Title</label>
            <input
              type="text"
              className="text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="text-input"
              style={{ minHeight: '60px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row-grid" style={{ marginBottom: '0.5rem' }}>
            <div className="input-group">
              <label className="input-label">Priority</label>
              <select
                className="select-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
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
              <label className="input-label">Due Date</label>
              <input
                type="date"
                className="date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="edit-form-buttons">
            <button className="edit-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="edit-btn-save" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      ) : (
        <>
          {/* Column 1: Checkbox */}
          <div className="checkbox-hitbox">
            <input
              type="checkbox"
              className="real-checkbox"
              checked={task.isCompleted}
              onChange={handleToggleComplete}
            />
            <div className="custom-checkbox-face">
              <CheckIcon />
            </div>
          </div>

          {/* Column 2: Task Details */}
          <div className="task-details-col">
            <div className="task-card-title-row">
              <span className={`task-card-title ${task.isCompleted ? 'completed' : ''}`}>
                {task.title}
              </span>
            </div>
            
            {task.description && (
              <p className="task-card-desc" style={{ opacity: task.isCompleted ? 0.6 : 0.9 }}>
                {task.description}
              </p>
            )}

            <div className="task-card-meta-row">
              <span className="meta-badge category">{task.category}</span>
              <span className={`meta-badge priority-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              {task.dueDate && (
                <span className={`meta-badge due-date ${isOverdue ? 'overdue' : ''}`}>
                  <CalendarIcon />
                  {isOverdue ? `Overdue: ` : `Due: `}
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Column 3: Actions */}
          <div className="task-actions-col">
            <button
              className="action-icon-btn edit-btn"
              onClick={() => setIsEditing(true)}
              title="Edit Task"
            >
              <EditIcon />
            </button>
            <button
              className="action-icon-btn delete-btn"
              onClick={() => onDeleteTask(task.id)}
              title="Delete Task"
            >
              <TrashIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
