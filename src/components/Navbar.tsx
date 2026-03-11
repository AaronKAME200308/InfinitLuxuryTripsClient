import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E8C97A';
const ROYAL_DARK = '#13104A';
const CREAM = '#FAF7F0';
const DARK = '#0D0D0D';

type NavLink = {
  label: string;
  path: string;
};

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu si on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string): boolean =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-cta  { display: none !important; }
          .nav-burger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-burger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(13,13,13,0.96)' : 'rgba(13,13,13,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid rgba(201,168,76,${scrolled ? '0.3' : '0.15'})`,
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
          transition: 'all 0.3s ease',
        }}
      >
        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          {/* Conteneur circulaire avec taille fixe et image cadrée */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: `2px solid ${GOLD}`,
              overflow: 'hidden',
              flexShrink: 0,
              background: `linear-gradient(135deg, #1E1B6B, ${ROYAL_DARK})`,
            }}
          >
            <img
              src="/logoilt.jpeg"
              alt="ILT"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div>
            <div style={{ color: CREAM, fontSize: 15, fontWeight: 600, letterSpacing: 2, lineHeight: 1.1 }}>
              INFINITE LUXURY
            </div>
            <div style={{ color: GOLD, fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' }}>
              TRIPS
            </div>
          </div>
        </Link>

        {/* ── Liens desktop ── */}
        <div className="nav-links" style={{ display: 'flex', gap: 36 }}>
          {links.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                color: isActive(path) ? GOLD : 'rgba(255,255,255,0.7)',
                fontSize: 12,
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: isActive(path) ? 600 : 400,
                borderBottom: isActive(path) ? `1px solid ${GOLD}` : '1px solid transparent',
                paddingBottom: 2,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── CTA desktop ── */}
        <Link
          to="/reservation"
          className="nav-cta"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: DARK,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            padding: '10px 24px',
            borderRadius: 2,
            textDecoration: 'none',
            boxShadow: `0 4px 20px rgba(201,168,76,0.3)`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,168,76,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)';
          }}
        >
          Book Now
        </Link>

        {/* ── Burger mobile ── */}
        <button
          className="nav-burger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: 'none', // overridden by media query
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 24,
                height: 1.5,
                background: GOLD,
                borderRadius: 2,
                transition: 'all 0.3s',
                transform:
                  menuOpen
                    ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                    : i === 2 ? 'translateY(-6.5px) rotate(-45deg)'
                    : 'scaleX(0)'
                    : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── Menu mobile déroulant ── */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 72,
          left: 0,
          right: 0,
          zIndex: 99,
          background: 'rgba(13,13,13,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid rgba(201,168,76,0.2)`,
          display: 'flex',
          flexDirection: 'column',
          padding: menuOpen ? '24px 32px 32px' : '0 32px',
          gap: 24,
          maxHeight: menuOpen ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, padding 0.35s ease',
        }}
      >
        {links.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            style={{
              color: isActive(path) ? GOLD : 'rgba(255,255,255,0.75)',
              fontSize: 13,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: isActive(path) ? 600 : 400,
              textDecoration: 'none',
              borderBottom: `1px solid rgba(201,168,76,0.1)`,
              paddingBottom: 16,
            }}
          >
            {label}
          </Link>
        ))}

        <Link
          to="/reservation"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: DARK,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 2,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Book Now
        </Link>
      </div>
    </>
  );
};

export default Navbar;