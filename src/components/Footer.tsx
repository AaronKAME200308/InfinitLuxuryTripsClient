import { Link } from 'react-router-dom';

const GOLD = '#C9A84C';
const ROYAL_DARK = '#13104A';
const CREAM = '#FAF7F0';

const Footer = () => (
  <footer style={{
    background: ROYAL_DARK, color: 'rgba(255,255,255,0.6)',
    fontFamily: "'Cormorant Garamond', serif",
    borderTop: '1px solid rgba(201,168,76,0.15)'
  }}>
    <div style={{
      maxWidth: 1200, margin: '0 auto', padding: '60px 48px',
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48
    }}>
      {/* Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E1B6B, #13104A)',
            border: `2px solid ${GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: GOLD
          }}>iLT</div>
          <div style={{ color: CREAM, fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
            INFINITE LUXURY TRIPS
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 280, marginBottom: 20 }}>
          Curating the world's most extraordinary travel experiences for those who demand the exceptional.
        </p>
        <div style={{ color: GOLD, fontSize: 13 }}>
          ⚡ Zelle: {import.meta.env.VITE_APP_ZELLE_EMAIL || 'concierge@infiniteluxurytrips.com'}
        </div>
      </div>

      {/* Explore */}
      <div>
        <div style={{ color: GOLD, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
          Explore
        </div>
        {[
          { label: 'Destinations', path: '/destinations' },
          { label: 'Blog',         path: '/blog' },
          { label: 'Reservations', path: '/reservation' },
          { label: 'Contact',      path: '/contact' }
        ].map(({ label, path }) => (
          <Link key={path} to={path} style={{
            display: 'block', marginBottom: 10, fontSize: 14,
            color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
            transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = GOLD}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >{label}</Link>
        ))}
      </div>

      {/* Destinations */}
      <div>
        <div style={{ color: GOLD, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
          Top Destinations
        </div>
        {['Santorini', 'Maldives', 'Kyoto', 'Dubai', 'Amalfi Coast', 'Bali'].map(dest => (
          <div key={dest} style={{ marginBottom: 10, fontSize: 14 }}>{dest}</div>
        ))}
      </div>

      {/* Contact */}
      <div>
        <div style={{ color: GOLD, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
          Contact
        </div>
        {[
          '✉ concierge@infiniteluxurytrips.com',
          '📞 +1 (800) ILT-LUXE',
          '🕐 Available 24/7'
        ].map(item => (
          <div key={item} style={{ marginBottom: 12, fontSize: 13, lineHeight: 1.5 }}>{item}</div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '20px 48px',
      display: 'flex', justifyContent: 'space-between',
      fontSize: 12, maxWidth: 1200, margin: '0 auto'
    }}>
      <span>© 2026 Infinite Luxury Trips. All rights reserved.</span>
      <span style={{ color: GOLD }}>Crafted for those who seek the extraordinary.</span>
    </div>
  </footer>
);

export default Footer;
