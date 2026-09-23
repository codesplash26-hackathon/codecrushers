import { fetchApi } from './api';

export const adminService = {
  // Health & Stats
  getHealth: () => fetchApi('/health'),

  // Stops & Stations
  getStops: () => fetchApi('/stops'),
  createStop: (data) => fetchApi('/stops', { method: 'POST', body: JSON.stringify(data) }),
  deleteStop: (id) => fetchApi(`/stops/${id}`, { method: 'DELETE' }),

  // Routes
  getRoutes: () => fetchApi('/routes'),
  createRoute: (data) => fetchApi('/routes', { method: 'POST', body: JSON.stringify(data) }),

  // Schedules
  getSchedules: () => fetchApi('/schedules'),
  createSchedule: (data) => fetchApi('/schedules', { method: 'POST', body: JSON.stringify(data) }),

  // Transport Services
  getServices: () => fetchApi('/services'),
  createService: (data) => fetchApi('/services', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  loginAdmin: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
};
