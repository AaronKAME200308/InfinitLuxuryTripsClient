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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string): boolean =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? 'rgba(13,13,13,0.96)'
          : 'rgba(13,13,13,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid rgba(201,168,76,${scrolled ? '0.3' : '0.15'})`,
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textDecoration: 'none'
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: `linear-gradient(135deg, #1E1B6B, ${ROYAL_DARK})`,
            border: `2px solid ${GOLD}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: 1,
            fontFamily: "'Cormorant Garamond', serif"
          }}
        >
          iLT
        </div>

        <div>
          <div
            style={{
              color: CREAM,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 2,
              lineHeight: 1.1
            }}
          >
            INFINITE LUXURY
          </div>

          <div
            style={{
              color: GOLD,
              fontSize: 9,
              letterSpacing: 4,
              textTransform: 'uppercase'
            }}
          >
            TRIPS
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 36 }}>
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
              borderBottom: isActive(path)
                ? `1px solid ${GOLD}`
                : '1px solid transparent',
              paddingBottom: 2,
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
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
          padding: '10px 24px',
          borderRadius: 2,
          textDecoration: 'none',
          boxShadow: `0 4px 20px rgba(201,168,76,0.3)`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,168,76,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 20px rgba(201,168,76,0.3)';
        }}
      >
        Book Now
      </Link>
    </nav>
  );
};

export default Navbar;