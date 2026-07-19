// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// function AdminRegister({ onBack, onLogin }) {
//   const { register } = useAuth();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     gender: '',
//     age: '',
//     height: '',
//     weight: '',
//     adminKey: '',
//     role: 'admin'
//   });
//   const [errs, setErrs] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const ADMIN_SECRET_KEY = "admin123"; // In production, use environment variable

//   const set = (k) => (e) => {
//     setForm(f => ({ ...f, [k]: e.target.value }));
//     setErrs(ev => ({ ...ev, [k]: '' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = 'Full name is required';
//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
//     if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = '10-digit phone number is required';
//     if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
//     if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
//     if (!form.gender) e.gender = 'Gender is required';
//     if (!form.age || isNaN(form.age) || form.age < 1 || form.age > 120) e.age = 'Valid age is required';
//     if (!form.height || isNaN(form.height) || form.height < 50 || form.height > 300) e.height = 'Valid height is required';
//     if (!form.weight || isNaN(form.weight) || form.weight < 10 || form.weight > 500) e.weight = 'Valid weight is required';
//     if (!form.adminKey || form.adminKey !== ADMIN_SECRET_KEY) e.adminKey = 'Invalid admin key';
//     return e;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validate();
//     if (Object.keys(errors).length) {
//       setErrs(errors);
//       return;
//     }

//     setLoading(true);
//     setError('');

//     const userData = {
//       ...form,
//       age: parseInt(form.age),
//       height: parseFloat(form.height),
//       weight: parseFloat(form.weight),
//       allergies: [],
//       bmi: parseFloat((parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)),
//       role: 'admin'
//     };

//     const result = await register(userData);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="register-page admin-register-page">
//       <div className="register-container">
//         <button className="back-btn" onClick={onBack}>← Back</button>
        
//         <div className="register-header">
//           <div className="register-icon">⚙️</div>
//           <h2>Admin Registration</h2>
//           <p>Create administrator account for platform management</p>
//           <div className="info-banner">
//             🔒 Admin registration requires a valid admin key
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="register-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Full Name *</label>
//               <input 
//                 className="form-input" 
//                 placeholder="Your full name" 
//                 value={form.name} 
//                 onChange={set('name')}
//                 style={errs.name ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.name && <div className="form-err">{errs.name}</div>}
//             </div>
//             <div className="form-group">
//               <label className="form-label">Email *</label>
//               <input 
//                 className="form-input" 
//                 type="email" 
//                 placeholder="admin@example.com" 
//                 value={form.email} 
//                 onChange={set('email')}
//                 style={errs.email ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.email && <div className="form-err">{errs.email}</div>}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Phone *</label>
//               <input 
//                 className="form-input" 
//                 placeholder="10-digit number" 
//                 value={form.phone} 
//                 onChange={set('phone')}
//                 style={errs.phone ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.phone && <div className="form-err">{errs.phone}</div>}
//             </div>
//             <div className="form-group">
//               <label className="form-label">Gender *</label>
//               <select 
//                 className="form-select" 
//                 value={form.gender} 
//                 onChange={set('gender')}
//                 style={errs.gender ? { borderColor: 'var(--red)' } : {}}
//               >
//                 <option value="">Select</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errs.gender && <div className="form-err">{errs.gender}</div>}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Age *</label>
//               <input 
//                 className="form-input" 
//                 type="number" 
//                 placeholder="Years" 
//                 value={form.age} 
//                 onChange={set('age')}
//                 style={errs.age ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.age && <div className="form-err">{errs.age}</div>}
//             </div>
//             <div className="form-group">
//               <label className="form-label">Height (cm) *</label>
//               <input 
//                 className="form-input" 
//                 type="number" 
//                 placeholder="e.g. 165" 
//                 value={form.height} 
//                 onChange={set('height')}
//                 style={errs.height ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.height && <div className="form-err">{errs.height}</div>}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Weight (kg) *</label>
//               <input 
//                 className="form-input" 
//                 type="number" 
//                 placeholder="e.g. 65" 
//                 value={form.weight} 
//                 onChange={set('weight')}
//                 style={errs.weight ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.weight && <div className="form-err">{errs.weight}</div>}
//             </div>
//             <div className="form-group">
//               <label className="form-label">Admin Key *</label>
//               <input 
//                 className="form-input" 
//                 type="password" 
//                 placeholder="Enter admin key" 
//                 value={form.adminKey} 
//                 onChange={set('adminKey')}
//                 style={errs.adminKey ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.adminKey && <div className="form-err">{errs.adminKey}</div>}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Password *</label>
//               <input 
//                 className="form-input" 
//                 type="password" 
//                 placeholder="Min 8 characters" 
//                 value={form.password} 
//                 onChange={set('password')}
//                 style={errs.password ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.password && <div className="form-err">{errs.password}</div>}
//             </div>
//             <div className="form-group">
//               <label className="form-label">Confirm Password *</label>
//               <input 
//                 className="form-input" 
//                 type="password" 
//                 placeholder="Re-enter password" 
//                 value={form.confirmPassword} 
//                 onChange={set('confirmPassword')}
//                 style={errs.confirmPassword ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.confirmPassword && <div className="form-err">{errs.confirmPassword}</div>}
//             </div>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" className="register-btn admin-register-btn" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Register as Admin'}
//           </button>

