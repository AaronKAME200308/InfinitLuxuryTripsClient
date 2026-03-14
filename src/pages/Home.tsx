import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Star,
  Shield, Headphones, Award, Globe, Users, Sparkles,
  CheckCircle2, Clock, Phone
} from 'lucide-react';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import BlogCard from '../components/BlogCard';
import { SectionLabel, LoadingSpinner } from '../components/UI';

// ── Animation ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const STATS = [
  { value: '120+',   label: 'Destinations',     icon: <Globe     size={18} /> },
  { value: '4,800+', label: 'Happy Travelers',  icon: <Users     size={18} /> },
  { value: '98%',    label: 'Satisfaction',      icon: <Star      size={18} /> },
  { value: '24/7',   label: 'Concierge',         icon: <Headphones size={18} /> },
];

const FEATURES = [
  { icon: <Globe      size={20} />, title: 'Worldwide Access',   desc: 'Caribbean, Europe, Middle East, South America — we open doors others can\'t.' },
  { icon: <Shield     size={20} />, title: 'Secure Payments',    desc: 'Pay via Stripe or Zelle with full fraud protection and instant confirmation.'  },
  { icon: <Headphones size={20} />, title: '24/7 Concierge',     desc: 'A dedicated luxury travel expert available around the clock, just for you.'   },
  { icon: <Award      size={20} />, title: 'Curated Excellence', desc: 'Only properties that pass our rigorous selection make the cut.'               },
  { icon: <Users      size={20} />, title: 'Groups & Families',  desc: 'Intimate retreats or grand family adventures — every detail tailored for you.' },
  { icon: <Sparkles   size={20} />, title: 'Unique Experiences', desc: 'Private charters, chef\'s tables, sunrise tours — moments rarely for sale.'   },
];

const POPULAR = ['Maldives', 'Santorini', 'Dubai', 'Cancún', 'Patagonie', 'Paris'];

// ── Séparateur décoratif or ───────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-3 max-w-[1280px] mx-auto px-6">
    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    <div className="flex items-center gap-1">
      <div className="w-1 h-1 rounded-full" style={{ background: 'var(--royal-border)' }} />
      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'var(--royal-border)' }} />
    </div>
    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts, loading: postsLoading }        = useBlogPosts(3);

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: '#fff', marginTop: -68, paddingTop: 68 }}>

        {/* Fond décoratif aéré — cercles dégradés très doux */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full"
            style={{ width: 600, height: 600, top: -150, right: -100,
              background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)' }} />
          <div className="absolute rounded-full"
            style={{ width: 500, height: 500, bottom: -100, left: -80,
              background: 'radial-gradient(circle, rgba(48,36,112,0.06) 0%, transparent 70%)' }} />
          {/* Ligne top accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, var(--royal) 0%, var(--gold) 50%, var(--royal) 100%)', opacity: 0.5 }} />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 md:py-28">

            {/* ── Texte gauche ── */}
            <div>
              {/* Badge or */}
              <motion.div {...fadeUp(0)} className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: 'var(--gold-soft)',
                    color: 'var(--gold-hover)',
                    border: '1.5px solid var(--gold-border)',
                    fontFamily: 'var(--font-display)',
                  }}>
                  <Star size={11} fill="var(--gold)" color="var(--gold)" />
                  Curated Luxury Travel
                </div>
              </motion.div>

              {/* Headline — violet + or */}
              <motion.h1 {...fadeUp(0.08)}
                className="font-bold leading-tight mb-5"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Discover the{' '}
                <span style={{
                  color: 'var(--royal)',
                  borderBottom: '3px solid var(--gold)',
                  paddingBottom: 2,
                }}>World's Finest</span>
                <br />
                <span style={{ color: 'var(--gold)' }}>Destinations</span>
              </motion.h1>

              <motion.p {...fadeUp(0.14)}
                className="text-base leading-relaxed mb-8"
                style={{ color: 'var(--text-2)', maxWidth: 440, lineHeight: 1.85 }}>
                We craft immersive journeys tailored for those who demand
                the exceptional — from private islands to historic palaces.
              </motion.p>

              {/* Search box — bordure violette */}
              <motion.div {...fadeUp(0.2)}
                className="flex flex-col sm:flex-row gap-2 mb-6 p-2 rounded-2xl"
                style={{
                  background: 'var(--bg)',
                  border: '2px solid var(--royal-border)',
                  boxShadow: '0 4px 24px rgba(48,36,112,0.10)',
                  maxWidth: 500,
                }}>
                <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-white">
                  <MapPin size={15} style={{ color: 'var(--royal)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="flex-1 bg-transparent text-sm border-none outline-none"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                    onKeyDown={e => e.key === 'Enter' && navigate('/destinations')}
                  />
                </div>
                <button onClick={() => navigate('/destinations')}
                  className="btn-royal flex-shrink-0 flex items-center gap-2" style={{ padding: '10px 20px' }}>
                  <Search size={14} /> Search
                </button>
              </motion.div>

              {/* Popular tags — violet */}
              <motion.div {...fadeUp(0.26)} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>Popular:</span>
                {POPULAR.map(tag => (
                  <button key={tag} onClick={() => navigate('/destinations')}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--royal)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--royal)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--royal-soft)'; e.currentTarget.style.color = 'var(--royal)'; e.currentTarget.style.borderColor = 'var(--royal-border)'; }}
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* ── Image éditoriale droite ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Image principale — bordure violet */}
              <div className="relative rounded-3xl overflow-hidden"
                style={{ height: 480, boxShadow: 'var(--shadow-xl)', border: '2px solid var(--royal-border)' }}>
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=85"
                  alt="Luxury destination" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: 'linear-gradient(to top, rgba(48,36,112,0.55), transparent)' }} />

                {/* Badge flottant — accent or */}
                <div className="absolute bottom-5 left-5 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.97)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--gold-border)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--gold-hover)' }}>
                    ★ Top Pick
                  </div>
                  <div className="font-bold text-sm" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    Saint Barthélemy
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="var(--gold)" color="var(--gold)" />)}
                    <span className="text-xs font-semibold ml-1" style={{ color: 'var(--royal)' }}>4.9</span>
                  </div>
                </div>
              </div>

              {/* Image secondaire chevauchante */}
              <div className="absolute -bottom-6 -left-8 rounded-2xl overflow-hidden"
                style={{ width: 158, height: 118, boxShadow: 'var(--shadow-lg)', border: '2px solid #fff' }}>
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80"
                  alt="Dubai" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--gold)', color: 'var(--royal)' }}>Dubai</span>
                </div>
              </div>

              {/* Stats card flottante — violet */}
              <div className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl"
                style={{ background: '#fff', boxShadow: 'var(--shadow-lg)', border: '1.5px solid var(--royal-border)' }}>
                <div className="text-xs mb-0.5 font-medium" style={{ color: 'var(--text-3)' }}>Happy travelers</div>
                <div className="font-extrabold text-xl" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  4,800+
                </div>
                {/* Mini avatars */}
                <div className="flex gap-0 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full -ml-1 first:ml-0 border-2 border-white"
                      style={{ background: `hsl(${260 + i * 20}, 55%, ${52 + i * 5}%)` }} />
                  ))}
                  <span className="text-[10px] font-bold ml-1.5 self-center" style={{ color: 'var(--gold-hover)' }}>+</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4">
          {STATS.map(({ value, label, icon }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex items-center justify-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--royal-soft)', color: 'var(--royal)' }}>
                {icon}
              </div>
              <div>
                <div className="font-extrabold leading-none"
                  style={{ fontSize: 20, color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════ FEATURED DESTINATIONS ════════════════ */}
      <section className="py-16 px-6" style={{ background: '#fff' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <SectionLabel center={false}>Handpicked for You</SectionLabel>
              <h2 className="font-bold mt-1"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Featured <span style={{ color: 'var(--royal)' }}>Destinations</span>
              </h2>
              {/* Soulignement or */}
              <div className="mt-2" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </div>
            <button onClick={() => navigate('/destinations')}
              className="btn-outline flex items-center gap-2 text-xs flex-shrink-0">
              View All <ArrowRight size={13} />
            </button>
          </motion.div>

          {destLoading ? <LoadingSpinner message="Loading destinations" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((dest, i) => (
                <motion.div key={dest.id}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <DestinationCard dest={dest} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* ════════════════ WHY ILT ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Colonne gauche — titre + bénéfices + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:sticky" style={{ top: 88 }}>
              <SectionLabel center={false}>Why Choose ILT</SectionLabel>
              <h2 className="font-bold mt-2 mb-2"
                style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                The <span style={{ color: 'var(--royal)' }}>ILT</span>{' '}
                <span style={{ color: 'var(--gold)' }}>Promise</span>
              </h2>
              <div className="mb-5" style={{ width: 40, height: 3, background: 'linear-gradient(90deg, var(--royal), var(--gold))', borderRadius: 2 }} />
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.85 }}>
                We don't just book trips — we architect memories. Every ILT journey is
                built on six uncompromising pillars.
              </p>
              {/* Checklist violette */}
              {[
                'Personalized itinerary, always',
                'No hidden fees, ever',
                'Free cancellation within 48h',
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5 mb-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                    <CheckCircle2 size={12} style={{ color: 'var(--royal)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>{item}</span>
                </div>
              ))}

              {/* Contact info */}
              <div className="mt-6 p-4 rounded-2xl" style={{ background: '#fff', border: '1.5px solid var(--royal-border)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  Reach us anytime
                </div>
                {[
                  { icon: <Phone size={13} />, text: '+1 (800) ILT-LUXE' },
                  { icon: <Clock size={13} />, text: '24/7 Available' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 mb-2 text-sm" style={{ color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--gold)' }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>

              {/* Deux boutons — violet + or */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <button onClick={() => navigate('/contact')}
                  className="btn-gold flex items-center gap-2 text-sm">
                  Talk to Concierge <ArrowRight size={13} />
                </button>
                <button onClick={() => navigate('/reservation')}
                  className="btn-outline flex items-center gap-2 text-sm">
                  Book a Trip
                </button>
              </div>
            </motion.div>

            {/* Colonne droite — 6 cards blanches */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(({ icon, title, desc }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3, boxShadow: 'var(--shadow-md)', transition: { duration: 0.2 } }}
                  className="p-5 rounded-2xl"
                  style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)', cursor: 'default' }}>
                  {/* Icône violette */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'var(--royal-soft)', color: 'var(--royal)' }}>
                    {icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1.5"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                  {/* Accent or en bas */}
                  <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ════════════════ BLOG ════════════════ */}
      <section className="py-16 px-6" style={{ background: '#fff' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <SectionLabel center={false}>Stories & Insights</SectionLabel>
              <h2 className="font-bold mt-1"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                The <span style={{ color: 'var(--royal)' }}>ILT</span>{' '}
                <span style={{ color: 'var(--gold)' }}>Journal</span>
              </h2>
              <div className="mt-2" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </div>
            <button onClick={() => navigate('/blog')}
              className="btn-outline flex items-center gap-2 text-xs flex-shrink-0">
              Read All <ArrowRight size={13} />
            </button>
          </motion.div>

          {postsLoading ? <LoadingSpinner message="Loading articles" /> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16"
            style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-lg)' }}>

            {/* Glow décoratifs */}
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(48,36,112,0.08) 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />
            {/* Ligne accent top */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, var(--royal) 0%, var(--gold) 50%, var(--royal) 100%)' }} />

            <div className="relative text-center max-w-xl mx-auto">
              {/* Badge violet */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5"
                style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}>
                ✦ Begin Your Journey
              </div>

              <h2 className="font-bold mb-3"
                style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                Ready for Your Next{' '}
                <span style={{ color: 'var(--royal)' }}>Adventure?</span>
              </h2>

              {/* Divider or */}
              <div className="mx-auto mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

              <p className="text-sm mb-8 mx-auto" style={{ color: 'var(--text-3)', lineHeight: 1.8, maxWidth: 380 }}>
                Our concierge team is available 24/7 to craft your perfect escape.
                No commitment required.
              </p>

              {/* Deux boutons — or (principal) + outline violet */}
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={() => navigate('/reservation')}
                  className="btn-gold flex items-center gap-2">
                  <MapPin size={14} /> Reserve Now
                </button>
                <button onClick={() => navigate('/contact')}
                  className="btn-royal flex items-center gap-2">
                  Contact Concierge
                </button>
              </div>

              {/* Trust micro-badges */}
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                {['Free cancellation', 'No hidden fees', 'Secure payment'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
                    <CheckCircle2 size={12} style={{ color: 'var(--royal)' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;