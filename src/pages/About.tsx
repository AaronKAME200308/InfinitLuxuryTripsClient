import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, MapPin, Shield, Award, Star, Heart } from 'lucide-react';

const PILLARS = [
    { num: '01', icon: '🌍', title: 'Exotic Destinations', accent: '#C9A84C', body: 'We hand-select every location — from private Caribbean islands to the ancient temples of Kyoto. Our portfolio covers over 30 destinations across 5 continents, each chosen for its extraordinary character and ability to create genuine wonder.' },
    { num: '02', icon: '👥', title: 'Group Specialists', accent: '#7B61FF', body: "Group travel is our DNA. Whether you're celebrating a milestone birthday, planning a corporate retreat, or organizing a family reunion, we thrive on the complexity that groups bring — and we make it look effortless." },
    { num: '03', icon: '🎧', title: 'Dedicated Concierge', accent: '#C9A84C', body: "Your personal concierge is available around the clock — not a chatbot, not a queue. A real human expert who knows your preferences, anticipates your needs, and is reachable at 3am if you need them." },
    { num: '04', icon: '✨', title: 'Curated Journeys', accent: '#7B61FF', body: "We don't sell packages. We architect experiences. Every itinerary is built from scratch around your vision — the rhythm of your days, the moments you want to feel, the memories you want to carry home." },
    { num: '05', icon: '🔒', title: 'Secure & Transparent', accent: '#C9A84C', body: 'Zero hidden fees. Zero surprises. Pay via Stripe or Zelle with full fraud protection and instant confirmation. Our pricing is all-inclusive and every cost is communicated upfront, always.' },
    { num: '06', icon: '❤️', title: 'Immersive Transfers', accent: '#7B61FF', body: 'Getting there is part of the experience. We pair every destination with handpicked local guides, private vehicles, and curated stops that turn every transit into an adventure in itself.' },
];


const VALUES = [
    { icon: '✦', title: 'Integrity', desc: 'We say what we mean and do what we promise. No exceptions.' },
    { icon: '◈', title: 'Excellence', desc: 'Mediocrity has no place here. Every detail is deliberate.' },
    { icon: '⊕', title: 'Empathy', desc: 'We listen first. Your dream trip starts with understanding you.' },
    { icon: '❋', title: 'Innovation', desc: 'We continuously discover new places before they become mainstream.' },
];



const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const GoldLine = () => (
    <div style={{ width: 48, height: 2, background: 'linear-gradient(to right, var(--gold), rgba(245,166,35,0.2))', borderRadius: 2, marginBottom: 24 }} />
);

const Tag = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[3px] mb-5"
        style={{ background: dark ? 'rgba(245,166,35,0.12)' : 'rgba(48,36,112,0.08)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.25)', fontFamily: 'var(--font-display)' }}>
        ✦ {children}
    </div>
);

const LogoRing = ({ size = 80 }: { size?: number }) => {
    const pad = Math.round(size * 0.07);
    const inner = Math.round(size * 0.11);
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full" style={{ border: '1.5px dashed rgba(245,166,35,0.35)' }} />
            <div className="absolute rounded-full" style={{ inset: pad, border: '1px solid rgba(245,166,35,0.55)' }} />
            <div className="absolute rounded-full" style={{ inset: inner, background: 'linear-gradient(135deg,#1A1650,#0D0B28)', boxShadow: '0 0 30px rgba(245,166,35,0.2)' }} />
            <img src="/logoilt.jpeg" alt="ILT Logo" className="absolute object-cover rounded-full"
                style={{ inset: inner, width: `calc(100% - ${inner * 2}px)`, height: `calc(100% - ${inner * 2}px)` }} />
        </div>
    );
};

