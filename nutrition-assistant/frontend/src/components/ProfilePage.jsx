import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    height: user?.height || '',
    weight: user?.weight || '',
    activityLevel: user?.activityLevel || 'Moderate',
    dietaryPreference: user?.dietaryPreference || 'Vegetarian',
    allergies: user?.allergies?.join(', ') || '',
  });

  const bmiCat = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#1565C0' };
    if (bmi < 25) return { label: 'Normal', color: '#2E7D32' };
    if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
    return { label: 'Obese', color: '#DC2626' };
  };

  const cat = bmiCat(user?.bmi || 22.8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', {
        ...form,
        allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      });
      updateUser(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">My Profile</div>
            <div className="page-sub">Manage your personal health information</div>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg,#1B5E20,#2E7D32)', border: 'none' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div className="profile-av profile-av-lg">{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff' }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{user?.email} · {user?.phone}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <span style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>{user?.dietaryPreference}</span>
              <span style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>{user?.activityLevel} Activity</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: '#fff' }}>{user?.bmi || 'N/A'}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>BMI</div>
            <div style={{ fontSize: 12, background: 'rgba(255,255,255,.2)', color: '#fff', padding: '2px 8px', borderRadius: 20, marginTop: 4 }}>{cat.label}</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Personal Information</div>
          {[
            ['Gender', user?.gender || 'Not set'],
            ['Age', user?.age ? `${user.age} years` : 'Not set'],
            ['Height', user?.height ? `${user.height} cm` : 'Not set'],
            ['Weight', user?.weight ? `${user.weight} kg` : 'Not set'],
            ['Activity Level', user?.activityLevel || 'Not set'],
            ['Dietary Preference', user?.dietaryPreference || 'Not set'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--ink3)' }}>{l}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Health Summary</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'BMI', val: user?.bmi || 'N/A', em: '⚖️' },
              { label: 'Weight (kg)', val: user?.weight || 'N/A', em: '💪' },
              { label: 'Height (cm)', val: user?.height || 'N/A', em: '📏' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: 'var(--canvas)', borderRadius: 'var(--radius)', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.em}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--ink3)', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card-title" style={{ marginBottom: 10, fontSize: 13 }}>Allergies</div>
          <div className="flex-c gap-2">
            {user?.allergies?.length > 0 ? (
              user.allergies.map(a => <span key={a} className="tag tag-red">⚠️ {a}</span>)
            ) : (
              <span className="tag tag-gray">No allergies listed</span>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setEditing(false)}>
          <div className="modal modal-lg">
            <div className="modal-title">Edit Profile</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input className="form-input" type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input className="form-input" type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <select className="form-select" value={form.activityLevel} onChange={e => setForm(f => ({ ...f, activityLevel: e.target.value }))}>
                    {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Dietary Preference</label>
                  <select className="form-select" value={form.dietaryPreference} onChange={e => setForm(f => ({ ...f, dietaryPreference: e.target.value }))}>
                    {['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Pescatarian', 'Keto', 'Paleo'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Allergies (comma-separated)</label>
                <input className="form-input" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} placeholder="e.g. Peanuts, Gluten, Dairy" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .profile-av {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg,var(--green),var(--teal));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .profile-av-lg {
          width: 100px;
          height: 100px;
          font-size: 34px;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;