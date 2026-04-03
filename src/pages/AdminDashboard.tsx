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
  id: string;
  reference: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  destinations: {
    name: string;
  } | null;
  travel_date: string;
  return_date?: string;
  guests: number;
  duration: number;
  status: 'pending' | 'confirmed' | 'awaiting_payment' | 'completed' | 'cancelled';
  final_price?: number;
  payment_link?: string;
  created_at: string;
  special_requests?: string;
  message?: string;
}

type StatusKey = 'pending' | 'confirmed' | 'awaiting_payment' | 'completed' | 'cancelled';

// ── Config statuts ─────────────────────────────────────────
const STATUS_CONFIG: Record<StatusKey, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FFF8EC', border: '#FDDFA0', icon: <Clock size={12} /> },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: <CheckCircle2 size={12} /> },
  awaiting_payment: { label: 'Awaiting Payment', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: <CreditCard size={12} /> },
  completed: { label: 'Completed', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: <CheckCircle2 size={12} /> },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <XCircle size={12} /> },
};

const STATUS_KEYS: StatusKey[] = ['pending', 'confirmed', 'awaiting_payment', 'completed', 'cancelled'];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'awaiting_payment', label: 'Awaiting Payment' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

// ── Badge statut ───────────────────────────────────────────
// const StatusBadge = ({ status }: { status: string }) => {
//   const cfg = STATUS_CONFIG[status as StatusKey] ?? STATUS_CONFIG.pending;
//   return (
//     <span
//       className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
//       style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontFamily: 'var(--font-display)' }}
//     >
//       {cfg.icon} {cfg.label}
//     </span>
//   );
// };

// ── Select statut inline ──────────────────────────────────
const StatusSelect = ({
  value,
  onChange,
  loading,
}: {
  value: StatusKey;
  onChange: (v: StatusKey) => void;
  loading: boolean;
}) => {
  const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.pending;
  return (
    <select
      value={value}
      disabled={loading}
      onChange={e => onChange(e.target.value as StatusKey)}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        padding: '4px 28px 4px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        color: cfg.color,
        background: `${cfg.bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 8px center`,
        border: `1px solid ${cfg.border}`,
        cursor: loading ? 'wait' : 'pointer',
        outline: 'none',
        minWidth: 140,
        opacity: loading ? 0.6 : 1,
        transition: 'opacity .2s',
      }}
    >
      {STATUS_KEYS.map(k => (
        <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>
      ))}
    </select>
  );
};

