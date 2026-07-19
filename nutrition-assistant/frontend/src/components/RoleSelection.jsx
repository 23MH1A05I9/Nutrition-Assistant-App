import React from 'react';

function RoleSelection({ onSelectRole }) {
  const roles = [
    {
      id: 'user',
      name: 'User',
      icon: '👤',
      description: 'Track your health, view meal plans, book appointments',
      color: '#2E8B57',
      loginLabel: 'Login as User',
      registerLabel: 'Register as User'
    },
    {
      id: 'dietitian',
      name: 'Dietitian',
      icon: '🩺',
      description: 'Manage clients, create meal plans, schedule consultations',
      color: '#1565C0',
      loginLabel: 'Login as Dietitian',
      registerLabel: 'Register as Dietitian'
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: '⚙️',
      description: 'Manage platform, users, dietitians, and analytics',
      color: '#DC2626',
      loginLabel: 'Login as Admin',
      registerLabel: 'Register as Admin'
    }
  ];

  return (
    <div className="role-selection-wrap">
      <div className="role-selection-container">
        <div className="role-header">
          <div className="role-logo">🥦</div>
          <h1 className="role-title">NutriAssist</h1>
          <p className="role-subtitle">Choose your role to get started</p>
        </div>

        <div className="role-grid">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="role-card"
              style={{ borderColor: role.color }}
            >
              <div className="role-icon" style={{ background: `${role.color}20`, color: role.color }}>
                {role.icon}
              </div>
              <h3 className="role-name">{role.name}</h3>
              <p className="role-description">{role.description}</p>
              <div className="role-buttons">
                <button 
                  className="role-btn login-btn"
                  style={{ background: role.color }}
                  onClick={() => onSelectRole(role.id, 'login')}
                >
                  {role.loginLabel}
                </button>
                <button 
                  className="role-btn register-btn"
                  style={{ borderColor: role.color, color: role.color }}
                  onClick={() => onSelectRole(role.id, 'register')}
                >
                  {role.registerLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="role-footer">
          <p>Already have an account? Choose your role above to login</p>
        </div>
      </div>

      <style>{`
        .role-selection-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8F5E9 0%, #F0FFF4 50%, #E3F2FD 100%);
          padding: 20px;
        }
        .role-selection-container {
          background: white;
          border-radius: 24px;
          padding: 50px 40px;
          max-width: 1000px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .role-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .role-logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .role-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1B5E20;
          margin: 0;
        }
        .role-subtitle {
          color: #6B7280;
          font-size: 16px;
          margin-top: 5px;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .role-card {
          border: 2px solid #E5E7EB;
          border-radius: 16px;
          padding: 30px 20px;
          text-align: center;
          background: white;
          transition: all 0.3s ease;
        }
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .role-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin: 0 auto 15px;
        }
        .role-name {
          font-size: 20px;
          font-weight: 700;
          margin: 10px 0 8px;
          color: #111827;
        }
        .role-description {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.5;
          margin-bottom: 15px;
          min-height: 40px;
        }
        .role-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .role-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          border: none;
        }
        .role-btn:hover {
          opacity: 0.85;
          transform: scale(1.02);
        }
        .login-btn {
          color: white;
        }
        .register-btn {
          background: transparent;
          border: 2px solid;
        }
        .register-btn:hover {
          background: var(--hover-bg);
        }
        .role-footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .role-grid {
            grid-template-columns: 1fr;
          }
          .role-selection-container {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default RoleSelection;