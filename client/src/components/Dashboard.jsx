import React from 'react';

export default function Dashboard({ stats }) {
  const { total = 0, completed = 0, pending = 0, percentCompleted = 0 } = stats;

  // SVG Progress Ring calculations
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Calculate dash offset: if 100% completed, offset is 0. If 0% completed, offset is circumference.
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  const getEncouragingMessage = () => {
    if (total === 0) return { title: 'No tasks yet', desc: 'Create some tasks to start tracking!' };
    if (percentCompleted === 100) return { title: 'All done! 🎉', desc: 'Incredible work! You completed everything.' };
    if (percentCompleted >= 75) return { title: 'Almost there!', desc: 'Just a few more tasks left. Keep going!' };
    if (percentCompleted >= 50) return { title: 'Halfway point!', desc: 'Making solid progress. You got this!' };
    if (percentCompleted >= 25) return { title: 'Good start!', desc: 'Keep building momentum!' };
    return { title: 'Let\'s get to work', desc: 'Focus on your highest priority items.' };
  };

  const message = getEncouragingMessage();

  return (
    <div className="glass-panel dashboard-grid">
      {/* Counters */}
      <div className="stats-card-list">
        <div className="stat-item">
          <span className="stat-val">{total}</span>
          <span className="stat-lbl">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{completed}</span>
          <span className="stat-lbl">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{pending}</span>
          <span className="stat-lbl">Pending</span>
        </div>
      </div>

      {/* Radial Progress Graphic */}
      <div className="progress-container">
        <div className="progress-ring-wrapper">
          <svg width="90" height="90">
            <circle
              className="progress-ring-circle-bg"
              r={normalizedRadius}
              cx="45"
              cy="45"
            />
            <circle
              className="progress-ring-circle-bar"
              r={normalizedRadius}
              cx="45"
              cy="45"
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
            />
          </svg>
          <span className="progress-percent-text">{percentCompleted}%</span>
        </div>
        <div className="progress-msg">
          <span className="progress-title">{message.title}</span>
          <span className="progress-desc">{message.desc}</span>
        </div>
      </div>
    </div>
  );
}
