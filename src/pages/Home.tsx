import { useNavigate } from 'react-router-dom';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import BlogCard from '../components/BlogCard';
import {
  GoldDivider, SectionLabel, GoldButton,
  OutlineButton, LoadingSpinner
} from '../components/UI';

const Home = () => {
  const navigate = useNavigate();
  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts, loading: postsLoading } = useBlogPosts(3);

  return (
    <div style={{ fontFamily: 'var(--font)' }}>

      {/* ================================ HERO ================================ */}
      <section style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: -72  // compense le padding-top du main
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.42)'
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(30,27,107,0.25) 0%, rgba(13,13,13,0.65) 100%)'
        }}/>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 900, padding: '0 40px' }}>
          <div style={{
            display: 'inline-block',
            border: '1px solid var(--gold)', padding: '6px 22px', marginBottom: 32,
            color: 'var(--gold)', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase'
          }}>Curated Luxury Experiences</div>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 300,
            color: 'var(--cream)', margin: '0 0 20px',
            lineHeight: 1.05, letterSpacing: -2
          }}>
            The World's Most<br/>
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Extraordinary</span> Places
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.62)', fontSize: 19, fontWeight: 300,
            maxWidth: 560, margin: '0 auto 52px', lineHeight: 1.7, letterSpacing: 0.3
          }}>
            Beyond destinations — we curate immersive experiences in the world's most
            breathtaking locations, crafted for those who seek the exceptional.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldButton onClick={() => navigate('/destinations')}>
              Explore Destinations
            </GoldButton>
            <OutlineButton
              onClick={() => navigate('/reservation')}
              color="rgba(255,255,255,0.6)"
            >Reserve a Stay</OutlineButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: 4, marginBottom: 8 }}>SCROLL</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto' }}/>
        </div>
      </section>

      {/* ================================ STATS ================================ */}
      <section style={{
        background: 'var(--royal-dark)', padding: '36px 60px',
        display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap',
        borderBottom: '1px solid rgba(201,168,76,0.15)'
      }}>
        {[
          ['120+', 'Destinations'],
          ['4,800+', 'Happy Travelers'],
          ['98%', 'Satisfaction Rate'],
          ['15+', 'Years of Excellence']
        ].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--gold)', fontSize: 36, fontWeight: 600, letterSpacing: -1 }}>{n}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* ================================ FEATURED DESTINATIONS ================================ */}
      <section style={{ background: 'var(--cream)', padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>Handpicked for You</SectionLabel>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: 'var(--dark)', margin: 0, letterSpacing: -1 }}>
            Featured <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Destinations</span>
          </h2>
          <GoldDivider />
        </div>

        {destLoading ? (
          <LoadingSpinner message="Loading destinations" />
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28, maxWidth: 1200, margin: '0 auto'
          }}>
            {destinations.map(dest => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <OutlineButton onClick={() => navigate('/destinations')}>
            View All Destinations
          </OutlineButton>
        </div>
      </section>

      {/* ================================ EXPERIENCE BANNER ================================ */}
      <section style={{ position: 'relative', padding: '120px 60px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.28)'
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,107,0.55), rgba(13,13,13,0.65))'
        }}/>
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <SectionLabel>The ILT Promise</SectionLabel>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: 'var(--cream)', margin: '0 0 24px', lineHeight: 1.2 }}>
            Every Journey Crafted to<br/>
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Perfection</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 17, lineHeight: 1.85, marginBottom: 52 }}>
            We don't just book trips. We architect memories — selecting only the finest properties,
            most enriching experiences, and hidden gems that only our clients discover.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
            {['Private Concierge', 'Exclusive Access', '24/7 Support'].map(f => (
              <div key={f} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  border: '1px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px'
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-light))' }}/>
                </div>
                <div style={{ color: 'var(--cream)', fontSize: 14, letterSpacing: 1 }}>{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ BLOG PREVIEW ================================ */}
      <section style={{ background: 'var(--light-gray)', padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>Insights & Stories</SectionLabel>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: 'var(--dark)', margin: 0 }}>
            The <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>ILT Journal</span>
          </h2>
          <GoldDivider />
        </div>

        {postsLoading ? (
          <LoadingSpinner message="Loading articles" />
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32, maxWidth: 1200, margin: '0 auto'
          }}>
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <OutlineButton onClick={() => navigate('/blog')}>
            Read All Articles
          </OutlineButton>
        </div>
      </section>

      {/* ================================ CTA FINAL ================================ */}
      <section style={{
        background: 'var(--royal-dark)', padding: '80px 60px', textAlign: 'center'
      }}>
        <SectionLabel>Begin Your Journey</SectionLabel>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: 'var(--cream)', margin: '0 0 20px' }}>
          Ready for Your Next<br/>
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Extraordinary Experience?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Our concierge team is available 24/7 to craft your perfect escape.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldButton onClick={() => navigate('/reservation')}>Reserve Now</GoldButton>
          <OutlineButton onClick={() => navigate('/contact')} color="rgba(255,255,255,0.5)">
            Contact Concierge
          </OutlineButton>
        </div>
      </section>
    </div>
  );
};

export default Home;
