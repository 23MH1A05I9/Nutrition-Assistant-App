import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function DietitianDashboard({ onNavigate }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalMealPlans: 0,
    upcomingAppointments: 0,
    pendingAppointments: 0,
    averageRating: 4.9
  });
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, mealPlansRes, profileRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/meal-plans'),
        api.get('/dietitians/me')
      ]);
      const upcoming = appointmentsRes.data.filter(a => 
        a.status === 'Pending' || a.status === 'Confirmed'
      );
      setAppointments(upcoming.slice(0, 5));

      const profile = profileRes.data;
      const clientsList = profile.clients || [];
      setClients(clientsList.slice(0, 5));

      setStats({
        totalClients: clientsList.length,
        totalMealPlans: mealPlansRes.data.length,
        upcomingAppointments: upcoming.length,
        pendingAppointments: upcoming.filter(a => a.status === 'Pending').length,
        averageRating: profile.rating || 4.9
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data
      setStats({
        totalClients: 45,
        totalMealPlans: 52,
        upcomingAppointments: 8,
        pendingAppointments: 3,
        averageRating: 4.9
      });
      setAppointments([
        { _id: 1, userId: { name: 'Priya Sharma' }, date: new Date(), time: '10:00 AM', type: 'Initial Consultation', status: 'Confirmed' },
        { _id: 2, userId: { name: 'Rahul Gupta' }, date: new Date(), time: '2:00 PM', type: 'Follow-up', status: 'Pending' },
        { _id: 3, userId: { name: 'Ananya Singh' }, date: new Date(), time: '4:00 PM', type: 'Progress Review', status: 'Confirmed' },
      ]);
      setClients([
        { _id: 1, name: 'Priya Sharma', email: 'priya@example.com', age: 28, bmi: 22.8 },
        { _id: 2, name: 'Rahul Gupta', email: 'rahul@example.com', age: 35, bmi: 27.1 },
        { _id: 3, name: 'Ananya Singh', email: 'ananya@example.com', age: 22, bmi: 19.5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Dietitian Dashboard</div>
            <div className="page-sub">Welcome back, {user?.name || 'Dietitian'}</div>
          </div>
          <div className="flex-c gap-2">
            <button className="btn btn-primary" type="button" onClick={() => onNavigate?.('meal-plan')}>📋 Create Meal Plan</button>
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate?.('appointments')}>📅 View Schedule</button>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-em">👥</div>
          <div className="stat-val">{stats.totalClients}</div>
          <div className="stat-lbl">Active Clients</div>
          <div className="stat-delta delta-up">+3 this week</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-em">🥗</div>
          <div className="stat-val">{stats.totalMealPlans}</div>
          <div className="stat-lbl">Meal Plans Created</div>
          <div className="stat-delta delta-up">All time</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-em">📅</div>
          <div className="stat-val">{stats.upcomingAppointments}</div>
          <div className="stat-lbl">This Week's Appts</div>
          <div className="stat-delta delta-up">{stats.pendingAppointments} pending</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-em">⭐</div>
          <div className="stat-val">{stats.averageRating}</div>
          <div className="stat-lbl">Average Rating</div>
          <div className="stat-delta delta-up">Excellent</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Upcoming Consultations</div>
              <div className="card-sub">Your next appointments</div>
            </div>
            <button className="btn btn-sm btn-outline" type="button" onClick={() => onNavigate?.('appointments')}>View All</button>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-em">📅</div>
              <div>No upcoming consultations</div>
            </div>
          ) : (
            appointments.map(a => (
              <div key={a._id} className="appt-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                      {a.userId?.name || 'Client'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)' }}>
                      📅 {new Date(a.date).toLocaleDateString()} · ⏰ {a.time}
                    </div>
                    <span className="tag tag-teal" style={{ marginTop: 6, display: 'inline-block' }}>
                      {a.type || 'Consultation'}
                    </span>
                  </div>
                  <span className={`tag ${a.status === 'Confirmed' ? 'tag-green' : 'tag-amber'}`}>
                    {a.status || 'Pending'}
                  </span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-primary" type="button" onClick={() => onNavigate?.('appointments')}>Start</button>
                  <button className="btn btn-sm btn-outline" type="button" onClick={() => onNavigate?.('appointments')}>Reschedule</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Clients</div>
              <div className="card-sub">Your active clients</div>
            </div>
            <button className="btn btn-sm btn-outline" type="button" onClick={() => onNavigate?.('clients')}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>BMI</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.age}</td>
                    <td>
                      <span className={`tag ${c.bmi < 25 ? 'tag-green' : 'tag-amber'}`}>
                        {c.bmi}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary" type="button" onClick={() => onNavigate?.('clients')}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Quick Actions</div>
        </div>
        <div className="grid-4" style={{ gap: 12 }}>
          {[
            { label: 'Create Meal Plan', em: '📋', color: 'var(--green)', page: 'meal-plan' },
            { label: 'View Client Progress', em: '📈', color: 'var(--blue)', page: 'progress' },
            { label: 'Upload Recipe', em: '🍴', color: 'var(--amber)', page: 'recipes' },
            { label: 'Send Notification', em: '🔔', color: 'var(--teal)', page: 'notifications' },
            { label: 'Update Availability', em: '📅', color: 'var(--purple)', page: 'profile' },
            { label: 'View Analytics', em: '📊', color: 'var(--ink3)', page: 'analytics' },
          ].map(q => (
            <button 
              key={q.label} 
              className="btn btn-outline" 
              type="button"
              onClick={() => onNavigate?.(q.page)}
              style={{ 
                justifyContent: 'center', 
                flexDirection: 'column', 
                height: 80, 
                gap: 4,
                borderColor: q.color
              }}
            >
              <span style={{ fontSize: 24 }}>{q.em}</span>
              <span style={{ fontSize: 12 }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
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
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--ink3);
        }
        .empty-em {
          font-size: 44px;
          margin-bottom: 12px;
          opacity: .5;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .flex-c {
          display: flex;
          align-items: center;
        }
        .gap-2 { gap: 8px; }
        @media (max-width: 768px) {
          .grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default DietitianDashboard;