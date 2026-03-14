import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, Clock, Tag, Calendar, Share2,
  Link2, BookOpen, ArrowRight, Twitter, Facebook,
  MapPin, CheckCircle2
} from 'lucide-react';
import { getBlogPostBySlug } from '../services/supabase';
import { useBlogPosts } from '../hooks';
import BlogCard from '../components/BlogCard';
import { LoadingSpinner, ErrorMessage } from '../components/UI';

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; image_url: string; read_time: string; featured: boolean;
  published_at: string; author?: string; author_avatar?: string;
}

// ── Share button ──────────────────────────────────────────
const ShareBtn = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--royal)'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--royal-soft)'; e.currentTarget.style.color = 'var(--royal)'; }}
  >
    {icon} {label}
  </motion.button>
);

const BlogDetail = () => {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const [post,    setPost]    = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

  // Parallax hero
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], ['0%', '15%']);

  const { posts: allPosts } = useBlogPosts(8);
  const related = allPosts.filter(p => p.slug !== slug && p.category === post?.category).slice(0, 3);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getBlogPostBySlug(slug)
      .then(data => { setPost(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
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

      {/* ════════════════ HERO full-image avec parallax ════════════════ */}
      <div className="relative overflow-hidden" style={{ height: 540 }}>

        {/* Image parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${post.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: bgY,
            scale: 1.1,
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.96) 0%, rgba(20,17,58,0.3) 55%, transparent 100%)' }} />

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onClick={() => navigate('/blog')}
          className="absolute top-24 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ArrowLeft size={14} /> Back to Journal
        </motion.button>

        {/* Badges — slide depuis le haut */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="absolute top-24 right-6 flex items-center gap-2 flex-wrap justify-end"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
            <Tag size={9} /> {post.category}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(48,36,112,0.75)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
            <Clock size={9} /> {post.read_time}
          </div>
        </motion.div>

        {/* Contenu bas — monte depuis le bas */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-bold text-white mb-4"
                style={{ fontSize: 'clamp(24px, 4.5vw, 50px)', fontFamily: 'var(--font-display)', lineHeight: 1.12, maxWidth: 780 }}>
                {post.title}
              </h1>

              {/* Auteur + date */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'var(--royal)', color: 'var(--gold)', border: '2px solid rgba(245,166,35,0.4)' }}>
                    {(post.author || 'ILT').charAt(0)}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-display)' }}>
                    {post.author || 'ILT Editorial'}
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <Calendar size={11} /> {formattedDate}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════ BODY ════════════════ */}
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Article ── */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {/* Excerpt — lead bordure or */}
            <div className="text-base leading-relaxed mb-7 px-5 py-4 rounded-2xl"
              style={{
                color: 'var(--text-2)',
                background: 'var(--gold-soft)',
                borderLeft: '4px solid var(--gold)',
                border: '1px solid var(--gold-border)',
                borderLeftWidth: 4,
                fontStyle: 'italic',
                lineHeight: 1.85,
              }}>
              {post.excerpt}
            </div>

            {/* Content */}
            {post.content ? (
              <motion.div
                className="prose-ilt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="rounded-2xl p-10 text-center"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <BookOpen size={24} style={{ color: 'var(--royal)' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  Full article content coming soon.
                </p>
              </div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 pt-6 flex items-center gap-3 flex-wrap"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                <Share2 size={12} /> Share
              </span>
              <ShareBtn icon={<Twitter  size={13} />} label="Twitter"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')} />
              <ShareBtn icon={<Facebook size={13} />} label="Facebook"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} />
              <ShareBtn icon={<Link2    size={13} />} label={copied ? '✓ Copied!' : 'Copy link'}
                onClick={handleCopyLink} />
            </motion.div>
          </motion.div>

          {/* ── Sidebar ── */}
          <div className="w-full lg:w-[270px] flex-shrink-0">
            <div className="sticky flex flex-col gap-4" style={{ top: 88 }}>

              {/* Article info */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="px-4 py-3" style={{ background: 'var(--royal)' }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-white"
                    style={{ fontFamily: 'var(--font-display)' }}>Article Info</span>
                </div>
                <div className="p-4 flex flex-col gap-3.5">
                  {[
                    { label: 'Category',  value: post.category,                    icon: <Tag      size={12} /> },
                    { label: 'Published', value: formattedDate,                    icon: <Calendar size={12} /> },
                    { label: 'Read time', value: post.read_time,                   icon: <Clock    size={12} /> },
                    { label: 'Author',    value: post.author || 'ILT Editorial',   icon: <CheckCircle2 size={12} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'var(--royal-soft)', color: 'var(--royal)' }}>
                        {icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>{label}</div>
                        <div className="text-sm font-medium mt-0.5" style={{ color: 'var(--text)' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38, duration: 0.45 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}
              >
                {/* Mini image de fond */}
                <div className="relative overflow-hidden" style={{ height: 90 }}>
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(48,36,112,0.85), rgba(48,36,112,0.4))' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={18} style={{ color: 'var(--gold)', margin: '0 auto 4px' }} />
                      <div className="text-xs font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        Ready to explore?
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    Plan Your Next Adventure
                  </div>
                  <div className="mb-4" style={{ width: 28, height: 2.5, background: 'var(--gold)', borderRadius: 2 }} />
                  <Link to="/destinations"
                    className="btn-gold w-full justify-center flex items-center gap-2 text-xs mb-2">
                    Explore Destinations <ArrowRight size={12} />
                  </Link>
                  <Link to="/reservation"
                    className="btn-outline w-full justify-center flex items-center gap-2 text-xs">
                    Book a Trip
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ════════════════ Related articles ════════════════ */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-4 mb-8"
              style={{ paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              <div className="h-0.5 w-6 rounded-full" style={{ background: 'var(--gold)' }} />
              <span className="font-bold uppercase tracking-[2.5px] text-sm"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                Related Articles
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.42 }}
                >
                  <BlogCard post={p} index={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;