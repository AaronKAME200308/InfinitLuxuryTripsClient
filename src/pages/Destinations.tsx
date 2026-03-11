import { useState } from 'react';
import { useDestinations, useCategories } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components/UI';

const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { destinations, loading, error } = useDestinations(activeCategory === 'All' ? null : activeCategory);
  const { categories } = useCategories();

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>

      <PageHeader
        label="Explore the World"
        title="Our"
        highlight="Destinations"
        imageUrl="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80"
      />

      {/* ---- Filter Bar ---- */}
      <div style={{
        background: '#fff', padding: '20px 60px',
        borderBottom: '1px solid #eee',
        display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
        position: 'sticky', top: 72, zIndex: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'var(--royal)' : 'transparent',
              border: `1px solid ${activeCategory === cat ? 'var(--royal)' : '#ddd'}`,
              color: activeCategory === cat ? '#fff' : '#666',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              fontFamily: 'var(--font)', padding: '8px 20px',
              borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >{cat}</button>
        ))}
      </div>

      {/* ---- Grid ---- */}
      <div style={{ padding: '60px', maxWidth: 1280, margin: '0 auto' }}>
        {loading ? (
          <LoadingSpinner message="Loading destinations" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
            <div style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
              No destinations found for this category
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: 13, color: '#999', letterSpacing: 1,
              marginBottom: 32, textAlign: 'right'
            }}>
              {destinations.length} destination{destinations.length > 1 ? 's' : ''} found
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 32
            }}>
              {destinations.map(dest => (
                <DestinationCard key={dest.id} dest={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
