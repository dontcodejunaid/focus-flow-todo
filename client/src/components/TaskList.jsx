import React from 'react';
import TaskCard from './TaskCard';

const EmptyIcon = () => (
  <svg className="empty-state-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17h6" />
    <path d="M9 12h6" />
    <path d="M9 7h4" />
  </svg>
);

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, addToast }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel empty-state-card">
        <EmptyIcon />
        <h3 className="empty-state-title">No Tasks Found</h3>
        <p>Try adding a new task, searching, or adjusting your filter settings!</p>
      </div>
    );
  }

  return (
    <div className="task-grid-container">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          addToast={addToast}
        />
      ))}
    </div>
  );
}
