import React, { useState } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: 1, message: 'Your meal plan has been updated by Dr. Arjun Mehta', createdAt: '2026-07-15T04:15:00.000Z', read: false },
  { id: 2, message: 'Appointment confirmed for June 10 at 10:00 AM', createdAt: '2026-07-14T15:45:00.000Z', read: false },
  { id: 3, message: 'Great progress! You\'ve lost 3 kg this month', createdAt: '2026-07-12T08:20:00.000Z', read: true },
  { id: 4, message: 'New recipe added to your plan: Quinoa Bowl', createdAt: '2026-07-10T13:30:00.000Z', read: true },
];

function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);

  const formatKolkataTime = (value) => {
    const date = new Date(value);
    return `${new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)} IST`;
  };

  const markAllRead = () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  };

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Notifications</div>
            <div className="page-sub">Updates from your dietitian and system</div>
          </div>
          <button className="btn btn-sm btn-outline" onClick={markAllRead}>Mark all read</button>
        </div>
      </div>

      <div className="card">
        {notifs.length === 0 && (
          <div className="empty-state">
            <div className="empty-em">🔔</div>
            <div>No notifications</div>
          </div>
        )}
        {notifs.map(n => (
          <div key={n.id} className="notif-item" onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ cursor: 'pointer' }}>
            <div className={`notif-dot ${n.read ? 'read' : ''}`} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{formatKolkataTime(n.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .notif-item {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .notif-item:last-child {
          border-bottom: none;
        }
        .notif-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          margin-top: 5px;
          flex-shrink: 0;
        }
        .notif-dot.read {
          background: var(--border);
        }
      `}</style>
    </div>
  );
}

export default NotificationsPage;