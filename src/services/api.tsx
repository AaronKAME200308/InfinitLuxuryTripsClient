import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001';

// Instance axios avec config de base
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur — gestion globale des erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ================================
// DESTINATIONS
// ================================
export const getDestinations = (category) =>
  api.get('/api/destinations', { params: { category } });

export const getDestination = (id) =>
  api.get(`/api/destinations/${id}`);

// ================================
// RÉSERVATIONS
// ================================
export const createReservation = (data) =>
  api.post('/api/reservations', data);

// ================================
// PAIEMENTS
// ================================
export const createStripeSession = (data) =>
  api.post('/api/payments/create-checkout-session', data);

export const verifyStripePayment = (sessionId) =>
  api.get(`/api/payments/verify/${sessionId}`);

// ================================
// CONTACT
// ================================
export const sendContactMessage = (data) =>
  api.post('/api/contact', data);

// ================================
// SANTÉ DU SERVEUR
// ================================
export const checkServerHealth = () =>
  api.get('/api/health');

export default api;
