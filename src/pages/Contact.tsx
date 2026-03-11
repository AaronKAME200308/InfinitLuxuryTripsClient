import { useState } from 'react';
import { sendContactMessage } from '../services/api';
import { PageHeader, FormField, GoldButton, inputStyle, selectStyle } from '../components/UI';


interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}


const Contact = () => {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const errs: ContactFormErrors = {};
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
    } catch (err) {
      setStatus('error');
    }
  };

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

          {/* LEFT — Contact info */}
          <div>
            <h2 style={{ fontSize: 38, fontWeight: 300, color: 'var(--dark)', margin: '0 0 20px' }}>
              Get in <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Touch</span>
            </h2>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.85, marginBottom: 44 }}>
              Our luxury concierge team is available around the clock to assist you in
              planning your perfect escape.
            </p>

            {[
              { icon: '✉', label: 'Email',  value: 'concierge@infiniteluxurytrips.com' },
              { icon: '📞', label: 'Phone',  value: '+1 (800) ILT-LUXE' },
              { icon: '⚡', label: 'Zelle',  value: 'infiniteluxurytrips@gmail.com' },
              { icon: '🕐', label: 'Hours',  value: '24/7 — Always Available' }
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 20, marginBottom: 32, alignItems: 'flex-start' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(30,27,107,0.06)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 5 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--dark)' }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Zelle security note */}
            <div style={{
              background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 4, padding: '16px 20px', marginTop: 8
            }}>
              <div style={{ fontSize: 12, color: 'var(--royal)', fontWeight: 600, marginBottom: 6 }}>
                🔒 Security Notice
              </div>
              <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6, margin: 0 }}>
                ILT will never contact you to change payment details. Our official Zelle address
                is the only one shown on this site.
              </p>
            </div>
          </div>

          {/* RIGHT — Contact form */}
          <div style={{
            background: '#fff', borderRadius: 4, padding: '44px 48px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(201,168,76,0.15)'
          }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px', fontSize: 32
                }}>✓</div>
                <h3 style={{ fontSize: 28, fontWeight: 300, color: 'var(--dark)', margin: '0 0 12px' }}>
                  Message <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Sent!</span>
                </h3>
                <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7 }}>
                  Thank you for reaching out. Our concierge team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 30, fontWeight: 300, color: 'var(--dark)', margin: '0 0 32px' }}>
                  Send a <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Message</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FormField label="Full Name" error={errors.name}>
                    <input type="text" placeholder="Your name"
                      value={form.name} onChange={e => update('name', e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.name ? '#e53e3e' : '#ddd' }}/>
                  </FormField>
                  <FormField label="Email" error={errors.email}>
                    <input type="email" placeholder="your@email.com"
                      value={form.email} onChange={e => update('email', e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.email ? '#e53e3e' : '#ddd' }}/>
                  </FormField>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FormField label="Phone (optional)">
                    <input type="tel" placeholder="+1 (555) 000-0000"
                      value={form.phone} onChange={e => update('phone', e.target.value)}
                      style={inputStyle}/>
                  </FormField>
                  <FormField label="Subject">
                    <select value={form.subject} onChange={e => update('subject', e.target.value)} style={selectStyle}>
                      {['', 'Trip Planning', 'Reservation Inquiry', 'Payment — Zelle', 'Payment — Stripe', 'Partnership', 'Other'].map(o => (
                        <option key={o} value={o}>{o || 'Select a subject...'}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Message" error={errors.message}>
                  <textarea rows={5}
                    placeholder="Tell us about your dream trip..."
                    value={form.message} onChange={e => update('message', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: errors.message ? '#e53e3e' : '#ddd' }}/>
                </FormField>

                {status === 'error' && (
                  <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 16, padding: '12px 16px', background: '#fff5f5', borderRadius: 4 }}>
                    Failed to send message. Please try again or email us directly.
                  </div>
                )}

                <GoldButton
                  onClick={handleSubmit}
                  fullWidth
                  style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                >
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
