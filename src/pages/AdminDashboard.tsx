import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, RefreshCw, Clock, CheckCircle2,
  XCircle, CreditCard, Eye, Trash2,
  Search, Filter, Users, MapPin, Calendar
} from 'lucide-react';
import supabase from '../services/supabase';

// ── Types ──────────────────────────────────────────────────
interface Reservation {
  id:               string;
  reference:        string;
  name:             string;
  email:            string;
  phone?:           string;
  destination_name: string;
  travel_date:      string;
  return_date?:     string;
  guests:           number;
  duration:         number;
  status:           'pending' | 'confirmed' | 'awaiting_payment' | 'completed' | 'cancelled';
  final_price?:     number;
  payment_link?:    string;
  created_at:       string;
  special_requests?: string;
  message?:         string;
}

// ── Config statuts ─────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: {
    label: 'En attente',      color: '#D97706', bg: '#FFF8EC', border: '#FDDFA0',
    icon: <Clock size={12} />,
  },
  confirmed: {
    label: 'Confirmée',       color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    icon: <CheckCircle2 size={12} />,
  },
  awaiting_payment: {
    label: 'Paiement attendu', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
    icon: <CreditCard size={12} />,
  },
  completed: {
    label: 'Terminée',        color: '#059669', bg: '#ECFDF5', border: '#A7F3D0',
    icon: <CheckCircle2 size={12} />,
  },
  cancelled: {
    label: 'Annulée',         color: '#DC2626', bg: '#FEF2F2', border: '#FECACA',
    icon: <XCircle size={12} />,
  },
};

const TABS = [
  { key: 'all',              label: 'Toutes'            },
  { key: 'pending',          label: 'En attente'        },
  { key: 'confirmed',        label: 'Confirmées'        },
  { key: 'awaiting_payment', label: 'Paiement attendu'  },
  { key: 'completed',        label: 'Terminées'         },
  { key: 'cancelled',        label: 'Annulées'          },
];

// ── Badge statut ───────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontFamily: 'var(--font-display)' }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('all');
  const [search,       setSearch]       = useState('');
  const [deleting,     setDeleting]     = useState<string | null>(null);

  // ── Chargement ────────────────────────────────────────────
  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setReservations(data as Reservation[]);
    setLoading(false);
  };

  useEffect(() => {
     fetchReservations();
    console.log('Reservations chargées :', reservations);
   }, []);

  // ── Auth guard ────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin');
    });
  }, [navigate]);

  // ── Déconnexion ───────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // ── Suppression ───────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
    setDeleting(id);
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(r => r.filter(x => x.id !== id));
    setDeleting(null);
  };

  // ── Filtres ───────────────────────────────────────────────
  const filtered = reservations
    .filter(r => activeTab === 'all' || r.status === activeTab)
    .filter(r =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.reference.toLowerCase().includes(search.toLowerCase()) ||
      r.destination_name.toLowerCase().includes(search.toLowerCase())
    );

  // ── Compteurs par statut ──────────────────────────────────
  const counts = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px 8px 34px', borderRadius: 10, fontSize: 13,
    border: '1.5px solid var(--royal-border)', background: '#fff',
    fontFamily: 'var(--font-body)', color: 'var(--text)', outline: 'none', width: '100%',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50"
        style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: '1.5px solid rgba(245,166,35,0.5)' }}>
              <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Admin · ILT
              </div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Tableau de bord réservations
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={fetchReservations} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}
              whileHover={{ background: 'rgba(255,255,255,0.18)' } as any}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Actualiser
            </motion.button>
            <motion.button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)', fontFamily: 'var(--font-display)' }}
              whileHover={{ background: 'rgba(220,38,38,0.3)' } as any}>
              <LogOut size={12} /> Déconnexion
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">

        {/* ── STATS RAPIDES ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'all',              label: 'Total',            color: 'var(--royal)' },
            { key: 'pending',          label: 'En attente',       color: '#D97706'      },
            { key: 'awaiting_payment', label: 'Paiement',         color: '#7C3AED'      },
            { key: 'completed',        label: 'Terminées',        color: '#059669'      },
            { key: 'cancelled',        label: 'Annulées',         color: '#DC2626'      },
          ].map(({ key, label, color }) => (
            <motion.button key={key} onClick={() => setActiveTab(key)}
              className="p-4 rounded-2xl text-left transition-all duration-200"
              style={{
                background: activeTab === key ? color : '#fff',
                border: `2px solid ${activeTab === key ? color : 'var(--border)'}`,
                boxShadow: activeTab === key ? `0 4px 16px ${color}30` : 'none',
              }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="font-extrabold text-2xl mb-0.5"
                style={{ color: activeTab === key ? '#fff' : color, fontFamily: 'var(--font-display)' }}>
                {counts[key] || 0}
              </div>
              <div className="text-xs font-semibold"
                style={{ color: activeTab === key ? 'rgba(255,255,255,0.8)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                {label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
            <input type="text" placeholder="Rechercher par nom, email, référence, destination..."
              value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeTab === key ? 'var(--royal)' : '#fff',
                  color:      activeTab === key ? '#fff' : 'var(--text-2)',
                  border:     `1.5px solid ${activeTab === key ? 'var(--royal)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-display)',
                }}>
                {label} {counts[key] ? `(${counts[key]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLEAU ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

          {/* Header tableau */}
          <div className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider"
            style={{ gridTemplateColumns: '1fr 1.4fr 1.4fr 0.8fr 0.8fr 0.8fr 1.2fr 100px', background: 'var(--royal-soft)', color: 'var(--text-3)', borderBottom: '1.5px solid var(--border)', fontFamily: 'var(--font-display)' }}>
            <span>Référence</span>
            <span>Client</span>
            <span>Destination</span>
            <span>Départ</span>
            <span>Pers.</span>
            <span>Prix</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--royal-border)', borderTopColor: 'var(--royal)' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Filter size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
              <div className="font-semibold text-sm" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Aucune réservation
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid px-5 py-4 items-center text-sm hover:bg-gray-50 transition-colors"
                  style={{ gridTemplateColumns: '1fr 1.4fr 1.4fr 0.8fr 0.8fr 0.8fr 1.2fr 100px', borderBottom: '1px solid var(--border)' }}>

                  {/* Référence */}
                  <div className="font-bold text-xs" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    {r.reference}
                    <div className="text-[10px] font-normal mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {new Date(r.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Client */}
                  <div>
                    <div className="font-semibold text-xs" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{r.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{r.email}</div>
                    {r.phone && <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{r.phone}</div>}
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: 'var(--text)' }}>{r.destination_name}</span>
                  </div>

                  {/* Départ */}
                  <div className="flex items-center gap-1">
                    <Calendar size={11} style={{ color: 'var(--text-3)' }} />
                    <span className="text-xs" style={{ color: 'var(--text)' }}>
                      {new Date(r.travel_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  {/* Personnes */}
                  <div className="flex items-center gap-1">
                    <Users size={11} style={{ color: 'var(--text-3)' }} />
                    <span className="text-xs" style={{ color: 'var(--text)' }}>{r.guests}</span>
                  </div>

                  {/* Prix */}
                  <div className="text-xs font-bold" style={{ color: r.final_price ? 'var(--royal)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    {r.final_price ? `$${Number(r.final_price).toLocaleString()}` : '—'}
                  </div>

                  {/* Statut */}
                  <StatusBadge status={r.status} />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => navigate(`/admin/order/${r.id}`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)' }}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                      title="Voir / Modifier">
                      <Eye size={13} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                      title="Supprimer">
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
          {filtered.length} réservation{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;