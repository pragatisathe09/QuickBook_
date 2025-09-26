import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getUsers = () => api.get('/admin/users');
export const updateUserRole = (userId, role) => api.put(`/admin/users/${userId}/role?role=${role}`);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

export const getRooms = () => api.get('/admin/rooms');
export const createRoom = (roomData) => api.post('/admin/rooms', roomData);
export const updateRoom = (roomId, roomData) => api.put(`/admin/rooms/${roomId}`, roomData);

export const getReservations = () => api.get('/admin/reservations');
export const getRoomReservations = (roomId) => api.get(`/admin/reservations/rooms/${roomId}`);

export const getFeedbacks = () => api.get('/admin/feedbacks');
export const deleteFeedback = (feedbackId) => api.delete(`/admin/feedback/${feedbackId}`);
