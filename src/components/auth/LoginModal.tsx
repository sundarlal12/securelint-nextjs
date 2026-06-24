"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { warmCache } from "@/lib/userCache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "970630889678-7aojvvhm0umigok9l7ipsvkrkj1gs3k9.apps.googleusercontent.com";

// Extend the window type to include Google Identity Services and Chrome extension API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
            auto_select?: boolean;
            context?: string;
          }) => void;
          prompt: (notification?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (el: HTMLElement, cfg: object) => void;
          cancel: () => void;
        };
      };
    };
    chrome?: {
      runtime?: {
        sendMessage: (
          extensionId: string,
          message: object,
          callback?: (response: unknown) => void
        ) => void;
      };
    };
  }
}

// After a successful login, send the token to the extension (if the page was
// opened by the extension's popup via ?ext_id=...).
function notifyExtension(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  const extId = sessionStorage.getItem("sl_ext_id");
  if (!extId) return;
  try {
    window.chrome?.runtime?.sendMessage(
      extId,
      { type: "AUTH_SUCCESS", token: accessToken, refresh_token: refreshToken },
      (resp) => {
        if (resp && (resp as Record<string, unknown>).success) {
          console.log("[SecureLint] Extension auth handshake complete");
          sessionStorage.removeItem("sl_ext_id");
        }
      }
    );
  } catch (_) {
    // chrome.runtime not available (e.g. non-Chrome browser) — safe to ignore
  }
}

function getBrowserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("securelint_browser_id");
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem("securelint_browser_id", id);
  }
  return id;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}
type Panel = "login" | "signup" | "forgot";

