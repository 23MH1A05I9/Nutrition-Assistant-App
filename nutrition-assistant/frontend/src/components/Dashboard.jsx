import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    bmi: user?.bmi || 22.8,
    calories: 1790,
    water: 7,
    sleep: 7.5
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [mealRes, apptRes, progressRes] = await Promise.all([
        api.get('/meal-plans'),
        api.get('/appointments'),
        api.get('/progress')
      ]);
      setMealPlan(mealRes.data[0] || null);
      setAppointments(apptRes.data || []);
      setProgress(progressRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const bmiCat = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#1565C0' };
    if (bmi < 25) return { label: 'Normal', color: '#2E7D32' };
    if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
    return { label: 'Obese', color: '#DC2626' };
  };

  const cat = bmiCat(stats.bmi);
  const todayProgress = progress.length > 0 ? progress[progress.length - 1] : { caloriesConsumed: 1790, waterIntake: 7, sleepHours: 7.5 };

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Good morning, {user?.name?.split(' ')[0] || 'User'}! 🌿</div>
            <div className="page-sub">Here's your health summary for today</div>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => onNavigate?.('meal-plan')}>📋 View Meal Plan</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-em">⚖️</div>
          <div className="stat-val">{stats.bmi}</div>
          <div className="stat-lbl">Current BMI</div>
          <div className="stat-delta" style={{ color: cat.color }}>● {cat.label}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-em">🔥</div>
          <div className="stat-val">{todayProgress.caloriesConsumed}</div>
          <div className="stat-lbl">Calories Today</div>
          <div className="stat-delta delta-up">of 1800 goal</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-em">💧</div>
          <div className="stat-val">{todayProgress.waterIntake}</div>
          <div className="stat-lbl">Glasses of Water</div>
          <div className="stat-delta delta-up">of 8 daily goal</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-em">😴</div>
          <div className="stat-val">{todayProgress.sleepHours}h</div>
          <div className="stat-lbl">Sleep Last Night</div>
          <div className="stat-delta delta-up">Good quality</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Today's Nutrition</div><div className="card-sub">From your meal plan</div></div>
            <button className="btn btn-sm btn-secondary" type="button" onClick={() => onNavigate?.('meal-plan')}>View Plan</button>
          </div>
          {[
            { label: 'Protein', val: 75, max: 90, unit: 'g', color: '#1565C0' },
            { label: 'Carbohydrates', val: 220, max: 250, unit: 'g', color: '#2E7D32' },
            { label: 'Fats', val: 60, max: 70, unit: 'g', color: '#F59E0B' },
            { label: 'Fiber', val: 30, max: 35, unit: 'g', color: '#00796B' },
            { label: 'Calories', val: 1790, max: 1800, unit: 'kcal', color: '#DC2626' },
          ].map(n => (
            <div key={n.label} className="nutrient-row">
              <div className="nutrient-label">{n.label}</div>
              <div className="nutrient-bar">
                <div className="nutrient-fill" style={{ width: `${Math.min(100, (n.val / n.max) * 100)}%`, background: n.color }} />
              </div>
              <div className="nutrient-val">{n.val}{n.unit}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Weight Progress</div><div className="card-sub">Last 4 weeks</div></div>
          </div>
          <div style={{ position: 'relative', height: 180 }}>
            <canvas id="weightChart" role="img" aria-label="Weight progress over last 4 weeks">Weight dropped from 65kg to 62kg.</canvas>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Upcoming Appointment</div><div className="card-sub">Next scheduled consultation</div></div>
            <button className="btn btn-sm btn-outline">All</button>
          </div>
          {appointments.filter(a => a.status !== 'Completed').slice(0, 1).map(a => (
            <div key={a._id} className="appt-card" style={{ background: 'var(--green-pale)', border: '1.5px solid var(--green-mid)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="appt-dietitian">{a.dietitianId?.name || 'Dietitian'}</div>
                  <div className="appt-time">📅 {new Date(a.date).toLocaleDateString()} · ⏰ {a.time}</div>
                  <div className="mt-2"><span className="tag tag-teal">{a.type}</span></div>
                </div>
                <span className={`tag ${a.status === 'Confirmed' ? 'tag-green' : a.status === 'Pending' ? 'tag-amber' : 'tag-gray'}`}>{a.status}</span>
              </div>
            </div>
          ))}
          {appointments.filter(a => a.status !== 'Completed').length === 0 && (
            <div className="empty-state">
              <div className="empty-em">📅</div>
              <div>No upcoming appointments</div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Quick Actions</div></div>
          </div>
          <div className="grid-2" style={{ gap: 10 }}>
            {[
              { label: 'Track Calories', em: '🔥', page: 'progress' },
              { label: 'Water Intake', em: '💧', page: 'progress' },
              { label: 'BMI Check', em: '⚖️', page: 'bmi' },
              { label: 'Find Recipes', em: '🍴', page: 'recipes' },
              { label: 'Book Appointment', em: '📅', page: 'appointments' },
              { label: 'Food Search', em: '🔍', page: 'food-search' },
            ].map(q => (
              <button key={q.label} className="btn btn-outline" type="button" onClick={() => onNavigate?.(q.page)} style={{ justifyContent: 'center', flexDirection: 'column', height: 70, gap: 4 }}>
                <span style={{ fontSize: 20 }}>{q.em}</span>
                <span style={{ fontSize: 11 }}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .nutrient-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .nutrient-label {
          width: 100px;
          font-size: 12px;
          color: var(--ink2);
          font-weight: 600;
          flex-shrink: 0;
        }
        .nutrient-bar {
          flex: 1;
          height: 8px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .nutrient-fill {
          height: 100%;
          border-radius: 4px;
        }
        .nutrient-val {
          width: 50px;
          text-align: right;
          font-size: 12px;
          color: var(--ink3);
          flex-shrink: 0;
        }
        .appt-card {
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 14px;
          margin-bottom: 10px;
          transition: .15s;
        }
        .appt-card:hover {
          border-color: var(--green-mid);
          background: var(--green-pale);
        }
        .appt-time {
          font-size: 12px;
          color: var(--ink3);
        }
        .appt-dietitian {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
        }
        .empty-state {
          text-align: center;
          padding: 52px 20px;
          color: var(--ink3);
        }
        .empty-em {
          font-size: 44px;
          margin-bottom: 12px;
          opacity: .5;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;