import { useState } from 'react';
import { useReveal } from '../hooks/useAnimations';
import { sendContactMessage } from '../services/api';
import { PageHeader, FormField, GoldButton, inputStyle, selectStyle } from '../components/UI';

const Contact = () => {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const leftRef  = useReveal({ threshold: 0.1 });
  const rightRef = useReveal({ threshold: 0.1 });

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name required';
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

  const contactItems = [
    { icon: '✉', label: 'Email',  value: 'concierge@infiniteluxurytrips.com', color: '#1E1B6B' },
    { icon: '📞', label: 'Phone',  value: '+1 (800) ILT-LUXE',                color: '#1E1B6B' },
    { icon: '⚡', label: 'Zelle',  value: 'infiniteluxurytrips@gmail.com',     color: '#6B3FA0' },
    { icon: '🕐', label: 'Hours',  value: '24/7 — Always Available',           color: '#C9A84C' }
  ];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>
      <PageHeader
        label="We're Here for You"
        title="Contact"
        highlight="Our Concierge"
        imageUrl="https://images.unsplash.com/photo-1423946374617-9d38491b7e5a?w=1400&q=80"
      />

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '60px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 64 }}>

          {/* LEFT */}
          <div ref={leftRef} className="reveal-left">
            <h2 style={{ fontSize: 38, fontWeight: 300, color: 'var(--dark)', margin: '0 0 20px' }}>
              Get in <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Touch</span>
            </h2>
            <p style={{ fontSize: 16, color: '#777', lineHeight: 1.85, marginBottom: 44 }}>
              Our luxury concierge team is available around the clock to assist you in planning your perfect escape.
            </p>

            {contactItems.map(({ icon, label, value, color }, i) => (
              <div key={label} style={{
                display: 'flex', gap: 20, marginBottom: 28, alignItems: 'flex-start',
                animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s both`
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(30,27,107,0.05)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, transition: 'all 0.3s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background   = 'rgba(201,168,76,0.1)';
                    e.currentTarget.style.borderColor  = 'var(--gold)';
                    e.currentTarget.style.transform    = 'scale(1.1) rotate(5deg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background   = 'rgba(30,27,107,0.05)';
                    e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.25)';
                    e.currentTarget.style.transform    = 'scale(1) rotate(0)';
                  }}
                >{icon}</div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 5 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--dark)', fontWeight: 400 }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Security notice */}
            <div style={{
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 4, padding: '16px 20px', marginTop: 8,
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
                background: 'linear-gradient(to bottom, var(--gold), var(--gold-light))'
              }}/>
              <div style={{ fontSize: 12, color: 'var(--royal)', fontWeight: 600, marginBottom: 6, paddingLeft: 8 }}>
                🔒 Security Notice
              </div>
              <p style={{ fontSize: 12, color: '#888', lineHeight: 1.6, margin: 0, paddingLeft: 8 }}>
                ILT will never contact you to change payment details.
                Our official Zelle is always shown on this site.
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div ref={rightRef} className="reveal-right" style={{
            background: '#fff', borderRadius: 4, padding: '44px 48px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(201,168,76,0.15)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Gold accent top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(to right, var(--royal), var(--gold), var(--royal-dark))'
            }}/>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px', fontSize: 32,
                  animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both'
                }}>✓</div>
                <h3 style={{ fontSize: 28, fontWeight: 300, color: 'var(--dark)', margin: '0 0 12px' }}>
                  Message <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Sent!</span>
                </h3>
                <p style={{ color: '#888', fontSize: 15, lineHeight: 1.75 }}>
                  Our concierge team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 30, fontWeight: 300, color: 'var(--dark)', margin: '0 0 32px' }}>
                  Send a <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Message</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FormField label="Full Name *" error={errors.name}>
                    <input type="text" placeholder="Your name"
                      value={form.name} onChange={e => update('name', e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#eee' }}/>
                  </FormField>
                  <FormField label="Email *" error={errors.email}>
                    <input type="email" placeholder="your@email.com"
                      value={form.email} onChange={e => update('email', e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.email ? '#e53e3e' : '#eee' }}/>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FormField label="Phone (optional)">
                    <input type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={e => update('phone', e.target.value)}
                      style={{ ...inputStyle, borderColor: '#eee' }}/>
                  </FormField>
                  <FormField label="Subject">
                    <select value={form.subject} onChange={e => update('subject', e.target.value)}
                      style={{ ...selectStyle, borderColor: '#eee' }}>
                      {['', 'Trip Planning', 'Reservation Inquiry', 'Payment — Zelle', 'Payment — Stripe', 'Partnership', 'Other'].map(o => (
                        <option key={o} value={o}>{o || 'Select a subject...'}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Message *" error={errors.message}>
                  <textarea rows={5} placeholder="Tell us about your dream trip..."
                    value={form.message} onChange={e => update('message', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: errors.message ? '#e53e3e' : '#eee' }}/>
                </FormField>

                {status === 'error' && (
                  <div style={{
                    color: '#c53030', fontSize: 13, marginBottom: 16,
                    padding: '12px 16px', background: '#fff5f5',
                    borderRadius: 4, border: '1px solid #fed7d7'
                  }}>
                    Failed to send. Please try again or email us directly.
                  </div>
                )}

                <GoldButton onClick={handleSubmit} fullWidth
                  style={{ opacity: status === 'loading' ? 0.7 : 1 }}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </GoldButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
