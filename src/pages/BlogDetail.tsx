import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Calendar, Share2, Link2, BookOpen, ArrowRight, Twitter, Facebook } from 'lucide-react';
import { getBlogPostBySlug } from '../services/supabase';
import { useBlogPosts } from '../hooks';
import BlogCard from '../components/BlogCard';
import { LoadingSpinner, ErrorMessage } from '../components/UI';

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; image_url: string; read_time: string; featured: boolean;
  published_at: string; author?: string; author_avatar?: string;
}

const ShareBtn = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void; color: string }) => (
  <button onClick={onClick}
    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
    style={{ background: 'var(--royal-soft)', color: 'var(--royal)', border: '1.5px solid var(--royal-border)', fontFamily: 'var(--font-display)' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--royal)'; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--royal-soft)'; e.currentTarget.style.color = 'var(--royal)'; }}>
    {icon} {label}
  </button>
);

const BlogDetail = () => {
  const { slug }     = useParams<{ slug: string }>();
  const navigate     = useNavigate();
  const [post,    setPost]    = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);

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

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 440 }}>
        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.90) 0%, rgba(0,0,0,0.1) 55%)' }} />

        {/* Back */}
        <button onClick={() => navigate('/blog')}
          className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
          <ArrowLeft size={14} /> Back to Journal
        </button>

        {/* Hero text */}
        <div className="absolute bottom-8 left-6 right-6 max-w-[860px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(48,36,112,0.8)', color: '#fff', backdropFilter: 'blur(6px)', fontFamily: 'var(--font-display)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Tag size={9} style={{ color: 'var(--gold)' }} /> {post.category}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                <Clock size={9} /> {post.read_time}
              </div>
            </div>
            <h1 className="text-white font-bold leading-tight mb-3"
              style={{ fontSize: 'clamp(22px, 4vw, 42px)', fontFamily: 'var(--font-display)' }}>
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--royal)', color: 'var(--gold)', border: '2px solid rgba(245,166,35,0.5)' }}>
                  {(post.author || 'ILT').charAt(0)}
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {post.author || 'ILT Editorial'}
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Calendar size={11} /> {formattedDate}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Article */}
          <motion.div className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

            {/* Excerpt lead — bordure or */}
            <div className="text-base leading-relaxed mb-7 px-5 py-4 rounded-2xl"
              style={{ color: 'var(--text-2)', background: 'var(--gold-soft)', borderLeft: '4px solid var(--gold)', fontStyle: 'italic', border: '1px solid var(--gold-border)', borderLeftWidth: 4 }}>
              {post.excerpt}
            </div>

            {/* Content */}
            {post.content ? (
              <div className="prose-ilt" dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)' }}>
                <BookOpen size={28} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Full article content coming soon.</p>
              </div>
            )}

            {/* Share */}
            <div className="mt-10 pt-6 flex items-center gap-3 flex-wrap"
              style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                <Share2 size={12} className="inline mr-1.5" /> Share
              </span>
              <ShareBtn icon={<Twitter size={13}/>}  label="Twitter"                         color="#1DA1F2"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')} />
              <ShareBtn icon={<Facebook size={13}/>} label="Facebook"                        color="#1877F2"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} />
              <ShareBtn icon={<Link2 size={13}/>}    label={copied ? 'Copied!' : 'Copy link'} color="var(--royal)"
                onClick={handleCopyLink} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="w-full lg:w-[260px] flex-shrink-0">
            <div className="sticky flex flex-col gap-4" style={{ top: 84 }}>

              {/* Article info — bordure violette */}
              <div className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="px-4 py-3" style={{ background: 'var(--royal)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Article Info
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {[
                    { label: 'Category',  value: post.category  },
                    { label: 'Published', value: formattedDate   },
                    { label: 'Read time', value: post.read_time  },
                    { label: 'Author',    value: post.author || 'ILT Editorial' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>{label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA card — fond blanc, bouton or */}
              <div className="rounded-2xl p-5 text-center"
                style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Ready to explore?</div>
                <div className="font-bold text-base mb-3" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  Plan Your Next Adventure
                </div>
                <div className="h-0.5 mx-auto mb-3" style={{ width: 32, background: 'var(--gold)', borderRadius: 2 }} />
                <Link to="/destinations"
                  className="btn-gold w-full justify-center flex items-center gap-2 text-sm">
                  Explore Destinations <ArrowRight size={13} />
                </Link>
                <Link to="/reservation"
                  className="btn-outline w-full justify-center flex items-center gap-2 text-sm mt-2">
                  Book a Trip
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-14">
            <div className="flex items-center gap-4 mb-6" style={{ paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              <div className="h-0.5 w-6 rounded-full" style={{ background: 'var(--gold)' }} />
              <span className="text-sm font-bold uppercase tracking-[2.5px]"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Related Articles</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/blog/${p.slug}`)} className="cursor-pointer">
                  <BlogCard post={p} />
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