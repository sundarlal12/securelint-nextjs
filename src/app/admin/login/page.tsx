"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const browserId =
        localStorage.getItem("securelint_browser_id") ||
        crypto.randomUUID();
      localStorage.setItem("securelint_browser_id", browserId);

      const data = await adminLogin(email, password, browserId);

      if (data.error === 1 || !data.access_token) {
        const detail = data.detail as Record<string, unknown> | undefined;
        const planStatus = String(detail?.plan_status ?? data.plan_status ?? "");
        const msg = String(detail?.message ?? data.message ?? "Login failed. Check your credentials.");
        if (planStatus === "pending") {
          setError("__pending__");
        } else {
          setError(msg);
        }
        return;
      }

      localStorage.setItem("admin_token",         String(data.access_token  ?? ""));
      localStorage.setItem("admin_refresh_token", String(data.refresh_token ?? ""));
      localStorage.setItem("admin_org_id",        String(data.org_id        ?? ""));
      localStorage.setItem("admin_role",          String(data.role          ?? ""));

      router.replace("/dashboard");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#080b0f" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #21262d", borderTop: "3px solid #39d353", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #0f2318, #1f4a3c)",
            border: "1px solid #39d35340", marginBottom: 16,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#39d353" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px" }}>
            SecureLint Enterprise
          </div>
          <div style={{ fontSize: 13, color: "#8b949e", marginTop: 6 }}>
            Admin Dashboard Login
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "#0d1117",
          border: "1px solid #21262d",
          borderRadius: 16,
          padding: "32px",
        }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid #21262d", background: "#161b22",
                  color: "#e6edf3", fontSize: 14, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8b949e", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid #21262d", background: "#161b22",
                  color: "#e6edf3", fontSize: 14, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Generic error */}
            {error && error !== "__upgrade__" && error !== "__pending__" && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1a0f0f", border: "1px solid #dc262644", color: "#dc2626", fontSize: 13 }}>
                {error}
              </div>
            )}

            {/* No enterprise plan */}
            {error === "__upgrade__" && (
              <div style={{ padding: "14px", borderRadius: 8, background: "#0a1a10", border: "1px solid #39d35344", fontSize: 13 }}>
                <div style={{ color: "#e6edf3", fontWeight: 600, marginBottom: 6 }}>Enterprise plan required</div>
                <div style={{ color: "#8b949e", lineHeight: 1.5 }}>Your account does not have enterprise access. Contact your administrator.</div>
              </div>
            )}

            {/* Plan pending activation */}
            {error === "__pending__" && (
              <div style={{ padding: "16px", borderRadius: 10, background: "#0d1a2a", border: "1px solid #3b82f640", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {/* Animated clock icon */}
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="1.5"/>
                      <path d="M12 7v5l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ color: "#93c5fd", fontWeight: 700, fontSize: 14 }}>Activation Pending</div>
                </div>
                <div style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: 12 }}>
                  Your enterprise account has been created but is awaiting activation by the SecureLint admin team.
                </div>
                <div style={{ background: "#0a1220", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e3a5f" }}>
                  {[
                    { icon: "✅", text: "Account registered" },
                    { icon: "✅", text: "Organisation created" },
                    { icon: "⏳", text: "Plan activation — in review" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 2 ? "1px solid #1e3a5f" : "none", fontSize: 12, color: i === 2 ? "#93c5fd" : "#64748b" }}>
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
                  Once activated you can log in here. Reach out to{" "}
                  <span style={{ color: "#93c5fd" }}>support@securelint.io</span> for faster activation.
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px", borderRadius: 8, border: "none",
                background: loading ? "#1f4a3c" : "#39d353",
                color: "#0d1117", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 4, transition: "background 0.2s",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid #39d35360", borderTop: "2px solid #39d353", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign In to Admin Dashboard
                </>
              )}
            </button>
          </form>

          {/* Info note */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #21262d", fontSize: 12, color: "#8b949e", textAlign: "center", lineHeight: 1.6 }}>
            This portal is restricted to enterprise admins and owners only.
            <br />Need access?{" "}
            <a href="mailto:support@securelint.io" style={{ color: "#39d353", textDecoration: "none", fontWeight: 600 }}>Contact support →</a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#484f58" }}>
          © 2026 SecureLint · Enterprise Security Platform
        </div>
      </div>
    </div>
  );
}
