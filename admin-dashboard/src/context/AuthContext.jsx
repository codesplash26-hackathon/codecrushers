import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);

  return (
    <AuthContext.Provider value={{ adminUser, setAdminUser }}>
      {children}
    </AuthContext.Provider>
  );
};
