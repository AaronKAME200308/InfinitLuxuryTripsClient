import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  ArrowLeft, Save, Send, CheckCircle2, AlertCircle,
  MapPin, Calendar, Users, Clock, Mail, Phone,
  CreditCard, Hotel, Car, FileText, Zap, Edit3
} from 'lucide-react';
import supabase from '../services/supabase';

// ── EmailJS ────────────────────────────────────────────────
const EMAILJS_SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID          || 'service_xxx';
const EMAILJS_PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY          || 'key_xxx';
const TEMPLATE_PAYMENT     = import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENT    || 'template_payment';

// ── Types ──────────────────────────────────────────────────
interface Reservation {
  id: string; reference: string;
  name: string; email: string; phone?: string;
  destination_name: string; travel_date: string; return_date?: string;
  guests: number; duration: number; status: string;
  special_requests?: string; message?: string;
  final_price?: number; hotel?: string; transport?: string;
  options?: string; payment_link?: string; admin_notes?: string;
  created_at: string; email_sent_at?: string;
}

const STATUS_OPTIONS = [
  { value: 'pending',           label: 'En attente'         },
  { value: 'confirmed',         label: 'Confirmée'          },
  { value: 'awaiting_payment',  label: 'Paiement attendu'   },
  { value: 'completed',         label: 'Terminée'           },
  { value: 'cancelled',         label: 'Annulée'            },
];

