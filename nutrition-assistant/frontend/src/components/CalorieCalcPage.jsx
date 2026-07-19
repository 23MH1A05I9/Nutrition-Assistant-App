import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function CalorieCalcPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    gender: user?.gender || 'Female',
    age: user?.age || 28,
    height: user?.height || 165,
    weight: user?.weight || 62,
    activity: 'Moderate',
    goal: 'Maintain'
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const activityFactors = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725, 'Very Active': 1.9 };
  
  const bmr = form.gender === 'Male'
    ? 88.362 + (13.397 * form.weight) + (4.799 * form.height) - (5.677 * form.age)
    : 447.593 + (9.247 * form.weight) + (3.098 * form.height) - (4.330 * form.age);
  
  const tdee = Math.round(bmr * (activityFactors[form.activity] || 1.55));
  const goalCalories = {
    Lose: tdee - 500,
    Maintain: tdee,
    Gain: tdee + 500
  };

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Daily Calorie Calculator</div>
        <div className="page-sub">Calculate your total daily energy expenditure (TDEE)</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 18 }}>Your Information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender} onChange={set('gender')}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" type="number" value={form.age} onChange={set('age')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input className="form-input" type="number" value={form.height} onChange={set('height')} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" value={form.weight} onChange={set('weight')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Activity Level</label>
            <select className="form-select" value={form.activity} onChange={set('activity')}>
              {Object.keys(activityFactors).map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Goal</label>
            <select className="form-select" value={form.goal} onChange={set('goal')}>
              <option>Lose</option>
              <option>Maintain</option>
              <option>Gain</option>
            </select>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
              Your Daily Calorie Goal
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 60, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              {goalCalories[form.goal]}
            </div>
            <div style={{ fontSize: 16, color: 'var(--ink3)', marginTop: 4 }}>kcal / day</div>
          </div>

          {[
            { label: 'Basal Metabolic Rate (BMR)', val: Math.round(bmr), sub: 'Calories at rest' },
            { label: 'Total Daily Expenditure (TDEE)', val: tdee, sub: 'With your activity level' },
            { label: 'For Weight Loss (−500)', val: goalCalories.Lose, sub: 'Lose ~0.5 kg per week' },
            { label: 'For Maintenance', val: goalCalories.Maintain, sub: 'Stay at current weight' },
            { label: 'For Weight Gain (+500)', val: goalCalories.Gain, sub: 'Gain ~0.5 kg per week' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{r.sub}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalorieCalcPage;