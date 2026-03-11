import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Reservation from './pages/Reservation';
import Confirmation from './pages/Confirmation';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Animation hooks
import { useCursor, useScrollProgress } from './hooks/useAnimations';

// Styles
import './index.css';
import './animations.css';

// Stripe — clé publique uniquement
const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);
// ---- Page wrapper avec transition ----
const PageWrapper = ({ children }) => {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
};

// ---- App shell avec animations globales ----
const AppShell = () => {
  useCursor();
  useScrollProgress();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <PageWrapper>
          <Routes>
            <Route path="/"                 element={<Home />} />
            <Route path="/destinations"     element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/reservation"      element={<Reservation />} />
            <Route path="/confirmation"     element={<Confirmation />} />
            <Route path="/blog"             element={<Blog />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="*"                 element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <AppShell />
      </Elements>
    </BrowserRouter>
  );
}

export default App;
