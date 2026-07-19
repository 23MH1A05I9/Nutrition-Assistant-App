import React from 'react';

function Topbar({ title, isDarkMode, onToggleDarkMode, onOpenNotifications, onOpenProfile }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <button className="tb-btn" title="Toggle dark mode" onClick={onToggleDarkMode} type="button" aria-pressed={isDarkMode}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button className="tb-btn" title="Notifications" onClick={onOpenNotifications} type="button">
          🔔<span className="tb-dot"></span>
        </button>
        <button className="tb-btn" title="Profile" onClick={onOpenProfile} type="button">👤</button>
      </div>

      <style>{`
        .topbar {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 0 28px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: var(--shadow-sm);
        }
        .topbar-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--green);
          text-transform: capitalize;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tb-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius);
          background: var(--canvas);
          border: 1px solid var(--border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink3);
          font-size: 15px;
          transition: .15s;
          position: relative;
        }
        .tb-btn:hover {
          background: var(--green-pale);
          color: var(--green);
          border-color: var(--green-mid);
        }
        .tb-dot {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--red);
          border: 2px solid #fff;
        }
      `}</style>
    </header>
  );
}

export default Topbar;