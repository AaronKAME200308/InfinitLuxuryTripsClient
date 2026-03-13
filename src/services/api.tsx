// ============================================================
// ILT — API Service (React Client)
// Toutes les communications avec le backend Node.js
// ============================================================

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001';

// ============================================================
// TYPES
// ============================================================

export interface ReservationPayload {
  name: string;
  email: string;
  phone: string | null;
  destinationId: string;
  destinationName: string;
  travelDate: string;
  guests: number;
  duration: number;
  specialRequests: string | null;
  paymentMethod: 'stripe' | 'zelle';
  amount: number;
}

export interface ReservationResult {
  success: boolean;
  reference: string;
  reservationId: string;
  paymentMethod: 'stripe' | 'zelle';
  message: string;
}

export interface StripeSessionPayload {
  reservationId: string;
  amount: number;
  destinationName: string;
  customerEmail: string;
  reference: string;
}

export interface StripeVerifyResult {
  success: boolean;
  status: 'paid' | 'unpaid' | 'no_payment_required';
  customerEmail: string;
  reference: string;
  amountTotal?: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ZelleInfo {
  email: string;
  instructions: string[];
}

// ============================================================
// HELPER — fetch centralisé avec gestion d'erreurs
// ============================================================
const apiFetch = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    // Le backend retourne toujours { error: string, details?: string[] }
    const message = data.details
      ? `${data.error}: ${data.details.join(', ')}`
      : data.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
};

// ============================================================
// HEALTH CHECK
// ============================================================
export const checkServerHealth = () =>
  apiFetch<{ status: string; message: string; environment: string; timestamp: string }>('/api/health');

// ============================================================
// DESTINATIONS
// Utilise le backend Node (pas Supabase direct) pour cohérence
// ============================================================
export const getDestinationsFromAPI = (category?: string | null) =>
  apiFetch<{ success: boolean; destinations: any[] }>(
    `/api/destinations${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`
  );

export const getDestinationFromAPI = (id: string) =>
  apiFetch<{ success: boolean; destination: any }>(`/api/destinations/${id}`);

// ============================================================
// RÉSERVATIONS
// ============================================================

/**
 * Crée une réservation en base + envoie l'email Zelle si besoin
 * POST /api/reservations
 * Retourne : { success, reference, reservationId, paymentMethod, message }
 */
export const createReservation = (payload: ReservationPayload) =>
  apiFetch<ReservationResult>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ============================================================
// PAIEMENTS — STRIPE
// ============================================================

/**
 * Crée une session Stripe Checkout et redirige automatiquement
 * POST /api/payments/create-checkout-session
 * Le backend retourne { success, url, sessionId }
 */
export const createStripeCheckoutSession = async (payload: StripeSessionPayload): Promise<void> => {
  const data = await apiFetch<{ success: boolean; url: string; sessionId: string }>(
    '/api/payments/create-checkout-session',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  // Redirection vers Stripe Checkout
  if (data.url) {
    window.location.href = data.url;
  }
};

/**
 * Vérifie le statut d'un paiement Stripe après redirection
 * GET /api/payments/verify/:sessionId
 * Retourne : { success, status, customerEmail, reference, amountTotal }
 */
export const verifyStripePayment = (sessionId: string) =>
  apiFetch<StripeVerifyResult>(`/api/payments/verify/${sessionId}`);

// ============================================================
// PAIEMENTS — ZELLE
// Info locale (pas d'appel backend — données statiques)
// ============================================================
export const getZelleInfo = (): ZelleInfo => {
  const email = import.meta.env.VITE_APP_ZELLE_EMAIL || 'infiniteluxurytrips@gmail.com';
  return {
    email,
    instructions: [
      'Open your banking app or the Zelle app',
      `Send payment to: ${email}`,
      'Include your booking reference in the memo field',
      'Take a screenshot of the confirmation',
      'Your reservation will be confirmed within 2 hours of payment receipt',
    ],
  };
};

// ============================================================
// CONTACT
// POST /api/contact
// ============================================================
export const sendContactMessage = (payload: ContactPayload) =>
  apiFetch<{ success: boolean; message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });