import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DietitianClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/dietitians/me');
      setClients(response.data.clients || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load clients');
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
        <div className="page-title">My Clients</div>
        <div className="page-sub">Clients assigned to your dietitian profile</div>
      </div>

      <div className="card">
        {error ? (
          <div className="empty-state">
            <div className="empty-em">⚠️</div>
            <div>{error}</div>
          </div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-em">👥</div>
            <div>No clients assigned yet</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>BMI</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client._id}>
                    <td style={{ fontWeight: 600 }}>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.age || 'N/A'}</td>
                    <td>{client.bmi || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DietitianClientsPage;