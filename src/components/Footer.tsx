import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Shield } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#1E1650', fontFamily: 'var(--font-body)' }}>

    {/* ── Top strip ── */}
    <div
      className="flex items-center justify-center gap-6 flex-wrap px-6 py-4 text-sm"
      style={{
        background: '#302470',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {[
        { icon: <Shield size={14} />, text: 'Secure Payments' },
        { icon: <Clock   size={14} />, text: '24/7 Concierge' },
        { icon: <MapPin  size={14} />, text: '120+ Destinations' },
      ].map(({ icon, text }) => (
        <div key={text} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <span style={{ color: 'var(--gold)' }}>{icon}</span>
          {text}
        </div>
      ))}
    </div>

    {/* ── Main grid ── */}
    <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* Brand */}
      <div className="md:col-span-1">
        <Link to="/" className="flex items-center gap-2.5 mb-5">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden"
            style={{ border: '1.5px solid rgba(245,166,35,0.5)', background: 'rgba(255,255,255,0.08)' }}
          >
            <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              Infinite Luxury Trips
            </div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--gold)', opacity: 0.8 }}>
              Travel & Concierge
            </div>
          </div>
        </Link>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Curating extraordinary travel experiences for those who seek the exceptional.
        </p>
        <div
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
          style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--gold)' }}
        >
          <span className="text-base">⚡</span>
          <span className="font-medium">Zelle accepted</span>
        </div>
      </div>

      {/* Explore */}
      <div>
        <div className="text-white font-semibold text-sm mb-5" style={{ fontFamily: 'var(--font-display)' }}>
          Explore
        </div>
        {[
          { label: 'Destinations', path: '/destinations' },
          { label: 'Blog & Stories', path: '/blog' },
          { label: 'Make a Reservation', path: '/reservation' },
          { label: 'Cancel a Booking',   path: '/cancel'      },
          { label: 'Contact Us',         path: '/contact'     },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className="block text-sm mb-3 transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Top Destinations */}
      <div>
        <div className="text-white font-semibold text-sm mb-5" style={{ fontFamily: 'var(--font-display)' }}>
          Top Destinations
        </div>
        {['Santorini', 'Maldives', 'Kyoto', 'Dubai', 'Amalfi Coast', 'Bali'].map(dest => (
          <div
            key={dest}
            className="flex items-center gap-2 text-sm mb-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
            {dest}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div>
        <div className="text-white font-semibold text-sm mb-5" style={{ fontFamily: 'var(--font-display)' }}>
          Get in Touch
        </div>
        {[
          { icon: <Mail size={13} />, text: 'concierge@infiniteluxurytrips.com' },
          { icon: <Phone size={13} />, text: '+1 (800) ILT-LUXE' },
          { icon: <Clock size={13} />, text: 'Available 24/7' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-3 mb-4">
            <span className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }}>{icon}</span>
            <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div
      className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        color: 'rgba(255,255,255,0.35)',
      }}
    >
      <span>© 2026 Infinite Luxury Trips · All rights reserved</span>
      <span style={{ color: 'rgba(245,166,35,0.6)' }}>
        Crafted for those who seek the extraordinary ✦
      </span>
    </div>
  </footer>
);

export default Footer;