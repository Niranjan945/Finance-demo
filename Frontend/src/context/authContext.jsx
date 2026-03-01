import React, { createContext, useState, useEffect } from 'react';
import api from '../Api/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && token !== 'undefined' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token });
      } catch (e) {
        console.error("Failed to parse stored user");
        localStorage.removeItem('user');
      }
    } else if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    const userData = response.data.data || response.data.user || response.data;
    const token = userData.token || response.data.token;

    if (!token) throw new Error("No token received from server");

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));   // ← THIS WAS MISSING

    setUser({ ...userData, token });
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    
    const userData = response.data.data || response.data.user || response.data;
    const token = userData.token || response.data.token;

    if (!token) throw new Error("No token received from server");

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));   // ← THIS WAS MISSING

    setUser({ ...userData, token });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};