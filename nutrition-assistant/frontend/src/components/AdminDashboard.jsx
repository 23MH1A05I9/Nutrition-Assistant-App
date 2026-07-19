import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalUsers: 1248,
    totalDietitians: 34,
    activeMealPlans: 892,
    totalAppointments: 2341
  });
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, dietitiansRes] = await Promise.all([
        api.get('/users'),
        api.get('/dietitians')
      ]);
      setStats({
        ...stats,
        totalUsers: usersRes.data.length,
        totalDietitians: dietitiansRes.data.length
      });
      setDietitians(dietitiansRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
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
        <div className="page-title">Admin Dashboard</div>
        <div className="page-sub">Platform overview and management</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-em">👥</div>
          <div className="stat-val">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-lbl">Total Users</div>
          <div className="stat-delta delta-up">+12% this month</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-em">🩺</div>
          <div className="stat-val">{stats.totalDietitians}</div>
          <div className="stat-lbl">Dietitians</div>
          <div className="stat-delta delta-up">{dietitians.filter(d => !d.isApproved).length} pending approval</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-em">🥗</div>
          <div className="stat-val">{stats.activeMealPlans}</div>
          <div className="stat-lbl">Active Meal Plans</div>
          <div className="stat-delta delta-up">+8% this month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-em">📅</div>
          <div className="stat-val">{stats.totalAppointments.toLocaleString()}</div>
          <div className="stat-lbl">Total Appointments</div>
          <div className="stat-delta delta-up">All time</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Monthly Overview</div>
          <div style={{ position: 'relative', height: 200 }}>
            <canvas id="adminChart" role="img" aria-label="Monthly user and appointment statistics">Users and appointments by month.</canvas>
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Approve pending dietitians', em: '✅', target: 'manage-dietitians' },
              { label: 'View all users', em: '👥', target: 'manage-users' },
              { label: 'Manage appointments', em: '📅', target: 'appointments' },
              { label: 'Send notifications', em: '🔔', target: 'notifications' },
              { label: 'View analytics report', em: '📈', target: 'analytics' },
            ].map(a => (
              <button key={a.label} className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: 10 }} onClick={() => onNavigate?.(a.target)} type="button">
                <span>{a.em}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Dietitian Approvals</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qualification</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dietitians.slice(0, 3).map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 600 }}>🩺 {d.name}</td>
                  <td>{d.qualification}</td>
                  <td>{d.specialization}</td>
                  <td>{d.experience} yrs</td>
                  <td><span className={`tag ${d.isApproved ? 'tag-green' : 'tag-amber'}`}>{d.isApproved ? 'Approved' : 'Pending'}</span></td>
                  <td>
                    {!d.isApproved ? (
                      <button className="btn btn-sm btn-primary" type="button" onClick={() => onNavigate?.('manage-dietitians')}>Approve</button>
                    ) : (
                      <button className="btn btn-sm btn-outline" type="button" onClick={() => onNavigate?.('manage-dietitians')}>View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;