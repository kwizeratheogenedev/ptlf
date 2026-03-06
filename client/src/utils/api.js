import axios from 'axios';

// Use relative URL in production, absolute URL in development
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Profile APIs
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const updateProfileImage = (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  return api.put('/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Achievement APIs
export const getAchievements = () => api.get('/achievements');
export const getAchievement = (id) => api.get(`/achievements/${id}`);
export const createAchievement = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return api.post('/achievements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateAchievement = (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  return api.put(`/achievements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);

// Service APIs
export const getServices = () => api.get('/services');
export const getAdminServices = () => api.get('/services/admin');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Message APIs
export const sendMessage = (data) => api.post('/messages', data);
export const getMessages = () => api.get('/messages');
export const getUnreadCount = () => api.get('/messages/unread');
export const markMessageAsRead = (id) => api.put(`/messages/${id}/read`);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export default api;
