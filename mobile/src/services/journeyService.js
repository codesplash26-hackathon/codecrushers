import api from './api';

export const planJourney = async (journeyParams) => {
  const response = await api.post('/journey/plan', journeyParams);
  return response.data;
};

export const reoptimizeJourney = async (rerouteParams) => {
  const response = await api.post('/journey/reoptimize', rerouteParams);
  return response.data;
};
