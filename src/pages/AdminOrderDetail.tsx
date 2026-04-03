import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  ArrowLeft, Save, Send, CheckCircle2, AlertCircle,
  MapPin, Calendar, Users, Clock, Mail, Phone,
  CreditCard, Hotel, Car, FileText, Zap, Edit3, Lock
} from 'lucide-react';
import supabase from '../services/supabase';

// ── EmailJS ────────────────────────────────────────────────
const EMAILJS_SERVICE_PAYMENT_ID = import.meta.env.VITE_EMAILJS_SERVICE_PAYMENT_ID || 'service_xxx';
const EMAILJS_PUBLIC_KEY         = import.meta.env.VITE_EMAILJS_PUBLIC_PAYMENT_KEY  || 'key_xxx';
const TEMPLATE_PAYMENT           = import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENT    || 'template_payment';

// ── Types ──────────────────────────────────────────────────
interface Reservation {
  id: string; reference: string;
  client_name: string; client_email: string; client_phone?: string;
  destinations: {
  name: string;
} | null; travel_date: string; return_date?: string;
  guests: number; duration: number; status: string;
  special_requests?: string; message?: string;
  final_price?: number; hotel?: string; transport?: string;
  options?: string; payment_link?: string; admin_notes?: string;
  created_at: string; email_sent_at?: string;
}

const STATUS_OPTIONS = [
  { value: 'pending',          label: 'Pending'          },
  { value: 'confirmed',        label: 'Confirmed'        },
  { value: 'awaiting_payment', label: 'Awaiting Payment' },
  { value: 'completed',        label: 'Completed'        },
  { value: 'cancelled',        label: 'Cancelled'        },
];

const STATUS_COLORS: Record<string, string> = {
  pending:          '#D97706',
  confirmed:        '#2563EB',
  awaiting_payment: '#7C3AED',
  completed:        '#059669',
  cancelled:        '#DC2626',
};

// Statuts verrouillés : envoi email + sauvegarde bloqués
const LOCKED_STATUSES = ['awaiting_payment', 'completed'];

// ── Section header ─────────────────────────────────────────
const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
    <span style={{ color: 'var(--royal)' }}>{icon}</span>
    <span className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{title}</span>
  </div>
);

const field: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: 10, fontSize: 13,
  border: '1.5px solid var(--royal-border)', background: '#fff',
  fontFamily: 'var(--font-body)', color: 'var(--text)', boxSizing: 'border-box', outline: 'none',
};

const fieldLocked: React.CSSProperties = {
  ...field,
  background: '#F9FAFB',
  color: '#9CA3AF',
  cursor: 'not-allowed',
  border: '1.5px solid #E5E7EB',
};

// ── Lock banner ────────────────────────────────────────────
const LockBanner = ({ status }: { status: string }) => {
  const isCompleted = status === 'completed';
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl mb-4"
      style={{
        background: isCompleted ? '#ECFDF5' : '#F5F3FF',
        border: `1.5px solid ${isCompleted ? '#A7F3D0' : '#DDD6FE'}`,
      }}>
      <Lock size={15} style={{ color: isCompleted ? '#059669' : '#7C3AED', flexShrink: 0, marginTop: 1 }} />
      <div>
        <div className="font-bold text-xs mb-0.5"
          style={{ color: isCompleted ? '#059669' : '#7C3AED', fontFamily: 'var(--font-display)' }}>
          {isCompleted ? 'Reservation completed' : 'Payment email already sent'}
        </div>
        <div className="text-[11px]" style={{ color: isCompleted ? '#065F46' : '#5B21B6' }}>
          {isCompleted
            ? 'This reservation is marked as completed. Editing and sending emails are disabled to prevent duplicate entries.'
            : 'A payment email has been sent to this client. To avoid duplicates, saving and sending are locked. Change the status to unlock.'}
        </div>
      </div>
    </div>
  );
};

// ── Disabled button ────────────────────────────────────────
const DisabledButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm cursor-not-allowed select-none"
    style={{
      background: '#F3F4F6',
      color: '#9CA3AF',
      border: '1.5px solid #E5E7EB',
      fontFamily: 'var(--font-display)',
    }}>
    <Lock size={13} />
    {icon}
    {label}
  </div>
);

