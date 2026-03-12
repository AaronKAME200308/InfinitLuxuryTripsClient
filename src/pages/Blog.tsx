import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { useBlogPosts, useFeaturedPost } from '../hooks';
import BlogCard from '../components/BlogCard';
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components/UI';

const CATEGORIES = ['All', 'Destinations', 'Travel Tips', 'Luxury', 'Culture', 'Food & Wine'];

const Blog = () => {
  const { post: featured }        = useFeaturedPost();
  const { posts, loading, error } = useBlogPosts(20);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');

  const otherPosts = posts.filter(p => !p.featured);

  const filtered = (activeCategory === 'All' ? otherPosts : otherPosts.filter(p => p.category === activeCategory))
    .filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <PageHeader
        label="Stories & Insights"
        title="The ILT"
        highlight="Journal"
        imageUrl="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80"
      />

      {/* ── Filter bar ── */}
      <div
        className="sticky z-10 bg-white px-6 py-3"
        style={{ top: 68, borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', minWidth: 200 }}
          >
            <Search size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div className="hidden md:block w-px h-5" style={{ background: 'var(--border)' }} />

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: activeCategory === cat ? 'var(--royal)' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--text-2)',
                  border: `1.5px solid ${activeCategory === cat ? 'var(--royal)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {!loading && !error && (
            <div className="ml-auto text-xs hidden md:block" style={{ color: 'var(--text-3)' }}>
              <span className="font-semibold" style={{ color: 'var(--royal)' }}>
                {filtered.length + (featured ? 1 : 0)}
              </span>{' '}articles
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading articles" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--royal-xlight)' }}>
              <BookOpen size={22} style={{ color: 'var(--royal)' }} />
            </div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              No articles published yet
            </div>
          </div>
        ) : (
          <>
            {/* Featured post — full width hero card */}
            {(featured || posts[0]) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div
                  className="text-xs font-bold uppercase tracking-[3px] mb-4 flex items-center gap-2"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                >
                  <span
                    className="inline-block w-5 h-0.5 rounded"
                    style={{ background: 'var(--gold)' }}
                  />
                  Featured Article
                </div>

                {/* Hero featured card */}
                <motion.div
                  whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(48,36,112,0.16)' }}
                  transition={{ duration: 0.22 }}
                  className="cursor-pointer rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 300 }}>
                    <motion.img
                      src={(featured || posts[0]).image_url}
                      alt={(featured || posts[0]).title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: 'var(--gold)',
                        color: '#1A2340',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      ★ Featured
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 self-start"
                      style={{ background: 'var(--royal-xlight)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                    >
                      {(featured || posts[0]).category}
                    </div>
                    <h2
                      className="font-bold text-xl leading-snug mb-3"
                      style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
                    >
                      {(featured || posts[0]).title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>
                      {(featured || posts[0]).excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                        {new Date((featured || posts[0]).published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' · '}{(featured || posts[0]).read_time}
                      </span>
                      <span
                        className="text-xs font-bold flex items-center gap-1"
                        style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}
                      >
                        Read article →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Divider */}
            {filtered.length > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs font-bold uppercase tracking-widest px-2" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  All Articles
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}

            {filtered.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                  No articles match your search
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-semibold"
                  style={{ color: 'var(--royal)' }}
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;