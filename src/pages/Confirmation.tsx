import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, Mail, Phone, Map, Headphones, AlertTriangle, Download } from 'lucide-react';
import { verifyStripePayment } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { useBookingPDF } from '../hooks/useBookingPDF';

interface PaymentDetails {
  status: 'paid' | 'pending' | 'failed';
  customerEmail?: string; clientName?: string; destination?: string;
  travelDate?: string; guests?: number; duration?: number;
  reference?: string; amountTotal?: number;
  paymentMethod?: 'stripe' | 'zelle'; confirmedAt?: string;
}

const Confirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();
  const { downloadPDF } = useBookingPDF();

  const sessionId = searchParams.get('session_id');
  const reference = searchParams.get('ref');
  const cancelled = searchParams.get('cancelled');
  const [status,      setStatus]      = useState<'loading' | 'confirmed' | 'failed' | 'cancelled'>('loading');
  const [details,     setDetails]     = useState<PaymentDetails | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (cancelled) { setStatus('cancelled'); return; }
    if (!sessionId) { setStatus('failed'); return; }
    verifyStripePayment(sessionId)
      .then(data => { setDetails(data as PaymentDetails); setStatus((data as PaymentDetails).status === 'paid' ? 'confirmed' : 'failed'); })
      .catch(() => setStatus('failed'));
  }, [sessionId, cancelled]);

  const handleDownload = async () => {
    if (!details) return;
    setDownloading(true);
    try {
      await downloadPDF({
        reference:     reference || details.reference || '—',
        clientName:    details.clientName    || 'Valued Client',
        clientEmail:   details.customerEmail || '—',
        destination:   details.destination   || '—',
        travelDate:    details.travelDate    || '—',
        guests:        details.guests        || 1,
        duration:      details.duration,
        amount:        details.amountTotal   || 0,
        paymentMethod: details.paymentMethod || 'stripe',
        confirmedAt:   details.confirmedAt,
      });
    } finally { setDownloading(false); }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh', background: 'var(--bg)' }}>
        <LoadingSpinner message="Verifying your payment" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-16"
      style={{ minHeight: '80vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '2px solid var(--royal-border)', boxShadow: 'var(--shadow-xl)' }}>

        {/* ── CONFIRMED ── */}
        {status === 'confirmed' && (
          <>
            {/* Top accent line violet → or */}
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--royal) 0%, var(--gold) 100%)' }} />
            <div className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--royal-soft)', border: '2px solid var(--royal-border)' }}>
                <CheckCircle2 size={30} style={{ color: 'var(--royal)' }} />
              </motion.div>

              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>Payment Successful</div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Your Experience is <span style={{ color: 'var(--royal)' }}>Confirmed!</span>
              </h1>
              <div className="mx-auto mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
              <p className="text-sm mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                A confirmation email has been sent to{' '}
                <strong style={{ color: 'var(--royal)' }}>{details?.customerEmail}</strong>.
                Our concierge will reach out within 24 hours.
              </p>

              {/* Reference — violet */}
              {(reference || details?.reference) && (
                <div className="px-6 py-4 rounded-xl mb-4 inline-block"
                  style={{ background: 'var(--royal-soft)', border: '1.5px solid var(--royal-border)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Booking Reference</div>
                  <div className="font-extrabold text-2xl tracking-[4px]"
                    style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>
                    {reference || details?.reference}
                  </div>
                </div>
              )}

              {details?.amountTotal && (
                <div className="text-sm mb-5" style={{ color: 'var(--text-3)' }}>
                  Amount paid:{' '}
                  <strong className="text-base" style={{ color: 'var(--gold-hover)', fontFamily: 'var(--font-display)' }}>
                    ${details.amountTotal.toLocaleString()}
                  </strong>
                </div>
              )}

              {/* Next steps */}
              <div className="rounded-xl p-4 mb-5 text-left" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--royal)', fontFamily: 'var(--font-display)' }}>What Happens Next</div>
                {[
                  { icon: <Mail      size={13} />, text: 'Confirmation email sent to your inbox'      },
                  { icon: <Phone     size={13} />, text: 'Our concierge will call within 24 hours'    },
                  { icon: <Map       size={13} />, text: 'Full itinerary sent 7 days before departure'},
                  { icon: <Headphones size={13}/>, text: '24/7 support throughout your journey'       },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 mb-2 text-sm" style={{ color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--royal)', flexShrink: 0 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={handleDownload} disabled={downloading}
                  className="btn-gold flex items-center gap-2"
                  style={{ opacity: downloading ? 0.7 : 1, cursor: downloading ? 'not-allowed' : 'pointer' }}>
                  <Download size={14} /> {downloading ? 'Generating...' : 'Download Receipt'}
                </button>
                <button onClick={() => navigate('/')} className="btn-royal flex items-center gap-2">Return Home</button>
              </div>
              <button onClick={() => navigate('/contact')}
                className="btn-outline mt-2.5 w-full flex items-center justify-center gap-2">
                Contact Concierge
              </button>
            </div>
          </>
        )}

        {/* ── CANCELLED ── */}
        {status === 'cancelled' && (
          <>
            <div className="h-1.5" style={{ background: 'var(--border)' }} />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}>
                <ArrowLeft size={28} style={{ color: 'var(--text-3)' }} />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Payment Cancelled</div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                No Problem — <span style={{ color: 'var(--royal)' }}>No Charges Made</span>
              </h1>
              <div className="mx-auto mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
              <p className="text-sm mb-6" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                Your payment was cancelled and nothing was charged. Your reservation details are saved.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/reservation')} className="btn-royal">Try Again</button>
                <button onClick={() => navigate('/')} className="btn-outline">Go Home</button>
              </div>
            </div>
          </>
        )}

        {/* ── FAILED ── */}
        {status === 'failed' && (
          <>
            <div className="h-1.5" style={{ background: 'var(--error)' }} />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--error-soft)', border: '2px solid #FECACA' }}>
                <XCircle size={30} color="var(--error)" />
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'var(--error)', fontFamily: 'var(--font-display)' }}>Payment Issue</div>
              <h1 className="font-bold text-2xl mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                Something <span style={{ color: 'var(--error)' }}>Went Wrong</span>
              </h1>
              <div className="mx-auto mb-4" style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 2 }} />
              <p className="text-sm mb-5" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
                We couldn't verify your payment. This may be due to a network issue or the payment was declined.
              </p>
              <div className="flex items-start gap-3 p-4 rounded-xl mb-5 text-left"
                style={{ background: 'var(--error-soft)', border: '1px solid #FECACA' }}>
                <AlertTriangle size={15} color="var(--error)" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: '#B91C1C' }}>
                  If you were charged, contact our concierge immediately with reference:{' '}
                  <strong>{reference || 'provided in your email'}</strong>
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/contact')} className="btn-royal">Contact Concierge</button>
                <button onClick={() => navigate('/reservation')} className="btn-outline">Try Again</button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Confirmation;