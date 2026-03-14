import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts, useFeaturedPost } from '../hooks';
import BlogCard from '../components/BlogCard';
import {LoadingSpinner, ErrorMessage } from '../components/UI';

const CATEGORIES = ['All', 'Destinations', 'Travel Tips', 'Luxury', 'Culture', 'Food & Wine'];

const Blog = () => {
  const { post: featured }        = useFeaturedPost();
  const { posts, loading, error } = useBlogPosts(20);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');

  const otherPosts = posts.filter(p => !p.featured);
  const filtered   = (activeCategory === 'All' ? otherPosts : otherPosts.filter(p => p.category === activeCategory))
    .filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const heroPost = featured || posts[0] || null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ── Hero full-image — article featured ── */}
      {heroPost && !loading && (
        <Link to={`/blog/${heroPost.slug}`} className="block">
          <div className="relative overflow-hidden cursor-pointer" style={{ height: 520, marginTop: 0 }}>

            {/* Image */}
            <motion.img
              src={heroPost.image_url}
              alt={heroPost.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.95) 0%, rgba(20,17,58,0.35) 55%, rgba(0,0,0,0.1) 100%)' }} />

            {/* TOP badges */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-24 left-6 right-6 max-w-[1200px] mx-auto flex items-center gap-2 flex-wrap"
            >
              {/* Badge voyage/activité */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                ✈ Upcoming Trip
              </div>
              {/* Catégorie */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(48,36,112,0.75)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
                {heroPost.category}
              </div>
              {/* Read time */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)' }}>
                <Clock size={10} /> {heroPost.read_time}
              </div>
            </motion.div>

            {/* BOTTOM content */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
              <div className="max-w-[1200px] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1
                    className="font-bold text-white mb-3"
                    style={{ fontSize: 'clamp(24px, 4vw, 46px)', fontFamily: 'var(--font-display)', lineHeight: 1.15, maxWidth: 700 }}
                  >
                    {heroPost.title}
                  </h1>
                  <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 560 }}>
                    {heroPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                      Read article <ArrowRight size={13} />
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {new Date(heroPost.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Filter bar sticky ── */}
      <div className="sticky z-10"
        style={{ top: 68, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-3">

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--royal-border)', minWidth: 190 }}>
            <Search size={13} style={{ color: 'var(--royal)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: 'var(--border)' }} />

          {/* Category pills scrollable */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 flex-nowrap">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'var(--royal)' : 'transparent',
                    color:      activeCategory === cat ? '#fff'         : 'var(--text-2)',
                    border:     `1.5px solid ${activeCategory === cat ? 'var(--royal)' : 'var(--royal-border)'}`,
                    fontFamily: 'var(--font-display)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Count */}
          {!loading && !error && (
            <div className="text-xs hidden md:block flex-shrink-0" style={{ color: 'var(--text-3)' }}>
              <span className="font-bold" style={{ color: 'var(--royal)' }}>
                {filtered.length + (heroPost ? 1 : 0)}
              </span> articles
            </div>
          )}
        </div>
      </div>

      {/* ── Grid articles ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading articles" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
              <BookOpen size={22} style={{ color: 'var(--royal)' }} />
            </div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              No articles published yet
            </div>
          </div>
        ) : (
          <>
            {/* Divider */}
            {filtered.length > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--royal-border)' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--royal-border)' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[2px]"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  All Articles
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
            )}

            {/* Grille — BlogCard full-image */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.42 }}
                  >
                    <BlogCard post={post} index={i} />
                  </motion.div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-16">
                <div className="font-semibold text-sm mb-2"
                  style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  No articles match your search
                </div>
                <button onClick={() => setSearchQuery('')}
                  className="btn-royal mt-3 text-xs" style={{ padding: '8px 18px' }}>
                  Clear search
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;