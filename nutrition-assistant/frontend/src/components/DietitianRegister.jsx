// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// function DietitianRegister({ onBack, onLogin }) {
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
//     activityLevel: 'Moderate',
//     dietaryPreference: 'Vegetarian',
//     allergies: '',
//     qualification: '',
//     specialization: '',
//     experience: '',
//     role: 'dietitian'
//   });
//   const [errs, setErrs] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

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
//     if (!form.qualification.trim()) e.qualification = 'Qualification is required';
//     if (!form.specialization.trim()) e.specialization = 'Specialization is required';
//     if (!form.experience || isNaN(form.experience) || form.experience < 0) e.experience = 'Valid experience is required';
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
//       allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
//       bmi: parseFloat((parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)),
//       role: 'dietitian',
//       dietitianDetails: {
//         qualification: form.qualification,
//         specialization: form.specialization,
//         experience: parseInt(form.experience)
//       }
//     };

//     const result = await register(userData);
//     setLoading(false);

//     if (!result.success) {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="register-page dietitian-register-page">
//       <div className="register-container">
//         <button className="back-btn" onClick={onBack}>← Back</button>
        
//         <div className="register-header">
//           <div className="register-icon">🩺</div>
//           <h2>Dietitian Registration</h2>
//           <p>Create your professional dietitian account</p>
//           <div className="info-banner">
//             ⚠️ Your account will need admin approval before you can login
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
//                 placeholder="you@example.com" 
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
//               <label className="form-label">Activity Level</label>
//               <select className="form-select" value={form.activityLevel} onChange={set('activityLevel')}>
//                 <option value="Sedentary">Sedentary</option>
//                 <option value="Light">Light</option>
//                 <option value="Moderate">Moderate</option>
//                 <option value="Active">Active</option>
//                 <option value="Very Active">Very Active</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Dietary Preference</label>
//               <select className="form-select" value={form.dietaryPreference} onChange={set('dietaryPreference')}>
//                 <option value="Vegetarian">Vegetarian</option>
//                 <option value="Vegan">Vegan</option>
//                 <option value="Non-Vegetarian">Non-Vegetarian</option>
//                 <option value="Pescatarian">Pescatarian</option>
//                 <option value="Keto">Keto</option>
//                 <option value="Paleo">Paleo</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Allergies</label>
//               <input 
//                 className="form-input" 
//                 placeholder="Peanuts, Gluten, Dairy" 
//                 value={form.allergies} 
//                 onChange={set('allergies')}
//               />
//             </div>
//           </div>

//           <div className="dietitian-section">
//             <h3 className="section-title">🩺 Professional Details</h3>
//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">Qualification *</label>
//                 <input 
//                   className="form-input" 
//                   placeholder="e.g. M.Sc. Nutrition & Dietetics" 
//                   value={form.qualification} 
//                   onChange={set('qualification')}
//                   style={errs.qualification ? { borderColor: 'var(--red)' } : {}}
//                 />
//                 {errs.qualification && <div className="form-err">{errs.qualification}</div>}
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Specialization *</label>
//                 <input 
//                   className="form-input" 
//                   placeholder="e.g. Weight Management" 
//                   value={form.specialization} 
//                   onChange={set('specialization')}
//                   style={errs.specialization ? { borderColor: 'var(--red)' } : {}}
//                 />
//                 {errs.specialization && <div className="form-err">{errs.specialization}</div>}
//               </div>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Years of Experience *</label>
//               <input 
//                 className="form-input" 
//                 type="number" 
//                 placeholder="e.g. 5" 
//                 value={form.experience} 
//                 onChange={set('experience')}
//                 style={errs.experience ? { borderColor: 'var(--red)' } : {}}
//               />
//               {errs.experience && <div className="form-err">{errs.experience}</div>}
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

//           <button type="submit" className="register-btn dietitian-register-btn" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Register as Dietitian'}
//           </button>

//           <div className="register-footer">
//             Already have an account? <span className="login-link" onClick={onLogin}>Login</span>
//           </div>
//         </form>
//       </div>

