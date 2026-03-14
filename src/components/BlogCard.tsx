import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag, ArrowRight } from 'lucide-react';

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
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(48,36,112,0.12)' }}
        transition={{ duration: 0.22 }}
        className="cursor-pointer rounded-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: '#fff',
          border: '1.5px solid var(--royal-border)',
          boxShadow: 'var(--shadow-xs)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: featured ? 240 : 190 }}>
          <motion.img
            src={post.image_url} alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}
          />
          {/* Overlay gradient bas */}
          <div className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.55), transparent)' }} />

          {/* Category badge sur l'image */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(48,36,112,0.80)',
              color: '#fff',
              backdropFilter: 'blur(6px)',
              fontFamily: 'var(--font-display)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            <Tag size={9} style={{ color: 'var(--gold)' }} />
            {post.category}
          </div>

          {/* Read time badge */}
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
            <Clock size={9} /> {post.read_time}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs mb-2.5" style={{ color: 'var(--text-3)' }}>
            {formatDate(post.published_at)}
          </div>

          <h3 className={`font-bold leading-snug mb-2 ${featured ? 'text-base' : 'text-sm'}`}
            style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            {post.title}
          </h3>

          <p className="text-xs leading-relaxed flex-1"
            style={{ color: 'var(--text-3)', lineHeight: 1.7 }}>
            {post.excerpt}
          </p>

          {/* Read more — violet */}
          <div className="flex items-center gap-1 mt-3 pt-3 text-xs font-bold"
            style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)', borderTop: '1px solid var(--border)' }}>
            Read article <ArrowRight size={12} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;