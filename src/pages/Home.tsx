import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, ArrowRight,
  Shield, Headphones, Award, Globe, Clock, CreditCard, Users, Sparkles
} from 'lucide-react';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import BlogCard from '../components/BlogCard';
import { SectionLabel, GoldDivider, LoadingSpinner } from '../components/UI';

// ── Fade-up animation preset ──────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

// ── Stats bar data ────────────────────────────────────────
const STATS = [
  { value: '120+',   label: 'Destinations' },
  { value: '4,800+', label: 'Happy Travelers' },
  { value: '98%',    label: 'Satisfaction Rate' },
  { value: '15+',    label: 'Years of Excellence' },
];

// ── Why ILT features — enrichies ─────────────────────────
const FEATURES = [
  {
    icon: <Globe size={24} />,
    title: 'Worldwide Access',
    desc: 'From Caribbean islands to Patagonian glaciers — we open doors others can\'t.',
    stat: '120+ destinations',
    color: '#EEF2FB',
    accent: 'var(--royal)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure Payments',
    desc: 'Pay with confidence via Stripe (credit card) or Zelle — fully protected.',
    stat: '100% secure',
    color: '#E8F7F0',
    accent: '#0A8754',
  },
  {
    icon: <Headphones size={24} />,
    title: '24/7 Concierge',
    desc: 'A dedicated luxury travel expert responds to your needs around the clock.',
    stat: 'Always available',
    color: '#FFF3DC',
    accent: '#D4881A',
  },
  {
    icon: <Award size={24} />,
    title: 'Curated Excellence',
    desc: 'Every property passes a rigorous selection process. Only the exceptional makes the cut.',
    stat: 'Hand-selected',
    color: '#FEF0F0',
    accent: '#D42B2B',
  },
  {
    icon: <Users size={24} />,
    title: 'Group & Family',
    desc: 'Intimate couples retreats or grand family adventures — we tailor every detail.',
    stat: '1–20 travelers',
    color: '#F0F4FF',
    accent: '#4535A0',
  },
  {
    icon: <Sparkles size={24} />,
    title: 'Unique Experiences',
    desc: 'Private charters, chef\'s tables, sunrise ruins tours — moments money rarely buys.',
    stat: 'Truly exclusive',
    color: '#EEF2FB',
    accent: 'var(--royal)',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts, loading: postsLoading }       = useBlogPosts(3);

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>

      {/* ════════════════ HERO ════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '92vh', marginTop: -68 }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(170deg, rgba(30,22,80,0.72) 0%, rgba(10,20,60,0.82) 100%)' }}
        />

        {/* Content */}
        <div className="relative w-full max-w-[1280px] mx-auto px-6 pt-20 pb-10">
          <div className="max-w-3xl mx-auto text-center">

            {/* Pill badge */}
            <motion.div {...fadeUp(0)} className="flex justify-center mb-5">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(245,166,35,0.18)',
                  border: '1px solid rgba(245,166,35,0.35)',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                <Star size={11} fill="var(--gold)" color="var(--gold)" />
                Curated Luxury Travel
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-white font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontFamily: 'var(--font-display)' }}
            >
              Discover the World's<br />
              <span style={{ color: 'var(--gold)' }}>Most Extraordinary</span> Places
            </motion.h1>

            <motion.p
              {...fadeUp(0.18)}
              className="text-base leading-relaxed mb-8 mx-auto"
              style={{ color: 'rgba(255,255,255,0.68)', maxWidth: 520 }}
            >
              We craft immersive journeys in the world's most breathtaking destinations —
              tailored for those who demand the exceptional.
            </motion.p>

            {/* Search box */}
            <motion.div
              {...fadeUp(0.25)}
              className="rounded-2xl overflow-hidden p-2 flex flex-col md:flex-row gap-2 mx-auto"
              style={{
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                maxWidth: 640,
              }}
            >
              {/* Destination */}
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl" style={{ background: 'var(--bg)' }}>
                <MapPin size={16} style={{ color: 'var(--royal)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-transparent text-sm border-none outline-none"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                />
              </div>
              {/* CTA */}
              <button
                onClick={() => navigate('/destinations')}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm flex-shrink-0 transition-all duration-200"
                style={{
                  background: 'var(--royal)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 2px 10px rgba(48,36,112,0.3)',
                }}
              >
                <Search size={15} />
                Search
              </button>
            </motion.div>

            {/* Quick tags */}
            <motion.div {...fadeUp(0.32)} className="flex items-center justify-center gap-2 flex-wrap mt-4">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Popular:</span>
              {['Maldives', 'Santorini', 'Bali', 'Dubai', 'Kyoto'].map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate('/destinations')}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.25)'; e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center py-2"
            >
              <div
                className="font-extrabold leading-none mb-1"
                style={{ fontSize: 28, color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-3)' }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════ FEATURED DESTINATIONS ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <SectionLabel>Handpicked for You</SectionLabel>
            <h2
              className="font-bold mt-2"
              style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              Featured <span style={{ color: 'var(--royal)' }}>Destinations</span>
            </h2>
            <GoldDivider />
          </motion.div>

          {destLoading ? (
            <LoadingSpinner message="Loading destinations" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <DestinationCard dest={dest} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/destinations')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                border: '1.5px solid var(--royal)',
                color: 'var(--royal)',
                background: 'var(--surface)',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--royal)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--royal)'; }}
            >
              View All Destinations
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ WHY ILT ════════════════ */}
      <section className="py-20 px-6" style={{ background: 'var(--royal-dark)', position: 'relative', overflow: 'hidden' }}>

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-[1280px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[2.5px] mb-4"
              style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', fontFamily: 'var(--font-display)', border: '1px solid rgba(245,166,35,0.25)' }}>
              Why Choose ILT
            </div>
            <h2 className="font-bold mb-3"
              style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#fff', fontFamily: 'var(--font-display)' }}>
              The <span style={{ color: 'var(--gold)' }}>ILT Promise</span>
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Six reasons why discerning travelers choose Infinite Luxury Trips for their most important journeys.
            </p>
            <div className="mx-auto mt-5 rounded-full" style={{ width: 48, height: 3, background: 'var(--gold)' }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, title, desc, stat, color, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {/* Icon + stat row */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: color, color: accent }}>
                    {icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                    {stat}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-bold text-base mb-1.5"
                    style={{ color: '#fff', fontFamily: 'var(--font-display)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="h-px w-12 rounded-full mt-auto" style={{ background: accent, opacity: 0.6 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ BLOG PREVIEW ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <SectionLabel>Insights & Stories</SectionLabel>
            <h2
              className="font-bold mt-2"
              style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}
            >
              The <span style={{ color: 'var(--royal)' }}>ILT Journal</span>
            </h2>
            <GoldDivider />
          </motion.div>

          {postsLoading ? (
            <LoadingSpinner message="Loading articles" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                border: '1.5px solid var(--royal)',
                color: 'var(--royal)',
                background: 'var(--surface)',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--royal)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--royal)'; }}
            >
              Read All Articles
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'var(--royal)' }}>
        {/* subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 80%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Begin Your Journey</SectionLabel>
            <h2
              className="text-white font-bold mt-2 mb-4"
              style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontFamily: 'var(--font-display)' }}
            >
              Ready for Your Next <span style={{ color: 'var(--gold)' }}>Adventure?</span>
            </h2>
            <p className="text-sm mb-8 mx-auto" style={{ color: 'rgba(255,255,255,0.62)', maxWidth: 420 }}>
              Our concierge team is available 24/7 to craft your perfect escape.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate('/reservation')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  background: 'var(--gold)',
                  color: '#1A2340',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.4)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
              >
                <MapPin size={14} />
                Reserve Now
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.85)',
                  background: 'transparent',
                  fontFamily: 'var(--font-display)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              >
                Contact Concierge
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;