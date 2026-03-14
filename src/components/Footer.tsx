import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Shield, ArrowRight } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--royal-border)', fontFamily: 'var(--font-body)' }}>

    {/* ── Trust strip ── */}
    <div style={{ background: 'var(--royal-soft)', borderBottom: '1px solid var(--royal-border)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-center gap-8 flex-wrap">
        {[
          { icon: <Shield size={13} />, text: 'Secure Payments' },
          { icon: <Clock   size={13} />, text: '24/7 Concierge' },
          { icon: <MapPin  size={13} />, text: '120+ Destinations' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs font-medium"
            style={{ color: 'var(--royal)' }}>
            <span style={{ color: 'var(--gold)' }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>

    {/* ── Main ── */}
    <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* Brand */}
      <div className="md:col-span-1">
        <Link to="/" className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl overflow-hidden"
            style={{ border: '1.5px solid var(--royal-border)', background: 'var(--royal-soft)' }}>
            <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
              Infinite Luxury Trips
            </div>
            <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
              Travel & Concierge
            </div>
          </div>
        </Link>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>
          Curating extraordinary travel experiences for those who seek the exceptional.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--gold-soft)', color: 'var(--gold-hover)', border: '1px solid var(--gold-border)' }}>
          ⚡ Zelle accepted
        </div>
      </div>

      {/* Explore */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[2.5px] mb-5"
          style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
          Explore
        </div>
        {[
          { label: 'Destinations',       path: '/destinations' },
          { label: 'Blog & Stories',     path: '/blog'         },
          { label: 'Make a Reservation', path: '/reservation'  },
          { label: 'Cancel a Booking',   path: '/cancel'       },
          { label: 'Contact Us',         path: '/contact'      },
        ].map(({ label, path }) => (
          <Link key={path} to={path}
            className="flex items-center gap-1 text-sm mb-2.5 transition-colors duration-200 group"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--royal)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Top Destinations */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[2.5px] mb-5"
          style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
          Top Destinations
        </div>
        {['Saint Barthélemy', 'Turks & Caicos', 'Santorini', 'Dubai', 'Amalfi Coast', 'Cancún'].map(dest => (
          <div key={dest} className="flex items-center gap-2 text-sm mb-2.5" style={{ color: 'var(--text-3)' }}>
            <MapPin size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
            {dest}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[2.5px] mb-5"
          style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
          Get in Touch
        </div>
        {[
          { icon: <Mail  size={13} />, text: 'concierge@infiniteluxurytrips.com' },
          { icon: <Phone size={13} />, text: '+1 (800) ILT-LUXE' },
          { icon: <Clock size={13} />, text: 'Available 24/7' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-3 mb-4">
            <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }}>{icon}</span>
            <span className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>{text}</span>
          </div>
        ))}

        {/* CTA mini */}
        <Link to="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mt-2 transition-colors"
          style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-hover)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--royal)'}
        >
          Send a message <ArrowRight size={11} />
        </Link>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          © 2026 Infinite Luxury Trips · All rights reserved
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--royal)', opacity: 0.6 }}>
          Crafted for those who seek the extraordinary ✦
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;