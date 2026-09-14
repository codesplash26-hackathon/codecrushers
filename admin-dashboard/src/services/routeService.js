import api from './api';

export const fetchRoutes = async () => {
  const response = await api.get('/routes');
  return response.data;
};

export const createRoute = async (routeData) => {
  const response = await api.post('/routes', routeData);
  return response.data;
};
