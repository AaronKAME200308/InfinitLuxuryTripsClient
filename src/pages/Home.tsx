import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedDestinations, useBlogPosts } from '../hooks';
import { useReveal, useCounter } from '../hooks/useAnimations';
import DestinationCard from '../components/DestinationCard';
import BlogCard from '../components/BlogCard';
import { GoldButton, OutlineButton, LoadingSpinner, SectionLabel, GoldDivider } from '../components/UI';

// ---- Gold particles flottantes ----
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top:  `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: `${Math.random() * 6}s`,
    duration: `${Math.random() * 4 + 5}s`,
    opacity: Math.random() * 0.4 + 0.1
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left, top: p.top,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'var(--gold)',
          opacity: p.opacity,
          animation: `particleDrift ${p.duration} ${p.delay} ease-in-out infinite`
        }}/>
      ))}
    </div>
  );
};

// ---- Stat item avec counter animé ----
const StatItem = ({ value, label, delay = 0 }) => {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState('0');
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        setTimeout(() => {
          el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          el.style.opacity    = '1';
          el.style.transform  = 'translateY(0)';

          // Extraire le numérique
          const raw     = value.replace(/\D/g, '');
          const suffix  = value.replace(/[\d,]/g, '');
          const target  = parseInt(raw);
          const startTs = performance.now();
          const dur     = 1800;

          const animate = (now) => {
            const p = Math.min((now - startTs) / dur, 1);
            const e = 1 - Math.pow(1 - p, 4);
            const n = Math.floor(e * target);
            setDisplayed(n.toLocaleString() + suffix);
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }, delay);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        color: 'var(--gold)', fontSize: 40, fontWeight: 600,
        letterSpacing: -1, lineHeight: 1,
        background: 'linear-gradient(135deg, var(--gold), var(--gold-light), var(--gold))',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer 3s linear infinite'
      }}>{displayed}</div>
      <div style={{
        color: 'rgba(255,255,255,0.45)', fontSize: 10,
        letterSpacing: 4, textTransform: 'uppercase', marginTop: 8
      }}>{label}</div>
    </div>
  );
};

// ---- Decorative section divider ----
const GoldOrnament = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '0 auto 48px' }}>
    <div style={{ height: 1, width: 80, background: 'linear-gradient(to right, transparent, var(--gold))' }}/>
    <div style={{
      width: 8, height: 8, border: '1px solid var(--gold)',
      transform: 'rotate(45deg)'
    }}/>
    <div style={{ height: 1, width: 80, background: 'linear-gradient(to left, transparent, var(--gold))' }}/>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const heroRef  = useRef(null);
  const heroImgRef = useRef(null);

  const { destinations, loading: destLoading } = useFeaturedDestinations(3);
  const { posts, loading: postsLoading }       = useBlogPosts(3);

  // Refs pour scroll reveal des sections
  const featuredRef  = useReveal({ threshold: 0.1 });
  const bannerRef    = useReveal({ threshold: 0.15 });
  const blogRef      = useReveal({ threshold: 0.1 });
  const ctaRef       = useReveal({ threshold: 0.2 });

  // Parallax sur le hero au scroll
  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;
    const onScroll = () => {
      img.style.transform = `scale(1.1) translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Texte hero animé lettre par lettre
  const heroText   = "The World's Most";
  const heroAccent = "Extraordinary Places";

  return (
    <div style={{ fontFamily: 'var(--font)', overflowX: 'hidden' }}>

      {/* ======= HERO ======= */}
      <section ref={heroRef} style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: -72
      }}>
        {/* Image Ken Burns */}
        <div ref={heroImgRef} style={{
          position: 'absolute', inset: '-10%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.42)',
          transform: 'scale(1.1)',
          transition: 'transform 0.1s linear',
          willChange: 'transform'
        }}/>

        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(30,27,107,0.3) 0%, rgba(13,13,13,0.65) 100%)'
        }}/>

        {/* Particules gold */}
        <Particles />

        {/* Contenu */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 920, padding: '0 40px', zIndex: 2 }}>

          {/* Badge animé */}
          <div className="hero-title" style={{ animationDelay: '0s' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              border: '1px solid rgba(201,168,76,0.4)', padding: '7px 24px', marginBottom: 36,
              color: 'var(--gold)', fontSize: 10, letterSpacing: 6, textTransform: 'uppercase',
              backdropFilter: 'blur(8px)', background: 'rgba(201,168,76,0.05)'
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulseRing 2s infinite' }}/>
              Curated Luxury Experiences
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulseRing 2s infinite 1s' }}/>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 300,
            color: 'var(--cream)', margin: '0 0 12px',
            lineHeight: 1.05, letterSpacing: -2,
            animation: 'heroReveal 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s both'
          }}>
            {heroText}<br/>
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light), var(--gold))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite'
            }}>{heroAccent}</span>
          </h1>

          <p className="hero-subtitle" style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 19, fontWeight: 300,
            maxWidth: 540, margin: '0 auto 52px', lineHeight: 1.75, letterSpacing: 0.3
          }}>
            Beyond destinations — we curate immersive experiences in the world's most
            breathtaking locations, crafted for those who seek the exceptional.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GoldButton onClick={() => navigate('/destinations')}>
              Explore Destinations
            </GoldButton>
            <OutlineButton onClick={() => navigate('/reservation')} color="rgba(255,255,255,0.55)">
              Reserve a Stay
            </OutlineButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)', textAlign: 'center', zIndex: 2
        }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 5, marginBottom: 10 }}>
            SCROLL
          </div>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, var(--gold), transparent)', margin: '0 auto' }}/>
        </div>

        {/* Diagonal bottom */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0,
          height: 100,
          background: 'var(--cream)',
          clipPath: 'polygon(0 100%, 100% 40%, 100% 100%)'
        }}/>
      </section>

      {/* ======= STATS ======= */}
      <section style={{
        background: 'var(--royal-dark)', padding: '52px 60px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)'
        }}/>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap',
          maxWidth: 900, margin: '0 auto'
        }}>
          {[
            { value: '120+', label: 'Destinations',      delay: 0   },
            { value: '4800+', label: 'Happy Travelers',  delay: 150 },
            { value: '98+',  label: 'Satisfaction %',    delay: 300 },
            { value: '15+',  label: 'Years Excellence',  delay: 450 }
          ].map(s => <StatItem key={s.label} {...s} />)}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)'
        }}/>
      </section>

      {/* ======= FEATURED DESTINATIONS ======= */}
      <section style={{ background: 'var(--cream)', padding: '100px 60px' }}>
        <div ref={featuredRef} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>Handpicked for You</SectionLabel>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: 'var(--dark)', margin: '0 0 0', letterSpacing: -1 }}>
            Featured <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Destinations</span>
          </h2>
          <GoldDivider />
        </div>

        {destLoading ? <LoadingSpinner /> : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: 32, maxWidth: 1200, margin: '0 auto'
          }}>
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} dest={dest} index={i} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <OutlineButton onClick={() => navigate('/destinations')}>
            View All Destinations
          </OutlineButton>
        </div>
      </section>

      {/* ======= EXPERIENCE BANNER ======= */}
      <section ref={bannerRef} className="reveal" style={{
        position: 'relative', padding: '120px 60px', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.28)'
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,27,107,0.6), rgba(13,13,13,0.7))'
        }}/>
        <Particles />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 720, margin: '0 auto', zIndex: 2 }}>
          <SectionLabel>The ILT Promise</SectionLabel>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: 'var(--cream)', margin: '0 0 24px', lineHeight: 1.2 }}>
            Every Journey Crafted to<br/>
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>Perfection</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 17, lineHeight: 1.85, marginBottom: 56 }}>
            We don't just book trips. We architect memories — selecting only the finest properties,
            most enriching experiences, and hidden gems that only our clients discover.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 56, flexWrap: 'wrap' }}>
            {[
              { icon: '◆', label: 'Private Concierge',  sub: 'Dedicated to you 24/7' },
              { icon: '◈', label: 'Exclusive Access',    sub: 'Beyond the ordinary' },
              { icon: '◇', label: '24/7 Support',        sub: 'Always by your side' }
            ].map((f, i) => (
              <div key={f.label} style={{
                textAlign: 'center',
                animation: `fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s both`
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: '1px solid rgba(201,168,76,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px', fontSize: 20, color: 'var(--gold)',
                  background: 'rgba(201,168,76,0.06)',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.transform   = 'scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background   = 'rgba(201,168,76,0.06)';
                    e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.4)';
                    e.currentTarget.style.transform    = 'scale(1)';
                  }}
                >{f.icon}</div>
                <div style={{ color: 'var(--cream)', fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>{f.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= BLOG ======= */}
      <section style={{ background: 'var(--light-gray)', padding: '100px 60px' }}>
        <div ref={blogRef} className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>Insights & Stories</SectionLabel>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 300, color: 'var(--dark)', margin: 0 }}>
            The <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>ILT Journal</span>
          </h2>
          <GoldDivider />
        </div>

        {postsLoading ? <LoadingSpinner /> : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 32, maxWidth: 1200, margin: '0 auto'
          }}>
            {posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <OutlineButton onClick={() => navigate('/blog')}>Read All Articles</OutlineButton>
        </div>
      </section>

      {/* ======= CTA FINAL ======= */}
      <section ref={ctaRef} className="reveal" style={{
        background: 'var(--royal-dark)', padding: '88px 60px', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}/>
        <GoldOrnament />
        <SectionLabel>Begin Your Journey</SectionLabel>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, color: 'var(--cream)', margin: '0 0 20px' }}>
          Ready for Your Next<br/>
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Extraordinary Experience?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 44, maxWidth: 460, margin: '0 auto 44px' }}>
          Our concierge team is available 24/7 to craft your perfect escape.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldButton onClick={() => navigate('/reservation')}>Reserve Now</GoldButton>
          <OutlineButton onClick={() => navigate('/contact')} color="rgba(255,255,255,0.45)">
            Contact Concierge
          </OutlineButton>
        </div>
      </section>

    </div>
  );
};

export default Home;
