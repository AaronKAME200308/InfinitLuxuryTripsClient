import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, Mail, Phone, Map, Headphones, AlertTriangle } from 'lucide-react';
import { verifyStripePayment } from '../services/api';
import { LoadingSpinner } from '../components/UI';

interface PaymentDetails {
  status: 'paid' | 'pending' | 'failed';
  customerEmail?: string;
  reference?: string;
  amountTotal?: number;
}

const Confirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const sessionId  = searchParams.get('session_id');
  const reference  = searchParams.get('ref');
  const cancelled  = searchParams.get('cancelled');
  const [status,  setStatus]  = useState<'loading' | 'confirmed' | 'failed' | 'cancelled'>('loading');
  const [details, setDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (cancelled) { setStatus('cancelled'); return; }
    if (!sessionId) { setStatus('failed'); return; }
    const verify = async () => {
      try {
        const data = await verifyStripePayment(sessionId);
        setDetails(data);
        setStatus(data.status === 'paid' ? 'confirmed' : 'failed');
      } catch { setStatus('failed'); }
    };
    verify();
  }, [sessionId, cancelled]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh', background: 'var(--bg)' }}>
        <LoadingSpinner message="Verifying your payment" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center px-4 py-16"
      style={{ minHeight: '80vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >

        {/* ── CONFIRMED ── */}
        {status === 'confirmed' && (
          <>
            {/* Green top bar */}
            <div className="h-2" style={{ background: 'linear-gradient(90deg, var(--royal), #4535A0)' }} />
            <div className="p-8 text-center">

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: '#E8F7F0' }}
              >
                <CheckCircle2 size={32} color="#0A8754" />
              </motion.div>

              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: '#0A8754', fontFamily: 'var(--font-display)' }}>
                Payment Successful
              </div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Your Experience is Confirmed!
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                A confirmation email has been sent to{' '}
                <strong style={{ color: 'var(--text)' }}>{details?.customerEmail}</strong>.
                Our concierge will reach out within 24 hours.
              </p>

              {/* Reference box */}
              {(reference || details?.reference) && (
                <div className="px-6 py-4 rounded-xl mb-5 inline-block"
                  style={{ background: 'var(--royal-xlight)', border: '1px solid rgba(48,36,112,0.12)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                    Booking Reference
                  </div>
                  <div className="font-extrabold text-2xl tracking-[4px]"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    {reference || details?.reference}
                  </div>
                </div>
              )}

              {details?.amountTotal && (
                <div className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
                  Amount paid:{' '}
                  <strong className="text-base" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                    ${details.amountTotal.toLocaleString()}
                  </strong>
                </div>
              )}

              {/* Next steps */}
              <div className="rounded-xl p-4 mb-6 text-left" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                  What Happens Next
                </div>
                {[
                  { icon: <Mail size={13} />,        text: 'Confirmation email sent to your inbox' },
                  { icon: <Phone size={13} />,       text: 'Our concierge will call within 24 hours' },
                  { icon: <Map size={13} />,         text: 'Full itinerary sent 7 days before departure' },
                  { icon: <Headphones size={13} />,  text: '24/7 support throughout your journey' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 mb-2.5 text-sm" style={{ color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--royal)', flexShrink: 0 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--royal)', color: '#fff', fontFamily: 'var(--font-display)' }}>
                  Return Home
                </button>
                <button onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                  Contact Concierge
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── CANCELLED ── */}
        {status === 'cancelled' && (
          <>
            <div className="h-2" style={{ background: 'var(--border)' }} />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--bg)' }}>
                <ArrowLeft size={28} style={{ color: 'var(--text-3)' }} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
                Payment Cancelled
              </div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                No Problem — No Charges Made
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                Your payment was cancelled and nothing was charged. Your reservation details are saved.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/reservation')}
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--royal)', color: '#fff', fontFamily: 'var(--font-display)' }}>
                  Try Again
                </button>
                <button onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                  Go Home
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── FAILED ── */}
        {status === 'failed' && (
          <>
            <div className="h-2" style={{ background: '#D42B2B' }} />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: '#FEF0F0' }}>
                <XCircle size={32} color="#D42B2B" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: '#D42B2B', fontFamily: 'var(--font-display)' }}>
                Payment Issue
              </div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Something Went Wrong
              </h1>
              <p className="text-sm mb-5" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                We couldn't verify your payment. This may be due to a network issue or the payment was declined.
              </p>
              <div className="flex items-start gap-3 p-4 rounded-xl mb-6 text-left"
                style={{ background: '#FEF0F0', border: '1px solid #FED7D7' }}>
                <AlertTriangle size={16} color="#D42B2B" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: '#C53030' }}>
                  If you were charged, contact our concierge immediately with your booking reference:{' '}
                  <strong>{reference || 'provided in your email'}</strong>
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ background: 'var(--royal)', color: '#fff', fontFamily: 'var(--font-display)' }}>
                  Contact Concierge
                </button>
                <button onClick={() => navigate('/reservation')}
                  className="px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
                  Try Again
                </button>
              </div>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
};

export default Confirmation;