import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, Zap, Clock, Shield, Send,
  CheckCircle2, AlertCircle, MessageSquare,
  MapPin, ArrowRight
} from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { FormField, inputStyle } from '../components/UI';

interface Errors { name?: string; email?: string; message?: string; }

const CONTACT_INFO = [
  { icon: <Mail  size={20} />, label: 'Email',        value: 'concierge@infiniteluxurytrips.com', sub: 'We reply within 24 hours',    color: 'var(--royal-soft)',  accent: 'var(--royal)'      },
  { icon: <Phone size={20} />, label: 'Phone',        value: '+1 (800) ILT-LUXE',                sub: 'Mon–Sun, 8am–10pm EST',       color: 'var(--royal-soft)',  accent: 'var(--royal)'      },
  { icon: <Zap   size={20} />, label: 'Zelle',        value: 'infiniteluxurytrips@gmail.com',    sub: 'Instant transfer · USA only', color: 'var(--gold-soft)',   accent: 'var(--gold-hover)' },
  { icon: <Clock size={20} />, label: 'Availability', value: '24/7 Concierge',                   sub: 'Always here for you',         color: 'var(--royal-soft)',  accent: 'var(--royal)'      },
];

const SUBJECTS = ['', 'Trip Planning', 'Reservation Inquiry', 'Payment — Zelle', 'Payment — Stripe', 'Partnership', 'Other'];

const Contact = () => {
  const [form,   setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k as keyof Errors]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs: Errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('loading');
    try { await sendContactMessage(form); setStatus('success'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }
    catch { setStatus('error'); }
  };

  const field: React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14, borderColor: 'var(--royal-border)' };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ════════════════ HERO full-image ════════════════ */}
      <div className="relative overflow-hidden" style={{ height: 380, width: "100%", position: "relative", overflow: "hidden" }}>
        <motion.img
          src="/contact.png"
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
          style={{objectPosition: "center 10%"}}
          initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.94) 0%, rgba(20,17,58,0.35) 55%, transparent 100%)' }} />

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-[1100px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: 'rgba(245,166,35,0.18)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)', fontFamily: 'var(--font-display)' }}>
                We're Here for You
              </div>
              <h1 className="font-bold text-white mb-2"
                style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                Contact <span style={{ color: 'var(--gold)' }}>Our Concierge</span>
              </h1>
              <div style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════ BODY ════════════════ */}
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT — Infos ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-bold text-xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Get in <span style={{ color: 'var(--royal)' }}>Touch</span>
              </h2>
              <div className="mb-4" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: 1.85 }}>
                Our luxury concierge team is available around the clock to help you plan your perfect escape — wherever in the world you want to go.
              </p>
            </motion.div>

            {/* Contact cards — slide depuis la gauche */}
            {CONTACT_INFO.map(({ icon, label, value, sub, color, accent }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.18 } }}
                className="flex items-start gap-4 p-4 rounded-2xl cursor-default"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color, color: accent, border: '1px solid var(--royal-border)' }}>
                  {icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[2.5px] mb-0.5"
                    style={{ color: accent, fontFamily: 'var(--font-display)' }}>
                    {label}
                  </div>
                  <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    {value}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Security notice — or */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: 'var(--gold-soft)', border: '1.5px solid var(--gold-border)' }}>
              <Shield size={15} style={{ color: 'var(--gold-hover)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-display)' }}>
                  Security Notice
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#8A6A20' }}>
                  ILT will never ask you to change payment details. Our official Zelle address is only shown on this page.
                </p>
              </div>
            </motion.div>

            {/* CTA réservation */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}
              className="p-5 rounded-2xl"
              style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={15} style={{ color: 'var(--royal)' }} />
                <span className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Ready to book?
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-3)', lineHeight: 1.7 }}>
                Skip the message and go straight to reserving your experience.
              </p>
              <a href="/reservation" className="btn-gold w-full justify-center flex items-center gap-2 text-xs">
                Make a Reservation <ArrowRight size={12} />
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT — Formulaire ── */}
          <motion.div
            className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>

            {/* Header violet */}
            <div className="px-7 py-5 flex items-center justify-between"
              style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <MessageSquare size={16} color="#fff" />
                </div>
                <div>
                  <div className="font-bold text-base text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Send a Message
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    We'll get back within 24 hours
                  </div>
                </div>
              </div>
              {/* Dot indicateur */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Online</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Succès */}
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'var(--royal-soft)', border: '2px solid var(--royal-border)' }}>
                    <CheckCircle2 size={34} style={{ color: 'var(--royal)' }} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <div className="text-xs font-bold uppercase tracking-[2.5px] mb-2"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                      Message Sent!
                    </div>
                    <h3 className="font-bold text-2xl mb-3"
                      style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                      We'll be in <span style={{ color: 'var(--royal)' }}>touch soon</span>
                    </h3>
                    <div className="mb-4" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2, margin: '0 auto 16px' }} />
                    <p className="text-sm mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
                      Thank you for reaching out. Our concierge team will respond within 24 hours with personalized recommendations.
                    </p>
                    <button onClick={() => setStatus('idle')}
                      className="btn-outline text-xs" style={{ padding: '8px 20px' }}>
                      Send another message
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                /* Formulaire */
                <motion.div key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.name} required>
                      <input type="text" placeholder="John Doe" value={form.name}
                        onChange={e => update('name', e.target.value)}
                        style={{ ...field, borderColor: errors.name ? 'var(--error)' : 'var(--royal-border)' }} />
                    </FormField>
                    <FormField label="Email Address" error={errors.email} required>
                      <input type="email" placeholder="john@example.com" value={form.email}
                        onChange={e => update('email', e.target.value)}
                        style={{ ...field, borderColor: errors.email ? 'var(--error)' : 'var(--royal-border)' }} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Phone (optional)">
                      <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone}
                        onChange={e => update('phone', e.target.value)} style={field} />
                    </FormField>
                    <FormField label="Subject">
                      <select value={form.subject} onChange={e => update('subject', e.target.value)}
                        style={{ ...field, appearance: 'none' }}>
                        {SUBJECTS.map(o => <option key={o} value={o}>{o || 'Select a subject...'}</option>)}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Message" error={errors.message} required>
                    <textarea rows={5} placeholder="Tell us about your dream trip or how we can help..."
                      value={form.message} onChange={e => update('message', e.target.value)}
                      style={{ ...field, resize: 'vertical', lineHeight: 1.7, borderColor: errors.message ? 'var(--error)' : 'var(--royal-border)' }} />
                    {/* Compteur de caractères */}
                    <div className="text-right text-xs mt-1"
                      style={{ color: form.message.length >= 10 ? 'var(--royal)' : 'var(--text-3)' }}>
                      {form.message.length} chars{form.message.length < 10 ? ` (min 10)` : ' ✓'}
                    </div>
                  </FormField>

                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                      <AlertCircle size={14} /> Failed to send. Please try again or email us directly.
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="btn-royal w-full justify-center flex items-center gap-2"
                    style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
                    whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
                    whileTap={status !== 'loading' ? { scale: 0.98 } : {}}>
                    <Send size={14} />
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </motion.button>

                  <p className="text-center text-xs mt-3" style={{ color: 'var(--text-3)' }}>
                    We respond within 24 hours · Your information is secure
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;