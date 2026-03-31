import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  MapPin, User, Calendar, Users, Clock,
  ChevronRight, ChevronLeft, CheckCircle2,
  Sparkles, MessageCircle, Phone, Send, XCircle
} from 'lucide-react';
import { useDestinations } from '../hooks';
import { FormField, inputStyle } from '../components/UI';
import supabase from '../services/supabase';

// ── EmailJS config ─────────────────────────────────────────
const EMAILJS_SERVICE_ID    = import.meta.env.VITE_EMAILJS_SERVICE_ID       || 'service_xxx';
const EMAILJS_PUBLIC_KEY    = import.meta.env.VITE_EMAILJS_PUBLIC_KEY       || 'key_xxx';
const TEMPLATE_CLIENT       = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT  || 'template_client';
const TEMPLATE_ADMIN        = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN   || 'template_admin';

interface TripForm {
  destinationId: string; destinationName: string;
  travelDate: string;    returnDate: string;
  guests: string;        duration: string;
  specialRequests: string;
}
interface ClientForm { client_name: string; client_email: string; client_phone: string; message: string; }
interface Errors { destinationId?: string; travelDate?: string; client_name?: string; client_email?: string; submit?: string; }

// ── Step bar ───────────────────────────────────────────────
const StepBar = ({ step }: { step: number }) => {
  const steps = [
    { n: 1, label: 'Votre voyage',   icon: <MapPin       size={15} />, desc: 'Destination & dates' },
    { n: 2, label: 'Vos infos',      icon: <User         size={15} />, desc: 'Coordonnées'         },
    { n: 3, label: 'Confirmation',   icon: <CheckCircle2 size={15} />, desc: 'Demande envoyée'     },
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
                animate={{ background: active ? 'var(--royal)' : '#F0EEF9', color: active ? '#fff' : '#9896B0', boxShadow: active ? '0 4px 14px rgba(48,36,112,0.28)' : 'none' }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm mb-2"
                style={{ border: active ? '2px solid var(--royal)' : '2px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}>
                {done ? <CheckCircle2 size={19} color="#fff" /> : active ? icon : n}
              </motion.div>
              <div className="text-xs font-bold hidden sm:block text-center"
                style={{ color: active ? 'var(--royal)' : 'var(--text-3)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>{label}</div>
              <div className="text-[10px] hidden sm:block text-center" style={{ color: 'var(--text-3)' }}>{desc}</div>
            </div>
            {i < steps.length - 1 && (
              <motion.div animate={{ background: step > n ? 'var(--royal)' : 'var(--royal-border)' }}
                transition={{ duration: 0.4 }} className="mx-3 mb-7 h-0.5 rounded-full" style={{ width: 60 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Bouton annulation réutilisable ─────────────────────────
const CancelBtn = () => (
  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
    <Link to="/cancel"
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
      style={{ background: 'var(--bg)', color: 'var(--text-3)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--error)'; (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; }}>
      <XCircle size={12} /> Annuler une réservation existante
    </Link>
  </div>
);

// ── StepHeader ─────────────────────────────────────────────
const StepHeader = ({ icon, title, sub, num }: { icon: React.ReactNode; title: string; sub: string; num: string }) => (
  <div className="relative px-8 py-6 flex items-center gap-4"
    style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
      {icon}
    </div>
    <div>
      <h2 className="font-bold text-xl text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{sub}</p>
    </div>
    <div className="absolute right-6 font-extrabold select-none pointer-events-none"
      style={{ fontSize: 72, color: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{num}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════
const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill  = location.state || {};

  const [step,         setStep]         = useState(1);
  const [errors,       setErrors]       = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference,    setReference]    = useState('');

  const [trip, setTrip] = useState<TripForm>({
    destinationId:   prefill.destinationId   || '',
    destinationName: prefill.destinationName || '',
    travelDate:      prefill.date            || '',
    returnDate:      '',
    guests:          String(prefill.guests   || 2),
    duration:        '7',
    specialRequests: '',
  });

  const [client, setClient] = useState<ClientForm>({ client_name: '', client_email: '', client_phone: '', message: '' });

  const { destinations, loading: destLoading } = useDestinations();
  const selectedDest = destinations.find((d: any) => d.id === trip.destinationId);
  const today = new Date().toISOString().split('T')[0];

  const updateTrip   = (k: keyof TripForm,   v: string) => { setTrip(f => ({ ...f, [k]: v }));   if (errors[k as keyof Errors]) setErrors(e => ({ ...e, [k]: undefined })); };
  const updateClient = (k: keyof ClientForm, v: string) => { setClient(f => ({ ...f, [k]: v })); if (errors[k as keyof Errors]) setErrors(e => ({ ...e, [k]: undefined })); };

  const validateStep1 = () => {
    const errs: Errors = {};
    if (!trip.destinationId)               errs.destinationId = 'Sélectionnez une destination';
    if (!trip.travelDate)                  errs.travelDate    = 'Date de départ requise';
    else if (trip.travelDate <= today)     errs.travelDate    = 'La date doit être dans le futur';
    setErrors(errs); return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Errors = {};
    if (!client.client_name.trim() || client.client_name.trim().length < 2)             errs.client_name  = 'Nom complet requis';
    if (!client.client_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.client_email)) errs.client_email = 'Email valide requis';
    setErrors(errs); return Object.keys(errs).length === 0;
  };

  const generateRef = () => 'ILT-' + Date.now().toString(36).toUpperCase().slice(-6);

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true); setErrors({});
    try {
      const ref = generateRef();

      // 1. Supabase
      const { error: dbError } = await supabase.from('reservations').insert([{
        client_name:             client.client_name.trim(),
        client_email:            client.client_email.trim().toLowerCase(),
        client_phone:            client.client_phone || null,
        destination_id:   trip.destinationId,
        travel_date:      trip.travelDate,
        // return_date:      trip.returnDate || null,
        guests:           parseInt(trip.guests),
        duration:         parseInt(trip.duration),
        special_requests: trip.specialRequests || null,
        // message:          client.message || null,
        status:           'pending',
        reference:        ref,
        payment_method:   'zelle',
        amount: 3000, //amount > 0::numeric
      }]);
      if (dbError) throw new Error(dbError.message);

      const tripData = {
        client_name:      client.client_name,
        client_email:     client.client_email,
        client_phone:     client.client_phone || 'Non renseigné',
        reference:        ref,
        destination:      selectedDest?.name || trip.destinationName,
        travel_date:      trip.travelDate
          ? new Date(trip.travelDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—',
        return_date:      trip.returnDate
          ? new Date(trip.returnDate).toLocaleDateString('fr-FR',  { day: 'numeric', month: 'long', year: 'numeric' })
          : 'Non précisé',
        guests:           trip.guests,
        duration:         `${trip.duration} nuits`,
        special_requests: trip.specialRequests || 'Aucune',
        message:          client.message || 'Aucun message',
        admin_url:        `${window.location.origin}/admin`,
        amount: 0
      };

      // 2. Email client
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_CLIENT, tripData, EMAILJS_PUBLIC_KEY);
      // 3. Email admin
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_ADMIN,  tripData, EMAILJS_PUBLIC_KEY);

      setReference(ref);
      setStep(3);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field    : React.CSSProperties = { ...inputStyle, borderRadius: 12, padding: '11px 14px', fontSize: 14, borderColor: 'var(--royal-border)' };
  const fieldErr = (k: keyof Errors)   => ({ ...field, borderColor: errors[k] ? 'var(--error)' : 'var(--royal-border)' });

  // ── Récap voyage (utilisé step 2) ─────────────────────
  const tripSummary = [
    ['Destination', selectedDest?.name || trip.destinationName],
    ['Départ',      trip.travelDate ? new Date(trip.travelDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
    ['Retour',      trip.returnDate  ? new Date(trip.returnDate).toLocaleDateString('fr-FR',  { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non précisé'],
    ['Personnes',   `${trip.guests} personne${parseInt(trip.guests) > 1 ? 's' : ''}`],
    ['Durée',       `${trip.duration} nuits`],
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <motion.img src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1400&q=80"
          alt="Reservation" className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.96) 0%, rgba(20,17,58,0.3) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-[760px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: 'rgba(245,166,35,0.18)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)', fontFamily: 'var(--font-display)' }}>
                <Sparkles size={10} /> Votre voyage de rêve
              </div>
              <h1 className="font-bold text-white mb-2"
                style={{ fontSize: 'clamp(26px, 5vw, 46px)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                Faire une <span style={{ color: 'var(--gold)' }}>Réservation</span>
              </h1>
              <div style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── WIZARD ── */}
      <div className="max-w-[760px] mx-auto px-4 py-10">
        {step < 3 && <StepBar step={step} />}

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-lg)' }}>

            {/* ════ STEP 1 — Voyage ════ */}
            {step === 1 && (
              <div>
                <StepHeader icon={<MapPin size={22} color="#fff" />} title="Votre voyage"
                  sub="Étape 1 sur 2 — Choisissez votre destination et vos dates" num="01" />
                <div className="p-8">
                  <div className="mb-5" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                  {/* Destination */}
                  <FormField label="Destination" error={errors.destinationId} required>
                    <select value={trip.destinationId}
                      onChange={e => { const d = destinations.find((x: any) => x.id === e.target.value); updateTrip('destinationId', e.target.value); updateTrip('destinationName', d?.name || ''); }}
                      style={{ ...fieldErr('destinationId'), appearance: 'none' }}>
                      <option value="">{destLoading ? 'Chargement...' : 'Sélectionnez une destination...'}</option>
                      {destinations.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name} — {d.category}</option>
                      ))}
                    </select>
                  </FormField>

                  {/* Aperçu */}
                  {selectedDest && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl mb-5"
                      style={{ background: 'var(--royal-soft)', border: '1px solid var(--royal-border)' }}>
                      <img src={selectedDest.image_url} alt={selectedDest.name}
                        className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>{selectedDest.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>{selectedDest.category}</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Date de départ" error={errors.travelDate} required>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                        <input type="date" min={today} value={trip.travelDate}
                          onChange={e => updateTrip('travelDate', e.target.value)}
                          style={{ ...fieldErr('travelDate'), paddingLeft: 34 }} />
                      </div>
                    </FormField>
                    <FormField label="Date de retour (optionnel)">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                        <input type="date" min={trip.travelDate || today} value={trip.returnDate}
                          onChange={e => updateTrip('returnDate', e.target.value)}
                          style={{ ...field, paddingLeft: 34 }} />
                      </div>
                    </FormField>
                  </div>

                  {/* Voyageurs + Durée */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Nombre de personnes">
                      <div className="relative">
                        <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                        <select value={trip.guests} onChange={e => updateTrip('guests', e.target.value)}
                          style={{ ...field, appearance: 'none', paddingLeft: 34 }}>
                          {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                            <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </FormField>
                    <FormField label="Durée estimée">
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
                        <select value={trip.duration} onChange={e => updateTrip('duration', e.target.value)}
                          style={{ ...field, appearance: 'none', paddingLeft: 34 }}>
                          {[3,4,5,6,7,8,10,12,14,21].map(n => (
                            <option key={n} value={n}>{n} nuit{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Demandes particulières (optionnel)">
                    <textarea rows={3} value={trip.specialRequests}
                      onChange={e => updateTrip('specialRequests', e.target.value)}
                      placeholder="Anniversaire, régime alimentaire, accessibilité, type de chambre..."
                      style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
                  </FormField>

                  <motion.button onClick={() => validateStep1() && setStep(2)}
                    className="btn-royal w-full justify-center flex items-center gap-2 mt-2"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Continuer <ChevronRight size={15} />
                  </motion.button>
                  <CancelBtn />
                </div>
              </div>
            )}

            {/* ════ STEP 2 — Infos client ════ */}
            {step === 2 && (
              <div>
                <StepHeader icon={<User size={22} color="#fff" />} title="Vos informations"
                  sub="Étape 2 sur 2 — Coordonnées pour vous recontacter" num="02" />
                <div className="p-8">
                  <div className="mb-5" style={{ width: 36, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                  {/* Récap voyage */}
                  <div className="p-4 rounded-xl mb-6"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Récapitulatif de votre demande</div>
                    {tripSummary.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-1.5"
                        style={{ borderBottom: '1px solid var(--royal-border)' }}>
                        <span style={{ color: 'var(--text-3)' }}>{k}</span>
                        <span className="font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{v}</span>
                      </div>
                    ))}
                    <p className="text-[10px] mt-2 italic" style={{ color: 'var(--text-3)' }}>
                      Le prix final vous sera communiqué par email par notre équipe concierge.
                    </p>
                  </div>

                  <FormField label="Nom complet" error={errors.client_name} required>
                    <input type="text" placeholder="Jean Dupont" autoComplete="name"
                      value={client.client_name} onChange={e => updateClient('client_name', e.target.value)}
                      style={fieldErr('client_name')} />
                  </FormField>
                  <FormField label="Adresse email" error={errors.client_email} required>
                    <input type="email" placeholder="jean@exemple.com" autoComplete="email"
                      value={client.client_email} onChange={e => updateClient('client_email', e.target.value)}
                      style={fieldErr('client_email')} />
                  </FormField>
                  <FormField label="Téléphone (optionnel)">
                    <input type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel"
                      value={client.client_phone} onChange={e => updateClient('client_phone', e.target.value)}
                      style={field} />
                  </FormField>
                  <FormField label="Message à l'équipe (optionnel)">
                    <textarea rows={3} value={client.message}
                      onChange={e => updateClient('message', e.target.value)}
                      placeholder="Questions, précisions, ou tout ce que vous souhaitez nous dire..."
                      style={{ ...field, resize: 'vertical', lineHeight: 1.65 }} />
                  </FormField>

                  {/* Note no paiement */}
                  <div className="flex items-start gap-3 p-4 rounded-xl mb-5"
                    style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-border)' }}>
                    <Sparkles size={14} style={{ color: 'var(--gold-hover)', flexShrink: 0, marginTop: 2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#7A5A10' }}>
                      <strong>Aucun paiement maintenant.</strong> Notre équipe analyse votre demande et vous envoie
                      un devis personnalisé avec le prix final et le lien de paiement directement par email sous 24h.
                    </p>
                  </div>

                  {errors.submit && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                      style={{ background: 'var(--error-soft)', color: 'var(--error)', border: '1px solid #FECACA' }}>
                      {errors.submit}
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-outline flex items-center gap-1.5">
                      <ChevronLeft size={14} /> Retour
                    </button>
                    <motion.button onClick={handleSubmit} disabled={isSubmitting}
                      className="btn-royal flex-1 justify-center flex items-center gap-2"
                      style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}}>
                      <Send size={14} />
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                    </motion.button>
                  </div>
                  <CancelBtn />
                </div>
              </div>
            )}

            {/* ════ STEP 3 — Confirmation ════ */}
            {step === 3 && (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'var(--royal-soft)', border: '2px solid var(--royal-border)' }}>
                  <CheckCircle2 size={36} style={{ color: 'var(--royal)' }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Demande envoyée !</div>
                  <h2 className="font-bold text-2xl mb-2"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Merci, <span style={{ color: 'var(--royal)' }}>{client.client_name.split(' ')[0]}</span> !
                  </h2>
                  <div className="mx-auto mb-5" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

                  {/* Référence */}
                  <div className="inline-block px-6 py-3 rounded-xl mb-6"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Référence de votre demande</div>
                    <div className="font-extrabold text-2xl tracking-[4px]"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>{reference}</div>
                  </div>

                  <p className="text-sm mb-2" style={{ color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 460, margin: '0 auto 12px' }}>
                    Un email de confirmation a été envoyé à <strong>{client.client_email}</strong>.
                  </p>
                  <p className="text-sm mb-8" style={{ color: 'var(--text-2)', lineHeight: 1.8, maxWidth: 460, margin: '0 auto 32px' }}>
                    Notre équipe analyse votre demande et vous envoie un <strong>devis personnalisé</strong> avec
                    le prix final et le lien de paiement <strong>dans les 24 heures</strong>.
                  </p>

                  {/* Étapes suivantes */}
                  <div className="text-left p-5 rounded-xl mb-6"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <div className="text-xs font-bold uppercase tracking-wider mb-4"
                      style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Prochaines étapes</div>
                    {[
                      { n: '1', text: 'Notre concierge étudie votre demande',      sub: 'Sous 24 heures'                         },
                      { n: '2', text: 'Vous recevez un devis détaillé par email',  sub: 'Prix, hôtel, transport inclus'           },
                      { n: '3', text: 'Vous payez via le lien sécurisé',           sub: 'Stripe ou Zelle selon votre préférence' },
                      { n: '4', text: 'Votre voyage est confirmé !',               sub: 'Itinéraire complet envoyé'               },
                    ].map(({ n, text, sub }) => (
                      <div key={n} className="flex items-start gap-3 mb-3 last:mb-0">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: 'var(--royal)', color: '#fff', fontFamily: 'var(--font-display)' }}>{n}</div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{text}</div>
                          <div className="text-xs" style={{ color: 'var(--text-3)' }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contacter l'admin */}
                  <div className="p-5 rounded-xl mb-6" style={{ background: '#fff', border: '1.5px solid var(--border)' }}>
                    <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                      Une question ? Contactez notre équipe directement
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a href="/contact"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--royal)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--royal-soft)'; (e.currentTarget as HTMLElement).style.color = 'var(--royal)'; }}>
                        <MessageCircle size={14} /> Envoyer un message
                      </a>
                      <a href="tel:+18004585893"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)', border: '1.5px solid var(--gold-border)', fontFamily: 'var(--font-display)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = '#0D0B28'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-soft)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold-hover)'; }}>
                        <Phone size={14} /> Appeler le concierge
                      </a>
                    </div>
                  </div>

                  <button onClick={() => navigate('/')} className="btn-outline text-sm">
                    Retour à l'accueil
                  </button>
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