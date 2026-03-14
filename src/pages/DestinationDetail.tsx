import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Calendar, CheckCircle2,
  Tag, MessageSquare, Phone, ChevronRight, ChevronLeft,
  X, Images, ZoomIn, Star, Sparkles
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
      style={{ background: 'rgba(20,17,58,0.97)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
        onClick={onClose}>
        <X size={18} />
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(245,166,35,0.2)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.35)', fontFamily: 'var(--font-display)' }}>
        {currentIndex + 1} / {images.length}
      </div>
      {images.length > 1 && (
        <button className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onPrev(); }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          <ChevronLeft size={22} />
        </button>
      )}
      <motion.img key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28 }}
        src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.06)' }}
        onClick={e => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onNext(); }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          <ChevronRight size={22} />
        </button>
      )}
      {/* Thumbnails */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button key={i}
            className="w-14 h-9 rounded-lg overflow-hidden transition-all"
            style={{ opacity: i === currentIndex ? 1 : 0.38, outline: i === currentIndex ? '2px solid var(--gold)' : 'none', outlineOffset: 2 }}
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
        style={{ border: '1.5px solid var(--royal-border)' }}
        onClick={() => onOpen(0)}>
        <img src={all[0]} alt={destName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          style={{ background: 'rgba(48,36,112,0.35)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs"
            style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
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
              style={{ background: 'rgba(48,36,112,0.78)', backdropFilter: 'blur(2px)' }}>
              <Images size={18} color="#fff" />
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

  // Parallax hero
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], ['0%', '16%']);

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

      {/* ════════════════ HERO — 580px parallax ════════════════ */}
      <div className="relative overflow-hidden" style={{ height: 580 }}>

        {/* Image parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${dest.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: bgY,
            scale: 1.1,
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.96) 0%, rgba(20,17,58,0.2) 55%, transparent 100%)' }} />

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onClick={() => navigate('/destinations')}
          className="absolute top-24 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ArrowLeft size={14} /> Back
        </motion.button>

        {/* Photos button + prix — top right */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="absolute top-24 right-6 flex items-center gap-2"
        >
          {allImages.length > 1 && (
            <button onClick={() => openLightbox(0)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <Images size={14} /> {allImages.length} Photos
            </button>
          )}
          <div className="px-4 py-2 rounded-xl text-sm font-extrabold"
            style={{ background: 'var(--surface)', color: 'var(--gold-hover)', fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', border: '1.5px solid var(--gold-border)' }}>
            from ${Number(dest.price).toLocaleString()}
          </div>
        </motion.div>

        {/* Badges TOP gauche — slide depuis le haut */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className="absolute left-6 right-6 max-w-[1280px] mx-auto flex items-center gap-2 flex-wrap"
          style={{ top: 80 }}
        >
          {/* Spacer pour aligner sous les boutons */}
        </motion.div>

        {/* Contenu BAS — monte depuis le bas */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-[1280px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badges catégorie + featured */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(48,36,112,0.78)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
                  <MapPin size={9} style={{ color: 'var(--gold)' }} /> {dest.category}
                </div>
                {dest.featured && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Sparkles size={9} /> Top Pick
                  </div>
                )}
              </div>

              {/* Titre */}
              <h1 className="font-bold text-white mb-3"
                style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontFamily: 'var(--font-display)', lineHeight: 1.1, maxWidth: 750 }}>
                {dest.name}
              </h1>

              {/* Description courte */}
              <p className="text-sm mb-4"
                style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 560 }}>
                {dest.description?.slice(0, 140)}...
              </p>

              {/* Rating + tags */}
              <div className="flex items-center gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={13}
                        fill={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}
                        color={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">{dest.rating}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    ({dest.reviews_count} reviews)
                  </span>
                </div>
                {dest.tags?.slice(0, 3).map((tag: string) => (
                  <div key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                    {tag}
                  </div>
                ))}
              </div>

              {/* CTA inline */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleReserve}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                  style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(245,166,35,0.4)' }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  Reserve This Experience <ChevronRight size={14} />
                </motion.button>
                <button onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                  <Phone size={13} /> Ask Concierge
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════ BODY ════════════════ */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Gallery */}
            {dest.gallery?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45 }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-base flex items-center gap-2"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    <Images size={16} style={{ color: 'var(--royal)' }} /> Photo Gallery
                  </h2>
                  <button onClick={() => openLightbox(0)}
                    className="text-xs font-bold flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    See all <ChevronRight size={13} />
                  </button>
                </div>
                <PhotoGallery mainImage={dest.image_url} gallery={dest.gallery} destName={dest.name} onOpen={openLightbox} />
              </motion.div>
            )}

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45 }}
              className="rounded-2xl p-6"
              style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
              <h2 className="font-bold text-base mb-2 flex items-center gap-2"
                style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                <MapPin size={15} style={{ color: 'var(--royal)' }} /> About This Destination
              </h2>
              <div className="mb-4 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: 1.85 }}>
                {dest.description}
              </p>
            </motion.div>

            {/* Inclusions */}
            {dest.inclusions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-2 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--royal)' }} /> What's Included
                </h2>
                <div className="mb-4 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dest.inclusions.map((item: string) => (
                    <motion.div key={item}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--royal-soft)', border: '1px solid var(--royal-border)' }}>
                        <CheckCircle2 size={11} style={{ color: 'var(--royal)' }} />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags / Highlights */}
            {dest.tags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-2 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <Tag size={15} style={{ color: 'var(--royal)' }} /> Highlights
                </h2>
                <div className="mb-4 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                <div className="flex gap-2 flex-wrap">
                  {dest.tags.map((tag: string, i: number) => (
                    <motion.span key={tag}
                      initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="badge-royal">
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {reviews?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-xs)' }}>
                <h2 className="font-bold text-base mb-2 flex items-center gap-2"
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  <MessageSquare size={15} style={{ color: 'var(--royal)' }} /> Guest Reviews
                </h2>
                <div className="mb-4 h-0.5 w-8 rounded-full" style={{ background: 'var(--gold)' }} />
                <div className="flex flex-col gap-4">
                  {reviews.map((r: any, i: number) => (
                    <motion.div key={r.id}
                      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                            {r.client_name}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                            {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </div>
                        </div>
                        <StarRating rating={r.rating} size={12} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{r.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT — Booking card sticky ── */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky rounded-2xl overflow-hidden"
              style={{ top: 84, background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-lg)' }}>

              {/* Header violet */}
              <div className="px-5 py-5" style={{ background: 'var(--royal)' }}>
                <div className="text-xs mb-1 font-medium" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-display)' }}>
                  Starting from
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-extrabold" style={{ fontSize: 40, color: 'var(--gold)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    ${Number(dest.price).toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>/ person</span>
                </div>
                {/* Rating mini dans le header */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={11}
                        fill={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}
                        color={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white">{dest.rating}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>· {dest.reviews_count} reviews</span>
                </div>
              </div>

              <div className="p-5">
                {/* Date */}
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Calendar size={11} /> Travel Date
                  </label>
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm"
                    style={{ border: '1.5px solid var(--royal-border)', color: 'var(--text)', fontFamily: 'var(--font-body)', background: 'var(--bg)' }} />
                </div>

                {/* Guests */}
                <div className="mb-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Users size={11} /> Guests
                  </label>
                  <select value={guests} onChange={e => setGuests(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm appearance-none"
                    style={{ border: '1.5px solid var(--royal-border)', color: 'var(--text)', fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Total estimé */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-5"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Estimated total</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>
                      ${Number(dest.price).toLocaleString()} × {guests} guest{parseInt(guests) > 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="font-extrabold text-xl" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>

                {/* Boutons */}
                <motion.button onClick={handleReserve}
                  className="btn-royal w-full justify-center mb-2.5 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Reserve This Experience <ChevronRight size={14} />
                </motion.button>
                <motion.button onClick={() => navigate('/contact')}
                  className="btn-outline w-full justify-center flex items-center gap-2"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Phone size={13} /> Ask a Concierge
                </motion.button>

                {/* Trust badges */}
                <div className="mt-4 pt-4 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
                  {['Stripe or Zelle payment', 'Free cancellation within 48h', 'No hidden fees'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
                      <CheckCircle2 size={11} style={{ color: 'var(--royal)', flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;