import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function BMIPage() {
  const { user } = useAuth();
  const [height, setHeight] = useState(user?.height || 165);
  const [weight, setWeight] = useState(user?.weight || 62);

  const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#1565C0', range: '< 18.5' };
    if (bmi < 25) return { label: 'Normal weight', color: '#2E7D32', range: '18.5 – 24.9' };
    if (bmi < 30) return { label: 'Overweight', color: '#F59E0B', range: '25.0 – 29.9' };
    return { label: 'Obese', color: '#DC2626', range: '≥ 30.0' };
  };

  const cat = getBMICategory(bmi);
  const bmiPos = Math.min(95, Math.max(5, ((bmi - 10) / 30) * 100));

  const categories = [
    { range: '< 18.5', cat: 'Underweight', color: 'tag-blue' },
    { range: '18.5 – 24.9', cat: 'Normal weight', color: 'tag-green' },
    { range: '25.0 – 29.9', cat: 'Overweight', color: 'tag-amber' },
    { range: '≥ 30.0', cat: 'Obese', color: 'tag-red' },
  ];

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">BMI Calculator</div>
        <div className="page-sub">Body Mass Index — a measure of body fat based on height and weight</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Enter Your Measurements</div>
          <div className="form-group">
            <label className="form-label">Height: {height} cm</label>
            <input type="range" className="w-full" min="100" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--green)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink3)' }}>
              <span>100 cm</span>
              <span>220 cm</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Weight: {weight} kg</label>
            <input type="range" className="w-full" min="30" max="200" value={weight} onChange={e => setWeight(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--green)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink3)' }}>
              <span>30 kg</span>
              <span>200 kg</span>
            </div>
          </div>

          <div className="divider" />
          <div className="bmi-gauge">
            <div className="bmi-value" style={{ color: cat.color }}>{bmi}</div>
            <div className="bmi-label" style={{ color: cat.color }}>{cat.label}</div>
          </div>

          <div className="bmi-bar" style={{ marginTop: 20 }}>
            <div style={{ background: '#1565C0', flex: 1 }} title="Underweight (<18.5)" />
            <div style={{ background: '#2E7D32', flex: 1.5 }} title="Normal (18.5-24.9)" />
            <div style={{ background: '#F59E0B', flex: 1 }} title="Overweight (25-29.9)" />
            <div style={{ background: '#DC2626', flex: 1 }} title="Obese (≥30)" />
          </div>
          <div style={{ position: 'relative', height: 20 }}>
            <div style={{ position: 'absolute', left: `${bmiPos}%`, top: 4, width: 12, height: 12, background: 'var(--ink)', borderRadius: '50%', transform: 'translateX(-50%)', transition: 'left .5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink3)', marginTop: 2 }}>
            <span>Underweight<br/>&lt;18.5</span>
            <span>Normal<br/>18.5–24.9</span>
            <span>Overweight<br/>25–29.9</span>
            <span>Obese<br/>≥30</span>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>BMI Categories</div>
            {categories.map(c => (
              <div key={c.cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--ink3)' }}>{c.range}</span>
                <span className={`tag ${c.color}`}>{c.cat}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Ideal Weight Range</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 10 }}>For your height of {height}cm:</div>
            {[
              { label: 'Minimum (BMI 18.5)', val: Math.round(18.5 * (height / 100) ** 2) },
              { label: 'Maximum (BMI 24.9)', val: Math.round(24.9 * (height / 100) ** 2) },
              { label: 'Your current weight', val: weight },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--ink3)' }}>{r.label}</span>
                <span style={{ fontWeight: 700 }}>{r.val} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .bmi-gauge {
          text-align: center;
          padding: 20px 0;
        }
        .bmi-value {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          line-height: 1;
        }
        .bmi-label {
          font-size: 14px;
          font-weight: 600;
          margin-top: 4px;
        }
        .bmi-bar {
          display: flex;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          margin: 16px 0 8px;
        }
        .bmi-bar div {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

export default BMIPage;