"use client";
import { useState, useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

/* ── Fire a toast from anywhere ────────────────────────────────────────────
   Usage:  showToast("Name updated successfully!")
           showToast("Something went wrong.", "error")
   ───────────────────────────────────────────────────────────────────────── */
export function showToast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("sl:toast", { detail: { message, type } }));
}

/* ── Icon per type ── */
function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return (
    <div style={{ width:40, height:40, borderRadius:"50%", background:"#00c48c", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
  if (type === "error") return (
    <div style={{ width:40, height:40, borderRadius:"50%", background:"#dc2626", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
  return (
    <div style={{ width:40, height:40, borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2"/>
        <path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Single toast pill ── */
function ToastPill({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => { setVisible(false); setTimeout(() => onDismiss(item.id), 320); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [item.id, onDismiss]);

  function dismiss() {
    setVisible(false);
    setTimeout(() => onDismiss(item.id), 320);
  }

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e9e9ec",
      borderRadius: 12,
      padding: "14px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      minWidth: 340, maxWidth: 500,
      boxShadow: "0 16px 48px rgba(16,17,20,0.12), 0 2px 8px rgba(16,17,20,0.06)",
      transform: visible ? "translateX(0)" : "translateX(120%)",
      opacity: visible ? 1 : 0,
      transition: "transform .32s cubic-bezier(.34,1.56,.64,1), opacity .28s ease",
      pointerEvents: "all",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <ToastIcon type={item.type} />
        <span style={{ color:"#0a0a0a", fontSize:14.5, fontWeight:480, letterSpacing:"-0.01em", lineHeight:1.4 }}>
          {item.message}
        </span>
      </div>
      <button onClick={dismiss}
        style={{ background:"none", border:"none", cursor:"pointer", color:"#8e8e93", padding:4, flexShrink:0, display:"flex", alignItems:"center" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "#8e8e93")}
        aria-label="Dismiss">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

/* ── Toast container — mount once in layout ── */
export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let nextId = 0;

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const { message, type = "success" } = (e as CustomEvent).detail as { message: string; type?: ToastType };
      setToasts(prev => [...prev, { id: ++nextId, message, type }]);
    }
    window.addEventListener("sl:toast", handler);
    return () => window.removeEventListener("sl:toast", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed", top: 20, right: 20,
      display: "flex", flexDirection: "column", gap: 12,
      zIndex: 99999, pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <ToastPill key={t.id} item={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
