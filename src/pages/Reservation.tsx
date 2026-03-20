import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin,
  CreditCard, Zap, CheckCircle2, ChevronRight,
  ChevronLeft, Lock, AlertCircle, Sparkles, XCircle
} from 'lucide-react';
import { useDestinations, useReservation } from '../hooks';
import { FormField, inputStyle } from '../components/UI';
import { createStripeCheckoutSession, getZelleInfo } from '../services/api';

interface Errors { name?: string; email?: string; destinationId?: string; travelDate?: string; submit?: string; }
interface ReservationResult { success: boolean; reservationId: string; reference: string; message?: string; }

// ── Step bar enrichie ─────────────────────────────────────
const StepBar = ({ step }: { step: number }) => {
  const steps = [
    { n: 1, label: 'Your Details', icon: <User       size={15} />, desc: 'Who you are'     },
    { n: 2, label: 'Trip Info',    icon: <MapPin     size={15} />, desc: 'Where & when'    },
    { n: 3, label: 'Payment',      icon: <CreditCard size={15} />, desc: 'Secure checkout' },
  ];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map(({ n, label, icon, desc }, i) => {
        const active = step >= n;
        const done   = step > n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: done ? 'var(--royal)' : active ? 'var(--royal)' : '#F0EEF9',
                  color: active ? '#fff' : '#9896B0',
                  boxShadow: active ? '0 4px 14px rgba(48,36,112,0.28)' : 'none',
                }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mb-2"
                style={{ fontFamily: 'var(--font-display)', border: active ? '2px solid var(--royal)' : '2px solid var(--royal-border)' }}>
                {done ? <CheckCircle2 size={19} color="#fff" /> : (active ? icon : n)}
              </motion.div>
              <div className="text-xs font-bold hidden md:block text-center"
                style={{ color: active ? 'var(--royal)' : 'var(--text-3)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                {label}
              </div>
              <div className="text-[10px] hidden md:block text-center"
                style={{ color: active ? 'var(--gold-hover)' : 'var(--text-3)', fontFamily: 'var(--font-body)' }}>
                {desc}
              </div>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ background: step > n ? '#302470' : '#DDD9F0' }}
                transition={{ duration: 0.4 }}
                className="mx-4 mb-7 h-0.5 rounded-full" style={{ width: 70 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────
const Reservation = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefill   = location.state || {};
  const zelleInfo = getZelleInfo();

  const [step,         setStep]         = useState(1);
  const [errors,       setErrors]       = useState<Errors>({});
  const [payMethod,    setPayMethod]    = useState('stripe');
  const [result,       setResult]       = useState<ReservationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    destinationId: prefill.destinationId || '',
    destinationName: prefill.destinationName || '',
    travelDate: prefill.date || '',
    guests: String(prefill.guests || 2),
    duration: '7',
    specialRequests: '',
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
    setErrors(errs); return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Errors = {};
    const todayDate = new Date(); todayDate.setHours(0,0,0,0);
    if (!form.destinationId) errs.destinationId = 'Please select a destination';
    if (!form.travelDate) errs.travelDate = 'Travel date required';
    else if (new Date(form.travelDate) <= todayDate) errs.travelDate = 'Date must be in the future';
    setErrors(errs); return Object.keys(errs).length === 0;
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
    } catch (err: any) { setErrors({ submit: err.message }); setIsSubmitting(false); }
  };

  const field: React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14, borderColor: 'var(--royal-border)' };
  const fieldErr = (k: keyof Errors) => ({ ...field, borderColor: errors[k] ? 'var(--error)' : 'var(--royal-border)' });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ════════════════ HERO full-image ════════════════ */}
      <div className="relative overflow-hidden" style={{ height: 340 }}>
        <motion.img
          src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80"
          alt="Reservation"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.95) 0%, rgba(20,17,58,0.3) 55%, transparent 100%)' }} />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-[720px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: 'rgba(245,166,35,0.18)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)', fontFamily: 'var(--font-display)' }}>
                <Sparkles size={10} /> Your Journey Awaits
              </div>
              <h1 className="font-bold text-white mb-2"
                style={{ fontSize: 'clamp(26px, 5vw, 48px)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                Make a <span style={{ color: 'var(--gold)' }}>Reservation</span>
              </h1>
              <div style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════ FORM WIZARD ════════════════ */}
      <div className="max-w-[720px] mx-auto px-4 py-10">
        {step < 4 && <StepBar step={step} />}

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-lg)' }}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div>
                {/* Header avec image mini */}
                <div className="relative overflow-hidden px-8 py-6 flex items-center gap-4"
                  style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <User size={22} color="#fff" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      Personal Information
                    </h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Step 1 of 3 — Tell us about yourself</p>
                  </div>
                  {/* Numéro déco */}
                  <div className="absolute right-6 font-extrabold select-none pointer-events-none"
                    style={{ fontSize: 72, color: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    01
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-4" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
                  <FormField label="Full Name" error={errors.name} required>
                    <input type="text" placeholder="John Doe" autoComplete="name"
                      value={form.name} onChange={e => update('name', e.target.value)}
                      style={fieldErr('name')} />
                  </FormField>
                  <FormField label="Email Address" error={errors.email} required>
                    <input type="email" placeholder="john@example.com" autoComplete="email"
                      value={form.email} onChange={e => update('email', e.target.value)}
                      style={fieldErr('email')} />
                  </FormField>
                  <FormField label="Phone Number">
                    <input type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel"
                      value={form.phone} onChange={e => update('phone', e.target.value)}
                      style={field} />
                  </FormField>
                  <motion.button onClick={() => validateStep1() && setStep(2)}
                    className="btn-royal w-full justify-center flex items-center gap-2 mt-2"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Continue <ChevronRight size={15} />
                  </motion.button>

                  {/* Cancel booking */}
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <Link to="/cancel"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{ background: 'var(--bg)', color: 'var(--text-3)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--error)'; (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}>
                      <XCircle size={12} /> Cancel an existing booking
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div>
                <div className="relative overflow-hidden px-8 py-6 flex items-center gap-4"
                  style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <MapPin size={22} color="#fff" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      Trip Details
                    </h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Step 2 of 3 — Where & when?</p>
                  </div>
                  <div className="absolute right-6 font-extrabold select-none pointer-events-none"
                    style={{ fontSize: 72, color: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    02
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-4" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                  <FormField label="Destination" error={errors.destinationId} required>
                    <select value={form.destinationId}
                      onChange={e => { const d = destinations.find(x => x.id === e.target.value); update('destinationId', e.target.value); update('destinationName', d?.name || ''); }}
                      style={{ ...fieldErr('destinationId'), appearance: 'none' }}>
                      <option value="">{destLoading ? 'Loading...' : 'Select a destination...'}</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name} — from ${Number(d.price).toLocaleString()}/person</option>
                      ))}
                    </select>
                  </FormField>

                  {/* Aperçu destination sélectionnée */}
                  {selectedDest && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl mb-5 overflow-hidden"
                      style={{ background: 'var(--royal-soft)', border: '1px solid var(--royal-border)' }}>
                      <img src={selectedDest.image_url} alt={selectedDest.name}
                        className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                          {selectedDest.name}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>
                          {selectedDest.category} · from ${Number(selectedDest.price).toLocaleString()}/person
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Travel Date" error={errors.travelDate} required>
                      <input type="date" min={today} value={form.travelDate}
                        onChange={e => update('travelDate', e.target.value)}
                        style={fieldErr('travelDate')} />
                    </FormField>
                    <FormField label="Guests">
                      <select value={form.guests} onChange={e => update('guests', e.target.value)}
                        style={{ ...field, appearance: 'none' }}>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Duration (nights)">
                    <select value={form.duration} onChange={e => update('duration', e.target.value)}
                      style={{ ...field, appearance: 'none' }}>
                      {[3,5,7,10,14,21].map(n => <option key={n} value={n}>{n} nights</option>)}
                    </select>
                  </FormField>

                  <FormField label="Special Requests">
                    <textarea rows={3} value={form.specialRequests}
                      onChange={e => update('specialRequests', e.target.value)}
                      placeholder="Anniversaries, dietary needs, accessibility..."
                      style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
                  </FormField>

                  {/* Estimation */}
                  {selectedDest && (
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-5"
                      style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Estimated total</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                          ${Number(selectedDest.price).toLocaleString()} × {form.guests} guest{parseInt(form.guests) > 1 ? 's' : ''}
                        </div>
                      </div>
                      <span className="font-extrabold text-2xl" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                        ${estimatedAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-outline flex items-center gap-1.5">
                      <ChevronLeft size={14} /> Back
                    </button>
                    <motion.button onClick={() => validateStep2() && setStep(3)}
                      className="btn-royal flex-1 justify-center flex items-center gap-2"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Continue <ChevronRight size={15} />
                    </motion.button>
                  </div>

                  {/* Cancel booking */}
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <Link to="/cancel"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{ background: 'var(--bg)', color: 'var(--text-3)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--error)'; (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}>
                      <XCircle size={12} /> Cancel an existing booking
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div>
                <div className="relative overflow-hidden px-8 py-6 flex items-center gap-4"
                  style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <CreditCard size={22} color="#fff" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      Payment Method
                    </h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Step 3 of 3 — Almost done!</p>
                  </div>
                  <div className="absolute right-6 font-extrabold select-none pointer-events-none"
                    style={{ fontSize: 72, color: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    03
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-5" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                  {/* Payment toggle */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { id: 'stripe', icon: <CreditCard size={20} />, label: 'Credit Card',     sub: 'Secured by Stripe · Instant' },
                      { id: 'zelle',  icon: <Zap         size={20} />, label: 'Zelle Transfer', sub: 'USA banks only · No fees'    },
                    ].map(({ id, icon, label, sub }) => (
                      <motion.button key={id} onClick={() => setPayMethod(id)}
                        className="p-4 rounded-xl text-left cursor-pointer transition-all duration-200"
                        style={{
                          border:     `2px solid ${payMethod === id ? 'var(--royal)' : 'var(--royal-border)'}`,
                          background: payMethod === id ? 'var(--royal-soft)' : '#fff',
                        }}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <div className="flex items-center gap-2 mb-1.5"
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
                      </motion.button>
                    ))}
                  </div>

                  {/* Info box Stripe */}
                  {payMethod === 'stripe' && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl mb-5"
                      style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={13} style={{ color: 'var(--royal)' }} />
                        <span className="text-sm font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                          Secured by Stripe · PCI DSS Level 1
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        Redirected to Stripe's secure checkout. Card details never stored on our servers. Auto-confirmation by email.
                      </p>
                    </motion.div>
                  )}

                  {/* Info box Zelle */}
                  {payMethod === 'zelle' && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl mb-5"
                      style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold-border)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ background: '#6B3FA0' }}>Z</div>
                        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-hover)' }}>
                          Zelle Payment Instructions
                        </span>
                      </div>
                      {zelleInfo.instructions.map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5 mb-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ background: 'var(--gold)', color: 'var(--royal)' }}>{i + 1}</div>
                          <span className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{s}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Récap commande */}
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
                        <div key={k} className="flex justify-between items-center mb-2 text-sm">
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
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                      <AlertCircle size={14} /> {errors.submit}
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-outline flex items-center gap-1.5">
                      <ChevronLeft size={14} /> Back
                    </button>
                    <motion.button onClick={handleSubmit} disabled={isSubmitting}
                      className="btn-royal flex-1 justify-center flex items-center gap-2"
                      style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}}>
                      <Lock size={13} />
                      {isSubmitting ? 'Processing...' : payMethod === 'stripe' ? 'Pay Securely with Stripe' : 'Confirm & Pay with Zelle'}
                    </motion.button>
                  </div>

                  <p className="text-center text-xs mt-3" style={{ color: 'var(--text-3)' }}>
                    No hidden fees · Free cancellation within 48h
                  </p>

                  {/* Cancel booking */}
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <Link to="/cancel"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{ background: 'var(--bg)', color: 'var(--text-3)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--error)'; (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}>
                      <XCircle size={12} /> Cancel an existing booking
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 : Zelle ── */}
            {step === 4 && result && (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'var(--gold-soft)', border: '2px solid var(--gold-border)' }}>
                  <Zap size={28} style={{ color: 'var(--gold-hover)' }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Almost There!</div>
                  <h2 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Complete Your <span style={{ color: 'var(--royal)' }}>Payment</span>
                  </h2>
                  <div className="mx-auto mb-4" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
                  <p className="text-sm mb-5" style={{ color: 'var(--text-2)' }}>
                    Dear <strong>{form.name}</strong>, your reservation is pending Zelle payment.
                  </p>

                  {/* Référence */}
                  <div className="inline-block px-6 py-3 rounded-xl mb-5"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Booking Reference</div>
                    <div className="font-extrabold text-2xl tracking-[4px]"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>{result.reference}</div>
                  </div>

                  {/* Détails Zelle */}
                  <div className="rounded-xl p-5 mb-5 text-left"
                    style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold-border)' }}>
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
                    <button onClick={() => navigate('/contact')} className="btn-outline flex items-center gap-2">
                      Contact Concierge
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reservation;