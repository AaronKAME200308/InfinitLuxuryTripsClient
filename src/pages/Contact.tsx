import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Zap, Clock, Shield, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { sendContactMessage } from '../services/api';
import { PageHeader, FormField, inputStyle } from '../components/UI';

interface Errors { name?: string; email?: string; message?: string; }

const CONTACT_INFO = [
  { icon: <Mail  size={18} />, label: 'Email',        value: 'concierge@infiniteluxurytrips.com', sub: 'We reply within 24 hours'       },
  { icon: <Phone size={18} />, label: 'Phone',        value: '+1 (800) ILT-LUXE',                sub: 'Mon–Sun, 8am–10pm EST'          },
  { icon: <Zap   size={18} />, label: 'Zelle',        value: 'infiniteluxurytrips@gmail.com',    sub: 'Instant transfer · USA only'    },
  { icon: <Clock size={18} />, label: 'Availability', value: '24/7 Concierge',                   sub: 'Always here for you'            },
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
    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { setStatus('error'); }
  };

  const field: React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14 };

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

          {/* LEFT — Infos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Get in <span style={{ color: 'var(--royal)' }}>Touch</span>
              </h2>
              <div className="mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
                Our luxury concierge team is available around the clock to help you plan your perfect escape.
              </p>
            </motion.div>

            {CONTACT_INFO.map(({ icon, label, value, sub }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)' }}>
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-display)' }}>
                    {label}
                  </div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    {value}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Security notice */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-border)' }}>
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
          </div>

          {/* RIGHT — Form */}
          <motion.div className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

            {/* Form header */}
            <div className="px-7 py-5 flex items-center gap-3"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)' }}>
                <MessageSquare size={16} />
              </div>
              <div>
                <div className="font-bold text-base" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Send a Message
                </div>
                <div className="text-xs" style={{ color: 'var(--text-3)' }}>We'll get back within 24 hours</div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'var(--royal-soft)', border: '2px solid var(--royal-border)' }}>
                    <CheckCircle2 size={28} style={{ color: 'var(--royal)' }} />
                  </motion.div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Message <span style={{ color: 'var(--royal)' }}>Sent!</span>
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                    Thank you for reaching out. Our concierge team will respond within 24 hours.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-outline mt-6 text-xs" style={{ padding: '8px 18px' }}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" className="p-7">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.name} required>
                      <input type="text" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)}
                        style={{ ...field, borderColor: errors.name ? 'var(--error)' : 'var(--royal-border)' }} />
                    </FormField>
                    <FormField label="Email Address" error={errors.email} required>
                      <input type="email" placeholder="john@example.com" value={form.email} onChange={e => update('email', e.target.value)}
                        style={{ ...field, borderColor: errors.email ? 'var(--error)' : 'var(--royal-border)' }} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone (optional)">
                      <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} style={field} />
                    </FormField>
                    <FormField label="Subject">
                      <select value={form.subject} onChange={e => update('subject', e.target.value)}
                        style={{ ...field, appearance: 'none', borderColor: 'var(--royal-border)' }}>
                        {SUBJECTS.map(o => <option key={o} value={o}>{o || 'Select a subject...'}</option>)}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Message" error={errors.message} required>
                    <textarea rows={5} placeholder="Tell us about your dream trip..."
                      value={form.message} onChange={e => update('message', e.target.value)}
                      style={{ ...field, resize: 'vertical', lineHeight: 1.65, borderColor: errors.message ? 'var(--error)' : 'var(--royal-border)' }} />
                  </FormField>
                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                      <AlertCircle size={14} /> Failed to send. Please try again or email us directly.
                    </div>
                  )}
                  <button onClick={handleSubmit} disabled={status === 'loading'}
                    className="btn-royal w-full justify-center flex items-center gap-2"
                    style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
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