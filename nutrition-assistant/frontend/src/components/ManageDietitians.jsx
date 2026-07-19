import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageDietitians() {
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietitians();
  }, []);

  const fetchDietitians = async () => {
    try {
      const response = await api.get('/dietitians');
      setDietitians(response.data);
    } catch (error) {
      console.error('Error fetching dietitians:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDietitian = async (id) => {
    try {
      await api.put(`/dietitians/${id}/approve`);
      setDietitians(ds => ds.map(d => d._id === id ? { ...d, isApproved: true } : d));
    } catch (error) {
      console.error('Error approving dietitian:', error);
    }
  };

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Manage Dietitians</div>
        <div className="page-sub">Approve and manage dietitian accounts</div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qualification</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dietitians.map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 600 }}>🩺 {d.name}</td>
                  <td>{d.qualification}</td>
                  <td>{d.specialization}</td>
                  <td>{d.experience} yrs</td>
                  <td>⭐ {d.rating || 'N/A'}</td>
                  <td>
                    <span className={`tag ${d.isApproved ? 'tag-green' : 'tag-amber'}`}>
                      {d.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="flex-c gap-2">
                      {!d.isApproved ? (
                        <button className="btn btn-sm btn-primary" onClick={() => approveDietitian(d._id)}>
                          Approve
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline">View</button>
                      )}
                    </div>
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

export default ManageDietitians;