// ── Carte mobile ───────────────────────────────────────────
const MobileCard = ({
  r,
  onView,
  onDelete,
  onStatusChange,
  deleting,
  updatingStatus,
}: {
  r: Reservation;
  onView: () => void;
  onDelete: () => void;
  onStatusChange: (v: StatusKey) => void;
  deleting: boolean;
  updatingStatus: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    className="rounded-2xl p-4 mb-3"
    style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
  >
    {/* En-tête carte */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <div>
        <div className="font-bold text-xs" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
          {r.reference}
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
          {new Date(r.created_at).toLocaleDateString('en-US')}
        </div>
      </div>
      <div className="flex gap-2">
        <motion.button
          onClick={onView}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
        >
          <Eye size={13} />
        </motion.button>
        <motion.button
          onClick={onDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </div>

    {/* Infos */}
    <div className="space-y-1.5 mb-3">
      <div className="font-semibold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
        {r.client_name}
      </div>
      <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{r.client_email}</div>

      <div className="flex flex-wrap gap-3 pt-1">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
          <MapPin size={11} style={{ color: 'var(--gold)' }} /> {r.destinations?.name || '—'}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
          <Calendar size={11} style={{ color: 'var(--text-3)' }} />
          {new Date(r.travel_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text)' }}>
          <Users size={11} style={{ color: 'var(--text-3)' }} /> {r.guests} guests
        </span>
        {r.final_price && (
          <span className="text-xs font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
            ${Number(r.final_price).toLocaleString()}
          </span>
        )}
      </div>
    </div>

    {/* Statut select */}
    <StatusSelect value={r.status} onChange={onStatusChange} loading={updatingStatus} />
  </motion.div>
);

// ═══════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // ── Chargement ────────────────────────────────────────────
  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select(`
      *,
      destinations (
        name
      )
    `)
      .order('created_at', { ascending: false });
    if (!error && data) setReservations(data as Reservation[]);
    console.log('Fetched reservations:', data, error);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

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
    if (!window.confirm('Permanently delete this reservation?')) return;
    setDeleting(id);
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(r => r.filter(x => x.id !== id));
    setDeleting(null);
  };

  // ── Mise à jour statut ────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: StatusKey) => {
    setUpdatingStatus(id);
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) {
      setReservations(rs =>
        rs.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    }
    setUpdatingStatus(null);
  };

  // ── Filtres ───────────────────────────────────────────────
  const filtered = reservations
    .filter(r => activeTab === 'all' || r.status === activeTab)
    .filter(r =>
      !search ||
      r.client_name.toLowerCase().includes(search.toLowerCase()) ||
      r.client_email.toLowerCase().includes(search.toLowerCase()) ||
      r.reference.toLowerCase().includes(search.toLowerCase())
    );

  // ── Compteurs ─────────────────────────────────────────────
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: '1.5px solid rgba(245,166,35,0.5)' }}>
              <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Admin · ILT
              </div>
              <div className="text-[10px] hidden sm:block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Reservations dashboard
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button onClick={fetchReservations} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}
              whileHover={{ background: 'rgba(255,255,255,0.18)' } as any}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
            <motion.button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(220,38,38,0.2)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)', fontFamily: 'var(--font-display)' }}
              whileHover={{ background: 'rgba(220,38,38,0.3)' } as any}>
              <LogOut size={12} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── STATS RAPIDES ── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6 sm:mb-8">
          {[
            { key: 'all', label: 'Total', color: 'var(--royal)' },
            { key: 'pending', label: 'Pending', color: '#D97706' },
            { key: 'awaiting_payment', label: 'Awaiting', color: '#7C3AED' },
            { key: 'completed', label: 'Completed', color: '#059669' },
            { key: 'cancelled', label: 'Cancelled', color: '#DC2626' },
          ].map(({ key, label, color }) => (
            <motion.button key={key} onClick={() => setActiveTab(key)}
              className="p-3 sm:p-4 rounded-2xl text-left transition-all duration-200"
              style={{
                background: activeTab === key ? color : '#fff',
                border: `2px solid ${activeTab === key ? color : 'var(--border)'}`,
                boxShadow: activeTab === key ? `0 4px 16px ${color}30` : 'none',
              }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="font-extrabold text-xl sm:text-2xl mb-0.5"
                style={{ color: activeTab === key ? '#fff' : color, fontFamily: 'var(--font-display)' }}>
                {counts[key] || 0}
              </div>
              <div className="text-[10px] sm:text-xs font-semibold"
                style={{ color: activeTab === key ? 'rgba(255,255,255,0.8)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                {label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
            <input type="text" placeholder="Search by name, email, reference..."
              value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeTab === key ? 'var(--royal)' : '#fff',
                  color: activeTab === key ? '#fff' : 'var(--text-2)',
                  border: `1.5px solid ${activeTab === key ? 'var(--royal)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-display)',
                }}>
                {label}{counts[key] ? ` (${counts[key]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* ══ DESKTOP : vrai tableau HTML ══════════════════════ */}
        <div className="hidden md:block rounded-2xl overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: 'var(--royal-soft)', borderBottom: '1.5px solid var(--border)' }}>
                {['Reference', 'Client', 'Destination', 'Departure', 'Guests', 'Price', 'Status', 'Actions'].map(col => (
                  <th key={col}
                    className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
                      style={{ borderColor: 'var(--royal-border)', borderTopColor: 'var(--royal)' }} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <Filter size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                      No reservations found
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((r, i) => (
                    <motion.tr key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}>

                      {/* Référence */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <div className="font-bold text-xs" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                          {r.reference}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                          {new Date(r.created_at).toLocaleDateString('en-US')}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <div className="font-semibold text-xs" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                          {r.client_name}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{r.client_email}</div>
                        {r.client_phone && (
                          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{r.client_phone}</div>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: 'var(--text)' }}>{r.destinations?.name || '—'}</span>
                        </div>
                      </td>

                      {/* Départ */}
                      <td className="px-4 py-3 whitespace-nowrap" style={{ verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-1">
                          <Calendar size={11} style={{ color: 'var(--text-3)' }} />
                          <span className="text-xs" style={{ color: 'var(--text)' }}>
                            {new Date(r.travel_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </td>

                      {/* Personnes */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-1">
                          <Users size={11} style={{ color: 'var(--text-3)' }} />
                          <span className="text-xs" style={{ color: 'var(--text)' }}>{r.guests}</span>
                        </div>
                      </td>

                      {/* Prix */}
                      <td className="px-4 py-3 whitespace-nowrap" style={{ verticalAlign: 'middle' }}>
                        <span className="text-xs font-bold"
                          style={{ color: r.final_price ? 'var(--royal)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                          {r.final_price ? `$${Number(r.final_price).toLocaleString()}` : '—'}
                        </span>
                      </td>

                      {/* Statut — select inline */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <StatusSelect
                          value={r.status}
                          onChange={v => handleStatusChange(r.id, v)}
                          loading={updatingStatus === r.id}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3" style={{ verticalAlign: 'middle' }}>
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => navigate(`/admin/order/${r.id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)' }}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                            title="View / Edit">
                            <Eye size={13} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                            title="Delete">
                            <Trash2 size={13} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* ══ MOBILE : cartes empilées ══════════════════════════ */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--royal-border)', borderTopColor: 'var(--royal)' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Filter size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
              <div className="font-semibold text-sm" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                No reservations found
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map(r => (
                <MobileCard
                  key={r.id}
                  r={r}
                  onView={() => navigate(`/admin/order/${r.id}`)}
                  onDelete={() => handleDelete(r.id)}
                  onStatusChange={v => handleStatusChange(r.id, v)}
                  deleting={deleting === r.id}
                  updatingStatus={updatingStatus === r.id}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-3)' }}>
          {filtered.length} reservation{filtered.length > 1 ? 's' : ''} displayed
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;