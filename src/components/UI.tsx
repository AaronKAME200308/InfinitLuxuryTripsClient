import React from 'react';
import { motion } from 'framer-motion';
import { Star, AlertCircle, Loader2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
type StarRatingProps    = { rating: number; size?: number; showValue?: boolean };
type SectionLabelProps  = { children: React.ReactNode; center?: boolean };
type PageHeaderProps    = { label: string; title: string; highlight?: string; imageUrl?: string; children?: React.ReactNode };
type LoadingProps       = { message?: string };
type ErrorProps         = { message?: string };
type ButtonProps        = { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean; style?: React.CSSProperties; disabled?: boolean };
type OutlineButtonProps = ButtonProps;
type FormFieldProps     = { label?: string; error?: string; children: React.ReactNode; required?: boolean };

// ── StarRating ─────────────────────────────────────────────
export const StarRating = ({ rating, size = 13, showValue = false }: StarRatingProps) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <Star
        key={i}
        size={size}
        fill={i <= Math.floor(rating) ? 'var(--gold)' : 'var(--border)'}
        color={i <= Math.floor(rating) ? 'var(--gold)' : 'var(--border)'}
      />
    ))}
    {showValue && (
      <span className="text-sm font-semibold ml-1"
        style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
        {rating.toFixed(1)}
      </span>
    )}
  </div>
);

// ── SectionLabel ───────────────────────────────────────────
export const SectionLabel = ({ children, center = true }: SectionLabelProps) => (
  <div className={`section-label mb-3 ${center ? 'text-center' : ''}`}>
    {children}
  </div>
);

// ── PageHeader ─────────────────────────────────────────────
export const PageHeader = ({ label, title, highlight, imageUrl, children }: PageHeaderProps) => (
  <div className="relative overflow-hidden" style={{ background: 'var(--royal)', paddingTop: 56, paddingBottom: 52 }}>
    {imageUrl && (
      <div className="absolute inset-0"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2)' }} />
    )}
    <div className="absolute inset-0"
      style={{ background: 'linear-gradient(135deg, rgba(48,36,112,0.92) 0%, rgba(35,26,85,0.88) 100%)' }} />

    <div className="relative max-w-[1280px] mx-auto px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Label pill */}
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[2.5px] mb-4"
          style={{ background: 'rgba(245,166,35,0.18)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)', fontFamily: 'var(--font-display)' }}>
          {label}
        </div>

        <h1 className="text-white font-bold mb-3"
          style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
          {title}{' '}
          {highlight && <span style={{ color: 'var(--gold)' }}>{highlight}</span>}
        </h1>

        {/* Gold divider */}
        <div className="mx-auto rounded-full" style={{ width: 40, height: 3, background: 'var(--gold)' }} />
      </motion.div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  </div>
);

// ── LoadingSpinner ─────────────────────────────────────────
export const LoadingSpinner = ({ message = 'Loading...' }: LoadingProps) => (
  <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: '40vh' }}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
      <Loader2 size={32} style={{ color: 'var(--royal)' }} />
    </motion.div>
    <div className="text-xs font-semibold uppercase tracking-[2px]"
      style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
      {message}
    </div>
  </div>
);

// ── ErrorMessage ───────────────────────────────────────────
export const ErrorMessage = ({ message }: ErrorProps) => (
  <div className="flex items-center justify-center" style={{ minHeight: '30vh', padding: '48px 24px' }}>
    <div className="card flex flex-col items-center gap-4 text-center max-w-sm p-8">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'var(--error-soft)' }}>
        <AlertCircle size={24} color="var(--error)" />
      </div>
      <div>
        <div className="font-semibold text-base mb-1"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          Something went wrong
        </div>
        <div className="text-sm" style={{ color: 'var(--text-3)' }}>{message}</div>
      </div>
    </div>
  </div>
);

// ── GoldButton — CTA premium ───────────────────────────────
export const GoldButton = ({ children, onClick, fullWidth, style, disabled }: ButtonProps) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="btn-gold"
    style={{
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </motion.button>
);

// ── RoyalButton — action principale ───────────────────────
export const RoyalButton = ({ children, onClick, fullWidth, style, disabled }: ButtonProps) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="btn-royal"
    style={{
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </motion.button>
);

// ── OutlineButton — action secondaire ─────────────────────
export const OutlineButton = ({ children, onClick, fullWidth, style, disabled }: OutlineButtonProps) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.01 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="btn-outline"
    style={{
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </motion.button>
);

// ── FormField ──────────────────────────────────────────────
export const FormField = ({ label, error, children, required }: FormFieldProps) => (
  <div className="mb-5">
    {label && (
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: error ? 'var(--error)' : 'var(--text-2)', fontFamily: 'var(--font-display)' }}>
        {label}
        {required && <span style={{ color: 'var(--gold-hover)' }} className="ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error && (
      <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: 'var(--error)' }}>
        <AlertCircle size={11} />
        {error}
      </div>
    )}
  </div>
);

// ── inputStyle / selectStyle — pour usage inline ───────────
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 12,
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  color: 'var(--text)',
  background: 'var(--surface)',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239896B0' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '40px',
};

// ── GoldDivider — compat ───────────────────────────────────
export const GoldDivider = ({ width = 40, margin = '14px auto 0' }: { width?: number; margin?: string }) => (
  <div style={{ width, height: 3, background: 'var(--gold)', borderRadius: 2, margin }} />
);