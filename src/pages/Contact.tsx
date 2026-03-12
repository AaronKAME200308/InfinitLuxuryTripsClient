import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, Zap, Clock, Shield, Send,
  CheckCircle2, AlertCircle, MessageSquare
} from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { PageHeader, FormField, inputStyle } from '../components/UI';

interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const CONTACT_INFO = [
  {
    icon: <Mail size={18} />,
    label: 'Email',
    value: 'concierge@infiniteluxurytrips.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: <Phone size={18} />,
    label: 'Phone',
    value: '+1 (800) ILT-LUXE',
    sub: 'Mon–Sun, 8am–10pm EST',
  },
  {
    icon: <Zap size={18} />,
    label: 'Zelle',
    value: 'infiniteluxurytrips@gmail.com',
    sub: 'Instant bank transfer · USA only',
  },
  {
    icon: <Clock size={18} />,
    label: 'Availability',
    value: '24/7 Concierge',
    sub: 'Always here for you',
  },
];

const SUBJECTS = [
  '', 'Trip Planning', 'Reservation Inquiry',
  'Payment — Zelle', 'Payment — Stripe',
  'Partnership', 'Other',
];

const Contact = () => {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k as keyof ContactFormErrors]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const errs: ContactFormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name required (min 2 characters)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setStatus('loading');
      await sendContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const field: React.CSSProperties = {
    ...inputStyle,
    borderRadius: 12,
    padding: '11px 14px',
    fontSize: 14,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <PageHeader
        label="We're Here for You"
        title="Contact"
        highlight="Our Concierge"
        imageUrl="https://images.unsplash.com/photo-1423946374617-9d38491b7e5a?w=1400&q=80"
      />

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT — Info ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h2
                className="font-bold text-2xl mb-3"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
              >
                Get in <span style={{ color: 'var(--royal)' }}>Touch</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Our luxury concierge team is available around the clock to help you plan
                your perfect escape. Reach out via any channel below.
              </p>
            </motion.div>

            {/* Contact cards */}
            {CONTACT_INFO.map(({ icon, label, value, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--royal-xlight)', color: 'var(--royal)' }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                  >
                    {value}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Security notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: '#FFF8EC', border: '1px solid rgba(245,166,35,0.25)' }}
            >
              <Shield size={16} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--gold-dark)', fontFamily: 'var(--font-display)' }}>
                  Security Notice
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#8A6A20' }}>
                  ILT will never contact you to change payment details. Our official Zelle
                  address is the only one shown on this page.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — Form ── */}
          <motion.div
            className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            {/* Card header */}
            <div
              className="px-7 py-5"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--royal-xlight)' }}
                >
                  <MessageSquare size={16} style={{ color: 'var(--royal)' }} />
                </div>
                <div>
                  <div
                    className="font-bold text-base"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                  >
                    Send a Message
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>
                    We'll get back to you within 24 hours
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: '#E8F7F0' }}
                  >
                    <CheckCircle2 size={30} color="#0A8754" />
                  </motion.div>
                  <h3
                    className="font-bold text-xl mb-2"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                    Thank you for reaching out. Our concierge team will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'var(--royal-xlight)',
                      color: 'var(--royal)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" className="p-7">

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.name} required>
                      <input
                        type="text" placeholder="John Doe" autoComplete="name"
                        value={form.name} onChange={e => update('name', e.target.value)}
                        style={{ ...field, borderColor: errors.name ? '#D42B2B' : 'var(--border)' }}
                      />
                    </FormField>
                    <FormField label="Email Address" error={errors.email} required>
                      <input
                        type="email" placeholder="john@example.com"
                        value={form.email} onChange={e => update('email', e.target.value)}
                        style={{ ...field, borderColor: errors.email ? '#D42B2B' : 'var(--border)' }}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone (optional)">
                      <input
                        type="tel" placeholder="+1 (555) 000-0000"
                        value={form.phone} onChange={e => update('phone', e.target.value)}
                        style={field}
                      />
                    </FormField>
                    <FormField label="Subject">
                      <select
                        value={form.subject} onChange={e => update('subject', e.target.value)}
                        style={{ ...field, appearance: 'none' }}
                      >
                        {SUBJECTS.map(o => (
                          <option key={o} value={o}>{o || 'Select a subject...'}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Message" error={errors.message} required>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your dream trip or how we can help..."
                      value={form.message} onChange={e => update('message', e.target.value)}
                      style={{ ...field, resize: 'vertical', lineHeight: 1.65, borderColor: errors.message ? '#D42B2B' : 'var(--border)' }}
                    />
                  </FormField>

                  {status === 'error' && (
                    <div
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: '#FEF0F0', color: '#D42B2B', border: '1px solid #FED7D7' }}
                    >
                      <AlertCircle size={14} />
                      Failed to send. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
                    style={{
                      background: status === 'loading' ? 'var(--border)' : 'var(--royal)',
                      color: status === 'loading' ? 'var(--text-3)' : '#fff',
                      fontFamily: 'var(--font-display)',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Send size={14} />
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
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