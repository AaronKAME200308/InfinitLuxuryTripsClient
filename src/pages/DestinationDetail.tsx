import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestination, useReviews } from '../hooks';
import { useReveal } from '../hooks/useAnimations';
import { StarRating, LoadingSpinner, ErrorMessage, GoldButton, RoyalButton, OutlineButton } from '../components/UI';

const DestinationDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [date, setDate]     = useState('');
  const [guests, setGuests] = useState('2');
  const heroImgRef = useRef(null);

  const isUUID = /^[0-9a-f-]{36}$/.test(id);
  const { destination: dest, loading, error } = useDestination(id, !isUUID);
  const { reviews } = useReviews(dest?.id);

  const contentRef = useReveal({ threshold: 0.1 });
  const reviewsRef = useReveal({ threshold: 0.1 });

  // Parallax hero
  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;
    const onScroll = () => {
      img.style.transform = `scale(1.1) translateY(${window.scrollY * 0.2}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleReserve = () => navigate('/reservation', {
    state: { destinationId: dest.id, destinationName: dest.name, price: dest.price, date, guests }
  });

  if (loading) return <LoadingSpinner message="Loading destination" />;
  if (error || !dest) return <ErrorMessage message={error || 'Destination not found'} />;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'var(--font)' }}>

      {/* ---- Hero avec parallax ---- */}
      <div style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
        <div ref={heroImgRef} style={{
          position: 'absolute', inset: '-10%',
          backgroundImage: `url(${dest.image_url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.48)',
          transform: 'scale(1.1)',
          transition: 'transform 0.1s linear',
          willChange: 'transform'
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, rgba(0,0,0,0.1) 55%)'
        }}/>

        {/* Back button */}
        <button onClick={() => navigate('/destinations')} style={{
          position: 'absolute', top: 32, left: 48,
          background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', padding: '10px 22px', borderRadius: 2,
          fontSize: 11, letterSpacing: 3, fontFamily: 'var(--font)',
          backdropFilter: 'blur(10px)', transition: 'all 0.3s'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background    = 'rgba(201,168,76,0.2)';
            e.currentTarget.style.borderColor   = 'var(--gold)';
            e.currentTarget.style.color         = 'var(--gold)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background    = 'rgba(0,0,0,0.4)';
            e.currentTarget.style.borderColor   = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.color         = '#fff';
          }}
        >← Back</button>

        {/* Hero content */}
        <div style={{
          position: 'absolute', bottom: 56, left: 60,
          animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(19,16,74,0.85)', backdropFilter: 'blur(8px)',
            color: 'var(--gold)', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 2, marginBottom: 16,
            border: '1px solid rgba(201,168,76,0.2)'
          }}>{dest.category}</div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 300,
            color: 'var(--cream)', margin: '0 0 20px', letterSpacing: -2
          }}>{dest.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StarRating rating={dest.rating} size={18} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {dest.rating} · {dest.reviews_count} reviews
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 600 }}>
              from ${Number(dest.price).toLocaleString()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>/person</span>
          </div>
        </div>

        {/* Diagonal cut */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: 80,
          background: 'var(--cream)',
          clipPath: 'polygon(0 100%, 100% 30%, 100% 100%)'
        }}/>
      </div>

      {/* ---- Content ---- */}
      <div ref={contentRef} className="reveal" style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64 }}>

          {/* LEFT */}
          <div>
            {/* About */}
            <div style={{ marginBottom: 48 }}>
              <div style={{
                color: 'var(--gold)', fontSize: 10, letterSpacing: 5,
                textTransform: 'uppercase', marginBottom: 18,
                display: 'flex', alignItems: 'center', gap: 16
              }}>
                <span>About This Destination</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }}/>
              </div>
              <p style={{ fontSize: 19, color: '#333', lineHeight: 1.9, fontWeight: 300 }}>
                {dest.description}
              </p>
            </div>

            {/* Inclusions */}
            {dest.inclusions?.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{
                  color: 'var(--gold)', fontSize: 10, letterSpacing: 5,
                  textTransform: 'uppercase', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 16
                }}>
                  <span>What's Included</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {dest.inclusions.map((item, i) => (
                    <div key={item} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 16px',
                      background: i % 2 === 0 ? 'rgba(30,27,107,0.03)' : 'transparent',
                      borderRadius: 3, border: '1px solid rgba(201,168,76,0.08)',
                      transition: 'all 0.3s'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background   = 'rgba(201,168,76,0.06)';
                        e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background   = i % 2 === 0 ? 'rgba(30,27,107,0.03)' : 'transparent';
                        e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.08)';
                      }}
                    >
                      <div style={{ color: 'var(--gold)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>◆</div>
                      <span style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {dest.tags?.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div style={{
                  color: 'var(--gold)', fontSize: 10, letterSpacing: 5,
                  textTransform: 'uppercase', marginBottom: 18,
                  display: 'flex', alignItems: 'center', gap: 16
                }}>
                  <span>Highlights</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }}/>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {dest.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                      color: 'var(--royal)', background: 'rgba(30,27,107,0.06)',
                      border: '1px solid rgba(30,27,107,0.12)',
                      padding: '10px 18px', borderRadius: 2,
                      transition: 'all 0.3s'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background   = 'var(--royal)';
                        e.currentTarget.style.color        = '#fff';
                        e.currentTarget.style.borderColor  = 'var(--royal)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background   = 'rgba(30,27,107,0.06)';
                        e.currentTarget.style.color        = 'var(--royal)';
                        e.currentTarget.style.borderColor  = 'rgba(30,27,107,0.12)';
                      }}
                    >{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews?.length > 0 && (
              <div ref={reviewsRef} className="reveal">
                <div style={{
                  color: 'var(--gold)', fontSize: 10, letterSpacing: 5,
                  textTransform: 'uppercase', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 16
                }}>
                  <span>Guest Reviews</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.4), transparent)' }}/>
                </div>
                {reviews.map((review, i) => (
                  <div key={review.id} style={{
                    background: '#fff', padding: '24px 28px', borderRadius: 4,
                    borderLeft: '3px solid var(--gold)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                    marginBottom: 16,
                    animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both`,
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform  = 'translateX(4px)';
                      e.currentTarget.style.boxShadow  = '0 8px 32px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform  = 'translateX(0)';
                      e.currentTarget.style.boxShadow  = '0 2px 16px rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--dark)' }}>{review.client_name}</div>
                        <div style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>
                          {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, margin: 0 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Booking box */}
          <div style={{
            background: '#fff', borderRadius: 4, padding: 36,
            boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            alignSelf: 'start', position: 'sticky', top: 96,
            animation: 'slideRight 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both'
          }}>
            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ color: '#bbb', fontSize: 12, marginBottom: 6 }}>Starting from</div>
              <div style={{
                fontSize: 52, fontWeight: 600, color: 'var(--royal)', lineHeight: 1,
                background: 'linear-gradient(135deg, var(--royal), #3730a3)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                ${Number(dest.price).toLocaleString()}
              </div>
              <div style={{ color: '#ccc', fontSize: 13 }}>per person</div>
            </div>

            {/* Decorative line */}
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, var(--gold), transparent)', marginBottom: 24 }}/>

            {/* Date */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 8 }}>
                Travel Date
              </label>
              <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={{
                width: '100%', padding: '12px 16px', border: '1px solid #eee',
                borderRadius: 2, fontSize: 15, fontFamily: 'var(--font)', boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}/>
            </div>

            {/* Guests */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: 8 }}>
                Guests
              </label>
              <select value={guests} onChange={e => setGuests(e.target.value)} style={{
                width: '100%', padding: '12px 16px', border: '1px solid #eee',
                borderRadius: 2, fontSize: 15, fontFamily: 'var(--font)',
                background: '#fff', boxSizing: 'border-box'
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

            <p style={{ fontSize: 11, color: '#ccc', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
              ⚡ Zelle · 💳 Stripe · No hidden fees<br/>Free cancellation within 48h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