export default function LoginModal({ isOpen, onClose, defaultTab = "login" }: Props) {
  const [panel, setPanel] = useState<Panel>(defaultTab);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState({ text: "", error: false });
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupPlan, setSignupPlan] = useState("pro");
  const [plans, setPlans] = useState<{ id: string; name: string; price_monthly: number }[]>([]);
  const [signupMsg, setSignupMsg] = useState({ text: "", error: false });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState({ text: "", error: false });
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleMsg, setGoogleMsg] = useState({ text: "", error: false });

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // ── After Google returns a credential, call our backend ──────────────────
  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleLoading(true);
    setGoogleMsg({ text: "", error: false });
    setLoginMsg({ text: "", error: false });
    setSignupMsg({ text: "", error: false });
    try {
      const res = await fetch(`${API_BASE}/api/google-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credential, browser_id: getBrowserId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.message || data.message || "Google sign-in failed");

      const accessToken = data.access_token || "";
      localStorage.setItem("user_token",         accessToken);
      localStorage.setItem("user_refresh_token", data.refresh_token || "");
      localStorage.setItem("user_plan_id",       data.plan_id       || "free");
      localStorage.setItem("user_plan_status",   data.plan_status   || "inactive");

      warmCache(accessToken).catch(() => {});
      notifyExtension(accessToken, data.refresh_token || "");

      const pendingPlanId   = sessionStorage.getItem("pending_billing_plan_id");
      const pendingPlanName = sessionStorage.getItem("pending_billing_plan_name");
      const pendingPrice    = sessionStorage.getItem("pending_billing_price");
      if (pendingPlanId) {
        localStorage.setItem("billing_plan_id",   pendingPlanId);
        localStorage.setItem("billing_plan_name", pendingPlanName || pendingPlanId);
        localStorage.setItem("billing_price",     pendingPrice    || "0");
        sessionStorage.removeItem("pending_billing_plan_id");
        sessionStorage.removeItem("pending_billing_plan_name");
        sessionStorage.removeItem("pending_billing_price");
        setGoogleMsg({ text: "Signed in! Taking you to checkout…", error: false });
        setTimeout(() => { window.location.href = "/user/dashboard/billing"; }, 800);
        return;
      }

      const planId = (data.plan_id || "").toLowerCase();
      const dest = planId === "enterprise" ? "/dashboard" : "/user/dashboard";
      setGoogleMsg({ text: data.is_new_user ? "Account created! Redirecting…" : "Signed in! Redirecting…", error: false });
      setTimeout(() => { window.location.href = dest; }, 800);
    } catch (err: unknown) {
      setGoogleMsg({ text: err instanceof Error ? err.message : "Google sign-in failed", error: true });
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  // ── Load Google Identity Services script ─────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("gsi-script")) {
      // Script already loaded — just initialise
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id:   GOOGLE_CLIENT_ID,
          callback:    (resp) => handleGoogleCredential(resp.credential),
          auto_select: false,
          context:     "signin",
        });
      }
      return;
    }
    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id:   GOOGLE_CLIENT_ID,
        callback:    (resp) => handleGoogleCredential(resp.credential),
        auto_select: false,
        context:     "signin",
      });
    };
    document.head.appendChild(script);
  }, [handleGoogleCredential]);

  useEffect(() => {
    if (isOpen) {
      setPanel(defaultTab);
      setSignupSuccess(false);
      setLoginMsg({ text: "", error: false });
      setSignupMsg({ text: "", error: false });
      setForgotMsg({ text: "", error: false });
      setGoogleMsg({ text: "", error: false });
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (defaultTab === "signup") nameRef.current?.focus();
        else emailRef.current?.focus();
      }, 350);
      // Fetch available plans for the signup form
      fetch(`${API_BASE}/api/plans`)
        .then(r => r.json())
        .then(d => { if (d.plans?.length) setPlans(d.plans); })
        .catch(() => {});
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const headers: Record<Panel, { title: string; subtitle: string }> = {
    login: { title: "Welcome back", subtitle: "Sign in to sync your settings across devices" },
    signup: { title: "Create your account", subtitle: "Start protecting your secrets in seconds" },
    forgot: { title: "Reset your password", subtitle: "We'll send you a reset link via email" },
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMsg({ text: "", error: false });
    try {
      const res = await fetch(`${API_BASE}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, browser_id: getBrowserId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save tokens
      const accessToken = data.access_token || "";
      localStorage.setItem("user_token",         accessToken);
      localStorage.setItem("user_refresh_token", data.refresh_token || "");
      localStorage.setItem("user_plan_id",       data.plan_id       || "free");
      localStorage.setItem("user_plan_status",   data.plan_status   || "inactive");

      // Warm the full cache (profile + plans) in the background
      warmCache(accessToken).catch(() => {});
      notifyExtension(accessToken, data.refresh_token || "");

      // Check if user came from the pricing page wanting a specific plan
      const pendingPlanId   = sessionStorage.getItem("pending_billing_plan_id");
      const pendingPlanName = sessionStorage.getItem("pending_billing_plan_name");
      const pendingPrice    = sessionStorage.getItem("pending_billing_price");
      if (pendingPlanId) {
        localStorage.setItem("billing_plan_id",   pendingPlanId);
        localStorage.setItem("billing_plan_name", pendingPlanName || pendingPlanId);
        localStorage.setItem("billing_price",     pendingPrice    || "0");
        sessionStorage.removeItem("pending_billing_plan_id");
        sessionStorage.removeItem("pending_billing_plan_name");
        sessionStorage.removeItem("pending_billing_price");
        setLoginMsg({ text: "Logged in! Taking you to checkout…", error: false });
        setTimeout(() => { window.location.href = "/user/dashboard/billing"; }, 800);
        return;
      }

      // Default redirect: enterprise → admin dashboard, everyone else → user dashboard
      const planId = (data.plan_id || "").toLowerCase();
      const dest = planId === "enterprise" ? "/dashboard" : "/user/dashboard";
      setLoginMsg({ text: "Logged in! Redirecting…", error: false });
      setTimeout(() => { window.location.href = dest; }, 800);
    } catch (err: unknown) {
      setLoginMsg({ text: err instanceof Error ? err.message : "Login failed", error: true });
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      setSignupMsg({ text: "Passwords do not match", error: true });
      return;
    }
    setSignupLoading(true);
    setSignupMsg({ text: "", error: false });
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:  signupName,
          email:      signupEmail,
          password:   signupPassword,
          browser_id: getBrowserId(),
          plan_id:    signupPlan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.message || data.message || "Signup failed");
      // Save tokens; plan starts inactive until payment
      if (data.access_token) {
        localStorage.setItem("user_token",         data.access_token);
        localStorage.setItem("user_refresh_token", data.refresh_token || "");
        localStorage.setItem("user_plan_id",       data.plan_id     || "free");
        localStorage.setItem("user_plan_status",   data.plan_status || "inactive");
        warmCache(data.access_token).catch(() => {});
        notifyExtension(data.access_token, data.refresh_token || "");
      }
      setSignupSuccess(true);
      setTimeout(() => { window.location.href = "/user/dashboard"; }, 1200);
    } catch (err: unknown) {
      setSignupMsg({ text: err instanceof Error ? err.message : "Signup failed", error: true });
    } finally {
      setSignupLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg({ text: "", error: false });
    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setForgotMsg({ text: "Reset link sent! Check your inbox.", error: false });
    } catch (err: unknown) {
      setForgotMsg({ text: err instanceof Error ? err.message : "Request failed", error: true });
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-48.png" alt="SecureLint" />
            <span>SecureLint</span>
          </div>
          <h2>{headers[panel].title}</h2>
          <p>{headers[panel].subtitle}</p>
        </div>

        <div className="modal-body">
          {/* OAuth (only on login/signup, not forgot or success) */}
          {panel !== "forgot" && !signupSuccess && (
            <>
              <div className="modal-oauth">
                {/* Real Google Sign-In: opens a secure popup, returns a signed id_token */}
                <button
                  type="button"
                  className="oauth-btn"
                  disabled={googleLoading}
                  onClick={() => {
                    setGoogleMsg({ text: "", error: false });
                    if (window.google?.accounts?.id) {
                      window.google.accounts.id.prompt((notification) => {
                        // If One-Tap is suppressed (user dismissed before), fall back gracefully
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                          setGoogleMsg({ text: "Google pop-up was blocked. Please allow pop-ups and try again.", error: true });
                        }
                      });
                    } else {
                      setGoogleMsg({ text: "Google Sign-In is loading… please try again in a moment.", error: true });
                    }
                  }}
                  style={{ cursor: googleLoading ? "not-allowed" : "pointer", opacity: googleLoading ? 0.7 : 1 }}
                >
                  {googleLoading ? (
                    <span className="btn-spinner" style={{ width: 16, height: 16, borderWidth: 2, marginRight: 6 }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {googleLoading ? "Signing in…" : "Continue with Google"}
                </button>
              </div>

              {googleMsg.text && (
                <p className={`form-msg ${googleMsg.error ? "error" : ""}`} style={{ textAlign: "center", marginTop: 4 }}>
                  {googleMsg.text}
                </p>
              )}

              <div className="modal-divider"><span>or use email</span></div>

              <div className="modal-tabs">
                <button className={`modal-tab ${panel === "login" ? "active" : ""}`} onClick={() => setPanel("login")}>Log in</button>
                <button className={`modal-tab ${panel === "signup" ? "active" : ""}`} onClick={() => setPanel("signup")}>Sign up</button>
              </div>
            </>
          )}

          {/* Login panel */}
          <div className={`modal-panel ${panel === "login" ? "active" : ""}`}>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email address</label>
                <input ref={emailRef} type="email" id="loginEmail" placeholder="you@example.com" required autoComplete="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <div className="pw-toggle">
                  <input type={showLoginPw ? "text" : "password"} id="loginPassword" placeholder="••••••••" required autoComplete="current-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} aria-label="Show password">{showLoginPw ? "🙈" : "👁"}</button>
                </div>
              </div>
              <div className="form-row">
                <label className="form-remember"><input type="checkbox" /> Remember me</label>
                <button type="button" className="form-forgot" onClick={() => setPanel("forgot")}>Forgot password?</button>
              </div>
              <button type="submit" className="btn-submit" disabled={loginLoading}>
                {loginLoading && <span className="btn-spinner" />}
                {loginLoading ? "Please wait…" : "Log in to SecureLint"}
              </button>
            </form>
            {loginMsg.text && <p className={`form-msg ${loginMsg.error ? "error" : ""}`}>{loginMsg.text}</p>}
          </div>

          {/* Signup panel */}
          {!signupSuccess && (
            <div className={`modal-panel ${panel === "signup" ? "active" : ""}`}>
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="signupName">Full name</label>
                  <input ref={nameRef} type="text" id="signupName" placeholder="Jane Doe" required autoComplete="name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email address</label>
                  <input type="email" id="signupEmail" placeholder="you@example.com" required autoComplete="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <div className="pw-toggle">
                    <input type={showSignupPw ? "text" : "password"} id="signupPassword" placeholder="Min 8 characters" required minLength={8} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowSignupPw(!showSignupPw)} aria-label="Show password">{showSignupPw ? "🙈" : "👁"}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="signupConfirm">Confirm password</label>
                  <div className="pw-toggle">
                    <input type={showConfirmPw ? "text" : "password"} id="signupConfirm" placeholder="••••••••" required minLength={8} value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} aria-label="Show password">{showConfirmPw ? "🙈" : "👁"}</button>
                  </div>
                </div>

                {/* Plan is fixed to "pro" — hidden from UI, submitted silently */}
                <input type="hidden" name="signupPlan" value="pro" />

                <button type="submit" className="btn-submit" disabled={signupLoading}>
                  {signupLoading && <span className="btn-spinner" />}
                  {signupLoading ? "Please wait…" : "Create account"}
                </button>
              </form>
              {signupMsg.text && <p className={`form-msg ${signupMsg.error ? "error" : ""}`}>{signupMsg.text}</p>}
              <p className="modal-footer-text">By signing up, you agree to our <a href="/privacy">Privacy Policy</a>.</p>
            </div>
          )}

          {/* Signup success */}
          {panel === "signup" && signupSuccess && (
            <div className="modal-panel active">
              <div className="thankyou-card">
                <div className="thankyou-icon">✅</div>
                <h3>Thank you for signing up!</h3>
                <p>Your account has been created successfully{signupEmail ? <> for <strong>{signupEmail}</strong></> : ""}.</p>
                <p style={{ marginTop: 12 }}>You can now log in from the extension or the SecureLint dashboard.</p>
                <button className="back-link" onClick={() => { setPanel("login"); setSignupSuccess(false); }}>← Back to login</button>
              </div>
            </div>
          )}

          {/* Forgot panel */}
          <div className={`modal-panel ${panel === "forgot" ? "active" : ""}`}>
            <form onSubmit={handleForgot}>
              <p style={{ fontSize: 13.5, color: "var(--ink-muted)", marginBottom: 16 }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div className="form-group">
                <label htmlFor="forgotEmail">Email address</label>
                <input type="email" id="forgotEmail" placeholder="you@example.com" required autoComplete="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn-submit" disabled={forgotLoading}>
                {forgotLoading && <span className="btn-spinner" />}
                {forgotLoading ? "Please wait…" : "Send reset link"}
              </button>
            </form>
            {forgotMsg.text && <p className={`form-msg ${forgotMsg.error ? "error" : ""}`}>{forgotMsg.text}</p>}
            <p className="modal-footer-text"><button onClick={() => setPanel("login")}>← Back to login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
