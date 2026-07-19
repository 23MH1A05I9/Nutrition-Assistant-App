// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// function AdminLogin({ onBack, onRegister }) {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password, 'admin');
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="login-page admin-page">
//       <div className="login-container">
//         <button className="back-btn" onClick={onBack}>← Back</button>
        
//         <div className="login-header">
//           <div className="login-icon">⚙️</div>
//           <h2>Admin Login</h2>
//           <p>Manage platform, users, dietitians, and analytics</p>
//         </div>

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="form-group">
//             <label className="form-label">Email Address</label>
//             <input 
//               type="email" 
//               className="form-input" 
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input 
//               type="password" 
//               className="form-input" 
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" className="login-btn admin-btn" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login as Admin'}
//           </button>

//           <div className="login-footer">
//             Don't have an account? <span onClick={onRegister} className="register-link">Register</span>
//           </div>

//           <div className="demo-credentials">
//             <p><strong>Demo Credentials:</strong></p>
//             <p>Email: admin@demo.com</p>
//             <p>Password: password123</p>
//           </div>
//         </form>
//       </div>

//       <style>{`
//         .admin-page .login-header h2 {
//           color: #DC2626;
//         }
//         .admin-btn {
//           background: #DC2626;
//         }
//         .admin-btn:hover:not(:disabled) {
//           background: #B91C1C;
//         }
//         .admin-page .register-link {
//           color: #DC2626;
//         }
//         .admin-page .demo-credentials {
//           background: #FEF2F2;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default AdminLogin;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminLogin({ onBack, onRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, 'admin');
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="login-header">
          <div className="login-icon">⚙️</div>
          <h2>Admin Login</h2>
          <p>Manage platform, users, dietitians, and analytics</p>
          <div className="info-banner">
            🔒 Admin access is restricted to authorized personnel only
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn admin-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              'Login as Admin'
            )}
          </button>

          <div className="login-footer">
            <p>Don't have an account? <span onClick={onRegister} className="register-link">Register as Admin</span></p>
          </div>

          {/* <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@demo.com</p>
            <p>Password: password123</p>
          </div> */}

          <div className="login-options">
            <button type="button" className="option-btn" onClick={onBack}>
              <span>👤</span> Login as User
            </button>
            <button type="button" className="option-btn" onClick={onBack}>
              <span>🩺</span> Login as Dietitian
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FECACA 100%);
          padding: 20px;
        }
        .login-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(220, 38, 38, 0.15);
          position: relative;
          animation: slideUp 0.5s ease;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: #6B7280;
          cursor: pointer;
          font-size: 14px;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .back-btn:hover {
          color: #DC2626;
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .login-icon {
          font-size: 56px;
          margin-bottom: 10px;
          display: block;
        }
        .login-header h2 {
          font-size: 24px;
          color: #DC2626;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .login-header p {
          color: #6B7280;
          font-size: 14px;
          margin-top: 5px;
        }
        .info-banner {
          background: #FEF2F2;
          color: #991B1B;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 10px;
          border-left: 3px solid #DC2626;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          margin-bottom: 0;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
        }
        .form-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: #F9FAFB;
          transition: all 0.3s ease;
          outline: none;
        }
        .form-input:focus {
          border-color: #DC2626;
          background: white;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .form-input::placeholder {
          color: #9CA3AF;
        }
        .error-message {
          background: #FEF2F2;
          color: #DC2626;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          border-left: 3px solid #DC2626;
        }
        .login-btn {
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-btn {
          background: linear-gradient(135deg, #DC2626, #B91C1C);
        }
        .admin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 10px;
        }
        .register-link {
          color: #DC2626;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .register-link:hover {
          color: #B91C1C;
          text-decoration: underline;
        }
        .demo-credentials {
          margin-top: 15px;
          padding: 12px 16px;
          background: #FEF2F2;
          border-radius: 8px;
          font-size: 12px;
          color: #374151;
          border-left: 3px solid #DC2626;
        }
        .demo-credentials p {
          margin: 2px 0;
        }
        .demo-credentials strong {
          color: #DC2626;
        }
        .login-options {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .option-btn {
          flex: 1;
          padding: 8px 12px;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .option-btn:hover {
          background: #E5E7EB;
          border-color: #9CA3AF;
        }
        @media (max-width: 480px) {
          .login-container {
            padding: 24px;
          }
          .login-header h2 {
            font-size: 20px;
          }
          .login-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;