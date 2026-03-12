import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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

  // Client-side search filter
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

      {/* ── Sticky filter bar ── */}
      <div
        className="sticky z-10 bg-white px-6 py-3"
        style={{ top: 68, borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center gap-3 flex-wrap">

          {/* Search mini */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', minWidth: 200 }}
          >
            <Search size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6" style={{ background: 'var(--border)' }} />

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
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

          {/* Count — pushed right */}
          {!loading && !error && (
            <div className="ml-auto text-xs hidden md:block" style={{ color: 'var(--text-3)' }}>
              <span className="font-semibold" style={{ color: 'var(--royal)' }}>{filtered.length}</span>
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
          <div className="text-center py-20">
            <div
              className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
            >
              No results found
            </div>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
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