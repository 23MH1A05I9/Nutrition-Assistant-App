import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProgressPage() {
  const [waterCups, setWaterCups] = useState(5);
  const [logModal, setLogModal] = useState(false);
  const [progress, setProgress] = useState([]);
  const [logForm, setLogForm] = useState({ weight: '', calories: '', burned: '', sleep: '', notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/progress', {
        weight: parseFloat(logForm.weight),
        caloriesConsumed: parseFloat(logForm.calories),
        caloriesBurned: parseFloat(logForm.burned),
        sleepHours: parseFloat(logForm.sleep),
        waterIntake: waterCups,
        notes: logForm.notes,
        date: new Date()
      });
      setLogModal(false);
      fetchProgress();
      setLogForm({ weight: '', calories: '', burned: '', sleep: '', notes: '' });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const latest = progress.length > 0 ? progress[progress.length - 1] : { 
    caloriesConsumed: 1750, 
    caloriesBurned: 400, 
    waterIntake: 7, 
    sleepHours: 7.5 
  };

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Progress Tracker</div>
            <div className="page-sub">Log your daily health metrics</div>
          </div>
          <button className="btn btn-primary" onClick={() => setLogModal(true)}>+ Log Today</button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>💧 Water Intake Today</div>
          <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 10 }}>Tap cups to track your water intake (goal: 8 glasses)</div>
          <div className="water-cups">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`water-cup ${i < waterCups ? 'filled' : ''}`} onClick={() => setWaterCups(i + 1)}>💧</div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--ink3)' }}>{waterCups} of 8 glasses</span>
            <div className="progress-bar" style={{ width: 200 }}>
              <div className="progress-fill" style={{ width: `${(waterCups / 8) * 100}%`, background: 'var(--blue)' }} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>🔥 Calorie Balance</div>
          <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--red)' }}>{latest.caloriesConsumed}</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Consumed</div>
            </div>
            <div style={{ fontSize: 24, display: 'flex', alignItems: 'center', color: 'var(--ink3)' }}>−</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>{latest.caloriesBurned}</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Burned</div>
            </div>
            <div style={{ fontSize: 24, display: 'flex', alignItems: 'center', color: 'var(--ink3)' }}>=</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--amber)' }}>{latest.caloriesConsumed - latest.caloriesBurned}</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Net</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, (latest.caloriesConsumed / 1800) * 100)}%`, background: 'var(--amber)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink3)', marginTop: 4 }}>
            <span>0</span><span>Goal: 1800 kcal</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Weight Progress Chart</div>
            <div className="card-sub">Last 4 weeks tracking</div>
          </div>
          <button className="btn btn-sm btn-outline">📥 Export CSV</button>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <canvas id="progressChart" role="img" aria-label="Weight and BMI progress chart over 4 weeks">Weight decreased from 65kg to 62kg over 4 weeks.</canvas>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Progress History</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>BMI</th>
                <th>Calories</th>
                <th>Water</th>
                <th>Sleep</th>
              </tr>
            </thead>
            <tbody>
              {[...progress].reverse().slice(0, 10).map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.weight || '-'}</td>
                  <td>
                    <span className={`tag ${p.bmi < 25 ? 'tag-green' : 'tag-amber'}`}>
                      {p.bmi || '-'}
                    </span>
                  </td>
                  <td>{p.caloriesConsumed || '-'} kcal</td>
                  <td>{p.waterIntake || '-'} glasses</td>
                  <td>{p.sleepHours || '-'}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logModal && (
        <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setLogModal(false)}>
          <div className="modal">
            <div className="modal-title">Log Today's Progress</div>
            <form onSubmit={handleLogSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input className="form-input" type="number" placeholder="e.g. 62" value={logForm.weight} onChange={e => setLogForm(f => ({ ...f, weight: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Calories Consumed</label>
                  <input className="form-input" type="number" placeholder="e.g. 1800" value={logForm.calories} onChange={e => setLogForm(f => ({ ...f, calories: e.target.value }))} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Calories Burned</label>
                  <input className="form-input" type="number" placeholder="e.g. 500" value={logForm.burned} onChange={e => setLogForm(f => ({ ...f, burned: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sleep Hours</label>
                  <input className="form-input" type="number" placeholder="e.g. 8" value={logForm.sleep} onChange={e => setLogForm(f => ({ ...f, sleep: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Any observations for today..." value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setLogModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .water-cups {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 14px 0;
        }
        .water-cup {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 2px solid var(--blue);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all .15s;
          background: transparent;
        }
        .water-cup.filled {
          background: var(--blue-pale);
          border-color: var(--blue);
        }
        .water-cup:hover {
          transform: scale(1.1);
        }
        .progress-bar {
          height: 8px;
          background: var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 20px;
          transition: width .4s ease;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17,24,39,.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(3px);
        }
        .modal {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 28px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
        }
        .modal-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 20px;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

export default ProgressPage;