// ═══════════════════════════════════════════════════════════
const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [sending,     setSending]     = useState(false);
  const [saveMsg,     setSaveMsg]     = useState('');
  const [sendMsg,     setSendMsg]     = useState('');

  const [adminForm, setAdminForm] = useState({
    status:       '',
    final_price:  '',
    hotel:        '',
    transport:    '',
    options:      '',
    payment_link: '',
    admin_notes:  '',
  });

  // ── Is this status locked? ─────────────────────────────
  const isLocked = LOCKED_STATUSES.includes(adminForm.status);

  // ── Fetch ──────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('reservations').select('*, destinations(name)').eq('id', id).single();
      if (!error && data) {
        setReservation(data as Reservation);
        setAdminForm({
          status:       data.status       || 'pending',
          final_price:  data.final_price  ? String(data.final_price) : '',
          hotel:        data.hotel        || '',
          transport:    data.transport    || '',
          options:      data.options      || '',
          payment_link: data.payment_link || '',
          admin_notes:  data.admin_notes  || '',
        });
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin');
    });
  }, [navigate]);

  const updateForm = (k: keyof typeof adminForm, v: string) =>
    setAdminForm(f => ({ ...f, [k]: v }));

  // ── Save ───────────────────────────────────────────────
  const handleSave = async () => {
    if (isLocked) return;
    setSaving(true); setSaveMsg('');
    try {
      const { error } = await supabase.from('reservations').update({
        status:       adminForm.status,
        final_price:  adminForm.final_price ? parseFloat(adminForm.final_price) : null,
        hotel:        adminForm.hotel        || null,
        transport:    adminForm.transport    || null,
        options:      adminForm.options      || null,
        payment_link: adminForm.payment_link || null,
        admin_notes:  adminForm.admin_notes  || null,
      }).eq('id', id);

      if (error) throw error;
      setReservation(r => r
        ? { ...r, ...adminForm, final_price: adminForm.final_price ? parseFloat(adminForm.final_price) : undefined }
        : r);
      setSaveMsg('✓ Saved successfully');
    } catch {
      setSaveMsg('✗ Error while saving');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  // ── Send payment email ─────────────────────────────────
  const handleSendPaymentEmail = async () => {
    if (isLocked) return;
    if (!adminForm.payment_link) {
      setSendMsg('✗ Please add a payment link first');
      setTimeout(() => setSendMsg(''), 3000);
      return;
    }
    if (!adminForm.final_price) {
      setSendMsg('✗ Please add the final price first');
      setTimeout(() => setSendMsg(''), 3000);
      return;
    }
    if (!window.confirm(`Send payment email to ${reservation?.client_email}?`)) return;

    setSending(true); setSendMsg('');
    try {
      await emailjs.send(EMAILJS_SERVICE_PAYMENT_ID, TEMPLATE_PAYMENT, {
        client_name:  reservation?.client_name,
        client_email: reservation?.client_email,
        reference:    reservation?.reference,
        destination:  reservation?.destinations?.name || '—',
        travel_date:  reservation?.travel_date
          ? new Date(reservation.travel_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—',
        guests:       reservation?.guests,
        duration:     `${reservation?.duration} nights`,
        final_price:  `$${Number(adminForm.final_price).toLocaleString()}`,
        hotel:        adminForm.hotel     || 'To be confirmed',
        transport:    adminForm.transport || 'To be confirmed',
        options:      adminForm.options   || 'No additional options',
        payment_link: adminForm.payment_link,
      }, EMAILJS_PUBLIC_KEY);

      await supabase.from('reservations').update({
        status:        'awaiting_payment',
        email_sent_at: new Date().toISOString(),
        final_price:   parseFloat(adminForm.final_price),
        hotel:         adminForm.hotel        || null,
        transport:     adminForm.transport    || null,
        options:       adminForm.options      || null,
        payment_link:  adminForm.payment_link,
        admin_notes:   adminForm.admin_notes  || null,
      }).eq('id', id);

      setAdminForm(f => ({ ...f, status: 'awaiting_payment' }));
      setSendMsg('✓ Payment email sent!');
    } catch {
      setSendMsg('✗ Error while sending email');
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(''), 4000);
    }
  };

  // ── Loading / not found ────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--royal-border)', borderTopColor: 'var(--royal)' }} />
    </div>
  );

  if (!reservation) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <AlertCircle size={32} style={{ color: 'var(--error)', margin: '0 auto 12px' }} />
        <p style={{ color: 'var(--text-3)' }}>Reservation not found</p>
        <button onClick={() => navigate('/admin/dashboard')} className="btn-royal mt-4 text-xs">Go back</button>
      </div>
    </div>
  );

  const statusColor = STATUS_COLORS[adminForm.status] || '#666';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50"
        style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.button onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}
              whileHover={{ background: 'rgba(255,255,255,0.18)' } as any}>
              <ArrowLeft size={13} /> Back
            </motion.button>
            <div>
              <div className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Reservation · {reservation.reference}
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {reservation.client_name} · {reservation.client_email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLocked && (
              <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Lock size={10} /> Locked
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`, fontFamily: 'var(--font-display)' }}>
              {STATUS_OPTIONS.find(s => s.value === adminForm.status)?.label || adminForm.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT — Read-only client info ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Client info */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<Mail size={15} />} title="Client Information" />
              {[
                { icon: <Mail size={13} />,  label: 'Email',  value: reservation.client_email        },
                { icon: <Phone size={13} />, label: 'Phone',  value: reservation.client_phone || '—' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 mb-3">
                  <span style={{ color: 'var(--text-3)', marginTop: 1 }}>{icon}</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>{label}</div>
                    <div className="text-sm" style={{ color: 'var(--text)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trip details */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<MapPin size={15} />} title="Trip Details" />
              {[
                { icon: <MapPin size={13} />,   label: 'Destination', value: reservation.destinations?.name || '—' },
                { icon: <Calendar size={13} />, label: 'Departure',   value: new Date(reservation.travel_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: <Calendar size={13} />, label: 'Return',      value: reservation.return_date ? new Date(reservation.return_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified' },
                { icon: <Users size={13} />,    label: 'Guests',      value: `${reservation.guests} guest${reservation.guests > 1 ? 's' : ''}` },
                { icon: <Clock size={13} />,    label: 'Duration',    value: `${reservation.duration} night${reservation.duration > 1 ? 's' : ''}` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 mb-3 last:mb-0">
                  <span style={{ color: 'var(--text-3)', marginTop: 1 }}>{icon}</span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>{label}</div>
                    <div className="text-sm" style={{ color: 'var(--text)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special requests & message */}
            {(reservation.special_requests || reservation.message) && (
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                <SectionTitle icon={<FileText size={15} />} title="Requests & Message" />
                {reservation.special_requests && (
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Special Requests</div>
                    <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.7 }}>{reservation.special_requests}</p>
                  </div>
                )}
                {reservation.message && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Client Message</div>
                    <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.7 }}>{reservation.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Email sent timestamp */}
            {reservation.email_sent_at && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669' }}>
                <CheckCircle2 size={13} />
                Payment email sent on {new Date(reservation.email_sent_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          {/* ── RIGHT — Admin form ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Lock banner */}
            {isLocked && <LockBanner status={adminForm.status} />}

            {/* Status */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<Edit3 size={15} />} title="Order Status" />
              <select value={adminForm.status} onChange={e => updateForm('status', e.target.value)}
                style={{ ...field, border: `2px solid ${statusColor}`, color: statusColor, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {isLocked && (
                <p className="text-[11px] mt-2" style={{ color: '#6B7280' }}>
                  Change the status to <strong>Pending</strong> or <strong>Confirmed</strong> to unlock editing.
                </p>
              )}
            </div>

            {/* Quote & trip options */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<CreditCard size={15} />} title="Quote & Trip Options" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    Final Price ($) *
                  </label>
                  <input type="number" placeholder="e.g. 3500" value={adminForm.final_price}
                    onChange={e => updateForm('final_price', e.target.value)}
                    disabled={isLocked}
                    style={isLocked ? { ...fieldLocked, fontWeight: 700, fontSize: 16 } : { ...field, fontWeight: 700, fontSize: 16 }} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    <span className="flex items-center gap-1"><Car size={11} /> Transport</span>
                  </label>
                  <input type="text" placeholder="e.g. Air France CDG → JFK" value={adminForm.transport}
                    onChange={e => updateForm('transport', e.target.value)}
                    disabled={isLocked}
                    style={isLocked ? fieldLocked : field} />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  <span className="flex items-center gap-1"><Hotel size={11} /> Accommodation</span>
                </label>
                <input type="text" placeholder="e.g. Le Méridien Hotel, Deluxe sea view room"
                  value={adminForm.hotel} onChange={e => updateForm('hotel', e.target.value)}
                  disabled={isLocked}
                  style={isLocked ? fieldLocked : field} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  Options & Inclusions
                </label>
                <textarea rows={3} placeholder="e.g. Airport transfer, snorkeling excursion, romantic dinner..."
                  value={adminForm.options} onChange={e => updateForm('options', e.target.value)}
                  disabled={isLocked}
                  style={isLocked ? { ...fieldLocked, resize: 'vertical', lineHeight: 1.65 } : { ...field, resize: 'vertical', lineHeight: 1.65 }} />
              </div>
            </div>

            {/* Payment link + send email */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}>
              <SectionTitle icon={<Zap size={15} />} title="Payment Link" />

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  Stripe Link or Zelle Instructions *
                </label>
                <input type="text"
                  placeholder="https://buy.stripe.com/xxx  or  Send $3500 to infiniteluxurytrips@gmail.com"
                  value={adminForm.payment_link} onChange={e => updateForm('payment_link', e.target.value)}
                  disabled={isLocked}
                  style={isLocked ? fieldLocked : { ...field, borderColor: adminForm.payment_link ? 'var(--royal)' : 'var(--royal-border)' }} />
                {!isLocked && (
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-3)' }}>
                    For Stripe: create a payment link in your Stripe dashboard and paste it here.
                    For Zelle: enter the transfer instructions.
                  </p>
                )}
              </div>

              {isLocked ? (
                <DisabledButton
                  icon={<Send size={13} />}
                  label={
                    adminForm.status === 'completed'
                      ? 'Email sending disabled — reservation completed'
                      : 'Email already sent — status is Awaiting Payment'
                  }
                />
              ) : (
                <motion.button onClick={handleSendPaymentEmail} disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: sending ? 'rgba(48,36,112,0.5)' : 'var(--royal)',
                    color: '#fff', border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(48,36,112,0.3)',
                  }}
                  whileHover={!sending ? { scale: 1.02 } : {}}
                  whileTap={!sending ? { scale: 0.98 } : {}}>
                  <Send size={14} />
                  {sending ? 'Sending...' : `Send payment email to ${reservation.client_email}`}
                </motion.button>
              )}

              <AnimatePresence>
                {sendMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl mt-3 text-xs font-semibold"
                    style={{
                      background: sendMsg.startsWith('✓') ? '#ECFDF5' : '#FEF2F2',
                      color:      sendMsg.startsWith('✓') ? '#059669'  : '#DC2626',
                      border: `1px solid ${sendMsg.startsWith('✓') ? '#A7F3D0' : '#FECACA'}`,
                    }}>
                    {sendMsg.startsWith('✓') ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {sendMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin notes */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<FileText size={15} />} title="Internal Notes (not sent to client)" />
              <textarea rows={3} placeholder="Private notes: client call, negotiations, suppliers contacted..."
                value={adminForm.admin_notes} onChange={e => updateForm('admin_notes', e.target.value)}
                disabled={isLocked}
                style={isLocked ? { ...fieldLocked, resize: 'vertical', lineHeight: 1.65 } : { ...field, resize: 'vertical', lineHeight: 1.65 }} />
            </div>

            {/* Save button */}
            <div>
              {isLocked ? (
                <DisabledButton
                  icon={<Save size={13} />}
                  label={
                    adminForm.status === 'completed'
                      ? 'Saving disabled — reservation completed'
                      : 'Saving disabled — payment email already sent'
                  }
                />
              ) : (
                <motion.button onClick={handleSave} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: saving ? 'var(--gold-soft)' : 'var(--gold)',
                    color: '#0D0B28', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(245,166,35,0.3)',
                  }}
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}>
                  <Save size={14} />
                  {saving ? 'Saving...' : 'Save changes'}
                </motion.button>
              )}

              <AnimatePresence>
                {saveMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl mt-3 text-xs font-semibold"
                    style={{
                      background: saveMsg.startsWith('✓') ? '#ECFDF5' : '#FEF2F2',
                      color:      saveMsg.startsWith('✓') ? '#059669'  : '#DC2626',
                      border: `1px solid ${saveMsg.startsWith('✓') ? '#A7F3D0' : '#FECACA'}`,
                    }}>
                    {saveMsg.startsWith('✓') ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {saveMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;