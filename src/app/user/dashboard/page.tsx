"use client";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface Profile { user_id: string; email: string; full_name: string; created_at: string; plan: { id: string; name: string; price_monthly: number }; plan_status: string; }

const row = (label: string, value: React.ReactNode, action?: React.ReactNode) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0", borderBottom:"1px solid #d0d7de" }}>
    <div>
      <div style={{ fontSize:12, color:"#57606a", marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:15, color:"#1a1a2e", fontWeight:500 }}>{value}</div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [saving,  setSaving]    = useState(false);
  const [msg,     setMsg]       = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(`${API_BASE}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setProfile(d);
        setNewName(d.full_name || "");
        localStorage.setItem("user_email", d.email || "");
      })
      .finally(() => setLoading(false));
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
        setProfile(p => p ? { ...p, full_name: newName } : p);
        setEditing(false);
        setMsg("Name updated.");
        setTimeout(() => setMsg(""), 3000);
      }
    } finally { setSaving(false); }
  }

  const Shimmer = () => <div style={{ height:20, borderRadius:4, background:"linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", marginBottom:8 }} />;

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:28 }}>Profile</h1>
      {[1,2,3,4].map(i => <Shimmer key={i} />)}
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:4 }}>Profile</h1>
      {msg && <div style={{ fontSize:13, color:"#1a7f37", marginBottom:12 }}>{msg}</div>}

      {/* Name */}
      <div style={{ padding:"18px 0", borderBottom:"1px solid #d0d7de" }}>
        <div style={{ fontSize:12, color:"#57606a", marginBottom:3 }}>Name</div>
        {editing ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:6 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              style={{ padding:"8px 12px", borderRadius:6, border:"1px solid #d0d7de", fontSize:14, outline:"none", width:220 }} />
            <button onClick={saveName} disabled={saving}
              style={{ padding:"8px 16px", borderRadius:6, background:"#1a7f37", color:"#fff", fontSize:13, fontWeight:600, border:"none", cursor:"pointer" }}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding:"8px 16px", borderRadius:6, background:"#f6f8fa", color:"#57606a", fontSize:13, border:"1px solid #d0d7de", cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:15, color:"#1a1a2e", fontWeight:500 }}>{profile?.full_name || "—"}</span>
            <button onClick={() => setEditing(true)}
              style={{ fontSize:13, color:"#1a7f37", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
              Update
            </button>
          </div>
        )}
      </div>

      {row("Email", <span style={{ display:"flex", alignItems:"center", gap:6 }}>{profile?.email}<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#57606a" strokeWidth="1.5"/><path d="M12 8v4M12 16h.01" stroke="#57606a" strokeWidth="1.5" strokeLinecap="round"/></svg></span>)}
      {row("Password", "••••••••", <button style={{ fontSize:13, color:"#1a7f37", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Change</button>)}
      {row("Member since", profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }) : "—")}

      {/* Current plan badge */}
      <div style={{ marginTop:28, padding:"16px 20px", borderRadius:10, background: profile?.plan_status === "active" ? "#dafbe1" : "#fff8c5", border:`1px solid ${profile?.plan_status === "active" ? "#1a7f3730" : "#d4a60050"}` }}>
        <div style={{ fontSize:12, color:"#57606a", marginBottom:4 }}>Current Plan</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18, fontWeight:800, color:"#1a1a2e" }}>{profile?.plan?.name ?? "—"}</span>
          <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background: profile?.plan_status === "active" ? "#1a7f37" : "#d4a600", color:"#fff" }}>
            {profile?.plan_status?.toUpperCase() ?? "PENDING"}
          </span>
          {profile?.plan?.price_monthly === 0 ? <span style={{ fontSize:13, color:"#57606a" }}>Free</span> : <span style={{ fontSize:13, color:"#57606a" }}>${profile?.plan?.price_monthly}/mo</span>}
        </div>
        {profile?.plan_status !== "active" && (
          <div style={{ fontSize:12, color:"#7d4e00", marginTop:8 }}>Complete payment to activate your plan. <a href="/user/dashboard/subscription" style={{ color:"#1a7f37", fontWeight:600, textDecoration:"none" }}>Go to Subscription →</a></div>
        )}
      </div>

      {/* Linked accounts */}
      <h2 style={{ fontSize:17, fontWeight:700, color:"#1a1a2e", marginTop:32, marginBottom:12 }}>Linked Accounts</h2>
      <div style={{ padding:"14px 16px", borderRadius:8, border:"1px solid #d0d7de", background:"#fff", display:"flex", alignItems:"center", gap:10, fontSize:14, color:"#1a1a2e" }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </div>
    </div>
  );
}
