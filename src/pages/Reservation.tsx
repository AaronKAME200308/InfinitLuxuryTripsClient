import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDestinations, useReservation } from '../hooks';
import { PageHeader, GoldButton, RoyalButton, OutlineButton, FormField, inputStyle, selectStyle } from '../components/UI';
import { createStripeSession } from '../services/api';

const STEPS = ['Your Details', 'Trip Info', 'Payment'];

const StepIndicator = ({ step }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
    {STEPS.map((label, i) => {
      const n = i + 1;
      const active = step >= n;
      return (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: active ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : '#e8e8e8',
              color: active ? 'var(--dark)' : '#aaa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, margin: '0 auto 10px',
              transition: 'all 0.3s'
            }}>{step > n ? '✓' : n}</div>
            <div style={{
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: active ? 'var(--royal)' : '#bbb', transition: 'color 0.3s'
            }}>{label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: 80, height: 1,
              background: step > n ? 'var(--gold)' : '#e8e8e8',
              margin: '0 8px 20px', transition: 'background 0.3s'
            }}/>
          )}
        </div>
      );
    })}
  </div>
);

const Reservation = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const prefill     = location.state || {};

  const [step, setStep]   = useState(1);
  const [errors, setErrors] = useState({});
  const [payMethod, setPayMethod] = useState('stripe');
  const [reservationResult, setReservationResult] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destinationId: prefill.destinationId || '',
    destinationName: prefill.destinationName || '',
    travelDate: prefill.date || '',
    guests: prefill.guests || '2',
    duration: '7',
    specialRequests: '',
    zelleConfirmation: ''
  });

  const { destinations } = useDestinations();
  const { submitReservation, loading } = useReservation();

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  // ---- Validation step 1 ----
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Full name required (min 2 characters)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- Validation step 2 ----
  const validateStep2 = () => {
    const errs = {};
    if (!form.destinationId) errs.destinationId = 'Please select a destination';
    if (!form.travelDate) errs.travelDate = 'Travel date required';
    else if (new Date(form.travelDate) <= new Date()) errs.travelDate = 'Date must be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- Submit & pay ----
  const handleSubmit = async () => {
    try {
      const dest = destinations.find(d => d.id === form.destinationId);
      const amount = dest ? dest.price * parseInt(form.guests) : 0;

      const data = await submitReservation({
        ...form,
        paymentMethod: payMethod,
        amount,
        destinationName: dest?.name || form.destinationName
      });

      setReservationResult(data);

      if (payMethod === 'stripe') {
        // Redirection vers Stripe Checkout
        await createStripeSession({
          reservationId: data.reservationId,
          amount,
          destinationName: dest?.name,
          customerEmail: form.email,
          reference: data.reference
        });
      } else {
        // Zelle → page confirmation
        setStep(4);
      }
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const selectedDest = destinations.find(d => d.id === form.destinationId);
  const estimatedAmount = selectedDest ? selectedDest.price * parseInt(form.guests || 1) : 0;

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <PageHeader
        label="Your Journey Awaits"
        title="Make a"
        highlight="Reservation"
        imageUrl="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80"
      />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 40px' }}>
        {step < 4 && <StepIndicator step={step} />}

        <div style={{
          background: '#fff', borderRadius: 4, padding: '48px 52px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(201,168,76,0.15)'
        }}>

          {/* ---- STEP 1 : Personal Details ---- */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 36px' }}>
                Personal <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Information</span>
              </h2>

              <FormField label="Full Name" error={errors.name}>
                <input type="text" placeholder="John Doe"
                  value={form.name} onChange={e => update('name', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#ddd' }}/>
              </FormField>

              <FormField label="Email Address" error={errors.email}>
                <input type="email" placeholder="john@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.email ? '#e53e3e' : '#ddd' }}/>
              </FormField>

              <FormField label="Phone Number (optional)">
                <input type="tel" placeholder="+1 (555) 000-0000"
                  value={form.phone} onChange={e => update('phone', e.target.value)}
                  style={inputStyle}/>
              </FormField>

              <GoldButton onClick={() => validateStep1() && setStep(2)} fullWidth>
                Continue →
              </GoldButton>
            </div>
          )}

          {/* ---- STEP 2 : Trip Details ---- */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 36px' }}>
                Trip <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Details</span>
              </h2>

              <FormField label="Destination" error={errors.destinationId}>
                <select value={form.destinationId}
                  onChange={e => {
                    const dest = destinations.find(d => d.id === e.target.value);
                    update('destinationId', e.target.value);
                    update('destinationName', dest?.name || '');
                  }}
                  style={{ ...selectStyle, borderColor: errors.destinationId ? '#e53e3e' : '#ddd' }}>
                  <option value="">Select a destination...</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — from ${Number(d.price).toLocaleString()}/person</option>
                  ))}
                </select>
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FormField label="Travel Date" error={errors.travelDate}>
                  <input type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.travelDate} onChange={e => update('travelDate', e.target.value)}
                    style={{ ...inputStyle, borderColor: errors.travelDate ? '#e53e3e' : '#ddd' }}/>
                </FormField>
                <FormField label="Number of Guests">
                  <select value={form.guests} onChange={e => update('guests', e.target.value)} style={selectStyle}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Duration (nights)">
                <select value={form.duration} onChange={e => update('duration', e.target.value)} style={selectStyle}>
                  {[3,5,7,10,14,21].map(n => (
                    <option key={n} value={n}>{n} nights</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Special Requests (optional)">
                <textarea rows={4} value={form.specialRequests}
                  onChange={e => update('specialRequests', e.target.value)}
                  placeholder="Anniversaries, dietary needs, accessibility requirements..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}/>
              </FormField>

              {/* Price estimate */}
              {selectedDest && (
                <div style={{
                  background: 'rgba(30,27,107,0.04)', border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: 4, padding: '16px 20px', marginBottom: 28,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ color: '#888', fontSize: 14 }}>Estimated Total</span>
                  <span style={{ color: 'var(--royal)', fontSize: 24, fontWeight: 600 }}>
                    ${estimatedAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                <OutlineButton onClick={() => setStep(1)}>← Back</OutlineButton>
                <GoldButton onClick={() => validateStep2() && setStep(3)} style={{ flex: 1 }}>
                  Continue →
                </GoldButton>
              </div>
            </div>
          )}

          {/* ---- STEP 3 : Payment ---- */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 34, fontWeight: 300, color: 'var(--dark)', margin: '0 0 8px' }}>
                Choose <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Payment</span>
              </h2>
              <p style={{ color: '#888', fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
                Select your preferred payment method to complete your reservation.
              </p>

              {/* Payment method selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                {[
                  { id: 'stripe', icon: '💳', label: 'Credit Card', sublabel: 'Secure via Stripe' },
                  { id: 'zelle',  icon: '⚡', label: 'Zelle',       sublabel: 'Instant bank transfer' }
                ].map(({ id, icon, label, sublabel }) => (
                  <div key={id} onClick={() => setPayMethod(id)} style={{
                    padding: '20px 24px', borderRadius: 4, cursor: 'pointer',
                    border: `2px solid ${payMethod === id ? 'var(--gold)' : '#eee'}`,
                    background: payMethod === id ? 'rgba(201,168,76,0.05)' : '#fff',
                    transition: 'all 0.2s', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--dark)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{sublabel}</div>
                    {payMethod === id && (
                      <div style={{ color: 'var(--gold)', fontSize: 11, marginTop: 8, letterSpacing: 2 }}>✓ SELECTED</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Zelle instructions */}
              {payMethod === 'zelle' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(30,27,107,0.04), rgba(201,168,76,0.06))',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 4, padding: 28, marginBottom: 28
                }}>
                  <h3 style={{ color: 'var(--royal)', margin: '0 0 16px', fontSize: 17 }}>
                    ⚡ Zelle Payment Instructions
                  </h3>
                  {[
                    ['Send to', process.env.REACT_APP_ZELLE_EMAIL || 'concierge@infiniteluxurytrips.com'],
                    ['Amount', `$${estimatedAmount.toLocaleString()}`],
                    ['Memo', 'Your booking reference (provided after submission)']
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 14 }}>
                      <span style={{ color: '#aaa', minWidth: 72 }}>{k}:</span>
                      <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                  <p style={{ color: '#aaa', fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
                    ⚠️ Your reservation will be confirmed within 2 hours of payment receipt.
                    ILT will never ask you to change the payment address.
                  </p>
                </div>
              )}

              {/* Stripe info */}
              {payMethod === 'stripe' && (
                <div style={{
                  background: 'rgba(30,27,107,0.03)', border: '1px solid #eee',
                  borderRadius: 4, padding: 24, marginBottom: 28
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>🔒</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--dark)', fontSize: 15 }}>Secured by Stripe</div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>PCI DSS Level 1 · 3D Secure · 135 countries</div>
                    </div>
                  </div>
                  <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    You'll be redirected to a secure Stripe Checkout page. Your card details are never stored on our servers.
                    Confirmation email sent automatically upon payment.
                  </p>
                </div>
              )}

              {/* Summary */}
              <div style={{ background: '#f9f7f2', borderRadius: 4, padding: '20px 24px', marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                  Booking Summary
                </div>
                {[
                  ['Guest',       form.name],
                  ['Destination', form.destinationName],
                  ['Date',        form.travelDate ? new Date(form.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
                  ['Guests',      `${form.guests} person(s)`],
                  ['Duration',    `${form.duration} nights`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: '#999' }}>{k}</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v || '—'}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#eee', margin: '12px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Total</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>${estimatedAmount.toLocaleString()}</span>
                </div>
              </div>

              {errors.submit && (
                <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 16, padding: '12px 16px', background: '#fff5f5', borderRadius: 4 }}>
                  {errors.submit}
                </div>
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                <OutlineButton onClick={() => setStep(2)}>← Back</OutlineButton>
                <RoyalButton
                  onClick={handleSubmit}
                  style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Processing...' : payMethod === 'stripe' ? '🔒 Pay with Stripe' : '⚡ Confirm & Pay with Zelle'}
                </RoyalButton>
              </div>
            </div>
          )}

          {/* ---- STEP 4 : Confirmation Zelle ---- */}
          {step === 4 && reservationResult && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 32px', fontSize: 36
              }}>✓</div>

              <h2 style={{ fontSize: 40, fontWeight: 300, color: 'var(--dark)', margin: '0 0 12px' }}>
                Request <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Received!</span>
              </h2>
              <p style={{ color: '#666', fontSize: 16, lineHeight: 1.8, maxWidth: 460, margin: '0 auto 32px' }}>
                Thank you, <strong>{form.name}</strong>. Please complete your Zelle payment to confirm your reservation.
                We will send a confirmation email once payment is received.
              </p>

              <div style={{
                background: '#f9f7f2', borderRadius: 4, padding: 24,
                border: '1px solid rgba(201,168,76,0.3)', marginBottom: 24, display: 'inline-block'
              }}>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6, letterSpacing: 2 }}>BOOKING REFERENCE</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--royal)', letterSpacing: 4 }}>
                  {reservationResult.reference}
                </div>
              </div>

              <div style={{
                background: 'rgba(30,27,107,0.04)', border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 4, padding: '20px 28px', marginBottom: 32, textAlign: 'left'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--royal)', marginBottom: 12, fontSize: 15 }}>
                  ⚡ Complete Your Zelle Payment
                </div>
                {[
                  ['Send to',  process.env.REACT_APP_ZELLE_EMAIL || 'concierge@infiniteluxurytrips.com'],
                  ['Amount',   `$${estimatedAmount.toLocaleString()}`],
                  ['Memo',     reservationResult.reference]
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: '#aaa', minWidth: 72 }}>{k}:</span>
                    <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              <GoldButton onClick={() => navigate('/')}>Return to Home</GoldButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservation;
