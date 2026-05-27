import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a3d33, #2a5c4a, #1e4a3c)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(64,130,109,.25) 0%, transparent 70%)",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 24,
        padding: "52px 48px",
        textAlign: "center",
        maxWidth: 460,
        width: "100%",
        backdropFilter: "blur(12px)",
        boxShadow: "0 32px 80px rgba(0,0,0,.3)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-128.png"
            alt="SecureLint"
            width={64}
            height={64}
            style={{  }}
          />
        </div>

        {/* 404 */}
        <div style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: -4,
          lineHeight: 1,
          marginBottom: 12,
          background: "linear-gradient(135deg, #7dd3b8, #a8e6cf)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 800, color: "#fff",
          letterSpacing: -0.5, marginBottom: 10,
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 15, color: "rgba(255,255,255,.55)",
          lineHeight: 1.7, marginBottom: 36, maxWidth: 320, margin: "0 auto 36px",
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", color: "#1a3d33",
            fontWeight: 800, fontSize: 14,
            padding: "12px 24px", borderRadius: 50,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,.2)",
            transition: "transform .15s",
          }}>
            ← Back to Home
          </Link>
          <a href="mailto:contact@vaptlabs.com" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "transparent", color: "rgba(255,255,255,.75)",
            fontWeight: 600, fontSize: 14,
            padding: "12px 24px", borderRadius: 50,
            textDecoration: "none",
            border: "1.5px solid rgba(255,255,255,.2)",
          }}>
            Contact Support
          </a>
        </div>

        {/* SecureLint label */}
        <div style={{
          marginTop: 36, fontSize: 11, fontWeight: 700,
          color: "rgba(255,255,255,.3)", letterSpacing: 1.2, textTransform: "uppercase",
        }}>
          🛡️ SecureLint — Sensitive Data Protector
        </div>
      </div>
    </div>
  );
}
