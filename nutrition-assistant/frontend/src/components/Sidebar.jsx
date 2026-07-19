import React from 'react';
import { useAuth } from '../context/AuthContext';

function Sidebar({ currentPage, setPage }) {
  const { user, logout } = useAuth();

  const navItems = {
    user: [
      { id: 'dashboard', label: 'Dashboard', em: '📊' },
      { id: 'meal-plan', label: 'Meal Plan', em: '🥗' },
      { id: 'recipes', label: 'Recipes', em: '🍴' },
      { id: 'food-search', label: 'Food Search', em: '🔍' },
      { id: 'progress', label: 'Progress Tracker', em: '📈' },
      { id: 'bmi', label: 'BMI Calculator', em: '⚖️' },
      { id: 'calorie-calc', label: 'Calorie Calculator', em: '🔥' },
      { id: 'appointments', label: 'Appointments', em: '📅' },
      { id: 'notifications', label: 'Notifications', em: '🔔' },
      { id: 'profile', label: 'My Profile', em: '👤' },
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', em: '📊' },
      { id: 'manage-users', label: 'Users', em: '👥' },
      { id: 'manage-dietitians', label: 'Dietitians', em: '🩺' },
      { id: 'analytics', label: 'Analytics', em: '📈' },
    ],
    dietitian: [
      { id: 'dashboard', label: 'Dashboard', em: '📊' },
      { id: 'clients', label: 'My Clients', em: '👥' },
      { id: 'meal-plan', label: 'Meal Plans', em: '🥗' },
      { id: 'appointments', label: 'Consultations', em: '📅' },
      { id: 'profile', label: 'My Profile', em: '👤' },
    ]
  };

  const items = navItems[user?.role] || navItems.user;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <div className="sb-icon">🥦</div>
          <div>
            <div className="sb-name">NutriAssist</div>
            <div className="sb-sub">Health & Wellness</div>
          </div>
        </div>
      </div>
      <nav className="sb-nav">
        <div className="sb-sec">
          <div className="sb-sec-label">Main</div>
          {items.map(item => (
            <button 
              key={item.id} 
              className={`sb-item${currentPage === item.id ? ' active' : ''}`} 
              onClick={() => setPage(item.id)}
            >
              <span className="em">{item.em}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-av">{initials}</div>
          <div>
            <div className="sb-uname">{user?.name?.split(' ')[0] || 'User'}</div>
            <div className="sb-urole">{user?.role || 'user'}</div>
          </div>
        </div>
        <button className="sb-logout" onClick={logout}>⬅️ Sign out</button>
      </div>
    </aside>
  );
}

export default Sidebar;