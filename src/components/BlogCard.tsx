import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

interface Post {
  slug: string;
  image_url: string;
  title: string;
  category: string;
  read_time: string;
  excerpt: string;
  published_at: string;
}

interface BlogCardProps {
  post: Post;
  featured?: boolean;
  index?: number; // pour décaler les animations
}

const BlogCard = ({ post, featured = false, index = 0 }: BlogCardProps) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const height = featured ? 340 : 260;

  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(48,36,112,0.18)' }}
        transition={{ duration: 0.22 }}
        className="cursor-pointer relative rounded-2xl overflow-hidden"
        style={{
          height,
          border: '1.5px solid var(--royal-border)',
          boxShadow: 'var(--shadow-sm)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* ── Image full card ── */}
        <motion.img
          src={post.image_url}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gradient overlay bas */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,17,58,0.92) 0%, rgba(20,17,58,0.25) 55%, transparent 100%)',
          }}
        />

        {/* ── TOP badges — slide depuis le haut ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + index * 0.08, duration: 0.38 }}
          className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2"
        >
          {/* Catégorie */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: 'rgba(48,36,112,0.78)',
              color: '#fff',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {post.category}
          </div>

          {/* Read time — or */}
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0"
            style={{
              background: 'var(--gold)',
              color: 'var(--royal)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <Clock size={9} /> {post.read_time}
          </div>
        </motion.div>

        {/* ── BOTTOM content — monte depuis le bas ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Date */}
            <div className="text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {formatDate(post.published_at)}
            </div>

            {/* Titre */}
            <h3
              className="font-bold leading-snug text-white mb-2"
              style={{
                fontSize: featured ? 17 : 14,
                fontFamily: 'var(--font-display)',
              }}
            >
              {post.title}
            </h3>

            {/* Excerpt — uniquement si featured */}
            {featured && (
              <p className="text-xs leading-relaxed mb-3"
                style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt}
              </p>
            )}

            {/* Read more */}
            <div className="flex items-center justify-between">
              <div
                className="inline-flex items-center gap-1.5 text-xs font-bold"
                style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
              >
                Read article <ArrowRight size={11} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;