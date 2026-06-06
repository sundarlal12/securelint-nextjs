"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "@/components/dashboard/Toast";
import { getCachedProfile, saveProfile, revalidateProfile } from "@/lib/userCache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";
const G = "#1a7f37";
const BORDER = "#e5e7eb";
const TEXT = "#111827";
const MUTED = "#6b7280";

interface Profile {
  user_id: string;
  email: string;
  full_name: string;
  created_at: string;
  plan: { id: string; name: string; price_monthly: number };
  plan_status: string;
}

function FieldRow({ label, children, info }: { label: string; children: React.ReactNode; info?: boolean }) {
  return (
    <div style={{ paddingBottom: 28, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</span>
        {info && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="1.8"/>
            <path d="M12 8v4m0 4h.01" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}

function DotPassword() {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TEXT }} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    // ── 1. Show cached data instantly ──
    const cached = getCachedProfile();
    if (cached) {
      setProfile(cached);
      setNewName(cached.full_name || "");
      setLoading(false);
    }

    // ── 2. Revalidate silently in background ──
    revalidateProfile(token).then(fresh => {
      if (!fresh) return;
      setProfile(fresh);
      setNewName(n => n || fresh.full_name || "");
      saveProfile(fresh);
    }).finally(() => setLoading(false));
  }, []);

  async function saveName() {
    const token = localStorage.getItem("user_token");
    if (!token || !profile) return;
    setSaving(true);
    try {
      const res  = await fetch(`${API_BASE}/api/user/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ full_name: newName }),
      });
      const data = await res.json();
      if (data.error === 0) {
        setProfile(p => {
          const updated = p ? { ...p, full_name: newName } : p;
          if (updated) saveProfile(updated);   // sync full profile blob + user_full_name
          return updated;
        });
        setEditing(false);
        showToast("Name updated successfully.");
      }
    } finally { setSaving(false); }
  }

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:36 }}>
        <div style={{ height:32, width:120, borderRadius:6, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />
      </div>
      {[1,2,3,4].map(i => <div key={i} style={{ height:56, marginBottom:24, borderRadius:8, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />)}
    </div>
  );

  const isActive = profile?.plan_status === "active";

  return (
    <div style={{ maxWidth: 640, paddingTop: 0 }}>
      <style>{`
        @media (max-width: 768px) {
          .ud-profile-wrap { padding-top: 64px !important; }
          .ud-profile-name-row { flex-wrap: wrap !important; }
          .ud-profile-name-input { width: 100% !important; max-width: 100% !important; }
          .ud-plan-card { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
        }
      `}</style>
      {/* Header */}
      <div className="ud-profile-wrap" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, paddingTop: 0 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.5px" }}>Profile</h1>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#d1d5db" }}>
          <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Name */}
        <FieldRow label="Name">
          {editing ? (
            <div className="ud-profile-name-row" style={{ display:"flex", alignItems:"center", gap:10, marginTop:2 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="ud-profile-name-input"
                style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${BORDER}`, fontSize:15, color:TEXT, outline:"none", width:220, background:"#f9fafb" }}
                autoFocus />
              <button onClick={saveName} disabled={saving}
                style={{ padding:"8px 18px", borderRadius:8, background:G, color:"#fff", fontSize:13, fontWeight:700, border:"none", cursor:"pointer", opacity: saving ? .7 : 1 }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditing(false)}
                style={{ padding:"8px 14px", borderRadius:8, background:"transparent", color:MUTED, fontSize:13, fontWeight:500, border:`1px solid ${BORDER}`, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:16, color:TEXT, fontWeight:500 }}>{profile?.full_name || "—"}</span>
              <button onClick={() => setEditing(true)}
                style={{ fontSize:13, color:MUTED, background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>
                Update
              </button>
            </div>
          )}
        </FieldRow>

        {/* Email */}
        <FieldRow label="Email" info>
          <span style={{ fontSize:16, color:TEXT }}>{profile?.email}</span>
        </FieldRow>

        {/* Password */}
        <FieldRow label="Password">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <DotPassword />
            <button style={{ fontSize:13, color:MUTED, background:"none", border:"none", cursor:"pointer", fontWeight:500 }}>
              Change
            </button>
          </div>
        </FieldRow>

        {/* Member since */}
        <FieldRow label="Member since">
          <span style={{ fontSize:16, color:TEXT }}>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
              : "—"}
          </span>
        </FieldRow>

      </div>

      {/* Current plan */}
      <div className="ud-plan-card" style={{ marginTop:32, padding:"16px 20px", borderRadius:12, background: isActive ? "#f0fdf4" : "#fffbeb", border:`1px solid ${isActive ? "#86efac" : "#fde68a"}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:13, color:MUTED, marginBottom:4 }}>Current Plan</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:19, fontWeight:800, color:TEXT }}>{profile?.plan?.name ?? "Basic"}</span>
            <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background: isActive ? G : "#d97706", color:"#fff" }}>
              {(profile?.plan_status ?? "pending").toUpperCase()}
            </span>
          </div>
        </div>
        <Link href="/user/dashboard/subscription"
          style={{ fontSize:13, color:G, fontWeight:700, textDecoration:"none", border:`1px solid ${G}40`, padding:"7px 16px", borderRadius:8, background:"#fff" }}>
          Manage →
        </Link>
      </div>

      {/* Linked Accounts */}
      <section style={{ marginTop:40 }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:TEXT, marginBottom:20, letterSpacing:"-0.3px" }}>Linked Accounts</h2>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px", borderRadius:10, border:`1px solid ${BORDER}`, background:"#fff", width:"fit-content" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span style={{ fontSize:15, color:MUTED }}>Google</span>
        </div>
      </section>

      {/* Security Settings */}
      <section style={{ marginTop:40 }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:TEXT, marginBottom:8, letterSpacing:"-0.3px" }}>Security Settings</h2>
        <p style={{ fontSize:15, color:MUTED, lineHeight:1.6, maxWidth:500, margin:"0 0 8px" }}>
          Your extension settings are managed based on your subscription plan. Visit{" "}
          <Link href="/user/dashboard/settings" style={{ color:G, fontWeight:600, textDecoration:"none" }}>Settings</Link>{" "}
          to view your active security configuration.
        </p>
      </section>
    </div>
  );
}
