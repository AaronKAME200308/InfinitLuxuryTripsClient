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
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(48,36,112,0.14)' }}
      transition={{ duration: 0.22 }}
      className="cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        fontFamily: 'var(--font-body)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: featured ? 260 : 180 }}>
        <motion.img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4 }}
        />
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(48,36,112,0.88)',
            color: '#fff',
            backdropFilter: 'blur(6px)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <Tag size={9} />
          {post.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-2.5">
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
            <Clock size={11} />
            {post.read_time}
          </div>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>{formatDate(post.published_at)}</span>
        </div>

        <h3
          className={`font-bold leading-snug mb-2 ${featured ? 'text-lg' : 'text-sm'}`}
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h3>

        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: 'var(--text-2)', lineHeight: 1.65 }}
        >
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="flex items-center gap-1 mt-3 text-xs font-semibold"
          style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
          Read article
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

export default BlogCard;