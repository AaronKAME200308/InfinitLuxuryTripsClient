import { useState, useEffect, useRef } from 'react';
import { useDestinations, useCategories } from '../hooks';
import { useReveal } from '../hooks/useAnimations';
import DestinationCard from '../components/DestinationCard';
import { PageHeader, LoadingSpinner, ErrorMessage } from '../components/UI';

const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [gridVisible, setGridVisible]       = useState(true);
  const headerRef = useReveal({ threshold: 0.1 });

  const { destinations, loading, error } = useDestinations(
    activeCategory === 'All' ? null : activeCategory
  );
  const { categories } = useCategories();

  // Transition lors du changement de catégorie
  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setGridVisible(false);
    setTimeout(() => {
      setActiveCategory(cat);
      setGridVisible(true);
    }, 250);
  };

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
        background: 'rgba(255,255,255,0.95)', padding: '18px 60px',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
        position: 'sticky', top: 72, zIndex: 10,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => handleCategoryChange(cat)} style={{
            background: activeCategory === cat
              ? 'linear-gradient(135deg, var(--royal), var(--royal-dark))'
              : 'transparent',
            border: `1px solid ${activeCategory === cat ? 'transparent' : '#e0e0e0'}`,
            color: activeCategory === cat ? '#fff' : '#777',
            fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            fontFamily: 'var(--font)', padding: '9px 22px',
            borderRadius: 2, transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: activeCategory === cat ? '0 4px 16px rgba(30,27,107,0.25)' : 'none'
          }}
            onMouseEnter={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color       = 'var(--royal)';
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.color       = '#777';
              }
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
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: 'var(--gold)', fontSize: 36, marginBottom: 16 }}>◇</div>
            <div style={{ color: '#aaa', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
              No destinations in this category
            </div>
          </div>
        ) : (
          <div style={{
            opacity: gridVisible ? 1 : 0,
            transform: gridVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease'
          }}>
            <div style={{
              fontSize: 12, color: '#bbb', letterSpacing: 1,
              marginBottom: 32, textAlign: 'right',
              fontStyle: 'italic'
            }}>
              {destinations.length} destination{destinations.length > 1 ? 's' : ''} found
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 32
            }}>
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
