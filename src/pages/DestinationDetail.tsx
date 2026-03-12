import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Calendar,
  CheckCircle2, Tag, MessageSquare, Phone, ChevronRight
} from 'lucide-react';
import { useDestination, useReviews } from '../hooks';
import { StarRating, LoadingSpinner, ErrorMessage, RoyalButton } from '../components/UI';

const DestinationDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [date, setDate]     = useState('');
  const [guests, setGuests] = useState('2');

  const isUUID = /^[0-9a-f-]{36}$/.test(id || '');
  const { destination: dest, loading, error } = useDestination(id || '', !isUUID);
  const { reviews } = useReviews(dest?.id);

  const handleReserve = () => {
    navigate('/reservation', {
      state: { destinationId: dest.id, destinationName: dest.name, price: dest.price, date, guests }
    });
  };

  if (loading) return <LoadingSpinner message="Loading destination" />;
  if (error || !dest) return <ErrorMessage message={error || 'Destination not found'} />;

  const today        = new Date().toISOString().split('T')[0];
  const totalEstimate = dest.price * parseInt(guests);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ height: 480 }}>
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,20,60,0.82) 0%, rgba(0,0,0,0.1) 55%)' }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate('/destinations')}
          className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.28)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-display)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Hero text */}
        <div className="absolute bottom-8 left-6 right-6 max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(48,36,112,0.85)', color: '#fff', backdropFilter: 'blur(6px)', fontFamily: 'var(--font-display)' }}
            >
              <MapPin size={10} />
              {dest.category}
            </div>
            <h1
              className="text-white font-bold mb-3"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}
            >
              {dest.name}
            </h1>
            <div className="flex items-center gap-3">
              <StarRating rating={dest.rating} size={16} />
              <span className="text-white text-sm font-semibold">{dest.rating}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
                · {dest.reviews_count} reviews
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT — Details */}
          <div className="flex-1 min-w-0">

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 mb-6"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <h2
                className="font-bold text-lg mb-4 flex items-center gap-2"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
              >
                <MapPin size={18} style={{ color: 'var(--royal)' }} />
                About This Destination
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
                {dest.description}
              </p>
            </motion.div>

            {/* Inclusions */}
            {dest.inclusions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <h2
                  className="font-bold text-lg mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  <CheckCircle2 size={18} style={{ color: 'var(--royal)' }} />
                  What's Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dest.inclusions.map((item: string) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} style={{ color: 'var(--gold-dark)', flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {dest.tags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <h2
                  className="font-bold text-lg mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  <Tag size={18} style={{ color: 'var(--royal)' }} />
                  Highlights
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {dest.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'var(--royal-xlight)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl p-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <h2
                  className="font-bold text-lg mb-5 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                >
                  <MessageSquare size={18} style={{ color: 'var(--royal)' }} />
                  Guest Reviews
                </h2>
                <div className="flex flex-col gap-4">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                            {review.client_name}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={12} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — Booking card (sticky) */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div
              className="sticky rounded-2xl overflow-hidden"
              style={{ top: 84, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
            >
              {/* Price header */}
              <div
                className="px-5 py-4"
                style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-display)' }}>
                  Starting from
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-extrabold leading-none"
                    style={{ fontSize: 38, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
                  >
                    ${Number(dest.price).toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>/ person</span>
                </div>
              </div>

              <div className="p-5">
                {/* Date */}
                <div className="mb-4">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Travel Date
                    </span>
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                    style={{
                      border: '1.5px solid var(--border)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      background: 'var(--bg)',
                    }}
                  />
                </div>

                {/* Guests */}
                <div className="mb-5">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Users size={12} />
                      Guests
                    </span>
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none transition-all duration-200"
                    style={{
                      border: '1.5px solid var(--border)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      background: 'var(--bg)',
                    }}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Total estimate */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                  style={{ background: 'var(--royal-xlight)', border: '1px solid rgba(48,36,112,0.1)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                    Estimated total
                  </span>
                  <span
                    className="font-extrabold text-lg"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                  >
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>

                {/* CTA buttons */}
                <RoyalButton onClick={handleReserve} fullWidth>
                  Reserve This Experience
                  <ChevronRight size={15} />
                </RoyalButton>

                <button
                  onClick={() => navigate('/contact')}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    border: '1.5px solid var(--border)',
                    color: 'var(--text-2)',
                    background: 'transparent',
                    fontFamily: 'var(--font-display)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--royal)'; e.currentTarget.style.color = 'var(--royal)'; e.currentTarget.style.background = 'var(--royal-xlight)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Phone size={13} />
                  Ask a Concierge
                </button>

                {/* Trust badges */}
                <div className="mt-4 flex flex-col gap-1.5">
                  {['Payment via Stripe or Zelle', 'Free cancellation within 48h', 'No hidden fees'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
                      <CheckCircle2 size={11} style={{ color: 'var(--gold-dark)', flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;