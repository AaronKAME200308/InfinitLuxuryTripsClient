import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { StarRating } from './UI';

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
}

const DestinationCard = ({ dest }: { dest: Destination }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(48,36,112,0.16)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => navigate(`/destinations/${dest.slug || dest.id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        <motion.img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4 }}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Category */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(48,36,112,0.88)',
              color: '#fff',
              backdropFilter: 'blur(6px)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <MapPin size={10} />
            {dest.category}
          </div>

          {/* Featured badge */}
          {dest.featured && (
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: 'var(--gold)',
                color: '#1A2340',
                fontFamily: 'var(--font-display)',
              }}
            >
              <Star size={10} fill="#1A2340" color="#1A2340" />
              Top Pick
            </div>
          )}
        </div>

        {/* Price — bottom right */}
        <div
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl text-sm font-bold"
          style={{
            background: 'rgba(255,255,255,0.96)',
            color: 'var(--royal)',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          from ${Number(dest.price).toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + arrow */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-bold text-base leading-snug"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
          >
            {dest.name}
          </h3>
          <ArrowRight size={16} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 2 }} />
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={dest.rating} size={13} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            {dest.rating}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>
            ({dest.reviews_count} reviews)
          </span>
        </div>

        {/* Tags */}
        {dest.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {dest.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--royal-xlight)',
                  color: 'var(--royal)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DestinationCard;