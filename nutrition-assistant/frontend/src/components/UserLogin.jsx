// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// function UserLogin({ onBack, onRegister }) {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password, 'user');
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="login-page user-page">
//       <div className="login-container">
//         <button className="back-btn" onClick={onBack}>← Back</button>
        
//         <div className="login-header">
//           <div className="login-icon">👤</div>
//           <h2>User Login</h2>
//           <p>Access your health dashboard and track your progress</p>
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

//           <button type="submit" className="login-btn user-btn" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login as User'}
//           </button>

//           <div className="login-footer">
//             Don't have an account? <span onClick={onRegister} className="register-link">Register</span>
//           </div>

//           <div className="demo-credentials">
//             <p><strong>Demo Credentials:</strong></p>
//             <p>Email: user@demo.com</p>
//             <p>Password: password123</p>
//           </div>
//         </form>
//       </div>

//       <style>{`
//         .user-page .login-header h2 {
//           color: #2E8B57;
//         }
//         .user-btn {
//           background: #2E8B57;
//         }
//         .user-btn:hover:not(:disabled) {
//           background: #1B5E20;
//         }
//         .user-page .register-link {
//           color: #2E8B57;
//         }
//         .user-page .demo-credentials {
//           background: #F0FAF4;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default UserLogin;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function UserLogin({ onBack, onRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, 'user');
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="user-login-page">
      <div className="login-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="login-header">
          <div className="login-icon">👤</div>
          <h2>User Login</h2>
          <p>Access your health dashboard and track your progress</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email"
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

          <button type="submit" className="login-btn user-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              'Login as User'
            )}
          </button>

          <div className="login-footer">
            <p>Don't have an account? <span onClick={onRegister} className="register-link">Register as User</span></p>
          </div>

          {/* <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: user@demo.com</p>
            <p>Password: password123</p>
          </div> */}

          <div className="login-options">
            <button type="button" className="option-btn" onClick={onBack}>
              <span>🩺</span> Login as Dietitian
            </button>
            <button type="button" className="option-btn" onClick={onBack}>
              <span>⚙️</span> Login as Admin
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .user-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%);
          padding: 20px;
        }
        .login-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(46, 139, 87, 0.15);
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
          color: #2E8B57;
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
          color: #2E8B57;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .login-header p {
          color: #6B7280;
          font-size: 14px;
          margin-top: 5px;
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
          border-color: #2E8B57;
          background: white;
          box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
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
        .user-btn {
          background: linear-gradient(135deg, #2E8B57, #1B5E20);
        }
        .user-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(46, 139, 87, 0.3);
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
          color: #2E8B57;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .register-link:hover {
          color: #1B5E20;
          text-decoration: underline;
        }
        .demo-credentials {
          margin-top: 15px;
          padding: 12px 16px;
          background: #E8F5E9;
          border-radius: 8px;
          font-size: 12px;
          color: #374151;
          border-left: 3px solid #2E8B57;
        }
        .demo-credentials p {
          margin: 2px 0;
        }
        .demo-credentials strong {
          color: #2E8B57;
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

export default UserLogin;