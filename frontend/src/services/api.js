import axios from 'axios';

// Базовый URL API - используем переменную окружения или дефолтное значение
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API методы для участников
export const participantsAPI = {
  getAll: () => api.get('/participants'),
  getTop: (limit = 10) => api.get(`/participants/top?limit=${limit}`),
  getById: (id) => api.get(`/participants/${id}`),
  create: (data) => api.post('/participants', data),
  update: (id, data) => api.put(`/participants/${id}`, data),
  delete: (id) => api.delete(`/participants/${id}`),
};

// API методы для событий
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getUpcoming: (limit = 10) => api.get(`/events/upcoming?limit=${limit}`),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// API методы для новостей
export const newsAPI = {
  getAll: () => api.get('/news'),
  getAllAdmin: () => api.get('/news?admin=true'),
  getLatest: (limit = 10) => api.get(`/news/latest?limit=${limit}`),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

export default api;

