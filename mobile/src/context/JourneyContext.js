import React, { createContext, useState } from 'react';

export const JourneyContext = createContext();

export const JourneyProvider = ({ children }) => {
  const [activeJourney, setActiveJourney] = useState(null);
  const [journeyHistory, setJourneyHistory] = useState([]);

  return (
    <JourneyContext.Provider value={{ activeJourney, setActiveJourney, journeyHistory, setJourneyHistory }}>
      {children}
    </JourneyContext.Provider>
  );
};
