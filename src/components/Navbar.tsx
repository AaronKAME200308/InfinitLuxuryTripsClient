import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';

const links = [
  { label: 'Destinations', path: '/destinations' },
  { label: 'Blog',         path: '/blog'         },
  { label: 'Contact',      path: '/contact'      },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      {/* ── Main Navbar ── */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center px-4 md:px-8"
        style={{
          background: scrolled ? '#1E1650' : '#302470',
          boxShadow: scrolled ? '0 2px 20px rgba(30,22,80,0.35)' : '0 2px 12px rgba(48,36,112,0.22)',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      >
        <div className="max-w-[1280px] w-full mx-auto flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-auto">
            <div
              className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(245,166,35,0.55)',
              }}
            >
              <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <div
                className="text-white font-bold text-[14px] tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Infinite Luxury Trips
              </div>
              <div
                className="text-[10px] tracking-[2.5px] uppercase"
                style={{ color: 'rgba(245,166,35,0.85)', fontFamily: 'var(--font-body)' }}
              >
                Travel & Concierge
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.75)',
                  background: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }
                }}
              >
                {label}
                {isActive(path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full"
                    style={{ background: 'var(--gold)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/reservation"
            className="hidden md:inline-flex items-center gap-2 ml-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: 'var(--gold)',
              color: '#1A2340',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 2px 10px rgba(245,166,35,0.35)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--gold-dark)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(245,166,35,0.45)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(245,166,35,0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <MapPin size={14} />
            Book a Trip
          </Link>

          {/* Burger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X size={18} color="#fff" />
              : <Menu size={18} color="#fff" />
            }
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-[68px] left-0 right-0 z-[199] md:hidden"
            style={{
              background: '#302470',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 24px rgba(30,22,80,0.3)',
            }}
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {links.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.75)',
                    background: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/reservation"
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                style={{ background: 'var(--gold)', color: '#1A2340', fontFamily: 'var(--font-display)' }}
              >
                <MapPin size={14} />
                Book a Trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;