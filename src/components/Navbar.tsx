import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';

const LINKS = [
  { label: 'Destinations', path: '/destinations' },
  {label: 'About Us',     path: '/about'        },
  { label: 'Blog',         path: '/blog'         },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center px-4 md:px-8"
        style={{
          background: '#fff',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div className="max-w-[1280px] w-full mx-auto flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-auto">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: '1.5px solid var(--royal-border)', background: 'var(--royal-soft)' }}>
              <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                Infinite Luxury Trips
              </div>
              <div className="text-[10px] tracking-[2px] uppercase"
                style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>
                Travel & Concierge
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ label, path }) => (
              <Link key={path} to={path}
                className="relative px-3.5 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  color: isActive(path) ? 'var(--royal)' : 'var(--text-2)',
                  background: isActive(path) ? 'var(--royal-soft)' : 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive(path) ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.background = 'var(--royal-soft)'; e.currentTarget.style.color = 'var(--royal)'; }}}
                onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}}
              >
                {label}
                {isActive(path) && (
                  <motion.div layoutId="nav-underline"
                    className="absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full"
                    style={{ background: 'var(--gold)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Link to="/contact" className="btn-royal text-xs" style={{ padding: '9px 18px' }}>
              <MapPin size={13} /> Book a Trip
            </Link>
          </div>

          {/* Burger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
            style={{ background: menuOpen ? 'var(--royal-soft)' : 'transparent', border: '1.5px solid var(--royal-border)' }}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen
              ? <X size={17} style={{ color: 'var(--royal)' }} />
              : <Menu size={17} style={{ color: 'var(--royal)' }} />
            }
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-[199] md:hidden"
            style={{ background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {LINKS.map(({ label, path }) => (
                <Link key={path} to={path}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: isActive(path) ? 'var(--royal)' : 'var(--text-2)', background: isActive(path) ? 'var(--royal-soft)' : 'transparent', fontFamily: 'var(--font-body)' }}>
                  {label}
                </Link>
              ))}
              <Link to="/contact" className="mt-2 btn-royal justify-center text-sm">
                <MapPin size={14} /> Book a Trip
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;