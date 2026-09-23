import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (username, password) => {
    // For admin console demo / production fallback
    if (username === 'admin' && password === 'admin') {
      const adminData = {
        name: 'Operations Admin',
        username: 'admin',
        role: 'SUPER_ADMIN',
        email: 'admin@bestroute.lk'
      };
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      localStorage.setItem('adminToken', 'demo-jwt-token-admin-2026');
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
