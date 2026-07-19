import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [dietitians, setDietitians] = useState([]);
  const [bookModal, setBookModal] = useState(false);
  const [form, setForm] = useState({ dietitianId: '', date: '', time: '', type: 'Initial Consultation', notes: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchDietitians();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietitians = async () => {
    try {
      const response = await api.get('/dietitians');
      setDietitians(response.data.filter(d => d.isApproved));
    } catch (error) {
      console.error('Error fetching dietitians:', error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', {
        ...form,
        dietitianId: form.dietitianId,
        date: new Date(form.date)
      });
      setBookModal(false);
      fetchAppointments();
      setForm({ dietitianId: '', date: '', time: '', type: 'Initial Consultation', notes: '' });
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/${id}`, { status: 'Cancelled' });
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  const getCounterpartyName = (appointment) => {
    if (user?.role === 'dietitian') {
      return appointment.userId?.name || 'Client';
    }
    if (user?.role === 'admin') {
      return appointment.userId?.name || appointment.dietitianId?.name || 'User';
    }
    return appointment.dietitianId?.name || 'Dietitian';
  };

  const upcoming = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Appointments</div>
            <div className="page-sub">Book and manage your dietitian consultations</div>
          </div>
          <button className="btn btn-primary" onClick={() => setBookModal(true)}>+ Book Appointment</button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>📅 Upcoming</div>
          {upcoming.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
              <div style={{ color: 'var(--ink3)' }}>No upcoming appointments</div>
            </div>
          )}
          {upcoming.map(a => (
            <div key={a._id} className="appt-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="appt-dietitian">{getCounterpartyName(a)}</div>
                  <div className="appt-time">{new Date(a.date).toLocaleDateString()} · {a.time}</div>
                  <div style={{ marginTop: 8 }}><span className="tag tag-teal">{a.type}</span></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  <span className={`tag ${a.status === 'Confirmed' ? 'tag-green' : 'tag-amber'}`}>{a.status}</span>
                  {a.status !== 'Cancelled' && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>✅ Past Appointments</div>
          {past.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ color: 'var(--ink3)' }}>No past appointments</div>
            </div>
          )}
          {past.slice(0, 3).map(a => (
            <div key={a._id} className="appt-card" style={{ opacity: 0.75 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="appt-dietitian">{getCounterpartyName(a)}</div>
                  <div className="appt-time">{new Date(a.date).toLocaleDateString()} · {a.time}</div>
                  <div style={{ marginTop: 8 }}><span className="tag tag-gray">{a.type}</span></div>
                </div>
                <span className={`tag ${a.status === 'Completed' ? 'tag-gray' : 'tag-red'}`}>{a.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>Available Dietitians</div>
        <div className="grid-3">
          {dietitians.slice(0, 3).map(d => (
            <div key={d._id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🩺</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{d.specialization}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 8 }}>{d.qualification} · {d.experience} years</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700 }}>⭐ {d.rating || 'N/A'}</span>
                <button className="btn btn-sm btn-primary" onClick={() => {
                  setForm(f => ({ ...f, dietitianId: d.userId || d._id }));
                  setBookModal(true);
                }}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookModal && (
        <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setBookModal(false)}>
          <div className="modal">
            <div className="modal-title">Book an Appointment</div>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Select Dietitian</label>
                <select className="form-select" value={form.dietitianId} onChange={e => setForm(f => ({ ...f, dietitianId: e.target.value }))} required>
                  <option value="">Choose a dietitian</option>
                  {dietitians.map(d => <option key={d._id} value={d.userId || d._id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <select className="form-select" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required>
                    <option value="">Select time</option>
                    {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Initial Consultation</option>
                  <option>Follow-up</option>
                  <option>Progress Review</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes for Dietitian</label>
                <textarea className="form-textarea" placeholder="Any specific concerns or questions..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setBookModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        .appt-time {
          font-size: 12px;
          color: var(--ink3);
        }
        .appt-dietitian {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
        }
      `}</style>
    </div>
  );
}

export default AppointmentsPage;