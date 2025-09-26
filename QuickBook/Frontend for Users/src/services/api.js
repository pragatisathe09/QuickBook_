import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Add error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Server is not responding');
    }

    if (!error.response) {
      throw new Error('Network error - Unable to reach the server');
    }

    switch (error.response.status) {
      case 401:
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired - Please login again');
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Internal server error - Please try again later');
      default:
        throw error;
    }
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  getProfile: () => api.get('/users/profile'),
  logout: () => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const roomsAPI = {
  getAll: () => api.get('/rooms')
};

export const reservationsAPI = {
  getAll: () => api.get('/users/reservations'),
  getMy: () => api.get('/users/my_reservations'),
  // create: (data) => api.post('/users/reservations', data),
  create: async (data) => {
    try {
      // Ensure the data matches the expected format
      const reservationData = {
        roomId: Number(data.roomId), // Ensure roomId is a number
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        amenities: data.amenities
      };

      console.log('Sending reservation data:', reservationData);

      const response = await api.post('/users/reservations', reservationData);
      return response;
    } catch (error) {
      console.error('Reservation creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        requestData: error.config?.data
      });

      throw error;
    }
  },
  update: (id, data) => api.put(`/users/reservations/${id}`, data),
  cancel: (id) => api.delete(`/users/reservations/${id}`)
};

export const feedback = {
  getUserFeedback: (userId) => api.get(`/feedbacks/user/${userId}`),
  create: (data) => api.post('/feedbacks', data)
};

export default api;
