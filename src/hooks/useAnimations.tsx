import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================
// useReveal — Scroll reveal avec IntersectionObserver
// Usage: const ref = useReveal(); <div ref={ref} className="reveal">
// ============================================================
export const useReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el); // Une seule fois
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
};

// ============================================================
// useRevealGroup — Révèle plusieurs éléments en stagger
// Usage: const refs = useRevealGroup(4);
//        refs[0], refs[1]... chacun a sa propre ref
// ============================================================
export const useRevealGroup = (count, baseDelay = 100) => {
  const refs = Array.from({ length: count }, () => useRef(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, i * baseDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return refs;
};

// ============================================================
// useCounter — Anime un nombre de 0 à target
// Usage: const count = useCounter(4800, 2000); → "4,800"
// ============================================================
export const useCounter = (target, duration = 2000, suffix = '') => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const numeric = parseInt(target.toString().replace(/\D/g, ''));

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * numeric));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = count.toLocaleString();
  return { ref, value: formatted + suffix };
};

// ============================================================
// useParallax — Effet parallaxe au scroll
// Usage: const { ref, style } = useParallax(0.3);
//        <div ref={ref} style={style}>
// ============================================================
export const useParallax = (speed = 0.3) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(centerY * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return {
    ref,
    style: { transform: `translateY(${offset}px)`, willChange: 'transform' }
  };
};

// ============================================================
// useCursor — Curseur personnalisé gold
// À appeler UNE SEULE FOIS dans App.js
// ============================================================
export const useCursor = () => {
  useEffect(() => {
    // Créer les éléments du curseur
    const cursor = document.createElement('div');
    cursor.id = 'luxury-cursor';
    const ring = document.createElement('div');
    ring.id = 'luxury-cursor-ring';
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top  = `${mouseY}px`;
    };

    // Ring suit avec légère inertie
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      requestAnimationFrame(animate);
    };
    animate();

    // Hover sur éléments interactifs
    const onEnter = () => {
      cursor.classList.add('hovering');
      ring.classList.add('hovering');
    };
    const onLeave = () => {
      cursor.classList.remove('hovering');
      ring.classList.remove('hovering');
    };

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea, .card-luxury')
        .forEach(el => {
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };

    // Observer pour les éléments ajoutés dynamiquement
    const mutationObserver = new MutationObserver(addHoverListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMouseMove);
    addHoverListeners();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      mutationObserver.disconnect();
      cursor.remove();
      ring.remove();
    };
  }, []);
};

// ============================================================
// useScrollProgress — Barre de progression du scroll
// ============================================================
export const useScrollProgress = () => {
  useEffect(() => {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      bar.remove();
    };
  }, []);
};

// ============================================================
// usePageTransition — Transition d'entrée de page
// ============================================================
export const usePageTransition = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('page-enter');
  }, []);

  return ref;
};

// ============================================================
// useImageParallax — Parallaxe sur les images hero
// ============================================================
export const useImageParallax = () => {
  useEffect(() => {
    const heroImg = document.querySelector('.hero-parallax-img');
    if (!heroImg) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      heroImg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
};
