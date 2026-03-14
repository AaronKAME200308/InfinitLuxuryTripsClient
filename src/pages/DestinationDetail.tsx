import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Calendar, CheckCircle2,
  Tag, MessageSquare, Phone, ChevronRight, ChevronLeft,
  X, Images, ZoomIn
} from 'lucide-react';
import { useDestination, useReviews } from '../hooks';
import { StarRating, LoadingSpinner, ErrorMessage } from '../components/UI';

// ── Lightbox ──────────────────────────────────────────────
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }: {
  images: string[]; currentIndex: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ background: 'rgba(20,17,58,0.96)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
        onClick={onClose}>
        <X size={18} />
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(245,166,35,0.2)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)', fontFamily: 'var(--font-display)' }}>
        {currentIndex + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onPrev(); }}>
          <ChevronLeft size={22} />
        </button>
      )}
      <motion.img key={currentIndex}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onNext(); }}>
          <ChevronRight size={22} />
        </button>
      )}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button key={i}
            className="w-12 h-8 rounded-lg overflow-hidden transition-all"
            style={{ opacity: i === currentIndex ? 1 : 0.4, outline: i === currentIndex ? '2px solid var(--gold)' : 'none', outlineOffset: 2 }}
            onClick={e => { e.stopPropagation(); }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  </AnimatePresence>
);

