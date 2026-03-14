import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Search, AlertTriangle, CheckCircle2, FileText, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { PageHeader, FormField, inputStyle } from '../components/UI';

interface FormData  { reference: string; email: string; reason: string; }
interface FormErrors { reference?: string; email?: string; reason?: string; }

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001';

const CancelRequest = () => {
  const navigate = useNavigate();
  const [form,     setForm]     = useState<FormData>({ reference: '', email: '', reason: '' });
  const [errors,   setErrors]   = useState<FormErrors>({});
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.reference.trim()) errs.reference = 'Booking reference is required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.reason.trim() || form.reason.trim().length < 10) errs.reason = 'Please explain your reason (min 10 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('loading'); setErrorMsg('');
    try {
      const res = await fetch(`${API_URL}/api/reservations/cancel-request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: form.reference.toUpperCase().trim(), email: form.email.toLowerCase().trim(), reason: form.reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.details ? data.details.join(', ') : data.error || 'Something went wrong'); setStatus('error'); return; }
      setStatus('success');
    } catch { setErrorMsg('Network error. Please try again.'); setStatus('error'); }
  };

  const field: React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14, borderColor: 'var(--royal-border)' };
  const fieldErr = (k: keyof FormErrors): React.CSSProperties => ({ ...field, borderColor: errors[k] ? 'var(--error)' : 'var(--royal-border)' });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <PageHeader label="Reservation Management" title="Cancel" highlight="Your Booking"
        imageUrl="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80" />

      <div className="max-w-[560px] mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--royal)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
          <ArrowLeft size={15} /> Back
        </button>

        <AnimatePresence mode="wait">
          {/* ── SUCCESS ── */}
          {status === 'success' ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}>
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--royal), var(--gold))' }} />
              <div className="p-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'var(--royal-soft)', border: '2px solid var(--royal-border)' }}>
                  <CheckCircle2 size={28} style={{ color: 'var(--royal)' }} />
                </motion.div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Request Received</div>
                <h2 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Cancellation Request <span style={{ color: 'var(--royal)' }}>Submitted</span>
                </h2>
                <div className="mx-auto mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
                  We've received your request. Our concierge team will contact you within{' '}
                  <strong style={{ color: 'var(--royal)' }}>24 hours</strong> to confirm and process your refund.
                </p>
                <div className="rounded-xl p-4 mb-6 text-left" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>What happens next</div>
                  {[
                    { icon: <Mail      size={13} />, text: 'Confirmation email sent to your inbox' },
                    { icon: <Search    size={13} />, text: 'Our team reviews your request'          },
                    { icon: <CheckCircle2 size={13}/>, text: 'Refund processed within 5–10 business days' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 mb-2 text-sm" style={{ color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--royal)', flexShrink: 0 }}>{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => navigate('/')} className="btn-royal">Return Home</button>
                  <button onClick={() => navigate('/contact')} className="btn-outline">Contact Us</button>
                </div>
              </div>
            </motion.div>

          ) : (
            /* ── FORM ── */
            <motion.div key="form"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}>

              {/* Header */}
              <div className="px-6 py-5 flex items-center gap-3"
                style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#FEF0F0', border: '1px solid #FECACA' }}>
                  <XCircle size={18} color="var(--error)" />
                </div>
                <div>
                  <div className="font-bold text-base" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Request Cancellation
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-3)' }}>Fill in your details — we'll handle the rest</div>
                </div>
              </div>

              {/* Warning */}
              <div className="mx-6 mt-5 flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-border)' }}>
                <AlertTriangle size={14} style={{ color: 'var(--gold-hover)', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: '#8A6A20' }}>
                  Cancellations are subject to our policy. Refunds are processed manually within{' '}
                  <strong>5–10 business days</strong> after approval.
                </p>
              </div>

              <div className="p-6">
                <FormField label="Booking Reference" error={errors.reference} required>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--royal)' }} />
                    <input type="text" placeholder="ILT-XXXXXX" value={form.reference}
                      onChange={e => update('reference', e.target.value.toUpperCase())}
                      style={{ ...fieldErr('reference'), paddingLeft: 36, textTransform: 'uppercase', letterSpacing: '2px' }} />
                  </div>
                </FormField>

                <FormField label="Email Address" error={errors.email} required>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--royal)' }} />
                    <input type="email" placeholder="Email used at booking" value={form.email}
                      onChange={e => update('email', e.target.value)}
                      style={{ ...fieldErr('email'), paddingLeft: 36 }} />
                  </div>
                </FormField>

                <FormField label="Reason for Cancellation" error={errors.reason} required>
                  <textarea rows={4} placeholder="Please explain why you'd like to cancel..."
                    value={form.reason} onChange={e => update('reason', e.target.value)}
                    style={{ ...fieldErr('reason'), resize: 'vertical', lineHeight: 1.65 }} />
                  <div className="text-xs mt-1 text-right"
                    style={{ color: form.reason.length >= 10 ? 'var(--royal)' : 'var(--text-3)' }}>
                    {form.reason.length} / 10 min
                  </div>
                </FormField>

                {status === 'error' && errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm"
                    style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    {errorMsg}
                  </motion.div>
                )}

                <button onClick={handleSubmit} disabled={status === 'loading'}
                  className="btn-royal w-full justify-center flex items-center gap-2"
                  style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    background: 'var(--error)' }}>
                  <XCircle size={14} />
                  {status === 'loading' ? 'Submitting...' : 'Submit Cancellation Request'}
                </button>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--text-3)' }}>
                  You will receive a confirmation email after submission
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CancelRequest;