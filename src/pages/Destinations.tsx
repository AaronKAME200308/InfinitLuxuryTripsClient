import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useDestinations, useCategories } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components/UI';

const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');

  const { destinations, loading, error } = useDestinations(
    activeCategory === 'All' ? null : activeCategory
  );
  const { categories } = useCategories();

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      <PageHeader
        label="Explore the World"
        title="Our"
        highlight="Destinations"
        imageUrl="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80"
      />

      {/* ── Filter bar sticky ── */}
      <div className="sticky z-10" style={{ top: 68, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-3">

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--royal-border)', minWidth: 200 }}>
            <Search size={13} style={{ color: 'var(--royal)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: 'var(--border)' }} />

          {/* Category pills — scrollable */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 flex-nowrap">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
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
              <span className="font-bold" style={{ color: 'var(--royal)' }}>{filtered.length}</span>
              {' '}result{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading destinations" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
              <SlidersHorizontal size={22} style={{ color: 'var(--royal)' }} />
            </div>
            <div className="font-bold text-sm mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
              No results found
            </div>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              Try a different category or search term.
            </p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="btn-royal mt-5 text-xs" style={{ padding: '8px 18px' }}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((dest, i) => (
              <motion.div key={dest.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}>
                <DestinationCard dest={dest} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;