//           <div className="register-footer">
//             Already have an account? <span className="login-link" onClick={onLogin}>Login</span>
//           </div>

//           <div className="demo-credentials">
//             <p><strong>Demo Admin Key:</strong> admin123</p>
//           </div>
//         </form>
//       </div>

//       <style>{`
//         .admin-register-page .register-header h2 {
//           color: #DC2626;
//         }
//         .admin-register-page .login-link {
//           color: #DC2626;
//         }
//         .admin-register-btn {
//           background: #DC2626;
//         }
//         .admin-register-btn:hover:not(:disabled) {
//           background: #B91C1C;
//         }
//         .info-banner {
//           background: #FFF3CD;
//           color: #856404;
//           padding: 10px;
//           border-radius: 8px;
//           font-size: 13px;
//           margin-top: 10px;
//         }
//         .demo-credentials {
//           margin-top: 15px;
//           padding: 10px;
//           background: #FEF2F2;
//           border-radius: 8px;
//           font-size: 12px;
//           color: #374151;
//           text-align: center;
//         }
//         .demo-credentials p {
//           margin: 2px 0;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default AdminRegister;


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AdminRegister({ onBack, onLogin }) {
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
    adminKey: '',
    role: 'admin'
  });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_SECRET_KEY = "admin123";

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
    if (!form.adminKey || form.adminKey !== ADMIN_SECRET_KEY) e.adminKey = 'Invalid admin key';
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
      allergies: [],
      bmi: parseFloat((parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)),
      role: 'admin'
    };

    const result = await register(userData);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="register-page admin-register-page">
      <div className="register-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="register-header">
          <div className="register-icon">⚙️</div>
          <h2>Admin Registration</h2>
          <p>Create administrator account for platform management</p>
          <div className="info-banner">
            🔒 Admin registration requires a valid admin key
          </div>
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
                placeholder="admin@example.com" 
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
              <label className="form-label">Admin Key *</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="Enter admin key" 
                value={form.adminKey} 
                onChange={set('adminKey')}
                style={errs.adminKey ? { borderColor: 'var(--red)' } : {}}
              />
              {errs.adminKey && <div className="form-err">{errs.adminKey}</div>}
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

          {/* Centered Register Button */}
          <div className="button-wrapper">
            <button type="submit" className="register-btn admin-register-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner">⏳</span> Creating Account...
                </>
              ) : (
                '⚙️ Register as Admin'
              )}
            </button>
          </div>

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
          background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 50%, #FECACA 100%);
          padding: 20px;
        }
        .register-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 750px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(220, 38, 38, 0.15);
          position: relative;
          animation: slideUp 0.5s ease;
          max-height: 90vh;
          overflow-y: auto;
        }
        .register-container::-webkit-scrollbar {
          width: 6px;
        }
        .register-container::-webkit-scrollbar-track {
          background: #F1F1F1;
          border-radius: 10px;
        }
        .register-container::-webkit-scrollbar-thumb {
          background: #DC2626;
          border-radius: 10px;
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
        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .register-icon {
          font-size: 56px;
          margin-bottom: 10px;
          display: block;
        }
        .register-header h2 {
          font-size: 24px;
          color: #DC2626;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .register-header p {
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
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 10px 13px;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: #F9FAFB;
          transition: all 0.3s ease;
          outline: none;
        }
        .form-input:focus, .form-select:focus {
          border-color: #DC2626;
          background: white;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .form-input::placeholder {
          color: #9CA3AF;
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
          border-left: 3px solid #DC2626;
        }
        .button-wrapper {
          display: flex;
          justify-content: center;
          margin: 10px 0 5px 0;
        }
        .register-btn {
          padding: 14px 40px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 280px;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        .register-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        .admin-register-btn {
          background: linear-gradient(135deg, #DC2626, #B91C1C);
        }
        .admin-register-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(220, 38, 38, 0.4);
        }
        .register-btn .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .register-footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 10px;
        }
        .login-link {
          color: #DC2626;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .login-link:hover {
          color: #B91C1C;
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .register-container {
            padding: 24px;
            max-height: 95vh;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .register-btn {
            min-width: 100%;
            font-size: 16px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminRegister;