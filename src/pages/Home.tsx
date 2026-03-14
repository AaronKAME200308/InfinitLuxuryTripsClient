import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Star,
  Shield, Headphones, Award, Globe, Users, Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import { SectionLabel, LoadingSpinner } from '../components/UI';

// ── Animation preset ──────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

// ── Stats avec icônes ─────────────────────────────────────
const STATS = [
  { value: '20+',   label: 'Destinations',     icon: <Globe      size={20} />, desc: 'Worldwide'      },
  { value: 'Many',  label: 'Happy Travelers',  icon: <Users      size={20} />, desc: '& counting'     },
  { value: '98%',   label: 'Satisfaction Rate', icon: <Star       size={20} />, desc: 'Average score'  },
  { value: '24/7',  label: 'Concierge',         icon: <Headphones size={20} />, desc: 'Always here'    },
];

const FEATURES = [
  { icon: <Globe      size={22} />, title: 'Worldwide Access',   desc: 'From Caribbean islands to Patagonian glaciers, we open doors others can\'t.',  stat: '120+ destinations',  color: 'var(--royal-soft)',  accent: 'var(--royal)'      },
  { icon: <Shield     size={22} />, title: 'Secure Payments',    desc: 'Pay via Stripe or Zelle with full fraud protection and instant confirmation.',   stat: '100% secure',        color: 'var(--success-soft)', accent: 'var(--success)'   },
  { icon: <Headphones size={22} />, title: '24/7 Concierge',     desc: 'A dedicated luxury travel expert responds to your needs around the clock.',      stat: 'Always available',   color: 'var(--gold-soft)',   accent: 'var(--gold-hover)' },
  { icon: <Award      size={22} />, title: 'Curated Excellence', desc: 'Every property passes a rigorous selection. Only the exceptional makes our list.', stat: 'Hand-selected',    color: '#FEF2F2',             accent: '#DC2626'           },
  { icon: <Users      size={22} />, title: 'Groups & Families',  desc: 'Intimate couples retreats or grand family adventures, every detail tailored.',   stat: '1–20 travelers',    color: 'var(--royal-soft)',  accent: 'var(--royal-light)'},
  { icon: <Sparkles   size={22} />, title: 'Unique Experiences', desc: 'Private charters, chef\'s tables, sunrise ruins, moments money rarely buys.',   stat: 'Truly exclusive',   color: 'var(--gold-soft)',   accent: 'var(--gold-hover)' },
];

const POPULAR_TAGS = ['Maldives', 'Santorini', 'Dubai', 'Cancún', 'Bali', 'Patagonie'];

const TRUST_BADGES = [
  { icon: <Shield       size={13} />, text: 'Secure payments'         },
  { icon: <CheckCircle2 size={13} />, text: 'Free cancellation 48h'   },
  { icon: <Headphones   size={13} />, text: '24/7 concierge support'  },
  { icon: <Star         size={13} />, text: '98% satisfaction rate'   },
];

const Home = () => {
  const navigate  = useNavigate();
  const heroRef   = useRef<HTMLElement>(null);
  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts,         loading: postsLoading } = useBlogPosts(4);

  // ── Parallax hero ─────────────────────────────────────
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);

  // Premier post = featured, les 3 suivants = grille
  const featuredPost = posts[0] || null;
  const gridPosts    = posts.slice(1, 4);

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>

      {/* ════════════════ HERO — Parallax + description ════════════════ */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '92vh', marginTop: -68 }}
      >
        {/* Background avec parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1662154477069-c8c0a5361a4c?q=80&w=1170&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: bgY,
            scale: 1.12, // légèrement agrandi pour éviter le bord visible au scroll
          }}
        />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative w-full max-w-[1280px] mx-auto px-6 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">

            {/* Badge */}
            <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.5px]"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(6px)',
                  fontFamily: 'var(--font-display)',
                }}>
                <Star size={11} fill="var(--gold)" color="var(--gold)" />
                Infinite Luxury Trips
              </div>
            </motion.div>

            {/* Headline avec animation lettre par lettre sur "Most Extraordinary" */}
            <motion.h1 {...fadeUp(0.1)}
              className="font-bold leading-tight mb-5 text-white"
              style={{ fontSize: 'clamp(36px, 6vw, 66px)', fontFamily: 'var(--font-display)' }}>
              Discover the World's
              <br />
              <span style={{ display: 'inline-block', color: 'var(--gold)' }}>
                {'Most Extraordinary'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.4, ease: 'easeOut' }}
                    style={{ display: 'inline-block' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </span>{' '}
              Places
            </motion.h1>

            {/* ── Description ajoutée ── */}
            <motion.p {...fadeUp(0.55)}
              className="text-base leading-relaxed mb-8 mx-auto"
              style={{ color: 'white', maxWidth: 480, lineHeight: 1.85 }}>
              We craft immersive journeys in the world's most breathtaking destinations,
              from private Caribbean islands to ancient European palaces,
              tailored for those who demand the exceptional.
            </motion.p>

            {/* Search box */}
            <motion.div {...fadeUp(0.62)}
              className="rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mx-auto mb-5"
              style={{
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 45px rgba(20,16,60,0.35)',
                maxWidth: 580,
                border: '1.5px solid var(--royal-border)',
              }}>
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: 'var(--bg)' }}>
                <MapPin size={15} style={{ color: 'var(--royal)', flexShrink: 0 }} />
                <input type="text" placeholder="Where do you want to go?"
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

            {/* Popular tags */}
            <motion.div {...fadeUp(0.68)} className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Popular:
              </span>
              {POPULAR_TAGS.map(tag => (
                <button key={tag} onClick={() => navigate('/destinations')}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-display)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.2)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS — avec icônes ════════════════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-0 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
          style={{ borderColor: 'var(--border)' }}>
          {STATS.map(({ value, label, icon, desc }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 px-6 py-6">
              {/* Icône cercle violet */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)' }}>
                {icon}
              </div>
              <div>
                <div className="font-extrabold leading-none mb-0.5"
                  style={{ fontSize: 24, color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  {value}
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  {label}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-3)' }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ FEATURED DESTINATIONS — left-align ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              {/* Left-align + sous-titre */}
              <SectionLabel center={false}>Handpicked for You</SectionLabel>
              <h2 className="font-bold mt-1"
                style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Featured <span style={{ color: 'var(--royal)' }}>Destinations</span>
              </h2>
              <p className="text-sm mt-2" style={{ color: 'var(--text-3)', maxWidth: 380 }}>
                Our most sought-after experiences each one carefully selected for its
                outstanding quality and uniqueness.
              </p>
              <div className="mt-3" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </div>
            <button onClick={() => navigate('/destinations')}
              className="btn-outline flex items-center gap-2 flex-shrink-0">
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

      {/* ════════════════ WHY ILT ════════════════ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: 'var(--royal)' }}>
        {/* Pattern fond */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        {/* Glow or haut-droite */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />

        <div className="max-w-[1280px] mx-auto relative">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[2.5px] mb-4"
                style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.25)', fontFamily: 'var(--font-display)' }}>
                Why Choose ILT
              </div>
              <h2 className="font-bold text-white"
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
                The <span style={{ color: 'var(--gold)' }}>ILT Promise</span>
              </h2>
            </div>
            <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.85 }}>
              Six pillars that define every journey we craft and why 4,800+ travelers trust us with their most important trips.
            </p>
          </motion.div>

          {/* Layout : grande carte centrale + 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Colonne gauche — 2 cards empilées */}
            <div className="flex flex-col gap-5">
              {FEATURES.slice(0, 2).map(({ icon, title, desc, stat, color, accent }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="rounded-2xl p-5 flex gap-4 items-start"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color, color: accent }}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                        style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                        {stat}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
                    <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: accent, opacity: 0.6 }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carte centrale — grande, verticale, mise en avant */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden flex flex-col relative"
              style={{
                background: 'linear-gradient(160deg, rgba(245,166,35,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1.5px solid rgba(245,166,35,0.35)',
                backdropFilter: 'blur(8px)',
              }}>

              {/* Numéro décoratif large */}
              <div className="absolute top-4 right-5 font-extrabold select-none pointer-events-none"
                style={{ fontSize: 96, color: 'rgba(245,166,35,0.08)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                #1
              </div>

              <div className="p-7 flex flex-col gap-5 flex-1">
                {/* Étoile or animée */}
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.2)', border: '1.5px solid rgba(245,166,35,0.4)' }}>
                  <Award size={28} style={{ color: 'var(--gold)' }} />
                </motion.div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[2px] mb-2"
                    style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                    Our Signature Promise
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white" style={{ fontFamily: 'var(--font-display)', lineHeight: 1.25 }}>
                    Curated<br />Excellence
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                    Every destination, hotel, and experience on our platform is personally vetted.
                    We don't list what doesn't meet our standard, no exceptions.
                  </p>
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  {[
                    { value: '100%', label: 'Verified properties'  },
                    { value: '5★',   label: 'Average experience'   },
                    { value: '48h',  label: 'Free cancellation'    },
                    { value: '0',    label: 'Hidden fees'          },
                  ].map(({ value, label }) => (
                    <div key={label} className="px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="font-extrabold text-lg" style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                        {value}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/destinations')}
                  className="btn-gold w-full justify-center flex items-center gap-2 mt-2">
                  Explore Our Selection <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* Colonne droite — 2 cards empilées */}
            <div className="flex flex-col gap-5">
              {FEATURES.slice(3, 5).map(({ icon, title, desc, stat, color, accent }, i) => (
                <motion.div key={title}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="rounded-2xl p-5 flex gap-4 items-start"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color, color: accent }}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                        style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                        {stat}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
                    <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: accent, opacity: 0.6 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bas — 2 dernières features en bande horizontale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {[FEATURES[2], FEATURES[5]].map(({ icon, title, desc, stat, color, accent }) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color, color: accent }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                      style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                      {stat}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
                  <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: accent, opacity: 0.6 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ BLOG — Featured full-image + grille full-image ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <SectionLabel center={false}>Insights & Stories</SectionLabel>
              <h2 className="font-bold mt-1"
                style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                The <span style={{ color: 'var(--royal)' }}>ILT Journal</span>
              </h2>
              <div className="mt-2" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
            </div>
            <button onClick={() => navigate('/blog')}
              className="btn-outline flex items-center gap-2 flex-shrink-0">
              Read All <ArrowRight size={13} />
            </button>
          </motion.div>

          {postsLoading ? <LoadingSpinner message="Loading articles" /> : (
            <div className="flex flex-col gap-5">

              {/* ── Article featured — full image large ── */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                  className="cursor-pointer relative rounded-2xl overflow-hidden group"
                  style={{
                    height: 420,
                    border: '1.5px solid var(--royal-border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Image full */}
                  <motion.img
                    src={featuredPost.image_url} alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }} transition={{ duration: 0.5 }}
                  />

                  {/* Gradient overlay bas */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.92) 0%, rgba(20,17,58,0.3) 50%, transparent 100%)' }} />

                  {/* TOP badges — apparaissent à l'entrée en vue */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex items-center gap-2 flex-wrap">
                      {/* Badge type — voyage ou activité */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                        ✈ Upcoming Trip
                      </div>
                      {/* Badge catégorie */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(48,36,112,0.75)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
                        {featuredPost.category}
                      </div>
                    </motion.div>
                    {/* Read time */}
                    <motion.div
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
                      style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(6px)' }}>
                      {featuredPost.read_time}
                    </motion.div>
                  </div>

                  {/* BOTTOM content — anime depuis le bas */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                      <h2 className="font-bold text-2xl text-white mb-2"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                        {featuredPost.title}
                      </h2>
                      <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 560 }}>
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {/* Bouton Read — or */}
                        <motion.div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                          style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                          whileHover={{ scale: 1.05 }} transition={{ duration: 0.15 }}>
                          Read article <ArrowRight size={12} />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ── Grille 3 articles — full image avec animations ── */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {gridPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.45 }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="cursor-pointer relative rounded-2xl overflow-hidden group"
                      style={{
                        height: 280,
                        border: '1.5px solid var(--royal-border)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      {/* Image full */}
                      <motion.img
                        src={post.image_url} alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.90) 0%, rgba(20,17,58,0.2) 55%, transparent 100%)' }} />

                      {/* TOP — badge catégorie animé */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
                        className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(48,36,112,0.78)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
                          {post.category}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                          {post.read_time}
                        </div>
                      </motion.div>

                      {/* BOTTOM — titre + date animés depuis le bas */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                          <h3 className="font-bold text-sm text-white mb-1.5"
                            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] font-bold flex items-center gap-1"
                              style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                              Read <ArrowRight size={10} />
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ CTA FINAL — image fond + trust badges ════════════════ */}
      <section className="py-0 relative overflow-hidden" style={{ minHeight: 380 }}>

        {/* Image de fond subtile avec overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80"
            alt="" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(48,36,112,0.55) 0%, rgba(20,14,50,0.62) 100%)' }} />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-xl mx-auto text-center px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

            {/* Badge violet glassmorphism */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)', letterSpacing: '1.5px' }}>
              ✦ Begin Your Journey
            </div>

            <h2 className="font-bold mb-3 text-white"
              style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
              Ready for Your Next{' '}
              <span style={{ color: 'var(--gold)' }}>Adventure?</span>
            </h2>

            {/* Gold divider */}
            <div className="mx-auto mb-5" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />

            <p className="text-sm mb-8 mx-auto" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380, lineHeight: 1.8 }}>
              Our concierge team is available 24/7 to craft your perfect escape.
              No commitment required to get started.
            </p>

            {/* Boutons */}
            <div className="flex gap-3 justify-center flex-wrap mb-8">
              <button onClick={() => navigate('/reservation')}
                className="btn-gold flex items-center gap-2">
                <MapPin size={14} /> Reserve Now
              </button>
              <button onClick={() => navigate('/contact')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  backdropFilter: 'blur(8px)',
                  padding: '11px 22px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
              >
                Contact Concierge
              </button>
            </div>

            {/* ── Trust badges ── */}
            <div className="flex items-center justify-center gap-5 flex-wrap">
              {TRUST_BADGES.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: 'var(--gold)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;