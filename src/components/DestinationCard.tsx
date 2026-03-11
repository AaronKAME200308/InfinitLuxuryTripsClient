import { useNavigate } from 'react-router-dom';
import { StarRating } from './UI';

const DestinationCard = ({ dest }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/destinations/${dest.slug || dest.id}`)}
      style={{
        borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        fontFamily: 'var(--font)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <img
          src={dest.image_url}
          alt={dest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(30,27,107,0.88)', color: 'var(--gold)',
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          padding: '5px 12px', borderRadius: 2
        }}>{dest.category}</div>

        {/* Price badge */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          color: 'var(--dark)', fontSize: 13, fontWeight: 700,
          padding: '5px 14px', borderRadius: 2
        }}>from ${Number(dest.price).toLocaleString()}</div>

        {/* Featured ribbon */}
        {dest.featured && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(30,27,107,0.7), transparent)',
            padding: '20px 16px 10px',
            color: 'rgba(255,255,255,0.8)', fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase', textAlign: 'right'
          }}>★ Featured</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: 22, fontWeight: 500, color: 'var(--dark)',
          margin: '0 0 10px', letterSpacing: -0.5
        }}>{dest.name}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <StarRating rating={dest.rating} />
          <span style={{ fontSize: 12, color: '#888' }}>
            {dest.rating} · {dest.reviews_count} reviews
          </span>
        </div>

        {dest.tags && dest.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {dest.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--royal)', background: 'rgba(30,27,107,0.07)',
                padding: '4px 10px', borderRadius: 2
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