// ── Gallery grid ──────────────────────────────────────────
const PhotoGallery = ({ mainImage, gallery, destName, onOpen }: {
  mainImage: string; gallery: string[]; destName: string; onOpen: (i: number) => void;
}) => {
  const all = [mainImage, ...(gallery || [])].slice(0, 5);
  if (all.length < 2) return null;

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 200px', height: 408 }}>
      <div className="relative overflow-hidden rounded-2xl cursor-pointer group row-span-2"
        onClick={() => onOpen(0)}
        style={{ border: '1.5px solid var(--royal-border)' }}>
        <img src={all[0]} alt={destName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ background: 'rgba(48,36,112,0.3)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--royal)', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700 }}>
            <ZoomIn size={13} /> View
          </div>
        </div>
      </div>
      {all.slice(1, 5).map((img, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl cursor-pointer group"
          style={{ border: '1.5px solid var(--royal-border)' }}
          onClick={() => onOpen(i + 1)}>
          <img src={img} alt={`${destName} ${i + 2}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {i === 3 && (gallery?.length || 0) > 4 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
              style={{ background: 'rgba(48,36,112,0.75)', backdropFilter: 'blur(2px)' }}>
              <Images size={20} color="#fff" />
              <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                +{(gallery?.length || 0) - 3} photos
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────
const DestinationDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [date,   setDate]   = useState('');
  const [guests, setGuests] = useState('2');
  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isUUID = /^[0-9a-f-]{36}$/.test(id || '');
  const { destination: dest, loading, error } = useDestination(id || '', !isUUID);
  const { reviews } = useReviews(dest?.id);

  if (loading) return <LoadingSpinner message="Loading destination" />;
  if (error || !dest) return <ErrorMessage message={error || 'Destination not found'} />;

  const today         = new Date().toISOString().split('T')[0];
  const totalEstimate = dest.price * parseInt(guests);
  const allImages     = [dest.image_url, ...(dest.gallery || [])];

  const openLightbox  = (i: number) => { setLightboxIndex(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg       = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length);
  const nextImg       = () => setLightboxIndex(i => (i + 1) % allImages.length);

  const handleReserve = () => navigate('/reservation', {
    state: { destinationId: dest.id, destinationName: dest.name, price: dest.price, date, guests }
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {lightboxOpen && <Lightbox images={allImages} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={prevImg} onNext={nextImg} />}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 420 }}>
        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.88) 0%, rgba(0,0,0,0.08) 55%)' }} />

        {/* Back */}
        <button onClick={() => navigate('/destinations')}
          className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Photos btn */}
        {allImages.length > 1 && (
          <button onClick={() => openLightbox(0)}
            className="absolute top-6 right-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)', boxShadow: '0 2px 10px rgba(245,166,35,0.4)' }}>
            <Images size={14} /> {allImages.length} Photos
          </button>
        )}

        {/* Hero info */}
        <div className="absolute bottom-8 left-6 right-6 max-w-[1280px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(48,36,112,0.75)', color: '#fff', backdropFilter: 'blur(6px)', fontFamily: 'var(--font-display)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <MapPin size={10} style={{ color: 'var(--gold)' }} /> {dest.category}
              </div>
              {dest.featured && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  ★ Top Pick
                </div>
              )}
            </div>
            <h1 className="text-white font-bold mb-3"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
              {dest.name}
            </h1>
            <div className="flex items-center gap-3">
              <StarRating rating={dest.rating} size={16} />
              <span className="text-white text-sm font-bold">{dest.rating}</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>· {dest.reviews_count} reviews</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Gallery */}
            {dest.gallery?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-base flex items-center gap-2"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    <Images size={16} style={{ color: 'var(--royal)' }} /> Photo Gallery
                  </h2>
                  <button onClick={() => openLightbox(0)}
                    className="text-xs font-bold flex items-center gap-1"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    See all <ChevronRight size={13} />
                  </button>
                </div>
                <PhotoGallery mainImage={dest.image_url} gallery={dest.gallery} destName={dest.name} onOpen={openLightbox} />
              </motion.div>
            )}

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-6"
              style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                <MapPin size={16} style={{ color: 'var(--royal)' }} /> About This Destination
              </h2>
              <div className="mb-3 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: 1.85 }}>
                {dest.description}
              </p>
            </motion.div>

            {/* Inclusions */}
            {dest.inclusions?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-3 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--royal)' }} /> What's Included
                </h2>
                <div className="mb-3 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dest.inclusions.map((item: string) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--royal-soft)', border: '1px solid var(--royal-border)' }}>
                        <CheckCircle2 size={11} style={{ color: 'var(--royal)' }} />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {dest.tags?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-3 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <Tag size={16} style={{ color: 'var(--royal)' }} /> Highlights
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {dest.tags.map((tag: string) => (
                    <span key={tag} className="badge-royal">{tag}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-3 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <MessageSquare size={16} style={{ color: 'var(--royal)' }} /> Guest Reviews
                </h2>
                <div className="mb-3 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                <div className="flex flex-col gap-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="p-4 rounded-xl"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{r.client_name}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                            {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </div>
                        </div>
                        <StarRating rating={r.rating} size={12} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — Booking card */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="sticky rounded-2xl overflow-hidden"
              style={{ top: 84, background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-lg)' }}>

              {/* Header violet */}
              <div className="px-5 py-4" style={{ background: 'var(--royal)' }}>
                <div className="text-xs mb-1 font-medium" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-display)' }}>
                  Starting from
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold" style={{ fontSize: 38, color: 'var(--gold)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    ${Number(dest.price).toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>/ person</span>
                </div>
              </div>

              <div className="p-5">
                {/* Date */}
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Calendar size={12} /> Travel Date
                  </label>
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm"
                    style={{ border: '1.5px solid var(--royal-border)', color: 'var(--text)', fontFamily: 'var(--font-body)', background: 'var(--bg)' }} />
                </div>

                {/* Guests */}
                <div className="mb-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Users size={12} /> Guests
                  </label>
                  <select value={guests} onChange={e => setGuests(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none"
                    style={{ border: '1.5px solid var(--royal-border)', color: 'var(--text)', fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Estimated total</span>
                  <span className="font-extrabold text-lg" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>

                {/* CTA buttons */}
                <button onClick={handleReserve}
                  className="btn-royal w-full justify-center mb-2.5 flex items-center gap-2">
                  Reserve This Experience <ChevronRight size={14} />
                </button>
                <button onClick={() => navigate('/contact')}
                  className="btn-outline w-full justify-center flex items-center gap-2">
                  <Phone size={13} /> Ask a Concierge
                </button>

                {/* Trust */}
                <div className="mt-4 flex flex-col gap-1.5">
                  {['Stripe or Zelle payment', 'Free cancellation within 48h', 'No hidden fees'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
                      <CheckCircle2 size={11} style={{ color: 'var(--royal)', flexShrink: 0 }} />
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