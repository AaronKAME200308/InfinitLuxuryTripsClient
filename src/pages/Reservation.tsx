// ============================================================
// ILT — Reservation Page
// Formulaire 3 étapes + Stripe Checkout + Zelle workflow
// ============================================================
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDestinations, useReservation } from '../hooks';
import {
  PageHeader, GoldButton, RoyalButton, OutlineButton,
  FormField, inputStyle, selectStyle
} from '../components/UI';
import { createStripeCheckoutSession, getZelleInfo } from '../services/api';

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  destinationId?: string;
  destinationName?: string;
  travelDate?: string;
  guests?: string;
  duration?: string;
  specialRequests?: string;
  submit?: string;
}

interface ReservationResult { 
  success: boolean;
  reservationId: string;
  reference: string;
  message?: string;
}


// ---- Step indicator ----
const StepIndicator = ({ step }: { step: number }) => {
  const steps = ['Your Details', 'Trip Info', 'Payment'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step >= n;
        const done   = step > n;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: active
                  ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
                  : '#ebebeb',
                color: active ? 'var(--dark)' : '#bbb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 700, margin: '0 auto 10px',
                transition: 'all 0.3s'
              }}>{done ? '✓' : n}</div>
              <div style={{
                fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                color: active ? 'var(--royal)' : '#ccc', transition: 'color 0.3s'
              }}>{label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 80, height: 1, margin: '0 8px 20px',
                background: step > n ? 'var(--gold)' : '#ebebeb',
                transition: 'background 0.3s'
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---- Main component ----
const Reservation = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefill   = location.state || {};
  const zelleInfo = getZelleInfo();

  const [step, setStep]                 = useState(1);
  const [errors, setErrors]             = useState<Errors>({});
  const [payMethod, setPayMethod]       = useState('stripe');
  const [reservationResult, setResult]  = useState(null as ReservationResult | null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    phone:           '',
    destinationId:   prefill.destinationId   || '',
    destinationName: prefill.destinationName || '',
    travelDate:      prefill.date            || '',
    guests:          String(prefill.guests   || 2),
    duration:        '7',
    specialRequests: ''
  });

  const { destinations, loading: destLoading } = useDestinations();
  const { submitReservation }                  = useReservation();

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  // Destination sélectionnée & montant estimé
  const selectedDest    = destinations.find(d => d.id === form.destinationId);
  const estimatedAmount = selectedDest
    ? selectedDest.price * parseInt(form.guests || "1")
    : 0;

  // ---- Validation ----
  const validateStep1 = () => {
    const errs : Errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Full name required (min 2 characters)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email address required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Errors = {};
    const today = new Date(); today.setHours(0,0,0,0);
    if (!form.destinationId)
      errs.destinationId = 'Please select a destination';
    if (!form.travelDate)
      errs.travelDate = 'Travel date is required';
    else if (new Date(form.travelDate) <= today)
      errs.travelDate = 'Travel date must be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Créer la réservation dans Supabase via backend
      const result = await submitReservation({
        name:            form.name.trim(),
        email:           form.email.trim().toLowerCase(),
        phone:           form.phone || null,
        destinationId:   form.destinationId,
        destinationName: selectedDest?.name || form.destinationName,
        travelDate:      form.travelDate,
        guests:          parseInt(form.guests),
        duration:        parseInt(form.duration),
        specialRequests: form.specialRequests || null,
        paymentMethod:   payMethod,
        amount:          estimatedAmount
      });

      setResult(result);

      // 2. Paiement selon méthode
      if (payMethod === 'stripe') {
        // Redirige vers Stripe Checkout (window.location.href)
        await createStripeCheckoutSession({
          reservationId:   result.reservationId,
          amount:          estimatedAmount,
          destinationName: selectedDest?.name,
          customerEmail:   form.email,
          reference:       result.reference
        });
        // La page se redirige — le code ci-dessous ne s'exécute pas
      } else {
        // Zelle → afficher les instructions
        setStep(4);
      }

    } catch (err: any) {
      setErrors({ submit: err.message });
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <PageHeader
        label="Your Journey Awaits"
        title="Make a"
        highlight="Reservation"
        imageUrl="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80"
      />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>
        {step < 4 && <StepIndicator step={step} />}

        <div style={{
          background: '#fff', borderRadius: 4, padding: '48px 52px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(201,168,76,0.15)'
        }}>

          {/* ======= STEP 1 : Personal Details ======= */}
          {step === 1 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 36px' }}>
                Personal <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Information</span>
              </h2>

              <FormField label="Full Name *" error={errors.name}>
                <input
                  type="text" placeholder="John Doe" autoComplete="name"
                  value={form.name} onChange={e => update('name', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#ddd' }}
                />
              </FormField>

              <FormField label="Email Address *" error={errors.email}>
                <input
                  type="email" placeholder="john@example.com" autoComplete="email"
                  value={form.email} onChange={e => update('email', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.email ? '#e53e3e' : '#ddd' }}
                />
              </FormField>

              <FormField label="Phone Number (optional)">
                <input
                  type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel"
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  style={inputStyle}
                />
              </FormField>

              <GoldButton onClick={() => validateStep1() && setStep(2)} fullWidth>
                Continue →
              </GoldButton>
            </div>
          )}

          {/* ======= STEP 2 : Trip Details ======= */}
          {step === 2 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 36px' }}>
                Trip <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Details</span>
              </h2>

              <FormField label="Destination *" error={errors.destinationId}>
                <select
                  value={form.destinationId}
                  onChange={e => {
                    const dest = destinations.find(d => d.id === e.target.value);
                    update('destinationId', e.target.value);
                    update('destinationName', dest?.name || '');
                  }}
                  style={{ ...selectStyle, borderColor: errors.destinationId ? '#e53e3e' : '#ddd' }}
                >
                  <option value="">
                    {destLoading ? 'Loading destinations...' : 'Select a destination...'}
                  </option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — from ${Number(d.price).toLocaleString()}/person
                    </option>
                  ))}
                </select>
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="Travel Date *" error={errors.travelDate}>
                  <input
                    type="date" min={today}
                    value={form.travelDate} onChange={e => update('travelDate', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.travelDate ? '#e53e3e' : '#ddd' }}
                  />
                </FormField>
                <FormField label="Number of Guests">
                  <select
                    value={form.guests} onChange={e => update('guests', e.target.value)}
                    style={selectStyle}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Duration (nights)">
                <select
                  value={form.duration} onChange={e => update('duration', e.target.value)}
                  style={selectStyle}
                >
                  {[3, 5, 7, 10, 14, 21].map(n => (
                    <option key={n} value={n}>{n} nights</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Special Requests (optional)">
                <textarea
                  rows={4} value={form.specialRequests}
                  onChange={e => update('specialRequests', e.target.value)}
                  placeholder="Anniversaries, dietary needs, accessibility requirements, preferred room type..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </FormField>

              {/* Estimation du prix */}
              {selectedDest && (
                <div style={{
                  background: 'rgba(30,27,107,0.04)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: 4, padding: '16px 24px', marginBottom: 28,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>
                      Estimated Total
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      ${Number(selectedDest.price).toLocaleString()} × {form.guests} guest{parseInt(form.guests) > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--royal)' }}>
                    ${estimatedAmount.toLocaleString()}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                <OutlineButton onClick={() => setStep(1)}>← Back</OutlineButton>
                <GoldButton
                  onClick={() => validateStep2() && setStep(3)}
                  style={{ flex: 1 }}
                >Continue →</GoldButton>
              </div>
            </div>
          )}

          {/* ======= STEP 3 : Payment ======= */}
          {step === 3 && (
            <div className="fade-up">
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 8px' }}>
                Choose <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Payment</span>
              </h2>
              <p style={{ color: '#999', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
                Select your preferred payment method to complete your reservation.
              </p>

              {/* Payment method toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                {[
                  { id: 'stripe', icon: '💳', label: 'Credit Card',        sub: 'Secured by Stripe · Instant confirmation' },
                  { id: 'zelle',  icon: '⚡', label: 'Zelle Bank Transfer', sub: 'Zero fees · USA banks only' }
                ].map(({ id, icon, label, sub }) => (
                  <div
                    key={id}
                    onClick={() => setPayMethod(id)}
                    style={{
                      padding: '20px 22px', borderRadius: 4, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${payMethod === id ? 'var(--gold)' : '#eee'}`,
                      background: payMethod === id ? 'rgba(201,168,76,0.05)' : '#fafafa',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--dark)', marginBottom: 5 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.4 }}>{sub}</div>
                    {payMethod === id && (
                      <div style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: 2, marginTop: 10 }}>✓ SELECTED</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Stripe info box */}
              {payMethod === 'stripe' && (
                <div style={{
                  background: '#f8f8ff', border: '1px solid #e8e8f5',
                  borderRadius: 4, padding: '20px 24px', marginBottom: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>🔒</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--dark)', fontSize: 15 }}>Secured by Stripe</div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>PCI DSS Level 1 · 3D Secure Authentication</div>
                    </div>
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#777', fontSize: 13, lineHeight: 1.8 }}>
                    <li>You'll be redirected to Stripe's secure checkout page</li>
                    <li>Card details are never stored on our servers</li>
                    <li>Confirmation email sent automatically upon payment</li>
                    <li>Fraud detection powered by Stripe Radar</li>
                  </ul>
                </div>
              )}

              {/* Zelle info box */}
              {payMethod === 'zelle' && (
                <div style={{
                  background: 'rgba(30,27,107,0.03)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 4, padding: '22px 26px', marginBottom: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#6B3FA0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 18, fontWeight: 800, flexShrink: 0
                    }}>Z</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--dark)', fontSize: 15 }}>
                        Zelle Payment Instructions
                      </div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>Complete after submitting this form</div>
                    </div>
                  </div>
                  {zelleInfo.instructions.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)',
                        color: 'var(--dark)', fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                  <div style={{
                    background: 'rgba(201,168,76,0.1)', borderRadius: 3,
                    padding: '10px 14px', marginTop: 14
                  }}>
                    <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.6 }}>
                      🔒 <strong>Security:</strong> ILT will never contact you to change the payment address.
                      Our official Zelle address is always: <strong>{zelleInfo.email}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Booking summary */}
              <div style={{
                background: '#f9f7f2', borderRadius: 4, padding: '20px 24px', marginBottom: 24,
                border: '1px solid #eee'
              }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
                  Booking Summary
                </div>
                {[
                  ['Traveler',     form.name],
                  ['Destination',  selectedDest?.name || form.destinationName],
                  ['Date',         form.travelDate
                    ? new Date(form.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'],
                  ['Guests',       `${form.guests} person${parseInt(form.guests) > 1 ? 's' : ''}`],
                  ['Duration',     `${form.duration} nights`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: 14 }}>
                    <span style={{ color: '#999' }}>{k}</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v || '—'}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#eee', margin: '14px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Total</span>
                  <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--gold)' }}>
                    ${estimatedAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error message */}
              {errors.submit && (
                <div style={{
                  color: '#e53e3e', fontSize: 13, marginBottom: 18,
                  padding: '12px 16px', background: '#fff5f5',
                  borderRadius: 4, border: '1px solid #fed7d7'
                }}>
                  ⚠️ {errors.submit}
                </div>
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                <OutlineButton onClick={() => setStep(2)}>← Back</OutlineButton>
                <RoyalButton
                  onClick={handleSubmit}
                  style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}
                >
                  {isSubmitting
                    ? '⏳ Processing...'
                    : payMethod === 'stripe'
                      ? '🔒 Pay Securely with Stripe'
                      : '⚡ Confirm & Pay with Zelle'}
                </RoyalButton>
              </div>

              <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: 16 }}>
                No hidden fees · Free cancellation within 48h · Secure payments
              </p>
            </div>
          )}

          {/* ======= STEP 4 : Zelle Confirmation ======= */}
          {step === 4 && reservationResult && (
            <div className="fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 32px', fontSize: 36
              }}>⚡</div>

              <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 16 }}>
                Almost There!
              </div>
              <h2 style={{ fontSize: 38, fontWeight: 300, color: 'var(--dark)', margin: '0 0 14px' }}>
                Complete Your <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Payment</span>
              </h2>
              <p style={{ color: '#777', fontSize: 15, lineHeight: 1.8, maxWidth: 460, margin: '0 auto 32px' }}>
                Dear <strong>{form.name}</strong>, your reservation is pending payment.
                Please send your Zelle payment now to confirm your booking.
              </p>

              {/* Reference */}
              <div style={{
                background: '#f9f7f2', borderRadius: 4, padding: 20,
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'inline-block', marginBottom: 28
              }}>
                <div style={{ fontSize: 11, color: '#aaa', letterSpacing: 3, marginBottom: 6 }}>BOOKING REFERENCE</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--royal)', letterSpacing: 4 }}>
                  {reservationResult.reference}
                </div>
              </div>

              {/* Zelle payment details */}
              <div style={{
                background: 'rgba(30,27,107,0.04)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: 4, padding: '24px 28px', marginBottom: 32,
                textAlign: 'left', maxWidth: 480, margin: '0 auto 32px'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--royal)', marginBottom: 16, fontSize: 16 }}>
                  ⚡ Send your Zelle payment now
                </div>
                {[
                  ['Send to',  zelleInfo.email],
                  ['Amount',   `$${estimatedAmount.toLocaleString()}`],
                  ['Memo',     reservationResult.reference]
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                    <span style={{ color: '#aaa', minWidth: 72, fontSize: 13 }}>{k}:</span>
                    <span style={{
                      color: 'var(--dark)', fontWeight: 700, fontSize: 15,
                      background: '#f0ede8', padding: '4px 10px', borderRadius: 3,
                      fontFamily: 'monospace', letterSpacing: 1
                    }}>{v}</span>
                  </div>
                ))}
                <p style={{ color: '#aaa', fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
                  ⚠️ A confirmation email has been sent to <strong>{form.email}</strong>.
                  Your reservation will be confirmed within 2 hours of payment receipt.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <GoldButton onClick={() => navigate('/')}>Return to Home</GoldButton>
                <OutlineButton onClick={() => navigate('/contact')}>Contact Concierge</OutlineButton>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Reservation;
