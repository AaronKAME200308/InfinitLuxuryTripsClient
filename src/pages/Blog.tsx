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
  const filtered   = (activeCategory === 'All' ? otherPosts : otherPosts.filter(p => p.category === activeCategory))
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <PageHeader
        label="Stories & Insights"
        title="The ILT"
        highlight="Journal"
        imageUrl="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80"
      />

      {/* Filter bar */}
      <div className="sticky z-10" style={{ top: 68, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--royal-border)', minWidth: 190 }}>
            <Search size={13} style={{ color: 'var(--royal)', flexShrink: 0 }} />
            <input type="text" placeholder="Search articles..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: 'var(--border)' }} />
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 flex-nowrap">
              {CATEGORIES.map(cat => (
                <motion.button key={cat} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'var(--royal)' : 'transparent',
                    color:      activeCategory === cat ? '#fff'         : 'var(--text-2)',
                    border:     `1.5px solid ${activeCategory === cat ? 'var(--royal)' : 'var(--royal-border)'}`,
                    fontFamily: 'var(--font-display)',
                    whiteSpace: 'nowrap',
                  }}>
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
          {!loading && !error && (
            <div className="text-xs hidden md:block flex-shrink-0" style={{ color: 'var(--text-3)' }}>
              <span className="font-bold" style={{ color: 'var(--royal)' }}>
                {filtered.length + (featured ? 1 : 0)}
              </span> articles
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {loading ? <LoadingSpinner message="Loading articles" />
        : error   ? <ErrorMessage message={error} />
        : posts.length === 0 ? (
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
            {/* Featured — hero horizontal */}
            {(featured || posts[0]) && (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-0.5 w-6 rounded-full" style={{ background: 'var(--gold)' }} />
                  <span className="text-xs font-bold uppercase tracking-[2.5px]" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    Featured Article
                  </span>
                </div>

                <motion.div whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(48,36,112,0.13)' }} transition={{ duration: 0.22 }}
                  className="cursor-pointer rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
                  style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-md)' }}>
                  <div className="relative overflow-hidden" style={{ height: 280 }}>
                    <motion.img src={(featured || posts[0]).image_url} alt={(featured || posts[0]).title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.4), transparent 60%)' }} />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                      ★ Featured
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="badge-royal self-start mb-3">{(featured || posts[0]).category}</div>
                    <h2 className="font-bold text-xl leading-snug mb-3"
                      style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                      {(featured || posts[0]).title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-2)', lineHeight: 1.75 }}>
                      {(featured || posts[0]).excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                        {new Date((featured || posts[0]).published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' · '}{(featured || posts[0]).read_time}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1"
                        style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                        Read → 
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
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--royal-border)' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--royal-border)' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[2px]" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>All Articles</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-16">
                <div className="font-semibold text-sm mb-2" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>No articles match your search</div>
                <button onClick={() => setSearchQuery('')} className="btn-royal mt-3 text-xs" style={{ padding: '8px 18px' }}>Clear search</button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;