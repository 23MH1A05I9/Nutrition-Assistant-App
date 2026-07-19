import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function RegisterPage({ onBack }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
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
    activityLevel: '',
    dietaryPreference: '',
    allergies: '',
    role: 'user',
    qualification: '',
    specialization: '',
    experience: ''
  });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrs(ev => ({ ...ev, [k]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone number is required';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.age || isNaN(form.age) || form.age < 1 || form.age > 120) e.age = 'Valid age is required';
    if (!form.height || isNaN(form.height) || form.height < 50 || form.height > 300) e.height = 'Valid height is required';
    if (!form.weight || isNaN(form.weight) || form.weight < 10 || form.weight > 500) e.weight = 'Valid weight is required';
    return e;
  };

  const validateDietitian = () => {
    const e = {};
    if (!form.qualification) e.qualification = 'Qualification is required';
    if (!form.specialization) e.specialization = 'Specialization is required';
    if (!form.experience || isNaN(form.experience)) e.experience = 'Valid experience is required';
    return e;
  };

  const nextStep = () => {
    const errors = validateStep1();
    if (Object.keys(errors).length) {
      setErrs(errors);
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on current step
    let errors = {};
    if (step === 2) {
      errors = validateStep2();
    } else if (step === 3) {
      errors = validateDietitian();
    }
    
    if (Object.keys(errors).length) {
      setErrs(errors);
      return;
    }

    // If step is 2 and role is user, submit
    if (step === 2 && form.role === 'user') {
      errors = validateStep2();
      if (Object.keys(errors).length) {
        setErrs(errors);
        return;
      }
      await submitRegistration();
      return;
    }

    // If step is 2 and role is dietitian, go to step 3
    if (step === 2 && form.role === 'dietitian') {
      errors = validateStep2();
      if (Object.keys(errors).length) {
        setErrs(errors);
        return;
      }
      setStep(3);
      return;
    }

    // If step is 3 (dietitian details)
    if (step === 3) {
      await submitRegistration();
    }
  };

  const submitRegistration = async () => {
    setLoading(true);
    setError('');

    const userData = {
      ...form,
      age: parseInt(form.age),
      height: parseFloat(form.height),
      weight: parseFloat(form.weight),
      allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      bmi: parseFloat((parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)),
      dietitianDetails: form.role === 'dietitian' ? {
        qualification: form.qualification,
        specialization: form.specialization,
        experience: parseInt(form.experience)
      } : null
    };

    const result = await register(userData);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  const renderDietitianFields = () => (
    <div className="animate-in">
      <h3 style={{ marginBottom: 15, color: '#1565C0' }}>🩺 Dietitian Details</h3>
      <div className="form-group">
        <label className="form-label">Qualification *</label>
        <input 
          className="form-input" 
          placeholder="e.g. M.Sc. Nutrition & Dietetics" 
          value={form.qualification} 
          onChange={set('qualification')}
          style={errs.qualification ? { borderColor: 'var(--red)' } : {}}
        />
        {errs.qualification && <div className="form-err" style={{ display: 'block' }}>{errs.qualification}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Specialization *</label>
        <input 
          className="form-input" 
          placeholder="e.g. Weight Management" 
          value={form.specialization} 
          onChange={set('specialization')}
          style={errs.specialization ? { borderColor: 'var(--red)' } : {}}
        />
        {errs.specialization && <div className="form-err" style={{ display: 'block' }}>{errs.specialization}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Years of Experience *</label>
        <input 
          className="form-input" 
          type="number" 
          placeholder="e.g. 5" 
          value={form.experience} 
          onChange={set('experience')}
          style={errs.experience ? { borderColor: 'var(--red)' } : {}}
        />
        {errs.experience && <div className="form-err" style={{ display: 'block' }}>{errs.experience}</div>}
      </div>
    </div>
  );

  const steps = form.role === 'dietitian' 
    ? ['Account', 'Health Profile', 'Dietitian Details'] 
    : ['Account', 'Health Profile'];

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
          Start your <em>wellness journey</em> today
        </div>
        <div className="al-desc">
          Create your personalised profile and get matched with certified dietitians 
          for expert nutrition guidance.
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
          <div className="af-title">Create Account</div>
          <div className="af-sub" style={{ marginBottom: 20 }}>
            Step {step} of {steps.length} — {steps[step - 1]}
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ 
                flex: 1, 
                height: 4, 
                borderRadius: 4, 
                background: i < step ? 'var(--green)' : 'var(--border)',
                transition: 'background .3s'
              }} />
            ))}
          </div>

          {error && (
            <div className="form-err" style={{ display: 'block', marginBottom: 12 }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-in">
              <div className="form-group">
                <label className="form-label">Register as *</label>
                <select className="form-select" value={form.role} onChange={set('role')}>
                  <option value="user">👤 User / Patient</option>
                  <option value="dietitian">🩺 Dietitian</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  className="form-input" 
                  placeholder="Your full name" 
                  value={form.name} 
                  onChange={set('name')}
                  style={errs.name ? { borderColor: 'var(--red)' } : {}}
                />
                {errs.name && <div className="form-err" style={{ display: 'block' }}>{errs.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={form.email} 
                  onChange={set('email')}
                  style={errs.email ? { borderColor: 'var(--red)' } : {}}
                />
                {errs.email && <div className="form-err" style={{ display: 'block' }}>{errs.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  className="form-input" 
                  placeholder="10-digit mobile number" 
                  value={form.phone} 
                  onChange={set('phone')}
                  style={errs.phone ? { borderColor: 'var(--red)' } : {}}
                />
                {errs.phone && <div className="form-err" style={{ display: 'block' }}>{errs.phone}</div>}
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
                  {errs.password && <div className="form-err" style={{ display: 'block' }}>{errs.password}</div>}
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
                  {errs.confirmPassword && <div className="form-err" style={{ display: 'block' }}>{errs.confirmPassword}</div>}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 3 }}>✓ Passwords match</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in">
              <div className="form-row">
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
                  {errs.gender && <div className="form-err" style={{ display: 'block' }}>{errs.gender}</div>}
                </div>
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
                  {errs.age && <div className="form-err" style={{ display: 'block' }}>{errs.age}</div>}
                </div>
              </div>

              <div className="form-row">
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
                  {errs.height && <div className="form-err" style={{ display: 'block' }}>{errs.height}</div>}
                </div>
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
                  {errs.weight && <div className="form-err" style={{ display: 'block' }}>{errs.weight}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select className="form-select" value={form.activityLevel} onChange={set('activityLevel')}>
                  <option value="">Select</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                  <option value="Very Active">Very Active</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dietary Preference</label>
                <select className="form-select" value={form.dietaryPreference} onChange={set('dietaryPreference')}>
                  <option value="">Select</option>
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
                  placeholder="e.g. Peanuts, Gluten, Dairy" 
                  value={form.allergies} 
                  onChange={set('allergies')}
                />
                <div className="form-hint">Separate multiple allergies with commas</div>
              </div>
            </div>
          )}

          {step === 3 && form.role === 'dietitian' && renderDietitianFields()}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>
              {step === 1 ? '← Back to Login' : '← Back'}
            </button>
            {step < steps.length ? (
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={nextStep}>
                Continue →
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }} 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .auth-wrap {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          background: linear-gradient(135deg,#E8F5E9 0%,#F0FFF4 50%,#E3F2FD 100%);
        }
        .auth-left {
          width: 42%;
          background: linear-gradient(160deg,#1B5E20 0%,#2E7D32 50%,#388E3C 100%);
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          right: -80px;
          top: -80px;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(255,255,255,.05);
        }
        .auth-left::after {
          content: '';
          position: absolute;
          left: -60px;
          bottom: -60px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: rgba(139,195,74,.08);
        }
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .auth-form {
          width: 100%;
          max-width: 450px;
        }
        .al-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 44px;
          position: relative;
          z-index: 1;
        }
        .al-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(255,255,255,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .al-brand {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
        .al-sub {
          font-size: 10px;
          color: rgba(255,255,255,.4);
        }
        .al-tagline {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .al-tagline em {
          color: #A5D6A7;
          font-style: normal;
        }
        .al-desc {
          font-size: 13px;
          color: rgba(255,255,255,.55);
          line-height: 1.8;
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }
        .al-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .al-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,.75);
          font-size: 13px;
        }
        .al-feat .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green3);
          flex-shrink: 0;
        }
        .af-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .af-sub {
          font-size: 13px;
          color: var(--ink3);
          margin-bottom: 26px;
        }
        .af-link {
          color: var(--green);
          cursor: pointer;
          font-weight: 600;
        }
        .af-link:hover {
          text-decoration: underline;
        }
        .af-divider {
          text-align: center;
          font-size: 13px;
          color: var(--ink3);
          margin: 14px 0;
        }
        .form-hint {
          font-size: 11px;
          color: var(--ink4);
          margin-top: 3px;
        }
        .animate-in {
          animation: fadeUp .3s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-err {
          font-size: 11px;
          color: var(--red);
          margin-top: 4px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: var(--radius);
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font);
          cursor: pointer;
          border: none;
          transition: all .15s;
          white-space: nowrap;
        }
        .btn-primary {
          background: var(--green);
          color: #fff;
        }
        .btn-primary:hover {
          background: #1B5E20;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-outline {
          background: transparent;
          color: var(--ink2);
          border: 1.5px solid var(--border);
        }
        .btn-outline:hover {
          background: var(--canvas);
          border-color: var(--green);
        }
        @media (max-width: 768px) {
          .auth-left {
            display: none;
          }
          .auth-right {
            padding: 20px;
          }
          .auth-form {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;