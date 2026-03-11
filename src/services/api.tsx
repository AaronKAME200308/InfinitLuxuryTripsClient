// ============================================================
// ILT — API Service (React Client)
// Toutes les communications avec le backend Node.js
// ============================================================

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';



// --------------------------------
// Helper fetch avec gestion erreurs
// --------------------------------
const apiFetch = async (path: string, options: any = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
};

// ================================
// HEALTH CHECK
// ================================
export const checkServerHealth = () =>
  apiFetch('/api/health');

// ================================
// DESTINATIONS
// ================================
export const getDestinationsFromAPI = (category: string) =>
  apiFetch(`/api/destinations${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`);

export const getDestinationFromAPI = (id: string) =>
  apiFetch(`/api/destinations/${id}`);

// ================================
// RÉSERVATIONS
// ================================

/**
 * Créer une réservation
 * Retourne : { success, reference, reservationId, paymentMethod, amount }
 */
export const createReservation = (data: any) =>
  apiFetch('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(data)
  });

/**
 * Vérifier le statut d'une réservation par référence
 * Retourne : { success, reservation }
 */
export const getReservationStatus = (reference: string  ) =>
  apiFetch(`/api/reservations/status/${reference}`);

// ================================
// PAIEMENTS — STRIPE
// ================================

/**
 * Créer une session Stripe Checkout
 * Retourne : { success, url, sessionId }
 * → Rediriger l'utilisateur vers url
 */
export const createStripeCheckoutSession = async ({
  reservationId,
  amount,
  destinationName,
  customerEmail,
  reference
}: {
  reservationId: string;
  amount: number;
  destinationName: string;
  customerEmail: string;
  reference: string;
}) => {
  const data = await apiFetch('/api/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ reservationId, amount, destinationName, customerEmail, reference })
  });

  // Redirection automatique vers Stripe
  if (data.url) {
    window.location.href = data.url;
  }

  return data;
};

/**
 * Vérifier un paiement Stripe après redirection
 * Retourne : { success, status, customerEmail, reference, amountTotal }
 */
export const verifyStripePayment = (sessionId: string) =>
  apiFetch(`/api/payments/verify/${sessionId}`);

// ================================
// PAIEMENTS — ZELLE
// ================================

/**
 * Récupère les infos Zelle depuis le .env pour l'affichage
 */
export const getZelleInfo = () => ({
  email: import.meta.env.REACT_APP_ZELLE_EMAIL || 'concierge@infiniteluxurytrips.com',
  instructions: [
    'Open your banking app or the Zelle app',
    `Send payment to: ${import.meta.env.REACT_APP_ZELLE_EMAIL || 'concierge@infiniteluxurytrips.com'}`,
    'Include your booking reference in the memo field',
    'Take a screenshot of the confirmation',
    'Your reservation will be confirmed within 2 hours'
  ]
});

// ================================
// CONTACT
// ================================
export const sendContactMessage = (data: any) =>
  apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  });
