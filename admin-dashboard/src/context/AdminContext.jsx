import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [activeDisruptions, setActiveDisruptions] = useState([]);

  return (
    <AdminContext.Provider value={{ activeDisruptions, setActiveDisruptions }}>
      {children}
    </AdminContext.Provider>
  );
};
