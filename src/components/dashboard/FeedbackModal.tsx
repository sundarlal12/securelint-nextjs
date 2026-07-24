"use client";
import { useState, useEffect, useRef } from "react";
import { showToast } from "@/components/dashboard/Toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";

const BLUE   = "#2563eb";
const BORDER = "#18181b";
const TEXT   = "#f1f3fa";
const MUTED  = "#52525b";

const INP: React.CSSProperties = {
  width: "100%", padding: "12px 16px", borderRadius: 8,
  border: `1px solid ${BORDER}`, fontSize: 16, color: TEXT,
  outline: "none", boxSizing: "border-box", background: "#fff",
  transition: "border-color .15s",
  fontFamily: "inherit",
};

interface Props {
  email: string;
  fullName?: string;
  onClose: () => void;
}

export default function FeedbackModal({ email, fullName, onClose }: Props) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const [brief,   setBrief]   = useState("");
  const [detail,  setDetail]  = useState("");
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");

  /* Close on Escape key */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSend() {
    if (!brief.trim()) { setError("Please add a brief description."); return; }
    if (!detail.trim()) { setError("Please add some feedback details."); return; }
    setError(""); setSending(true);

    const parts    = (fullName || "").trim().split(" ");
    const firstName = parts[0] || "SecureLint";
    const lastName  = parts.slice(1).join(" ") || "User";

    try {
      const res = await fetch(`${API_BASE}/api/contact/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          work_email:       email || "user@securelint.in",
          first_name:       firstName,
          last_name:        lastName,
          phone:            "",
          company_name:     "SecureLint User",
          company_size:     "1-10",
          function:         "Product Feedback",
          management_level: "Individual Contributor",
          country:          "India",
          message:          `[${brief.trim()}]\n\n${detail.trim()}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.error !== 1) {
        onClose();
        showToast("Your feedback has been sent. Thank you!");
      } else {
        setError(data.message || "Failed to send. Please try again.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    /* ── Backdrop ── */
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(16,17,20,0.32)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, zIndex: 10000,
        backdropFilter: "blur(2px)",
      }}>
      <style>{`
        @keyframes fb-in { from { opacity:0; transform:scale(.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .fb-inp:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
      `}</style>

      {/* ── Modal card ── */}
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 640,
        boxShadow: "0 24px 64px rgba(16,17,20,0.16), 0 4px 12px rgba(16,17,20,0.06)",
        overflow: "hidden", animation: "fb-in .22s ease",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{ padding: "36px 40px 16px", position: "relative" }}>
          <button onClick={onClose}
            style={{ position:"absolute", top:20, right:20, background:"none", border:"none", cursor:"pointer", color:"#8e8e93", padding:4, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#475569")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8e8e93")}
            aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.6px" }}>
            Send product feedback
          </h2>
          <p style={{ marginTop: 12, fontSize: 15, color: "#475569", lineHeight: 1.6, maxWidth: 480 }}>
            Tell us what you think. We use your feedback to improve SecureLint for everyone.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "8px 40px 4px" }}>
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #b91c1c", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Brief description */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:MUTED, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Brief Description
            </label>
            <input
              className="fb-inp"
              type="text"
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="Summarize your feedback in a few words"
              style={{ ...INP }}
              autoFocus
            />
          </div>

          {/* Detailed feedback */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:MUTED, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Feedback
            </label>
            <textarea
              className="fb-inp"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="Take all the space you need to give us your detailed feedback"
              rows={6}
              style={{ ...INP, resize: "none", lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 40px 32px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
            <button onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: 8, background: "none", color: BLUE, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending}
            style={{ padding: "10px 28px", borderRadius: 8, background: sending ? "#2563eb" : BLUE, color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = "#1d4ed8"; }}
            onMouseLeave={e => { if (!sending) e.currentTarget.style.background = BLUE; }}>
            {sending && <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>}
            {sending && <div style={{ width:15, height:15, border:"2px solid #ffffff60", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />}
            {sending ? "Sending…" : "Send"}
          </button>
        </div>

      </div>
    </div>
  );
}
