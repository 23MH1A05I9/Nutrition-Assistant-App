import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function UserRegister({ onBack, onLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'Moderate',
    dietaryPreference: 'Vegetarian',
    allergies: '',
    role: 'user'
  });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrs(ev => ({ ...ev, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone number is required';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.age || isNaN(form.age) || form.age < 1 || form.age > 120) e.age = 'Valid age is required';
    if (!form.height || isNaN(form.height) || form.height < 50 || form.height > 300) e.height = 'Valid height is required';
    if (!form.weight || isNaN(form.weight) || form.weight < 10 || form.weight > 500) e.weight = 'Valid weight is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setErrs(errors);
      return;
    }

    setLoading(true);
    setError('');

    const userData = {
      ...form,
      age: parseInt(form.age),
      height: parseFloat(form.height),
      weight: parseFloat(form.weight),
      allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      bmi: parseFloat((parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)),
      role: 'user'
    };

    const result = await register(userData);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="register-header">
          <div className="register-icon">👤</div>
          <h2>User Registration</h2>
          <p>Create your account to track health and book appointments</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                className="form-input" 
                placeholder="Your full name" 
                value={form.name} 
                onChange={set('name')}
                style={errs.name ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.name && <div className="form-err">{errs.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="you@example.com" 
                value={form.email} 
                onChange={set('email')}
                style={errs.email ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.email && <div className="form-err">{errs.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input 
                className="form-input" 
                placeholder="10-digit number" 
                value={form.phone} 
                onChange={set('phone')}
                style={errs.phone ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.phone && <div className="form-err">{errs.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select 
                className="form-select" 
                value={form.gender} 
                onChange={set('gender')}
                style={errs.gender ? { borderColor: 'var(--red)' } : {}}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errs.gender && <div className="form-err">{errs.gender}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input 
                className="form-input" 
                type="number" 
                placeholder="Years" 
                value={form.age} 
                onChange={set('age')}
                style={errs.age ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.age && <div className="form-err">{errs.age}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm) *</label>
              <input 
                className="form-input" 
                type="number" 
                placeholder="e.g. 165" 
                value={form.height} 
                onChange={set('height')}
                style={errs.height ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.height && <div className="form-err">{errs.height}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <input 
                className="form-input" 
                type="number" 
                placeholder="e.g. 65" 
                value={form.weight} 
                onChange={set('weight')}
                style={errs.weight ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.weight && <div className="form-err">{errs.weight}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <select className="form-select" value={form.activityLevel} onChange={set('activityLevel')}>
                <option value="Sedentary">Sedentary</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Active">Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dietary Preference</label>
              <select className="form-select" value={form.dietaryPreference} onChange={set('dietaryPreference')}>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Allergies</label>
              <input 
                className="form-input" 
                placeholder="Peanuts, Gluten, Dairy" 
                value={form.allergies} 
                onChange={set('allergies')}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Min 8 characters" 
                value={form.password} 
                onChange={set('password')}
                style={errs.password ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.password && <div className="form-err">{errs.password}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Re-enter password" 
                value={form.confirmPassword} 
                onChange={set('confirmPassword')}
                style={errs.confirmPassword ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.confirmPassword && <div className="form-err">{errs.confirmPassword}</div>}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-btn user-register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create User Account'}
          </button>

          <div className="register-footer">
            Already have an account? <span className="login-link" onClick={onLogin}>Login</span>
          </div>
        </form>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8F5E9 0%, #F0FFF4 50%, #E3F2FD 100%);
          padding: 20px;
        }
        .register-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 700px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          position: relative;
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
        }
        .back-btn:hover {
          color: #111827;
        }
        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .register-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .register-header h2 {
          font-size: 24px;
          color: #111827;
          margin: 0;
        }
        .register-header p {
          color: #6B7280;
          font-size: 14px;
          margin-top: 5px;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        }
        .form-input, .form-select {
          width: 100%;
          padding: 10px 13px;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: white;
          transition: border .15s;
          outline: none;
        }
        .form-input:focus, .form-select:focus {
          border-color: #2E8B57;
        }
        .form-err {
          font-size: 11px;
          color: #DC2626;
          margin-top: 3px;
        }
        .error-message {
          background: #FEF2F2;
          color: #DC2626;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
        }
        .register-btn {
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: opacity 0.3s ease;
          margin-top: 5px;
        }
        .register-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .user-register-btn {
          background: #2E8B57;
        }
        .user-register-btn:hover:not(:disabled) {
          background: #1B5E20;
        }
        .register-footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 15px;
        }
        .login-link {
          color: #2E8B57;
          font-weight: 600;
          cursor: pointer;
        }
        .login-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .register-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default UserRegister;