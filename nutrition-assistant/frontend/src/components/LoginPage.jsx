import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isRegister 
      ? await register({ email, password, name: email.split('@')[0] })
      : await login(email, password);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="al-logo">
          <div className="al-icon">🥦</div>
          <div>
            <div className="al-brand">NutriAssist</div>
            <div className="al-sub">Health & Wellness Platform</div>
          </div>
        </div>
        <div className="al-tagline">
          Your personal <em>nutrition guide</em> to a healthier life
        </div>
        <div className="al-desc">
          Track meals, monitor progress, connect with expert dietitians, 
          and achieve your health goals with AI-powered nutrition insights.
        </div>
        <div className="al-features">
          <div className="al-feat"><div className="dot" />Personalised meal plans from certified dietitians</div>
          <div className="al-feat"><div className="dot" />Real-time calorie & nutrition tracking</div>
          <div className="al-feat"><div className="dot" />BMI & weight progress monitoring</div>
          <div className="al-feat"><div className="dot" />Book consultations instantly</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form animate-in">
          <div className="af-title">{isRegister ? 'Create Account' : 'Welcome back'}</div>
          <div className="af-sub">
            {isRegister 
              ? 'Start your wellness journey today' 
              : 'Sign in to your NutriAssist account'}
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-input" 
                  placeholder="Your full name"
                  value={email.split('@')[0]}
                  onChange={(e) => setEmail(e.target.value + '@example.com')}
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="form-err" style={{ display: 'block', marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full">
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="af-divider">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <span className="af-link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign in' : 'Register now'}
            </span>
          </div>

          <div style={{ 
            background: "var(--green-pale)", 
            border: "1px solid var(--green-mid)", 
            borderRadius: "var(--radius)", 
            padding: "10px 12px", 
            fontSize: 11, 
            color: "#1B5E20" 
          }}>
            <strong>Demo Accounts:</strong><br/>
            User: user@demo.com / password123<br/>
            Admin: admin@demo.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;