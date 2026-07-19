import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
      await api.put(`/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="content">Loading...</div>;
  }

  return (
    <div className="content animate-in">
      <div className="page-header">
        <div className="page-title">Manage Users</div>
        <div className="page-sub">View and manage all registered users</div>
      </div>

      <div className="card">
        <div className="card-header">
          <input className="form-input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
          <div className="flex-c gap-2">
            <span className="tag tag-green">{users.filter(u => u.status === 'Active').length} Active</span>
            <span className="tag tag-red">{users.filter(u => u.status === 'Blocked').length} Blocked</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>BMI</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="tag tag-blue">{u.role}</span></td>
                  <td>{u.bmi || 'N/A'}</td>
                  <td>
                    <span className={`tag ${u.status === 'Active' ? 'tag-green' : 'tag-red'}`}>
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="flex-c gap-2">
                      <button className={`btn btn-sm ${u.status === 'Active' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => toggleStatus(u._id, u.status)}>
                        {u.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                      <button className="btn btn-sm btn-outline">View</button>
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

export default ManageUsers;