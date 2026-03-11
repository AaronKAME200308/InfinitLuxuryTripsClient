// ============================================================
// ILT — Confirmation Page
// Vérification du paiement Stripe après redirection
// ============================================================
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyStripePayment } from '../services/api';
import { GoldButton, OutlineButton, LoadingSpinner } from '../components/UI';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();

  const sessionId = searchParams.get('session_id');
  const reference = searchParams.get('ref');
  const cancelled = searchParams.get('cancelled');

  const [status, setStatus]   = useState('loading'); // loading | confirmed | failed | cancelled
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // Paiement annulé
    if (cancelled) {
      setStatus('cancelled');
      return;
    }

    // Pas de session ID
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyStripePayment(sessionId);
        setDetails(data);
        setStatus(data.status === 'paid' ? 'confirmed' : 'failed');
      } catch (err) {
        console.error('Payment verification error:', err.message);
        setStatus('failed');
      }
    };

    verify();
  }, [sessionId, cancelled]);

  if (status === 'loading') {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner message="Verifying your payment" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)', fontFamily: 'var(--font)', padding: '60px 40px'
    }}>
      <div style={{
        background: '#fff', borderRadius: 4, padding: '56px 60px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(201,168,76,0.15)',
        maxWidth: 580, width: '100%', textAlign: 'center'
      }}>

        {/* ---- CONFIRMED ---- */}
        {status === 'confirmed' && (
          <>
            <div style={{
              width: 84, height: 84, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px', fontSize: 38
            }}>✓</div>

            <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 16 }}>
              Payment Successful
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 300, color: 'var(--dark)', margin: '0 0 18px', lineHeight: 1.1 }}>
              Your Experience is<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>Confirmed!</span>
            </h1>
            <p style={{ color: '#777', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              Your payment was successful. A confirmation email has been sent to{' '}
              <strong style={{ color: 'var(--dark)' }}>{details?.customerEmail}</strong>.
              Our concierge team will reach out within 24 hours with your full itinerary.
            </p>

            {/* Reference box */}
            {(reference || details?.reference) && (
              <div style={{
                background: '#f9f7f2', borderRadius: 4, padding: '18px 24px',
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'inline-block', marginBottom: 36
              }}>
                <div style={{ fontSize: 11, color: '#aaa', letterSpacing: 3, marginBottom: 6 }}>
                  BOOKING REFERENCE
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--royal)', letterSpacing: 4 }}>
                  {reference || details?.reference}
                </div>
              </div>
            )}

            {/* Amount paid */}
            {details?.amountTotal && (
              <div style={{ marginBottom: 36 }}>
                <span style={{ color: '#aaa', fontSize: 14 }}>Amount paid: </span>
                <span style={{ color: 'var(--dark)', fontWeight: 600, fontSize: 18 }}>
                  ${details.amountTotal.toLocaleString()}
                </span>
              </div>
            )}

            {/* Next steps */}
            <div style={{
              background: 'rgba(30,27,107,0.04)', borderRadius: 4,
              padding: '20px 24px', marginBottom: 36, textAlign: 'left'
            }}>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
                What Happens Next
              </div>
              {[
                '📧 Confirmation email sent to your inbox',
                '📞 Our concierge will call within 24 hours',
                '🗺️ Full itinerary sent 7 days before departure',
                '💬 24/7 support throughout your journey'
              ].map((step, i) => (
                <div key={i} style={{ fontSize: 14, color: '#555', marginBottom: 10, lineHeight: 1.5 }}>
                  {step}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <GoldButton onClick={() => navigate('/')}>Return to Home</GoldButton>
              <OutlineButton onClick={() => navigate('/contact')}>Contact Concierge</OutlineButton>
            </div>
          </>
        )}

        {/* ---- CANCELLED ---- */}
        {status === 'cancelled' && (
          <>
            <div style={{ fontSize: 60, marginBottom: 24 }}>↩</div>
            <div style={{ color: '#aaa', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 16 }}>
              Payment Cancelled
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 300, color: 'var(--dark)', margin: '0 0 18px' }}>
              No Problem,<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--royal)' }}>No Charges Made</span>
            </h1>
            <p style={{ color: '#777', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              Your payment was cancelled. Nothing was charged to your account.
              Your reservation details are saved — you can complete payment at any time.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <GoldButton onClick={() => navigate('/reservation')}>Try Again</GoldButton>
              <OutlineButton onClick={() => navigate('/')}>Go Home</OutlineButton>
            </div>
          </>
        )}

        {/* ---- FAILED ---- */}
        {status === 'failed' && (
          <>
            <div style={{ fontSize: 60, marginBottom: 24 }}>⚠️</div>
            <div style={{ color: '#e53e3e', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 16 }}>
              Payment Issue
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 300, color: 'var(--dark)', margin: '0 0 18px' }}>
              Something Went<br/>
              <span style={{ fontStyle: 'italic', color: '#e53e3e' }}>Wrong</span>
            </h1>
            <p style={{ color: '#777', fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              We couldn't verify your payment. This may be due to a network issue or the payment was declined.
            </p>
            <div style={{
              background: '#fff5f5', border: '1px solid #fed7d7',
              borderRadius: 4, padding: '14px 18px', marginBottom: 36
            }}>
              <p style={{ color: '#c53030', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                If you were charged, please contact our concierge team immediately with your booking reference:{' '}
                <strong>{reference || 'provided in your email'}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <GoldButton onClick={() => navigate('/contact')}>Contact Concierge</GoldButton>
              <OutlineButton onClick={() => navigate('/reservation')}>Try Again</OutlineButton>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Confirmation;
