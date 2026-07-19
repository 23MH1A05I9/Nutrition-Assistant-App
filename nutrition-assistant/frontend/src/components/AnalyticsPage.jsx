import React from 'react';

function AnalyticsPage() {
  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Analytics & Reports</div>
        <div className="page-sub">Platform performance and health metrics</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-em">📈</div>
          <div className="stat-val">89%</div>
          <div className="stat-lbl">User Retention</div>
          <div className="stat-delta delta-up">+4% vs last month</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-em">🥗</div>
          <div className="stat-val">94%</div>
          <div className="stat-lbl">Meal Plan Adherence</div>
          <div className="stat-delta delta-up">Above target</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-em">⭐</div>
          <div className="stat-val">4.8</div>
          <div className="stat-lbl">Avg. Dietitian Rating</div>
          <div className="stat-delta delta-up">Excellent</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-em">🎯</div>
          <div className="stat-val">73%</div>
          <div className="stat-lbl">Goals Achieved</div>
          <div className="stat-delta delta-up">+6% this quarter</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Monthly Growth — Users & Appointments</div>
        <div style={{ position: 'relative', height: 260 }}>
          <canvas id="analyticsChart" role="img" aria-label="Monthly platform growth chart">Monthly users and appointments growth trend.</canvas>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;