// ═══════════════════════════════════════════════════════════
const AboutUs = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 700], ['0%', '22%']);

    return (
        <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg,#F9F7F4)', overflowX: 'hidden' }}>

            {/* ══ HERO ══ */}
            <div ref={heroRef} className="relative flex items-end overflow-hidden"
                style={{ minHeight: '90vh', marginTop: -68, background: '#0D0B28' }}>
                <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.15 }}>
                    <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1800&q=80"
                        alt="" className="w-full h-full object-cover"  />
                </motion.div>
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: GRAIN, backgroundSize: '180px' }} />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top,#0D0B28 0%,rgba(13,11,40,0.6) 50%,rgba(13,11,40,0.15) 100%)' }} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,166,35,0.06) 0%,transparent 60%)' }} />
                </div>

                <div className="relative w-full max-w-[1280px] mx-auto px-6 pb-20 pt-48">
                    <div className="max-w-3xl">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Tag dark>About Us</Tag>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-bold text-white mb-6"
                            style={{ fontSize: 'clamp(48px,7vw,96px)', lineHeight: 1.02, letterSpacing: '-2px', fontFamily: 'var(--font-display)' }}>
                            We Don't<br />Book Trips.<br />
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We Design<br />Memories.</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, lineHeight: 1.8, maxWidth: 540, fontFamily: 'var(--font-display)' }}>
                            At Infinite Luxury Trips, every journey begins with a conversation —
                            and ends with a story worth telling for the rest of your life.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                            className="flex items-center gap-4 mt-10 flex-wrap">
                            <motion.button onClick={() => navigate('/destinations')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold"
                                style={{ background: 'var(--gold)', color: '#0D0B28', fontFamily: 'var(--font-display)', boxShadow: '0 6px 28px rgba(245,166,35,0.3)' }}
                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                                Explore Destinations <ArrowRight size={14} />
                            </motion.button>
                            <motion.button onClick={() => navigate('/contact')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}
                                whileHover={{ background: 'rgba(255,255,255,0.12)' } as any} whileTap={{ scale: 0.97 }}>
                                Talk to Us
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Logo flottant bottom-right */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="absolute bottom-10 right-8 md:right-16 z-10 flex flex-col items-center gap-2">
                    <LogoRing size={80} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '3px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                        Infinite Luxury Trips
                    </span>
                </motion.div>
            </div>

            {/* ══ INTRO ÉDITORIALE ══ */}
            <section className="relative py-24 px-6 overflow-hidden" style={{ background: '#fff' }}>
                <div className="absolute left-0 top-0 bottom-0 w-px"
                    style={{ background: 'linear-gradient(to bottom,transparent,rgba(245,166,35,0.3) 30%,rgba(245,166,35,0.3) 70%,transparent)' }} />
                <div className="max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Sticky colonne gauche */}
                        <div className="lg:col-span-3 lg:sticky lg:top-28">
                            <Tag>Our Story</Tag>
                            <h2 className="font-bold" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: 'var(--royal,#1E1B6B)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                                Who We<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Really Are</span>
                            </h2>
                            <GoldLine />
                            <div className="flex items-center gap-3 mt-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(245,166,35,0.4)' }}>
                                    <img src="/logoilt.jpeg" alt="ILT" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Infinite Luxury Trips</div>
                                    <div className="text-[10px]" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-display)' }}>Your Luxury Travel Partner</div>
                                </div>
                            </div>
                        </div>

                        {/* Texte principal */}
                        <div className="lg:col-span-9">
                            <div className="mb-8 overflow-hidden">
                                <span className="float-left font-extrabold leading-none mr-4"
                                    style={{ fontSize: 'clamp(80px,10vw,120px)', color: 'rgba(245,166,35,0.12)', fontFamily: 'var(--font-display)', lineHeight: 0.85, marginTop: 8 }}>
                                    A
                                </span>
                                <p style={{ fontSize: 20, lineHeight: 1.85, color: 'var(--text,#111)', fontFamily: 'var(--font-display)' }}>
                                    t Infinite Luxury Trips, we believe travel should be more than just a getaway —
                                    it should be an{' '}
                                    <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 600 }}>unforgettable experience</em>.
                                    We specialize in curating exceptional journeys designed to inspire, indulge,
                                    and create lasting memories for every traveler who trusts us with their most precious time.
                                </p>
                            </div>
                            <div style={{ clear: 'both' }} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(0,0,0,0.6)', fontFamily: 'var(--font-display)' }}>
                                    Our expertise lies in <strong style={{ color: 'var(--royal)', fontWeight: 600 }}>group travel</strong>, where every detail
                                    is thoughtfully planned to ensure a seamless and elevated experience. From the moment
                                    you reach out, our dedicated concierge team is assigned to your journey — handling everything
                                    from visa logistics to restaurant reservations, so you arrive at every moment fully present.
                                </p>
                                <p style={{ fontSize: 15, lineHeight: 1.9, color: 'rgba(0,0,0,0.6)', fontFamily: 'var(--font-display)' }}>
                                    We take pride in offering access to <strong style={{ color: 'var(--royal)', fontWeight: 600 }}>exotic destinations</strong> around the world,
                                    carefully pairing each location with immersive tours and reliable transfers.
                                    Whether you're exploring vibrant cultures, relaxing in breathtaking landscapes,
                                    or celebrating life's special moments, every trip is crafted with intention and style.
                                </p>
                            </div>

                            {/* Pull quote */}
                            <div className="relative mt-12 p-8 rounded-2xl overflow-hidden"
                                style={{ background: 'linear-gradient(135deg,#0D0B28 0%,#1A1650 100%)' }}>
                                <div className="absolute top-4 right-6 font-extrabold select-none pointer-events-none"
                                    style={{ fontSize: 120, color: 'rgba(245,166,35,0.06)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>"</div>
                                <p className="relative" style={{ fontSize: 'clamp(17px,2.5vw,24px)', color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>
                                    What sets Infinite Luxury Trips apart is our unique approach to vacation experiences.
                                    We don't just plan trips — we design personalized journeys that reflect your vision,
                                    preferences, and sense of adventure.
                                </p>
                                <div className="flex items-center gap-3 mt-6">
                                    <div style={{ width: 36, height: 2, background: 'var(--gold)' }} />
                                    <span style={{ color: 'rgba(245,166,35,0.7)', fontSize: 11, letterSpacing: '2px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                                        The ILT Philosophy
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>                        

            {/* ══ 6 PILLIERS ══ */}
            <section className="relative py-24 px-6 overflow-hidden" style={{ background:"var(--royal)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
                    style={{ backgroundImage: GRAIN, backgroundSize: '180px' }} />
                <div className="max-w-[1280px] mx-auto">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-16">
                        <Tag dark>What We Stand For</Tag>
                        <h2 className="font-bold text-white"
                            style={{ fontSize: 'clamp(32px,5vw,60px)', fontFamily: 'var(--font-display)', lineHeight: 1.1, letterSpacing: '-1px' }}>
                            Six Pillars of{' '}
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Extraordinary</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {PILLARS.map(({ num, icon, title, body, accent }, i) => (
                            <motion.div key={title}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.55 }}
                                className="relative rounded-2xl p-7 overflow-hidden transition-all duration-300"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'default' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.borderColor = `${accent}66`; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                                    style={{ background: `radial-gradient(circle,${accent}18 0%,transparent 70%)` }} />
                                <div className="absolute bottom-4 right-5 font-extrabold select-none pointer-events-none"
                                    style={{ fontSize: 64, color: `${accent}0B`, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{num}</div>

                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                                    style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>{icon}</div>

                                <div className="font-bold text-[10px] uppercase tracking-[2.5px] mb-2"
                                    style={{ color: accent, fontFamily: 'var(--font-display)' }}>{num}</div>
                                <h3 className="font-bold text-white mb-3"
                                    style={{ fontSize: 20, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{title}</h3>
                                <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-display)' }}>{body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ VALEURS + LOGO SUR PHOTO ══ */}
            <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'var(--bg,#F9F7F4)' }}>
                <div className="max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Photo + logo superposé */}
                        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.65 }}
                            className="relative">
                            <div className="relative rounded-3xl overflow-hidden"
                                style={{ height: 'clamp(320px,40vw,500px)', boxShadow: '0 40px 100px rgba(13,11,40,0.2)' }}>
                                <img src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80"
                                    alt="ILT Experience" className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg,rgba(13,11,40,0.5) 0%,rgba(13,11,40,0.1) 60%)' }} />

                                {/* Logo centré sur la photo */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                                    <div className="relative" style={{ width: 110, height: 110 }}>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 rounded-full"
                                            style={{ border: '1px dashed rgba(245,166,35,0.5)' }} />
                                        <div className="absolute rounded-full"
                                            style={{ inset: 7, border: '1.5px solid rgba(245,166,35,0.7)' }} />
                                        <div className="absolute rounded-full overflow-hidden"
                                            style={{ inset: 12, boxShadow: '0 0 60px rgba(245,166,35,0.3), 0 0 0 8px rgba(13,11,40,0.4)' }}>
                                            <img src="/logoilt.jpeg" alt="ILT Logo" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px]"
                                        style={{ background: 'rgba(245,166,35,0.9)', color: '#0D0B28', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}>
                                        Infinite Luxury Trips
                                    </div>
                                </div>
                            </div>

                            {/* Stat badge */}
                            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.4 }}
                                className="absolute -bottom-6 -right-4 md:-right-8 rounded-2xl px-6 py-5"
                                style={{ background: '#0D0B28', border: '1.5px solid rgba(245,166,35,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                                <div className="font-extrabold mb-1" style={{ fontSize: 38, color: 'var(--gold)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>98%</div>
                                <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-display)' }}>Satisfaction Rate</div>
                                <div className="flex mt-2 gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="var(--gold)" color="var(--gold)" />)}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Valeurs */}
                        <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.65 }}>
                            <Tag>Core Values</Tag>
                            <h2 className="font-bold mb-4"
                                style={{ fontSize: 'clamp(28px,4vw,46px)', color: 'var(--royal,#1E1B6B)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                                The Principles That<br />
                                <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Guide Every Journey</span>
                            </h2>
                            <GoldLine />
                            <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(0,0,0,0.55)', marginBottom: 32, fontFamily: 'var(--font-display)' }}>
                                With Infinite Luxury Trips, travel isn't just about where you go —
                                it's about how you experience it. These four values are the compass
                                behind every decision we make.
                            </p>
                            <div className="flex flex-col gap-4">
                                {VALUES.map(({ icon, title, desc }, i) => (
                                    <motion.div key={title} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}
                                        className="flex gap-4 p-4 rounded-xl transition-all duration-300"
                                        style={{ background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.12)', cursor: 'default' }}
                                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(245,166,35,0.08)'; el.style.borderColor = 'rgba(245,166,35,0.3)'; }}
                                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(245,166,35,0.04)'; el.style.borderColor = 'rgba(245,166,35,0.12)'; }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                                            style={{ background: 'rgba(13,11,40,0.08)', color: 'var(--gold)' }}>{icon}</div>
                                        <div>
                                            <div className="font-bold text-sm mb-1" style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>{title}</div>
                                            <div className="text-xs" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'var(--font-display)', lineHeight: 1.7 }}>{desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══ PROMESSE FINALE ══ */}
            <section className="relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=1600&q=80"
                        alt="" className="w-full h-full object-cover"  />
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg,rgba(13,11,40,0.7) 0%,rgba(30,27,107,0.5) 100%)' }} />
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: GRAIN, backgroundSize: '180px' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,166,35,0.07) 0%,transparent 60%)' }} />
                </div>

                <div className="relative max-w-[900px] mx-auto text-center px-6 py-24 w-full">
                    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>

                        <div className="flex justify-center mb-8">
                            <LogoRing size={72} />
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div style={{ width: 60, height: 1, background: 'rgba(245,166,35,0.4)' }} />
                            <span style={{ color: 'rgba(245,166,35,0.7)', fontSize: 10, letterSpacing: '4px', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                                Our Promise
                            </span>
                            <div style={{ width: 60, height: 1, background: 'rgba(245,166,35,0.4)' }} />
                        </div>

                        <h2 className="font-bold text-white mb-6"
                            style={{ fontSize: 'clamp(32px,5vw,64px)', fontFamily: 'var(--font-display)', lineHeight: 1.1, letterSpacing: '-1px' }}>
                            With Infinite Luxury Trips,<br />
                            Travel Isn't Just About<br />
                            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Where You Go.</span>
                        </h2>

                        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px', fontFamily: 'var(--font-display)' }}>
                            It's about how you experience it. Every detail, every moment,
                            every memory — crafted with intention, delivered with excellence.
                        </p>

                        <div className="flex gap-4 justify-center flex-wrap">
                            <motion.button onClick={() => navigate('/reservation')}
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm"
                                style={{ background: 'var(--gold)', color: '#0D0B28', fontFamily: 'var(--font-display)', boxShadow: '0 8px 32px rgba(245,166,35,0.35)' }}
                                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                                <MapPin size={15} /> Reserve Your Journey
                            </motion.button>
                            <motion.button onClick={() => navigate('/destinations')}
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.18)', fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)' }}
                                whileHover={{ background: 'rgba(255,255,255,0.13)' } as any} whileTap={{ scale: 0.97 }}>
                                Explore Destinations <ArrowRight size={14} />
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-center gap-6 flex-wrap mt-10">
                            {[
                                { icon: <Shield size={12} />, text: 'Secure Payments' },
                                { icon: <Award size={12} />, text: 'Verified Properties' },
                                { icon: <Star size={12} />, text: '98% Satisfaction' },
                                { icon: <Heart size={12} />, text: 'Made with Love' },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-xs"
                                    style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-display)' }}>
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