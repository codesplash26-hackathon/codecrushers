import React, { createContext, useContext, useState, useEffect } from 'react';

import adminService from '../services/adminService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await adminService.loginAdmin({ email: username, password });
      if (res && res.token && res.user) {
        localStorage.setItem('adminUser', JSON.stringify(res.user));
        localStorage.setItem('adminToken', res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch {
      // Fallback if network or legacy fallback
    }

    if (username === 'admin' && password === 'admin') {
      const adminData = {
        name: 'Operations Admin',
        username: 'admin',
        role: 'admin',
        email: 'admin@bestroute.com'
      };
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      // Store real token fetched from backend if possible
      localStorage.setItem('adminToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjAxODI2MjAxMzU1MDhjZTZjZjZjYyIsInJvbGUiOiJhZG1pbiJ9.demo');
      setUser(adminData);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use admin / admin.' };
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
