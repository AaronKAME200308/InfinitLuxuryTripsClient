import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Tag, Calendar, Share2,
  Twitter, Facebook, Link2, BookOpen, ArrowRight
} from 'lucide-react';
import { getBlogPostBySlug } from '../services/supabase';
import { useBlogPosts } from '../hooks';
import BlogCard from '../components/BlogCard';
import { LoadingSpinner, ErrorMessage } from '../components/UI';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  read_time: string;
  featured: boolean;
  published_at: string;
  author?: string;
  author_avatar?: string;
}

// ── Share button ──────────────────────────────────────────
const ShareBtn = ({ icon, label, onClick, color }: {
  icon: React.ReactNode; label: string; onClick: () => void; color: string;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
    style={{ background: color + '15', color, border: `1px solid ${color}30`, fontFamily: 'var(--font-display)' }}
    onMouseEnter={e => { e.currentTarget.style.background = color + '25'; }}
    onMouseLeave={e => { e.currentTarget.style.background = color + '15'; }}
  >
    {icon}
    {label}
  </button>
);

const BlogDetail = () => {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const [post, setPost]     = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

  // Related posts
  const { posts: allPosts } = useBlogPosts(8);
  const related = allPosts.filter(p => p.slug !== slug && p.category === post?.category).slice(0, 3);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogPostBySlug(slug)
      .then(data => { setPost(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Loading article" />;
  if (error || !post) return <ErrorMessage message={error || 'Article not found'} />;

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ height: 460 }}>
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,20,60,0.88) 0%, rgba(0,0,0,0.12) 55%)' }}
        />

        {/* Back */}
        <button
          onClick={() => navigate('/blog')}
          className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-display)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
        >
          <ArrowLeft size={14} /> Back to Journal
        </button>

        {/* Hero text */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="max-w-215 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category + read time */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(48,36,112,0.85)', color: '#fff', backdropFilter: 'blur(6px)', fontFamily: 'var(--font-display)' }}
                >
                  <Tag size={9} />
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <Clock size={11} />
                  {post.read_time}
                </span>
              </div>

              <h1
                className="text-white font-bold leading-tight mb-3"
                style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontFamily: 'var(--font-display)' }}
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--gold)', color: '#1A2340' }}
                    >
                      {(post.author || 'ILT').charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {post.author || 'ILT Editorial'}
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <Calendar size={11} />
                  {formattedDate}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-275 mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Article content ── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Excerpt / lead */}
            <div
              className="text-base leading-relaxed mb-7 px-5 py-4 rounded-2xl border-l-4"
              style={{
                color: 'var(--text-2)',
                background: 'var(--royal-xlight)',
                borderLeftColor: 'var(--royal)',
                fontStyle: 'italic',
              }}
            >
              {post.excerpt}
            </div>

            {/* Content */}
            {post.content ? (
              <div
                className="prose-ilt"
                style={{
                  color: 'var(--text-2)',
                  lineHeight: 1.85,
                  fontSize: 15,
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              /* Fallback if content field is empty — show excerpt as placeholder */
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <BookOpen size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                  Full article content coming soon.
                </p>
              </div>
            )}

            {/* Share row */}
            <div
              className="mt-10 pt-6 flex items-center gap-3 flex-wrap"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider mr-2"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
              >
                <Share2 size={13} className="inline mr-1.5" />
                Share
              </span>
              <ShareBtn
                icon={<Twitter size={13} />}
                label="Twitter"
                color="#1DA1F2"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              />
              <ShareBtn
                icon={<Facebook size={13} />}
                label="Facebook"
                color="#1877F2"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              />
              <ShareBtn
                icon={<Link2 size={13} />}
                label={copied ? 'Copied!' : 'Copy link'}
                color={copied ? '#0A8754' : 'var(--royal)'}
                onClick={handleCopyLink}
              />
            </div>
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="w-full lg:w-70 shrink-0">
            <div className="sticky flex flex-col gap-5" style={{ top: 84 }}>

              {/* Article info card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div
                  className="px-4 py-3"
                  style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-white"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    Article Info
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {[
                    { label: 'Category',  value: post.category },
                    { label: 'Published', value: formattedDate },
                    { label: 'Read time', value: post.read_time },
                    { label: 'Author',    value: post.author || 'ILT Editorial' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                        {label}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{ background: 'var(--royal)', boxShadow: 'var(--shadow-md)' }}
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-white opacity-70"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  Ready to explore?
                </div>
                <div className="text-white font-bold text-base mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  Plan Your Next Adventure
                </div>
                <Link
                  to="/destinations"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: 'var(--gold)',
                    color: '#1A2340',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Explore Destinations
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-14"
          >
            <div
              className="flex items-center gap-4 mb-6"
              style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}
            >
              <span
                className="text-sm font-bold uppercase tracking-[3px]"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
              >
                Related Articles
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  className="cursor-pointer"
                >
                  <BlogCard post={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Inline prose styles ── */}
      <style>{`
        .prose-ilt h2 {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
          margin: 32px 0 14px;
        }
        .prose-ilt h3 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 24px 0 10px;
        }
        .prose-ilt p {
          margin-bottom: 18px;
          color: var(--text-2);
        }
        .prose-ilt ul, .prose-ilt ol {
          padding-left: 20px;
          margin-bottom: 18px;
        }
        .prose-ilt li {
          margin-bottom: 6px;
          color: var(--text-2);
        }
        .prose-ilt a {
          color: var(--royal);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-ilt blockquote {
          border-left: 3px solid var(--gold);
          padding: 12px 20px;
          margin: 24px 0;
          background: var(--royal-xlight);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: var(--text);
        }
        .prose-ilt img {
          width: 100%;
          border-radius: 16px;
          margin: 24px 0;
          object-fit: cover;
        }
        .prose-ilt strong {
          color: var(--text);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;