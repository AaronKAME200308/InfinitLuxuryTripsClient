import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin,
  CreditCard, Zap, CheckCircle2, ChevronRight,
  ChevronLeft, Lock, AlertCircle
} from 'lucide-react';
import { useDestinations, useReservation } from '../hooks';
import { PageHeader, FormField, inputStyle } from '../components/UI';
import { createStripeCheckoutSession, getZelleInfo } from '../services/api';

interface Errors { name?: string; email?: string; destinationId?: string; travelDate?: string; submit?: string; }
interface ReservationResult { success: boolean; reservationId: string; reference: string; message?: string; }

// ── Step bar ──────────────────────────────────────────────
const StepBar = ({ step }: { step: number }) => {
  const steps = [
    { n: 1, label: 'Your Details', icon: <User       size={14} /> },
    { n: 2, label: 'Trip Info',    icon: <MapPin     size={14} /> },
    { n: 3, label: 'Payment',      icon: <CreditCard size={14} /> },
  ];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map(({ n, label, icon }, i) => {
        const active = step >= n;
        const done   = step > n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ background: active ? '#302470' : '#F0EEF9', color: active ? '#fff' : '#9896B0' }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2"
                style={{ fontFamily: 'var(--font-display)', border: active ? '2px solid var(--royal)' : '2px solid var(--royal-border)' }}>
                {done ? <CheckCircle2 size={18} color="#fff" /> : (active ? icon : n)}
              </motion.div>
              <div className="text-xs font-semibold hidden md:block"
                style={{ color: active ? 'var(--royal)' : 'var(--text-3)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ background: step > n ? '#302470' : '#DDD9F0' }} transition={{ duration: 0.4 }}
                className="mx-3 mb-5 h-0.5 rounded-full" style={{ width: 60 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────
const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill  = location.state || {};
  const zelleInfo = getZelleInfo();

  const [step,         setStep]         = useState(1);
  const [errors,       setErrors]       = useState<Errors>({});
  const [payMethod,    setPayMethod]    = useState('stripe');
  const [result,       setResult]       = useState<ReservationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    destinationId: prefill.destinationId || '', destinationName: prefill.destinationName || '',
    travelDate: prefill.date || '', guests: String(prefill.guests || 2),
    duration: '7', specialRequests: '',
  });

  const { destinations, loading: destLoading } = useDestinations();
  const { submitReservation } = useReservation();

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k as keyof Errors]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const selectedDest    = destinations.find(d => d.id === form.destinationId);
  const estimatedAmount = selectedDest ? selectedDest.price * parseInt(form.guests || '1') : 0;
  const today           = new Date().toISOString().split('T')[0];

  const validateStep1 = () => {
    const errs: Errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Full name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Errors = {};
    const todayDate = new Date(); todayDate.setHours(0,0,0,0);
    if (!form.destinationId) errs.destinationId = 'Please select a destination';
    if (!form.travelDate) errs.travelDate = 'Travel date required';
    else if (new Date(form.travelDate) <= todayDate) errs.travelDate = 'Date must be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); setErrors({});
    try {
      const res = await submitReservation({
        name: form.name.trim(), email: form.email.trim().toLowerCase(),
        phone: form.phone || null, destinationId: form.destinationId,
        destinationName: selectedDest?.name || form.destinationName,
        travelDate: form.travelDate, guests: parseInt(form.guests),
        duration: parseInt(form.duration), specialRequests: form.specialRequests || null,
        paymentMethod: payMethod as 'stripe' | 'zelle', amount: estimatedAmount,
      });
      setResult(res);
      if (payMethod === 'stripe') {
        await createStripeCheckoutSession({
          reservationId: res.reservationId, amount: estimatedAmount,
          destinationName: selectedDest?.name || '', customerEmail: form.email, reference: res.reference,
        });
      } else { setStep(4); }
    } catch (err: any) {
      setErrors({ submit: err.message });
      setIsSubmitting(false);
    }
  };

  const field: React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14, borderColor: 'var(--royal-border)' };
  const fieldErr = (k: keyof Errors): React.CSSProperties => ({ ...field, borderColor: errors[k] ? 'var(--error)' : 'var(--royal-border)' });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <PageHeader label="Your Journey Awaits" title="Make a" highlight="Reservation"
        imageUrl="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80" />

      <div className="max-w-[720px] mx-auto px-4 py-10">
        {step < 4 && <StepBar step={step} />}

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)' }}>
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Personal Information</h2>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>Step 1 of 3 — Tell us about yourself</p>
                  </div>
                </div>
                <div className="mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                <FormField label="Full Name" error={errors.name} required>
                  <input type="text" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} style={fieldErr('name')} />
                </FormField>
                <FormField label="Email Address" error={errors.email} required>
                  <input type="email" placeholder="john@example.com" value={form.email} onChange={e => update('email', e.target.value)} style={fieldErr('email')} />
                </FormField>
                <FormField label="Phone Number">
                  <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} style={field} />
                </FormField>

                <button onClick={() => validateStep1() && setStep(2)}
                  className="btn-royal w-full justify-center flex items-center gap-2">
                  Continue <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Trip Details</h2>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>Step 2 of 3 — Where & when?</p>
                  </div>
                </div>
                <div className="mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                <FormField label="Destination" error={errors.destinationId} required>
                  <select value={form.destinationId}
                    onChange={e => { const d = destinations.find(x => x.id === e.target.value); update('destinationId', e.target.value); update('destinationName', d?.name || ''); }}
                    style={{ ...fieldErr('destinationId'), appearance: 'none' }}>
                    <option value="">{destLoading ? 'Loading...' : 'Select a destination...'}</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name} — from ${Number(d.price).toLocaleString()}/person</option>)}
                  </select>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Travel Date" error={errors.travelDate} required>
                    <input type="date" min={today} value={form.travelDate} onChange={e => update('travelDate', e.target.value)} style={fieldErr('travelDate')} />
                  </FormField>
                  <FormField label="Guests">
                    <select value={form.guests} onChange={e => update('guests', e.target.value)} style={{ ...field, appearance: 'none' }}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </FormField>
                </div>

                <FormField label="Duration (nights)">
                  <select value={form.duration} onChange={e => update('duration', e.target.value)} style={{ ...field, appearance: 'none' }}>
                    {[3,5,7,10,14,21].map(n => <option key={n} value={n}>{n} nights</option>)}
                  </select>
                </FormField>

                <FormField label="Special Requests">
                  <textarea rows={3} value={form.specialRequests} onChange={e => update('specialRequests', e.target.value)}
                    placeholder="Anniversaries, dietary needs, accessibility..." style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
                </FormField>

                {selectedDest && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                      ${Number(selectedDest.price).toLocaleString()} × {form.guests} guest{parseInt(form.guests) > 1 ? 's' : ''}
                    </span>
                    <span className="font-extrabold text-xl" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                      ${estimatedAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex items-center gap-1.5">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button onClick={() => validateStep2() && setStep(3)}
                    className="btn-royal flex-1 justify-center flex items-center gap-2">
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)' }}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Payment Method</h2>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>Step 3 of 3 — Almost done!</p>
                  </div>
                </div>
                <div className="mb-5" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                {/* Payment toggle */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { id: 'stripe', icon: <CreditCard size={18} />, label: 'Credit Card',  sub: 'Secured by Stripe' },
                    { id: 'zelle',  icon: <Zap         size={18} />, label: 'Zelle Transfer', sub: 'USA banks · No fees' },
                  ].map(({ id, icon, label, sub }) => (
                    <button key={id} onClick={() => setPayMethod(id)}
                      className="p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
                      style={{
                        border:     `2px solid ${payMethod === id ? 'var(--royal)' : 'var(--royal-border)'}`,
                        background: payMethod === id ? 'var(--royal-soft)' : '#fff',
                      }}>
                      <div className="flex items-center gap-2 mb-1"
                        style={{ color: payMethod === id ? 'var(--royal)' : 'var(--text-2)' }}>
                        {icon}
                        <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{label}</span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</div>
                      {payMethod === id && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--royal)' }}>
                          <CheckCircle2 size={11} /> Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Info box */}
                {payMethod === 'stripe' && (
                  <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={13} style={{ color: 'var(--royal)' }} />
                      <span className="text-sm font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                        Secured by Stripe · PCI DSS Level 1
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      Redirected to Stripe's secure checkout. Card details never stored on our servers.
                    </p>
                  </div>
                )}
                {payMethod === 'zelle' && (
                  <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold-border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ background: '#6B3FA0' }}>Z</div>
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-hover)' }}>
                        Zelle Instructions
                      </span>
                    </div>
                    {zelleInfo.instructions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 mb-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ background: 'var(--gold)', color: 'var(--royal)' }}>{i + 1}</div>
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1.5px solid var(--royal-border)' }}>
                  <div className="px-4 py-2.5" style={{ background: 'var(--royal-soft)', borderBottom: '1px solid var(--royal-border)' }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                      Booking Summary
                    </span>
                  </div>
                  <div className="px-4 py-4 bg-white">
                    {[
                      ['Traveler',    form.name],
                      ['Destination', selectedDest?.name || form.destinationName],
                      ['Date',        form.travelDate ? new Date(form.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
                      ['Guests',      `${form.guests} person${parseInt(form.guests) > 1 ? 's' : ''}`],
                      ['Duration',    `${form.duration} nights`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center mb-2.5 text-sm">
                        <span style={{ color: 'var(--text-3)' }}>{k}</span>
                        <span className="font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{v || '—'}</span>
                      </div>
                    ))}
                    <div className="h-px my-3" style={{ background: 'var(--border)' }} />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-2)' }}>Total</span>
                      <span className="font-extrabold text-2xl" style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-display)' }}>
                        ${estimatedAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                    style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                    <AlertCircle size={14} /> {errors.submit}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline flex items-center gap-1.5">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting}
                    className="btn-royal flex-1 justify-center flex items-center gap-2"
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                    <Lock size={13} />
                    {isSubmitting ? 'Processing...' : payMethod === 'stripe' ? 'Pay Securely with Stripe' : 'Confirm & Pay with Zelle'}
                  </button>
                </div>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--text-3)' }}>
                  No hidden fees · Free cancellation within 48h
                </p>
              </div>
            )}

            {/* ── STEP 4 : Zelle ── */}
            {step === 4 && result && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'var(--gold-soft)', border: '2px solid var(--gold-border)' }}>
                  <Zap size={28} style={{ color: 'var(--gold-hover)' }} />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Almost There!</div>
                <h2 className="font-bold text-2xl mb-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Complete Your <span style={{ color: 'var(--royal)' }}>Payment</span>
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
                  Dear <strong>{form.name}</strong>, your reservation is pending Zelle payment.
                </p>

                <div className="inline-block px-6 py-3 rounded-xl mb-5"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Booking Reference</div>
                  <div className="font-extrabold text-2xl tracking-[4px]"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>{result.reference}</div>
                </div>

                <div className="rounded-xl p-5 mb-6 text-left" style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold-border)' }}>
                  <div className="font-bold text-sm mb-3 flex items-center gap-2"
                    style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-display)' }}>
                    <Zap size={14} /> Send your Zelle payment now
                  </div>
                  {[['Send to', zelleInfo.email], ['Amount', `$${estimatedAmount.toLocaleString()}`], ['Memo', result.reference]].map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3 mb-2.5">
                      <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--text-3)' }}>{k}:</span>
                      <span className="font-bold text-sm px-3 py-1 rounded-lg"
                        style={{ background: '#fff', border: '1px solid var(--gold-border)', fontFamily: 'monospace', color: 'var(--text)' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <button onClick={() => navigate('/')} className="btn-royal flex items-center gap-2">Return Home</button>
                  <button onClick={() => navigate('/contact')} className="btn-outline flex items-center gap-2">Contact Concierge</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reservation;