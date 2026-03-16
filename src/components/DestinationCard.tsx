import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowUpRight } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug?: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  tags: string[];
  inclusions: string[];
  featured: boolean;
  state?: string;
}

const DestinationCard = ({ dest }: { dest: Destination }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(48,36,112,0.18)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => navigate(`/destinations/${dest.slug || dest.id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden relative"
      style={{
        height: 320,
        border: dest.state === 'upcoming'
          ? '1.5px solid rgba(245,166,35,0.5)'
          : '1.5px solid var(--royal-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* ── Image full card ── */}
      <motion.img
        src={dest.image_url}
        alt={dest.name}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.5 }}
      />

      {/* ── Gradient overlay bas → haut pour lisibilité ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(20,17,58,0.88) 0%, rgba(20,17,58,0.3) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* ── TOP — Category + Featured ── */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">

        {/* Category badge — blanc semi-transparent */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <MapPin size={9} style={{ color: 'var(--gold)' }} />
          {dest.category}
        </div>

        {/* Upcoming badge — priorité sur Featured */}
        {dest.state === 'upcoming' ? (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--royal), #4535A0)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✈ Upcoming
          </div>
        ) : dest.featured ? (
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'var(--gold)',
              color: 'var(--royal)',
              fontFamily: 'var(--font-display)',
            }}
          >
            ★ Top Pick
          </div>
        ) : null}
      </div>

      {/* ── BOTTOM — Nom, rating, prix, tags ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4">

        {/* Tags */}
        {dest.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            {dest.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(48,36,112,0.65)',
                  color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Nom + flèche */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-bold leading-snug text-white"
            style={{ fontSize: 17, fontFamily: 'var(--font-display)' }}
          >
            {dest.name}
          </h3>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
          >
            <ArrowUpRight size={14} color="#fff" />
          </div>
        </div>

        {/* Rating + Prix sur la même ligne */}
        <div className="flex items-center justify-between">

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={11}
                  fill={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.3)'}
                  color={i <= Math.floor(dest.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.3)'}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-white">{dest.rating}</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              ({dest.reviews_count})
            </span>
          </div>

          {/* Prix — badge or */}
          <div
            className="px-3 py-1.5 rounded-xl text-sm font-extrabold"
            style={{
              background: 'var(--gold)',
              color: 'var(--royal)',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 2px 8px rgba(245,166,35,0.4)',
            }}
          >
            from ${Number(dest.price).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;