//       <style>{`
//         .dietitian-register-page .register-header h2 {
//           color: #1565C0;
//         }
//         .dietitian-register-page .login-link {
//           color: #1565C0;
//         }
//         .dietitian-register-btn {
//           background: #1565C0;
//         }
//         .dietitian-register-btn:hover:not(:disabled) {
//           background: #0D47A1;
//         }
//         .dietitian-section {
//           background: #E3F2FD;
//           padding: 15px;
//           border-radius: 12px;
//           margin: 5px 0;
//         }
//         .section-title {
//           font-size: 16px;
//           color: #1565C0;
//           margin-bottom: 15px;
//         }
//         .info-banner {
//           background: #FFF3CD;
//           color: #856404;
//           padding: 10px;
//           border-radius: 8px;
//           font-size: 13px;
//           margin-top: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default DietitianRegister;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function DietitianRegister({ onBack, onLogin }) {
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
    qualification: '',
    specialization: '',
    experience: '',
    role: 'dietitian'
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
    if (!form.qualification.trim()) e.qualification = 'Qualification is required';
    if (!form.specialization.trim()) e.specialization = 'Specialization is required';
    if (!form.experience || isNaN(form.experience) || form.experience < 0) e.experience = 'Valid experience is required';
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
      role: 'dietitian',
      dietitianDetails: {
        qualification: form.qualification,
        specialization: form.specialization,
        experience: parseInt(form.experience)
      }
    };

    const result = await register(userData);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="register-page dietitian-register-page">
      <div className="register-container">
        <button type="button" className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="register-header">
          <div className="register-icon">🩺</div>
          <h2>Dietitian Registration</h2>
          <p>Create your professional dietitian account</p>
          <div className="info-banner">
            ⚠️ Your account will need admin approval before you can login
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
                style={errs.name ? { borderColor: '#DC2626' } : {}}
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
                style={errs.email ? { borderColor: '#DC2626' } : {}}
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
                style={errs.phone ? { borderColor: '#DC2626' } : {}}
              />
              {errs.phone && <div className="form-err">{errs.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select 
                className="form-select" 
                value={form.gender} 
                onChange={set('gender')}
                style={errs.gender ? { borderColor: '#DC2626' } : {}}
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
                style={errs.age ? { borderColor: '#DC2626' } : {}}
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
                style={errs.height ? { borderColor: '#DC2626' } : {}}
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
                style={errs.weight ? { borderColor: '#DC2626' } : {}}
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

          <div className="dietitian-section">
            <h3 className="section-title">🩺 Professional Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Qualification *</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. M.Sc. Nutrition & Dietetics" 
                  value={form.qualification} 
                  onChange={set('qualification')}
                  style={errs.qualification ? { borderColor: '#DC2626' } : {}}
                />
                {errs.qualification && <div className="form-err">{errs.qualification}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Weight Management" 
                  value={form.specialization} 
                  onChange={set('specialization')}
                  style={errs.specialization ? { borderColor: '#DC2626' } : {}}
                />
                {errs.specialization && <div className="form-err">{errs.specialization}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input 
                className="form-input" 
                type="number" 
                placeholder="e.g. 5" 
                value={form.experience} 
                onChange={set('experience')}
                style={errs.experience ? { borderColor: '#DC2626' } : {}}
              />
              {errs.experience && <div className="form-err">{errs.experience}</div>}
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
                style={errs.password ? { borderColor: '#DC2626' } : {}}
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
                style={errs.confirmPassword ? { borderColor: '#DC2626' } : {}}
              />
              {errs.confirmPassword && <div className="form-err">{errs.confirmPassword}</div>}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Centered Register Button */}
          <div className="button-wrapper">
            <button type="submit" className="register-btn dietitian-register-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="btn-icon">🩺</span>
                  Register as Dietitian
                </>
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
          background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
          padding: 20px;
        }
        .register-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 750px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(21, 101, 192, 0.15);
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
          background: #1565C0;
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
          position: sticky;
          top: 0;
          background: none;
          border: none;
          color: #6B7280;
          cursor: pointer;
          font-size: 14px;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          z-index: 10;
          background: white;
          width: fit-content;
        }
        .back-btn:hover {
          color: #1565C0;
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
          font-size: 26px;
          color: #1565C0;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }
        .register-header p {
          color: #6B7280;
          font-size: 14px;
          margin-top: 5px;
        }
        .info-banner {
          background: #FFF3CD;
          color: #856404;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 10px;
          border-left: 3px solid #FFC107;
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
          border-color: #1565C0;
          background: white;
          box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
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
        .dietitian-section {
          background: #E3F2FD;
          padding: 18px;
          border-radius: 12px;
          margin: 5px 0;
          border: 1px solid #BBDEFB;
        }
        .section-title {
          font-size: 16px;
          color: #1565C0;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        /* Centered Button Styles */
        .button-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          width: 100%;
        }
        .register-btn {
          padding: 14px 50px;
          border: none;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 280px;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        .register-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .register-btn:hover::before {
          left: 100%;
        }
        .register-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        .register-btn .btn-icon {
          font-size: 22px;
        }
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
          font-size: 22px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .dietitian-register-btn {
          background: linear-gradient(135deg, #1565C0, #0D47A1);
          box-shadow: 0 4px 20px rgba(21, 101, 192, 0.3);
        }
        .dietitian-register-btn:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 35px rgba(21, 101, 192, 0.4);
        }
        .dietitian-register-btn:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }
        
        .register-footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #E5E7EB;
        }
        .login-link {
          color: #1565C0;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .login-link:hover {
          color: #0D47A1;
          text-decoration: underline;
        }
        
        @media (max-width: 650px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .register-container {
            padding: 24px;
            max-height: 95vh;
          }
          .register-btn {
            min-width: 100%;
            padding: 14px 20px;
            font-size: 15px;
          }
          .register-header h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default DietitianRegister;