import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
    ArrowRight, MapPin, Shield, Award, Star,
    Heart, HandHeart, Gem, Telescope
} from 'lucide-react';

const VALUES = [
    {
        icon: <Gem size={20} />,
        title: 'Integrity',
        desc: 'We say what we mean and deliver what we promise — every time, no exceptions.',
    },
    {
        icon: <Award size={20} />,
        title: 'Excellence',
        desc: 'Mediocrity has no place here. Every detail of your journey is deliberate and refined.',
    },
    {
        icon: <HandHeart size={20} />,
        title: 'Empathy',
        desc: 'We listen first. Your dream trip begins with truly understanding who you are.',
    },
    {
        icon: <Telescope size={20} />,
        title: 'Discovery',
        desc: 'We uncover extraordinary places before they become mainstream — always ahead of the crowd.',
    },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Logo ring responsive

const AboutUs = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 700], ['0%', '22%']);

    return (
        <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg,#F9F7F4)', overflowX: 'hidden' }}>

            {/* ══ 1. HERO ══ */}
            <div ref={heroRef} className="relative flex items-end overflow-hidden"
                style={{ minHeight: '88vh', marginTop: -68, background: '#0D0B28' }}>

                <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.15 }}>
                    <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1800&q=80"
                        alt="" className="w-full h-full object-cover" />
                </motion.div>

                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: GRAIN, backgroundSize: '180px' }} />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, #0D0B28 0%, rgba(13,11,40,0.55) 55%, transparent 100%)' }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 60%)' }} />
                </div>

                {/* Texte hero */}
                <div className="relative w-full max-w-[1280px] mx-auto px-6 md:px-12 pb-24 pt-48">
                    <div className="max-w-3xl">
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-7"
                            style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.25)', fontFamily: 'var(--font-display)' }}>
                            ✦ About Us
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-bold text-white mb-7"
                            style={{ fontSize: 'clamp(44px, 7vw, 92px)', lineHeight: 1.03, letterSpacing: '-2px', fontFamily: 'var(--font-display)' }}>
                            We Don't<br />Book Trips.<br />
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We Design<br />Memories.</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.32 }}
                            style={{ color: 'rgba(255,255,255,0.52)', fontSize: 18, lineHeight: 1.8, maxWidth: 520, fontFamily: 'var(--font-display)' }}>
                            At Infinite Luxury Trips, every journey begins with a conversation —
                            and ends with a story worth telling for the rest of your life.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.48 }}
                            className="flex items-center gap-3 mt-10 flex-wrap">
                            <motion.button onClick={() => navigate('/destinations')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                                style={{ background: 'var(--gold)', color: '#0D0B28', fontFamily: 'var(--font-display)', boxShadow: '0 6px 28px rgba(245,166,35,0.28)' }}
                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                                Explore Destinations <ArrowRight size={14} />
                            </motion.button>
                            <motion.button onClick={() => navigate('/contact')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.78)', border: '1px solid rgba(255,255,255,0.14)', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}
                                whileHover={{ background: 'rgba(255,255,255,0.12)' } as any} whileTap={{ scale: 0.97 }}>
                                Talk to Us
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* ── LOGO HERO — responsive ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65, duration: 0.7 }}
                    className="absolute z-10 flex flex-col items-center gap-1.5"
                    style={{
                        /* Desktop : coin bas-droit */
                        bottom: '2.5rem',
                        right: '2rem',
                    }}>
                    {/* Styles responsive inline via media query */}
                    <style>{`
                        @media (max-width: 480px) {
                            .hero-logo-wrap {
                                bottom: 1.25rem !important;
                                right: 1rem !important;
                            }
                            .hero-logo-label {
                                display: none !important;
                            }
                        }
                        @media (min-width: 768px) {
                            .hero-logo-wrap {
                                bottom: 2.5rem !important;
                                right: 4rem !important;
                            }
                        }
                    `}</style>

                    {/* Conteneur avec classe utilitaire pour le ciblage CSS */}
                    <div className="hero-logo-wrap absolute z-10 flex flex-col items-center gap-1.5"
                        style={{ bottom: '1.5rem', right: '1.25rem' }}>

                        {/* Anneau + logo — taille fluide avec clamp */}
                        <div className="relative flex-shrink-0"
                            style={{
                                width:  'clamp(52px, 8vw, 82px)',
                                height: 'clamp(52px, 8vw, 82px)',
                            }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 rounded-full"
                                style={{ border: '1.5px dashed rgba(245,166,35,0.38)' }} />
                            <div className="absolute rounded-full"
                                style={{ inset: 'calc(7%)', border: '1px solid rgba(245,166,35,0.58)' }} />
                            <div className="absolute rounded-full"
                                style={{
                                    inset: 'calc(12%)',
                                    background: 'linear-gradient(135deg,#1A1650,#0D0B28)',
                                    boxShadow: '0 0 28px rgba(245,166,35,0.18)',
                                }} />
                            <img
                                src="/logoilt.jpeg"
                                alt="ILT"
                                className="absolute object-cover rounded-full"
                                style={{
                                    inset: 'calc(12%)',
                                    width: 'calc(76%)',
                                    height: 'calc(76%)',
                                }} />
                        </div>

                        {/* Label masqué sur très petit écran */}
                        <span
                            className="hero-logo-label"
                            style={{
                                color: 'rgba(255,255,255,0.28)',
                                fontSize: 'clamp(7px, 1.2vw, 9px)',
                                letterSpacing: '3px',
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                            }}>
                            Infinite Luxury Trips
                        </span>
                    </div>
                </motion.div>

            </div>

            {/* ══ 2. INTRO ÉDITORIALE ══ */}
            <section className="relative py-24 px-6 md:px-12 overflow-hidden" style={{ background: '#fff' }}>
                <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,166,35,0.35) 25%, rgba(245,166,35,0.35) 75%, transparent)' }} />

                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Sticky colonne gauche */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="lg:col-span-4 lg:sticky lg:top-28">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-6"
                                style={{ background: 'rgba(48,36,112,0.07)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.22)', fontFamily: 'var(--font-display)' }}>
                                ✦ Our Story
                            </div>
                            <h2 className="font-bold mb-5"
                                style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', color: 'var(--royal, #1E1B6B)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                                Who We<br />
                                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Really Are</span>
                            </h2>
                            <div style={{ width: 44, height: 2, background: 'linear-gradient(to right, var(--gold), rgba(245,166,35,0.2))', borderRadius: 2, marginBottom: 24 }} />
                            <div className="flex items-center gap-3 mt-2">
                                <div className="rounded-full overflow-hidden flex-shrink-0"
                                    style={{ width: 48, height: 48, border: '2px solid rgba(245,166,35,0.4)' }}>
                                    <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Infinite Luxury Trips</div>
                                    <div className="text-[10px]" style={{ color: 'rgba(0,0,0,0.38)', fontFamily: 'var(--font-display)' }}>Your Luxury Travel Partner</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Colonne droite — texte */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}
                            className="lg:col-span-8">
                            <div className="mb-6 overflow-hidden">
                                <span className="float-left font-extrabold leading-none mr-3"
                                    style={{ fontSize: 'clamp(72px, 9vw, 108px)', color: 'rgba(245,166,35,0.11)', fontFamily: 'var(--font-display)', lineHeight: 0.85, marginTop: 8 }}>
                                    A
                                </span>
                                <p style={{ fontSize: 19, lineHeight: 1.85, color: '#111', fontFamily: 'var(--font-display)', fontWeight: 400 }}>
                                    t Infinite Luxury Trips, we believe travel should be more than just a getaway —
                                    it should be an{' '}
                                    <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>unforgettable experience</em>.
                                    We specialize in curating exceptional journeys designed to inspire, indulge,
                                    and create lasting memories.
                                </p>
                            </div>
                            <div style={{ clear: 'both' }} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
                                <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(0,0,0,0.58)', fontFamily: 'var(--font-display)' }}>
                                    Our expertise lies in <strong style={{ color: 'var(--royal,#1E1B6B)', fontWeight: 600 }}>group travel</strong> —
                                    where every detail is thoughtfully planned to ensure a seamless, elevated experience.
                                    From the moment you reach out, a dedicated concierge handles everything so you
                                    can stay fully present.
                                </p>
                                <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(0,0,0,0.58)', fontFamily: 'var(--font-display)' }}>
                                    We pair every destination with immersive tours, private transfers, and handpicked
                                    experiences — whether you're exploring vibrant cultures, relaxing in breathtaking
                                    landscapes, or <strong style={{ color: 'var(--royal,#1E1B6B)', fontWeight: 600 }}>celebrating life's special moments</strong>.
                                </p>
                            </div>

                            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.55 }}
                                className="relative mt-10 p-8 rounded-2xl overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #0D0B28 0%, #1A1650 100%)' }}>
                                <div className="absolute top-3 right-5 font-extrabold select-none pointer-events-none"
                                    style={{ fontSize: 100, color: 'rgba(245,166,35,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>"</div>
                                <p className="relative"
                                    style={{ fontSize: 'clamp(16px, 2.2vw, 22px)', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.65, fontWeight: 500 }}>
                                    We don't just plan trips — we design personalized journeys that reflect
                                    your vision, your preferences, and your sense of adventure.
                                </p>
                                <div className="flex items-center gap-3 mt-5">
                                    <div style={{ width: 32, height: 2, background: 'var(--gold)', borderRadius: 2 }} />
                                    <span style={{ color: 'rgba(245,166,35,0.65)', fontSize: 10, letterSpacing: '2.5px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                                        The ILT Philosophy
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ 3. VALEURS + LOGO SUR PHOTO ══ */}
            <section className="relative py-24 px-6 md:px-12 overflow-hidden" style={{ background: 'var(--bg, #F9F7F4)' }}>
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Photo + logo superposé */}
                        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.7 }}
                            className="relative order-2 lg:order-1">
                            <div className="relative rounded-3xl overflow-hidden"
                                style={{ height: 'clamp(340px, 42vw, 520px)', boxShadow: '0 40px 100px rgba(13,11,40,0.18)' }}>
                                <img src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80"
                                    alt="ILT Experience" className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(13,11,40,0.52) 0%, rgba(13,11,40,0.08) 65%)' }} />
                                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                                    style={{ border: '1.5px solid rgba(245,166,35,0.14)' }} />

                                {/* Logo centré sur la photo */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                                    <div className="relative" style={{ width: 112, height: 112 }}>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 rounded-full"
                                            style={{ border: '1px dashed rgba(245,166,35,0.5)' }} />
                                        <div className="absolute rounded-full"
                                            style={{ inset: 7, border: '1.5px solid rgba(245,166,35,0.68)' }} />
                                        <div className="absolute rounded-full overflow-hidden"
                                            style={{ inset: 12, boxShadow: '0 0 56px rgba(245,166,35,0.28), 0 0 0 8px rgba(13,11,40,0.35)' }}>
                                            <img src="/logoilt.jpeg" alt="ILT Logo" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px]"
                                        style={{ background: 'rgba(245,166,35,0.92)', color: '#0D0B28', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}>
                                        Infinite Luxury Trips
                                    </div>
                                </div>
                            </div>

                            {/* Stat badge */}
                            <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.4 }}
                                className="absolute -bottom-6 -right-3 md:-right-7 rounded-2xl px-6 py-5"
                                style={{ background: '#0D0B28', border: '1.5px solid rgba(245,166,35,0.22)', boxShadow: '0 20px 56px rgba(0,0,0,0.28)' }}>
                                <div className="font-extrabold leading-none mb-1"
                                    style={{ fontSize: 36, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>98%</div>
                                <div className="text-xs font-semibold mb-2"
                                    style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-display)' }}>Satisfaction Rate</div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="var(--gold)" color="var(--gold)" />)}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Valeurs */}
                        <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.7 }}
                            className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5"
                                style={{ background: 'rgba(48,36,112,0.07)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.22)', fontFamily: 'var(--font-display)' }}>
                                ✦ Core Values
                            </div>
                            <h2 className="font-bold mb-4"
                                style={{ fontSize: 'clamp(28px, 4vw, 46px)', color: 'var(--royal, #1E1B6B)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                                The Principles That<br />
                                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Guide Every Journey</span>
                            </h2>
                            <div style={{ width: 44, height: 2, background: 'linear-gradient(to right, var(--gold), rgba(245,166,35,0.2))', borderRadius: 2, marginBottom: 20 }} />
                            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(0,0,0,0.52)', marginBottom: 28, fontFamily: 'var(--font-display)' }}>
                                With Infinite Luxury Trips, travel isn't just about where you go —
                                it's about how you experience it. These four values are the compass
                                behind every decision we make.
                            </p>
                            <div className="flex flex-col gap-3">
                                {VALUES.map(({ icon, title, desc }, i) => (
                                    <motion.div key={title}
                                        initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: 0.08 + i * 0.09, duration: 0.45 }}
                                        className="flex gap-4 p-4 rounded-xl transition-all duration-200"
                                        style={{ background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.11)', cursor: 'default' }}
                                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(245,166,35,0.08)'; el.style.borderColor = 'rgba(245,166,35,0.28)'; }}
                                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(245,166,35,0.04)'; el.style.borderColor = 'rgba(245,166,35,0.11)'; }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(13,11,40,0.07)', color: 'var(--gold)' }}>
                                            {icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--royal, #1E1B6B)', fontFamily: 'var(--font-display)' }}>{title}</div>
                                            <div className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.48)', fontFamily: 'var(--font-display)', lineHeight: 1.7 }}>{desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ 4. PROMESSE FINALE ══ */}
            <section className="relative overflow-hidden" style={{ minHeight: '58vh', display: 'flex', alignItems: 'center' }}>
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1600&q=80"
                        alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, rgba(13,11,40,0.72) 0%, rgba(30,27,107,0.48) 100%)' }} />
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: GRAIN, backgroundSize: '180px' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: 760, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 60%)' }} />
                </div>

                <div className="relative max-w-[840px] mx-auto text-center px-6 py-24 w-full">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7 }}>

                        {/* Logo — aussi responsive avec clamp */}
                        <div className="flex justify-center mb-8">
                            <div className="relative flex-shrink-0"
                                style={{ width: 'clamp(56px, 8vw, 72px)', height: 'clamp(56px, 8vw, 72px)' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: '1.5px dashed rgba(245,166,35,0.38)' }} />
                                <div className="absolute rounded-full" style={{ inset: '7%', border: '1px solid rgba(245,166,35,0.58)' }} />
                                <div className="absolute rounded-full"
                                    style={{ inset: '12%', background: 'linear-gradient(135deg,#1A1650,#0D0B28)', boxShadow: '0 0 28px rgba(245,166,35,0.2)' }} />
                                <img src="/logoilt.jpeg" alt="ILT" className="absolute object-cover rounded-full"
                                    style={{ inset: '12%', width: '76%', height: '76%' }} />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-7">
                            <div style={{ width: 48, height: 1, background: 'rgba(245,166,35,0.38)' }} />
                            <span style={{ color: 'rgba(245,166,35,0.65)', fontSize: 10, letterSpacing: '4px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                                Our Promise
                            </span>
                            <div style={{ width: 48, height: 1, background: 'rgba(245,166,35,0.38)' }} />
                        </div>

                        <h2 className="font-bold text-white mb-6"
                            style={{ fontSize: 'clamp(30px, 5vw, 60px)', fontFamily: 'var(--font-display)', lineHeight: 1.1, letterSpacing: '-1px' }}>
                            With Infinite Luxury Trips,<br />
                            Travel Isn't Just About<br />
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Where You Go.</span>
                        </h2>

                        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.52)', lineHeight: 1.85, maxWidth: 520, margin: '0 auto 40px', fontFamily: 'var(--font-display)' }}>
                            It's about how you experience it. Every detail, every moment, every memory —
                            crafted with intention, delivered with excellence.
                        </p>

                        <div className="flex gap-3 justify-center flex-wrap mb-10">
                            <motion.button onClick={() => navigate('/reservation')}
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm"
                                style={{ background: 'var(--gold)', color: '#0D0B28', fontFamily: 'var(--font-display)', boxShadow: '0 8px 32px rgba(245,166,35,0.32)' }}
                                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                                <MapPin size={15} /> Reserve Your Journey
                            </motion.button>
                            <motion.button onClick={() => navigate('/destinations')}
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.82)', border: '1.5px solid rgba(255,255,255,0.16)', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}
                                whileHover={{ background: 'rgba(255,255,255,0.12)' } as any} whileTap={{ scale: 0.97 }}>
                                Explore Destinations <ArrowRight size={14} />
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-center gap-5 flex-wrap">
                            {[
                                { icon: <Shield size={12} />, text: 'Secure Payments'     },
                                { icon: <Award  size={12} />, text: 'Verified Properties' },
                                { icon: <Star   size={12} />, text: '98% Satisfaction'    },
                                { icon: <Heart  size={12} />, text: 'Made with Love'      },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-1.5 text-xs"
                                    style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-display)' }}>
                                    <span style={{ color: 'var(--gold)' }}>{icon}</span> {text}
                                </div>
                            ))}
                        </div>

                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;