const STATUS_COLORS: Record<string, string> = {
  pending:          '#D97706',
  confirmed:        '#2563EB',
  awaiting_payment: '#7C3AED',
  completed:        '#059669',
  cancelled:        '#DC2626',
};

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

  // Formulaire admin
  const [adminForm, setAdminForm] = useState({
    status:       '',
    final_price:  '',
    hotel:        '',
    transport:    '',
    options:      '',
    payment_link: '',
    admin_notes:  '',
  });

  // ── Chargement ──────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('reservations').select('*').eq('id', id).single();
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
    if (id) fetch();
  }, [id]);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin');
    });
  }, [navigate]);

  const updateForm = (k: keyof typeof adminForm, v: string) =>
    setAdminForm(f => ({ ...f, [k]: v }));

  // ── Sauvegarder ─────────────────────────────────────────
  const handleSave = async () => {
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
      setReservation(r => r ? { ...r, ...adminForm, final_price: adminForm.final_price ? parseFloat(adminForm.final_price) : undefined } : r);
      setSaveMsg('✓ Sauvegardé avec succès');
    } catch {
      setSaveMsg('✗ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  // ── Envoyer email paiement ──────────────────────────────
  const handleSendPaymentEmail = async () => {
    if (!adminForm.payment_link) {
      setSendMsg('✗ Ajoutez d\'abord un lien de paiement');
      setTimeout(() => setSendMsg(''), 3000);
      return;
    }
    if (!adminForm.final_price) {
      setSendMsg('✗ Ajoutez d\'abord le prix final');
      setTimeout(() => setSendMsg(''), 3000);
      return;
    }
    if (!window.confirm(`Envoyer l'email de paiement à ${reservation?.email} ?`)) return;

    setSending(true); setSendMsg('');
    try {
      // 1. Envoyer l'email
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_PAYMENT, {
        client_name:      reservation?.name,
        client_email:     reservation?.email,
        reference:        reservation?.reference,
        destination:      reservation?.destination_name,
        travel_date:      reservation?.travel_date
          ? new Date(reservation.travel_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—',
        guests:           reservation?.guests,
        duration:         `${reservation?.duration} nuits`,
        final_price:      `$${Number(adminForm.final_price).toLocaleString()}`,
        hotel:            adminForm.hotel     || 'À confirmer',
        transport:        adminForm.transport || 'À confirmer',
        options:          adminForm.options   || 'Aucune option supplémentaire',
        payment_link:     adminForm.payment_link,
      }, EMAILJS_PUBLIC_KEY);

      // 2. Mettre à jour le statut + date d'envoi
      await supabase.from('reservations').update({
        status:          'awaiting_payment',
        email_sent_at:   new Date().toISOString(),
        final_price:     parseFloat(adminForm.final_price),
        hotel:           adminForm.hotel        || null,
        transport:       adminForm.transport    || null,
        options:         adminForm.options      || null,
        payment_link:    adminForm.payment_link,
        admin_notes:     adminForm.admin_notes  || null,
      }).eq('id', id);

      setAdminForm(f => ({ ...f, status: 'awaiting_payment' }));
      setSendMsg('✓ Email de paiement envoyé !');
    } catch (err) {
      setSendMsg('✗ Erreur lors de l\'envoi');
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(''), 4000);
    }
  };

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
        <p style={{ color: 'var(--text-3)' }}>Réservation introuvable</p>
        <button onClick={() => navigate('/admin/dashboard')} className="btn-royal mt-4 text-xs">Retour</button>
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
              <ArrowLeft size={13} /> Retour
            </motion.button>
            <div>
              <div className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Réservation · {reservation.reference}
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {reservation.name} · {reservation.email}
              </div>
            </div>
          </div>
          {/* Statut badge header */}
          <span className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`, fontFamily: 'var(--font-display)' }}>
            {STATUS_OPTIONS.find(s => s.value === adminForm.status)?.label || adminForm.status}
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── GAUCHE — Infos client (lecture seule) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Infos client */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<Mail size={15} />} title="Informations client" />
              {[
                { icon: <Mail size={13} />,     label: 'Email',       value: reservation.email            },
                { icon: <Phone size={13} />,    label: 'Téléphone',   value: reservation.phone || '—'     },
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

            {/* Détails voyage */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<MapPin size={15} />} title="Détails du voyage" />
              {[
                { icon: <MapPin size={13} />,  label: 'Destination', value: reservation.destination_name },
                { icon: <Calendar size={13} />, label: 'Départ',      value: new Date(reservation.travel_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: <Calendar size={13} />, label: 'Retour',      value: reservation.return_date ? new Date(reservation.return_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non précisé' },
                { icon: <Users size={13} />,   label: 'Personnes',   value: `${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}` },
                { icon: <Clock size={13} />,   label: 'Durée',       value: `${reservation.duration} nuits` },
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

            {/* Demandes + message */}
            {(reservation.special_requests || reservation.message) && (
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
                <SectionTitle icon={<FileText size={15} />} title="Demandes & message" />
                {reservation.special_requests && (
                  <div className="mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Demandes particulières</div>
                    <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.7 }}>{reservation.special_requests}</p>
                  </div>
                )}
                {reservation.message && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Message du client</div>
                    <p className="text-sm" style={{ color: 'var(--text)', lineHeight: 1.7 }}>{reservation.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Date envoi email */}
            {reservation.email_sent_at && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669' }}>
                <CheckCircle2 size={13} />
                Email paiement envoyé le {new Date(reservation.email_sent_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          {/* ── DROITE — Formulaire admin ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Statut */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<Edit3 size={15} />} title="Statut de la commande" />
              <select value={adminForm.status} onChange={e => updateForm('status', e.target.value)}
                style={{ ...field, border: `2px solid ${statusColor}`, color: statusColor, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Détails du devis */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<CreditCard size={15} />} title="Devis & options du voyage" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Prix final */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    Prix final ($) *
                  </label>
                  <input type="number" placeholder="ex: 3500" value={adminForm.final_price}
                    onChange={e => updateForm('final_price', e.target.value)}
                    style={{ ...field, fontWeight: 700, fontSize: 16 }} />
                </div>
                {/* Moyen de transport */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    <span className="flex items-center gap-1"><Car size={11} /> Transport</span>
                  </label>
                  <input type="text" placeholder="ex: Vol Air France CDG → JFK" value={adminForm.transport}
                    onChange={e => updateForm('transport', e.target.value)} style={field} />
                </div>
              </div>

              {/* Hôtel */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  <span className="flex items-center gap-1"><Hotel size={11} /> Hébergement</span>
                </label>
                <input type="text" placeholder="ex: Hôtel Le Méridien, chambre Deluxe vue mer"
                  value={adminForm.hotel} onChange={e => updateForm('hotel', e.target.value)} style={field} />
              </div>

              {/* Options supplémentaires */}
              <div className="mb-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  Options & inclusions
                </label>
                <textarea rows={3} placeholder="ex: Transfert aéroport, excursion snorkeling, dîner romantique..."
                  value={adminForm.options} onChange={e => updateForm('options', e.target.value)}
                  style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
              </div>
            </div>

            {/* Lien de paiement */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}>
              <SectionTitle icon={<Zap size={15} />} title="Lien de paiement" />

              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  Lien Stripe ou instruction Zelle *
                </label>
                <input type="text"
                  placeholder="https://buy.stripe.com/xxx  ou  Envoyer $3500 à infiniteluxurytrips@gmail.com"
                  value={adminForm.payment_link} onChange={e => updateForm('payment_link', e.target.value)}
                  style={{ ...field, borderColor: adminForm.payment_link ? 'var(--royal)' : 'var(--royal-border)' }} />
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-3)' }}>
                  Pour Stripe : créez une payment link dans votre dashboard Stripe et collez le lien ici.
                  Pour Zelle : entrez les instructions de transfert.
                </p>
              </div>

              {/* Envoi email */}
              <motion.button onClick={handleSendPaymentEmail} disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{
                  background: sending ? 'rgba(48,36,112,0.5)' : 'var(--royal)',
                  color: '#fff', border: 'none', cursor: sending ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(48,36,112,0.3)',
                }}
                whileHover={!sending ? { scale: 1.02 } : {}} whileTap={!sending ? { scale: 0.98 } : {}}>
                <Send size={14} />
                {sending ? 'Envoi en cours...' : `Envoyer l'email de paiement à ${reservation.email}`}
              </motion.button>

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

            {/* Notes admin */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
              <SectionTitle icon={<FileText size={15} />} title="Notes internes (non envoyées au client)" />
              <textarea rows={3} placeholder="Notes privées : appel client, négociations, fournisseurs contactés..."
                value={adminForm.admin_notes} onChange={e => updateForm('admin_notes', e.target.value)}
                style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
            </div>

            {/* Bouton sauvegarder */}
            <div>
              <motion.button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{
                  background: saving ? 'var(--gold-soft)' : 'var(--gold)',
                  color: '#0D0B28', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(245,166,35,0.3)',
                }}
                whileHover={!saving ? { scale: 1.02 } : {}} whileTap={!saving ? { scale: 0.98 } : {}}>
                <Save size={14} />
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </motion.button>

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