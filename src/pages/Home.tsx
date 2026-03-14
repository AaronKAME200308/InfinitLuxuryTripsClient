import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, ArrowRight,
  Shield, Headphones, Award, Globe, Users, Sparkles
} from 'lucide-react';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import BlogCard from '../components/BlogCard';
import { SectionLabel, GoldDivider, LoadingSpinner } from '../components/UI';

// ── Animation preset ──────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const STATS = [
  { value: '20+', label: 'Destinations' },
  { value: 'Many', label: 'Happy Travelers' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '2+', label: 'Years Excellence' },
];

const FEATURES = [
  { icon: <Globe size={22} />, title: 'Worldwide Access', desc: 'From Caribbean islands to Patagonian glaciers — we open doors others can\'t.', stat: '120+ destinations', color: 'var(--royal-soft)', accent: 'var(--royal)' },
  { icon: <Shield size={22} />, title: 'Secure Payments', desc: 'Pay via Stripe or Zelle with full fraud protection and instant confirmation.', stat: '100% secure', color: 'var(--success-soft)', accent: 'var(--success)' },
  { icon: <Headphones size={22} />, title: '24/7 Concierge', desc: 'A dedicated luxury travel expert responds to your needs around the clock.', stat: 'Always available', color: 'var(--gold-soft)', accent: 'var(--gold-hover)' },
  { icon: <Award size={22} />, title: 'Curated Excellence', desc: 'Every property passes a rigorous selection. Only the exceptional makes our list.', stat: 'Hand-selected', color: '#FEF2F2', accent: '#DC2626' },
  { icon: <Users size={22} />, title: 'Groups & Families', desc: 'Intimate couples retreats or grand family adventures — every detail tailored for you.', stat: '1–20 travelers', color: 'var(--royal-soft)', accent: 'var(--royal-light)' },
  { icon: <Sparkles size={22} />, title: 'Unique Experiences', desc: 'Private charters, chef\'s tables, sunrise ruins — moments money rarely buys.', stat: 'Truly exclusive', color: 'var(--gold-soft)', accent: 'var(--gold-hover)' },
];

const POPULAR_TAGS = ['Maldives', 'Santorini', 'Dubai', 'Cancún', 'Bali', 'Patagonie'];

const Home = () => {
  const navigate = useNavigate();
  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts, loading: postsLoading } = useBlogPosts(3);

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>

      {/* ════════════════ HERO ════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '92vh', marginTop: -68 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1662154477069-c8c0a5361a4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative w-full max-w-[1280px] mx-auto px-6 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
              <div
                className="btn-royal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xl font-semibold"
                style={{
                  color: 'white',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '1.5px',
                  backdropFilter: 'blur(6px)',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Infinite Luxury Trips
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-bold leading-tight mb-5 text-white"
              style={{
                fontSize: 'clamp(36px, 6vw, 66px)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Discover the World's
              <br />
              <span style={{ display: 'inline-block', color: 'var(--gold)' }}>
                {'Most Extraordinary'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.05,
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </span>{' '}
              Places
            </motion.h1>

            <motion.div
              {...fadeUp(0.25)}
              className="rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mx-auto mb-5"
              style={{
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 45px rgba(20,16,60,0.35)',
                maxWidth: 580,
                border: '1.5px solid var(--royal-border)',
              }}
            >
              <div
                className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl"
                style={{ background: 'var(--bg)' }}
              >
                <MapPin
                  size={15}
                  style={{ color: 'var(--royal)', flexShrink: 0 }}
                />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-transparent text-sm border-none outline-none"
                  style={{
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && navigate('/destinations')
                  }
                />
              </div>

              <button
                onClick={() => navigate('/destinations')}
                className="btn-royal flex-shrink-0 flex items-center gap-2"
                style={{ padding: '10px 20px' }}
              >
                <Search size={14} /> Search
              </button>
            </motion.div>

            <motion.div
              {...fadeUp(0.32)}
              className="flex items-center justify-center gap-2 flex-wrap"
            >
              <span
                className="text-xs font-semibold uppercase tracking-[1.5px]"
                style={{ color: 'white' }}
              >
                Popular:
              </span>

              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate('/destinations')}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '1.5px',
                    backdropFilter: 'blur(6px)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(212,175,55,0.18)'
                    e.currentTarget.style.color = 'var(--gold)'
                    e.currentTarget.style.borderColor =
                      'rgba(212,175,55,0.35)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.72)'
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.16)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center py-2">
              <div className="font-extrabold leading-none mb-1"
                style={{ fontSize: 26, color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
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
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10">
            <SectionLabel>Handpicked for You</SectionLabel>
            <h2 className="font-bold mt-2"
              style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Featured <span style={{ color: 'var(--royal)' }}>Destinations</span>
            </h2>
            <GoldDivider />
          </motion.div>

          {destLoading ? <LoadingSpinner message="Loading destinations" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest, i) => (
                <motion.div key={dest.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <DestinationCard dest={dest} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button onClick={() => navigate('/destinations')}
              className="btn-outline flex items-center gap-2">
              View All Destinations
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ WHY ILT ════════════════ */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background: 'var(--royal)' }}>

        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-[1280px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[2.5px] mb-4"
              style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.25)', fontFamily: 'var(--font-display)' }}>
              Why Choose ILT
            </div>
            <h2 className="font-bold mb-3 text-white"
              style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontFamily: 'var(--font-display)' }}>
              The <span style={{ color: 'var(--gold)' }}>ILT Promise</span>
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Six reasons why discerning travelers choose us for their most important journeys.
            </p>
            <div className="mx-auto mt-4 rounded-full" style={{ width: 40, height: 3, background: 'var(--gold)' }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, title, desc, stat, color, accent }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                }}>
                {/* Icon + stat */}
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: color, color: accent }}>
                    {icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>
                    {stat}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5 text-white"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                    {desc}
                  </p>
                </div>
                <div className="h-0.5 w-10 rounded-full mt-auto" style={{ background: accent, opacity: 0.7 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ BLOG PREVIEW ════════════════ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10">
            <SectionLabel>Insights & Stories</SectionLabel>
            <h2 className="font-bold mt-2"
              style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              The <span style={{ color: 'var(--royal)' }}>ILT Journal</span>
            </h2>
            <GoldDivider />
          </motion.div>

          {postsLoading ? <LoadingSpinner message="Loading articles" /> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button onClick={() => navigate('/blog')}
              className="btn-outline flex items-center gap-2">
              Read All Articles <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-16 px-6 relative overflow-hidden"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--royal-border)' }}>

        {/* Subtle violet glow top-right */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'var(--royal)', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />

        <div className="relative max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <SectionLabel>Begin Your Journey</SectionLabel>
            <h2 className="font-bold mt-2 mb-4"
              style={{ fontSize: 'clamp(24px, 4vw, 38px)', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              Ready for Your Next{' '}
              <span style={{ color: 'var(--royal)' }}>Adventure?</span>
            </h2>
            <p className="text-sm mb-8 mx-auto" style={{ color: 'var(--text-3)', maxWidth: 400, lineHeight: 1.8 }}>
              Our concierge team is available 24/7 to craft your perfect escape.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => navigate('/reservation')}
                className="btn-gold flex items-center gap-2">
                <MapPin size={14} /> Reserve Now
              </button>
              <button onClick={() => navigate('/contact')}
                className="btn-outline flex items-center gap-2">
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