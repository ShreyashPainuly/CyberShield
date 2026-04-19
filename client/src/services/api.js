import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cybershield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cybershield_token');
      localStorage.removeItem('cybershield_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// ── Scan ──────────────────────────────────────
export const scanAPI = {
  scanUrl: (url) => api.post('/scan', { url }),
  getScan: (id) => api.get(`/scan/${id}`)
};

// ── History ───────────────────────────────────
export const historyAPI = {
  getHistory: (params) => api.get('/history', { params }),
  getStats: () => api.get('/history/stats'),
  deleteScan: (id) => api.delete(`/history/${id}`)
};

// ── Contact ──────────────────────────────────
export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data)
};

export default api;
