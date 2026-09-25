import { fetchApi } from './api';

export const adminService = {
  // Health & Stats
  getHealth: () => fetchApi('/health'),
  getDashboardStats: () => fetchApi('/admin/dashboard-stats'),
  getJourneys: () => fetchApi('/journeys'),

  // Stops & Stations
  getStops: () => fetchApi('/stops'),
  createStop: (data) => fetchApi('/stops', { method: 'POST', body: JSON.stringify(data) }),
  deleteStop: (id) => fetchApi(`/stops/${id}`, { method: 'DELETE' }),

  // Routes
  getRoutes: () => fetchApi('/routes'),
  createRoute: (data) => fetchApi('/routes', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoute: (id) => fetchApi(`/routes/${id}`, { method: 'DELETE' }),

  // Schedules
  getSchedules: () => fetchApi('/schedules'),
  createSchedule: (data) => fetchApi('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  deleteSchedule: (id) => fetchApi(`/schedules/${id}`, { method: 'DELETE' }),

  // Transport Services / Drivers / Vehicles
  getServices: () => fetchApi('/services'),
  createService: (data) => fetchApi('/services', { method: 'POST', body: JSON.stringify(data) }),
  deleteService: (id) => fetchApi(`/services/${id}`, { method: 'DELETE' }),
  updateServiceStatus: (id, status) => fetchApi(`/services/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Disruptions
  getDisruptions: () => fetchApi('/disruptions'),
  getActiveDisruptions: () => fetchApi('/disruptions/active'),
  createDisruption: (data) => fetchApi('/disruptions', { method: 'POST', body: JSON.stringify(data) }),
  resolveDisruption: (id) => fetchApi(`/disruptions/${id}/resolve`, { method: 'PATCH' }),
  deleteDisruption: (id) => fetchApi(`/disruptions/${id}`, { method: 'DELETE' }),

  // Auth
  loginAdmin: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  // Users
  getUsers: () => fetchApi('/users'),
  createUser: (data) => fetchApi('/users', { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (id) => fetchApi(`/users/${id}`, { method: 'DELETE' }),
  updateUserRole: (id, role) => fetchApi(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

  // Notifications
  getNotifications: () => fetchApi('/notifications'),
};

export default adminService;
