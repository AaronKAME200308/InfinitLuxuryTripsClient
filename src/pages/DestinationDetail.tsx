import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestination, useReviews } from '../hooks';
import { StarRating, LoadingSpinner, ErrorMessage, RoyalButton, OutlineButton } from '../components/UI';

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate]     = useState('');
  const [guests, setGuests] = useState('2');

  // Essaie par slug d'abord, sinon par id
  const isUUID = /^[0-9a-f-]{36}$/.test(id || '');
  const { destination: dest, loading, error } = useDestination(id || '', !isUUID);
  const { reviews } = useReviews(dest?.id);

  const handleReserve = () => {
    navigate('/reservation', {
      state: { destinationId: dest.id, destinationName: dest.name, price: dest.price, date, guests }
    });
  };

  if (loading) return <LoadingSpinner message="Loading destination" />;
  if (error || !dest) return <ErrorMessage message={error || 'Destination not found'} />;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>

      {/* ---- Hero ---- */}
      <div style={{ position: 'relative', height: 580, overflow: 'hidden' }}>
        <img src={dest.image_url} alt={dest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,13,13,0.82) 0%, rgba(0,0,0,0.08) 55%)'
        }}/>
        {/* Back button */}
        <button onClick={() => navigate('/destinations')} style={{
          position: 'absolute', top: 32, left: 48,
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff', padding: '10px 20px', borderRadius: 2, cursor: 'pointer',
          fontSize: 12, letterSpacing: 2, fontFamily: 'var(--font)',
          backdropFilter: 'blur(8px)'
        }}>← Back</button>

        <div style={{ position: 'absolute', bottom: 52, left: 60 }}>
          <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 14 }}>
            {dest.category}
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 300,
            color: 'var(--cream)', margin: '0 0 18px', letterSpacing: -2
          }}>{dest.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StarRating rating={dest.rating} size={18} />
            <span style={{ color: '#ddd', fontSize: 15 }}>
              {dest.rating} · {dest.reviews_count} reviews
            </span>
          </div>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64 }}>

          {/* LEFT COLUMN */}
          <div>
            {/* About */}
            <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 18 }}>
              About This Destination
            </div>
            <p style={{ fontSize: 19, color: '#333', lineHeight: 1.85, marginBottom: 48, fontWeight: 300 }}>
              {dest.description}
            </p>

            {/* Inclusions */}
            {dest.inclusions && dest.inclusions.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
                  What's Included
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {dest.inclusions.map((item: string) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--gold)', flexShrink: 0, marginTop: 7
                      }}/>
                      <span style={{ fontSize: 15, color: '#555', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {dest.tags && dest.tags.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>
                  Highlights
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {dest.tags.map((tag: string) => (
                    <span key={tag} style={{
                      fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                      color: 'var(--royal)', background: 'rgba(30,27,107,0.07)',
                      border: '1px solid rgba(30,27,107,0.12)',
                      padding: '9px 18px', borderRadius: 2
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <div>
                <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
                  Guest Reviews
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {reviews.map(review => (
                    <div key={review.id} style={{
                      background: '#fff', padding: 24, borderRadius: 4,
                      borderLeft: '3px solid var(--gold)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--dark)' }}>{review.client_name}</div>
                          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                            {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={13} />
                      </div>
                      <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: 0 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Box */}
          <div style={{
            background: '#fff', borderRadius: 4, padding: 36,
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            alignSelf: 'start', position: 'sticky', top: 96
          }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ color: '#999', fontSize: 13, marginBottom: 6 }}>Starting from</div>
              <div style={{ fontSize: 52, fontWeight: 600, color: 'var(--royal)', lineHeight: 1 }}>
                ${Number(dest.price).toLocaleString()}
              </div>
              <div style={{ color: '#bbb', fontSize: 13 }}>per person</div>
            </div>
            <div style={{ height: 1, background: '#eee', marginBottom: 28 }}/>

            {/* Date */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>
                Travel Date
              </label>
              <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={{
                width: '100%', padding: '12px 16px', border: '1px solid #ddd',
                borderRadius: 2, fontSize: 15, fontFamily: 'var(--font)', boxSizing: 'border-box'
              }}/>
            </div>

            {/* Guests */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 8 }}>
                Guests
              </label>
              <select value={guests} onChange={e => setGuests(e.target.value)} style={{
                width: '100%', padding: '12px 16px', border: '1px solid #ddd',
                borderRadius: 2, fontSize: 15, fontFamily: 'var(--font)', background: '#fff', boxSizing: 'border-box'
              }}>
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <RoyalButton onClick={handleReserve} fullWidth>
              Reserve This Experience
            </RoyalButton>
            <div style={{ marginTop: 12 }}>
              <OutlineButton onClick={() => navigate('/contact')} fullWidth color="var(--gold)">
                Ask a Concierge
              </OutlineButton>
            </div>

            <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
              Payment via Zelle or Stripe · No hidden fees<br/>Free cancellation within 48h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
