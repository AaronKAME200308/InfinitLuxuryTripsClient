import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, Star,
  ArrowRight, ChevronRight, ChevronLeft, Sparkles, X
} from 'lucide-react';
import { useDestinations, useCategories } from '../hooks';
import DestinationCard from '../components/DestinationCard';
import { LoadingSpinner, ErrorMessage } from '../components/UI';

const Destinations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState(searchParams.get('q') ?? '');
  const [slideIndex,     setSlideIndex]     = useState(0);
  const [heroHovered,    setHeroHovered]    = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false); // mobile: search expanded
  const heroRef = useRef<HTMLDivElement>(null);

  const { destinations, loading, error } = useDestinations(
    activeCategory === 'All' ? null : activeCategory
  );
  const { categories } = useCategories();

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], ['0%', '18%']);

  const upcoming = destinations.filter((d: any) => d.state === 'upcoming');

  // Auto-avance carrousel
  useEffect(() => {
    if (upcoming.length <= 1) return;
    const t = setInterval(() => setSlideIndex(i => (i + 1) % upcoming.length), 5000);
    return () => clearInterval(t);
  }, [upcoming.length]);

  useEffect(() => { setSlideIndex(0); }, [upcoming.length]);

  const hero = upcoming[slideIndex] ?? null;

  const grid = destinations.filter((d: any) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Swipe touch pour le carrousel
  const touchStartX = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return; // ignore petits mouvements
    if (dx < 0) setSlideIndex(i => (i + 1) % upcoming.length);
    else        setSlideIndex(i => (i - 1 + upcoming.length) % upcoming.length);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

      {/* ════════════════ HERO / CAROUSEL — upcoming only ════════════════ */}
      {hero && !loading && (
        <div
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ height: 580 }}
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
          onTouchStart={upcoming.length > 1 ? handleTouchStart : undefined}
          onTouchEnd={upcoming.length > 1 ? handleTouchEnd   : undefined}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={hero.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => navigate(`/destinations/${hero.slug || hero.id}`)}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${hero.image_url})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  y: bgY, scale: 1.1,
                }}
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(20,17,58,0.96) 0%, rgba(20,17,58,0.25) 55%, transparent 100%)' }} />

              {/* TOP badges */}
              <motion.div
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute top-24 left-6 right-6 max-w-[1280px] mx-auto flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    <Sparkles size={10} /> Upcoming Trip
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(48,36,112,0.75)', color: '#fff', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}>
                    <MapPin size={9} style={{ color: 'var(--gold)' }} /> {hero.category}
                  </div>
                  {upcoming.length > 1 && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}>
                      {slideIndex + 1} / {upcoming.length}
                    </div>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="px-4 py-2 rounded-xl text-sm font-extrabold flex-shrink-0"
                  style={{ background: 'var(--surface)', color: 'var(--gold-hover)', fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: '1.5px solid var(--gold-border)' }}>
                  from ${Number(hero.price).toLocaleString()}
                </motion.div>
              </motion.div>

              {/* BOTTOM content */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
                <div className="max-w-[1280px] mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h1 className="font-bold text-white mb-3"
                      style={{ fontSize: 'clamp(28px, 5vw, 58px)', fontFamily: 'var(--font-display)', lineHeight: 1.1, maxWidth: 700 }}>
                      {hero.name}
                    </h1>
                    <p className="text-sm mb-5"
                      style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 520 }}>
                      {hero.description?.slice(0, 160)}...
                    </p>
                    <div className="flex items-center gap-4 flex-wrap mb-6">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={13}
                              fill={i <= Math.floor(hero.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}
                              color={i <= Math.floor(hero.rating) ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-white">{hero.rating}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>({hero.reviews_count} reviews)</span>
                      </div>
                      {hero.tags?.slice(0, 3).map((tag: string) => (
                        <div key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                        style={{ background: 'var(--gold)', color: 'var(--royal)', fontFamily: 'var(--font-display)', boxShadow: '0 4px 16px rgba(245,166,35,0.4)' }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        Discover this destination <ArrowRight size={14} />
                      </motion.div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate('/contact', { state: { destinationId: hero.id, destinationName: hero.name, price: hero.price } }); }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                        Reserve Now
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Boutons slider — desktop hover only, cachés sur mobile ── */}
          {upcoming.length > 1 && (
            <>
              <AnimatePresence>
                {heroHovered && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      onClick={e => { e.stopPropagation(); setSlideIndex(i => (i - 1 + upcoming.length) % upcoming.length); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full
                                 items-center justify-center hidden md:flex"
                      style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', color: '#fff', backdropFilter: 'blur(8px)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.26)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}>
                      <ChevronLeft size={20} />
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      onClick={e => { e.stopPropagation(); setSlideIndex(i => (i + 1) % upcoming.length); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full
                                 items-center justify-center hidden md:flex"
                      style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', color: '#fff', backdropFilter: 'blur(8px)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.26)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}>
                      <ChevronRight size={20} />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>

              {/* Dots — toujours visibles */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {upcoming.map((_: any, i: number) => (
                  <button key={i}
                    onClick={e => { e.stopPropagation(); setSlideIndex(i); }}
                    className="transition-all duration-300 rounded-full"
                    style={{ width: i === slideIndex ? 24 : 7, height: 7, background: i === slideIndex ? 'var(--gold)' : 'rgba(255,255,255,0.4)' }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════════════ Filter bar sticky ════════════════ */}
      <div className="sticky z-10"
        style={{ top: 68, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(48,36,112,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">

          {/* ── Search — desktop: toujours visible | mobile: icône → input ── */}

          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--royal-border)', minWidth: 200 }}>
            <Search size={13} style={{ color: 'var(--royal)', flexShrink: 0 }} />
            <input type="text" placeholder="Search destinations..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }} />
          </div>

          {/* Mobile search — icône → input expand */}
          <div className="md:hidden flex items-center">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-open"
                  initial={{ width: 36, opacity: 0 }} animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 36, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--royal)', minWidth: 0 }}>
                  <Search size={13} style={{ color: 'var(--royal)', flexShrink: 0 }} />
                  <input
                    autoFocus
                    type="text" placeholder="Search..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm border-none outline-none flex-1 min-w-0"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }} />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <X size={13} style={{ color: 'var(--text-3)' }} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-closed"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <Search size={15} style={{ color: 'var(--royal)' }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: 'var(--border)' }} />

          {/* Category pills */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 flex-nowrap">
              {categories.map((cat: string) => (
                <motion.button key={cat} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: activeCategory === cat ? 'var(--royal)' : 'transparent',
                    color:      activeCategory === cat ? '#fff'         : 'var(--text-2)',
                    border:     `1.5px solid ${activeCategory === cat ? 'var(--royal)' : 'var(--royal-border)'}`,
                    fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
                  }}>
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Count */}
          {!loading && !error && (
            <div className="text-xs hidden md:block flex-shrink-0" style={{ color: 'var(--text-3)' }}>
              <span className="font-bold" style={{ color: 'var(--royal)' }}>{grid.length}</span>
              {' '}destination{grid.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════ Grid ════════════════ */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading destinations" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : grid.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-24">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
              <SlidersHorizontal size={22} style={{ color: 'var(--royal)' }} />
            </div>
            {searchQuery ? (
              <>
                <div className="font-bold text-base mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  "{searchQuery}" n'est pas encore proposée
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--text-3)' }}>
                  Cette destination n'est pas encore dans notre catalogue.
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
                  Contactez notre concierge — nous pouvons organiser des voyages sur mesure partout dans le monde.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={() => { setSearchQuery(''); }}
                    className="btn-outline text-xs" style={{ padding: '8px 18px' }}>
                    Voir toutes les destinations
                  </button>
                  <button onClick={() => navigate('/contact')}
                    className="btn-royal text-xs" style={{ padding: '8px 18px' }}>
                    Contacter le concierge
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-sm mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  No results found
                </div>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Try a different category or search term.</p>
                <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="btn-royal mt-5 text-xs" style={{ padding: '8px 18px' }}>
                  Reset filters
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-7">
              <div className="h-0.5 w-6 rounded-full" style={{ background: 'var(--gold)' }} />
              <span className="text-xs font-bold uppercase tracking-[2.5px]"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                All Destinations
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {grid.map((dest: any, i: number) => (
                  <motion.div key={dest.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}>
                    <DestinationCard dest={dest} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;