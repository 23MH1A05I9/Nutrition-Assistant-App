import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function DietitianLogin({ onBack, onRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, 'dietitian');
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="dietitian-login-page">
      <div className="login-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="login-header">
          <div className="login-icon">🩺</div>
          <h2>Dietitian Login</h2>
          <p>Manage your clients, create meal plans, and consultations</p>
          <div className="info-banner">
            ⚠️ Your account must be approved by admin before you can login
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

          <button type="submit" className="login-btn dietitian-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              'Login as Dietitian'
            )}
          </button>

          <div className="login-footer">
            <p>Don't have an account? <span onClick={onRegister} className="register-link">Register as Dietitian</span></p>
          </div>

          {/* <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: dietitian@demo.com</p>
            <p>Password: password123</p>
          </div> */}

          <div className="login-options">
            <button type="button" className="option-btn" onClick={onBack}>
              <span>👤</span> Login as User
            </button>
            <button type="button" className="option-btn" onClick={onBack}>
              <span>⚙️</span> Login as Admin
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .dietitian-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
          padding: 20px;
        }
        .login-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(21, 101, 192, 0.2);
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
          color: #1565C0;
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
          color: #1565C0;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .login-header p {
          color: #6B7280;
          font-size: 14px;
          margin-top: 5px;
        }
        .info-banner {
          background: #FFF3CD;
          color: #856404;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-top: 10px;
          border-left: 3px solid #FFC107;
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
          border-color: #1565C0;
          background: white;
          box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
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
        .dietitian-btn {
          background: linear-gradient(135deg, #1565C0, #0D47A1);
        }
        .dietitian-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(21, 101, 192, 0.3);
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
          color: #1565C0;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .register-link:hover {
          color: #0D47A1;
          text-decoration: underline;
        }
        .demo-credentials {
          margin-top: 15px;
          padding: 12px 16px;
          background: #E3F2FD;
          border-radius: 8px;
          font-size: 12px;
          color: #374151;
          border-left: 3px solid #1565C0;
        }
        .demo-credentials p {
          margin: 2px 0;
        }
        .demo-credentials strong {
          color: #1565C0;
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

export default DietitianLogin;