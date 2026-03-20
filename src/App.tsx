import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages
import Home            from './pages/Home';
import Destinations    from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Reservation     from './pages/Reservation';
import Confirmation    from './pages/Confirmation';
import Blog            from './pages/Blog';
import BlogDetail      from './pages/BlogDetail';
import Contact         from './pages/Contact';
import CancelRequest   from './pages/CancelRequest';
import AboutUs from './pages/About';   // ou './AboutUs' selon ta structure


// Components
import Navbar          from './components/Navbar';
import Footer          from './components/Footer';
import ScrollToTop     from './components/ScrollToTop';

import './index.css';

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/destinations"        element={<Destinations />} />
            <Route path="/destinations/:id"    element={<DestinationDetail />} />
            <Route path="/reservation"         element={<Reservation />} />
            <Route path="/confirmation"        element={<Confirmation />} />
            <Route path="/blog"                element={<Blog />} />
            <Route path="/blog/:slug"          element={<BlogDetail />} />
            <Route path="/contact"             element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/cancel"              element={<CancelRequest />} />
            <Route path="*"                    element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Elements>
    </BrowserRouter>
  );
}

export default App;