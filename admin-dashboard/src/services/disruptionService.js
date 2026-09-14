import api from './api';

export const reportDisruption = async (disruptionData) => {
  const response = await api.post('/disruptions/report', disruptionData);
  return response.data;
};

export const getActiveDisruptions = async () => {
  const response = await api.get('/disruptions/active');
  return response.data;
};
