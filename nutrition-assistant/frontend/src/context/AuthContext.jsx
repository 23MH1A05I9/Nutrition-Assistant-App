// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../services/api';

// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       api.get('/auth/profile')
//         .then(res => {
//           setUser(res.data);
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//           delete api.defaults.headers.common['Authorization'];
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(user);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(user);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Registration failed' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete api.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (token && savedRole) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setRole(savedRole);
      fetchUserProfile(savedRole);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userRole) => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userRole) => {
    try {
      const response = await api.post('/auth/login', { email, password, role: userRole });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setRole(user.role);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setRole(user.role);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setRole(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      login, 
      register, 
      logout, 
      setUser: updateUser,
      updateUser, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};