import React from "react";

// ============================================================
// TYPES
// ============================================================

type StarRatingProps = {
  rating: number
  size?: number
}

type GoldDividerProps = {
  width?: number
  margin?: string
}

type SectionLabelProps = {
  children: React.ReactNode
  center?: boolean
}

type PageHeaderProps = {
  label: string
  title: string
  highlight?: string
  imageUrl?: string
}

type LoadingSpinnerProps = {
  message?: string
}

type ErrorMessageProps = {
  message?: string
}

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  fullWidth?: boolean
  style?: React.CSSProperties
}

type OutlineButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  color?: string
  fullWidth?: boolean
}

type FormFieldProps = {
  label?: string
  error?: string
  children: React.ReactNode
}

// ============================================================
// StarRating
// ============================================================

export const StarRating = ({ rating, size = 14 }: StarRatingProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={i <= Math.floor(rating) ? "var(--gold)" : "#ddd"}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
)

// ============================================================
// GoldDivider
// ============================================================

export const GoldDivider = ({
  width = 60,
  margin = "24px auto 0",
}: GoldDividerProps) => (
  <div style={{ width, height: 1, background: "var(--gold)", margin }} />
)

// ============================================================
// SectionLabel
// ============================================================

export const SectionLabel = ({
  children,
  center = true,
}: SectionLabelProps) => (
  <div
    style={{
      color: "var(--gold)",
      fontSize: 11,
      letterSpacing: 5,
      textTransform: "uppercase",
      marginBottom: 16,
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
  </div>
)

// ============================================================
// PageHeader
// ============================================================

export const PageHeader = ({
  label,
  title,
  highlight,
  imageUrl,
}: PageHeaderProps) => (
  <div
    style={{
      background: "var(--royal-dark)",
      padding: "80px 60px 64px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {imageUrl && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.18)",
          opacity: 0.6,
        }}
      />
    )}

    <div style={{ position: "relative" }}>
      <SectionLabel>{label}</SectionLabel>

      <h1
        style={{
          fontSize: "clamp(40px, 6vw, 64px)",
          fontWeight: 300,
          color: "var(--cream)",
          margin: "0 0 16px",
          letterSpacing: -2,
        }}
      >
        {title}{" "}
        {highlight && (
          <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
            {highlight}
          </span>
        )}
      </h1>

      <GoldDivider />
    </div>
  </div>
)

// ============================================================
// LoadingSpinner
// ============================================================

export const LoadingSpinner = ({
  message = "Loading...",
}: LoadingSpinnerProps) => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      fontFamily: "var(--font)",
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid rgba(201,168,76,0.2)",
        borderTop: "2px solid var(--gold)",
        animation: "spin 1s linear infinite",
      }}
    />

    <div
      style={{
        color: "#aaa",
        fontSize: 13,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}
    >
      {message}
    </div>

    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

// ============================================================
// ErrorMessage
// ============================================================

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div
    style={{
      minHeight: "40vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font)",
    }}
  >
    <div
      style={{
        textAlign: "center",
        padding: 48,
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 4,
        maxWidth: 400,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>

      <div style={{ color: "var(--royal)", fontSize: 18, marginBottom: 8 }}>
        Something went wrong
      </div>

      <div style={{ color: "#888", fontSize: 14 }}>{message}</div>
    </div>
  </div>
)

// ============================================================
// GoldButton
// ============================================================

export const GoldButton = ({
  children,
  onClick,
  fullWidth = false,
  style = {},
}: ButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
      border: "none",
      cursor: "pointer",
      color: "var(--dark)",
      fontSize: 12,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontFamily: "var(--font)",
      fontWeight: 700,
      padding: "15px 32px",
      borderRadius: 2,
      boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
      width: fullWidth ? "100%" : "auto",
      transition: "transform 0.2s, box-shadow 0.2s",
      ...style,
    }}
  >
    {children}
  </button>
)

// ============================================================
// RoyalButton
// ============================================================

export const RoyalButton = ({
  children,
  onClick,
  fullWidth = false,
  style = {},
}: ButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: "linear-gradient(135deg, var(--royal), var(--royal-dark))",
      border: "none",
      cursor: "pointer",
      color: "var(--gold)",
      fontSize: 12,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontFamily: "var(--font)",
      fontWeight: 700,
      padding: "15px 32px",
      borderRadius: 2,
      boxShadow: "0 4px 20px rgba(30,27,107,0.3)",
      width: fullWidth ? "100%" : "auto",
      transition: "transform 0.2s, box-shadow 0.2s",
      ...style,
    }}
  >
    {children}
  </button>
)

// ============================================================
// OutlineButton
// ============================================================

export const OutlineButton = ({
  children,
  onClick,
  color = "var(--royal)",
  fullWidth = false,
}: OutlineButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: "transparent",
      border: `1px solid ${color}`,
      cursor: "pointer",
      color,
      fontSize: 11,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontFamily: "var(--font)",
      fontWeight: 500,
      padding: "13px 28px",
      borderRadius: 2,
      width: fullWidth ? "100%" : "auto",
      transition: "all 0.3s",
    }}
  >
    {children}
  </button>
)

// ============================================================
// FormField
// ============================================================

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <div style={{ marginBottom: 24 }}>
    {label && (
      <label
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#888",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
    )}

    {children}

    {error && (
      <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 6 }}>
        {error}
      </div>
    )}
  </div>
)

// ============================================================
// Input styles
// ============================================================

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  border: "1px solid #ddd",
  borderRadius: 2,
  fontSize: 16,
  fontFamily: "var(--font)",
  color: "var(--dark)",
  boxSizing: "border-box",
  background: "#fff",
  transition: "border 0.2s",
}

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
}