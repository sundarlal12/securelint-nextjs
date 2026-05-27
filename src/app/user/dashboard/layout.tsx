"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/user/dashboard",              label: "Profile",      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { href: "/user/dashboard/subscription", label: "Subscription", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/></svg> },
  { href: "/user/dashboard/settings",     label: "Settings",     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/></svg> },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar]   = useState("U");
  const [email,  setEmail]    = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [checked, setChecked]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) { router.replace("/"); return; }
    const em = localStorage.getItem("user_email") || "";
    setEmail(em);
    setAvatar((em || "U")[0].toUpperCase());
    setChecked(true);
  }, [router]);

  if (!checked) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f6f8fa" }}>
      <div style={{ width:32, height:32, border:"3px solid #d0d7de", borderTop:"3px solid #1a7f37", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f6f8fa", fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width:64, background:"#fff", borderRight:"1px solid #d0d7de", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, gap:4, position:"fixed", top:0, left:0, height:"100vh", zIndex:50 }}>
        {/* Logo */}
        <div style={{ width:40, height:40, borderRadius:10, background:"#1a7f37", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        {NAV.map(n => {
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href} title={n.label}
              style={{ width:48, height:48, borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, color: active ? "#1a7f37" : "#57606a", background: active ? "#dafbe1" : "transparent", textDecoration:"none", transition:".15s", fontSize:9, fontWeight:600 }}>
              {n.icon}
              <span style={{ fontSize:8 }}>{n.label}</span>
            </Link>
          );
        })}

        {/* Avatar at bottom */}
        <div style={{ marginTop:"auto", marginBottom:16, position:"relative" }}>
          <button onClick={() => setShowMenu(!showMenu)}
            style={{ width:36, height:36, borderRadius:"50%", background:"#1a7f37", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {avatar}
          </button>
          {showMenu && (
            <div style={{ position:"absolute", bottom:44, left:0, background:"#fff", border:"1px solid #d0d7de", borderRadius:10, padding:8, minWidth:160, boxShadow:"0 8px 24px rgba(0,0,0,.12)", zIndex:100 }}>
              <div style={{ fontSize:12, color:"#57606a", padding:"4px 8px 8px", borderBottom:"1px solid #d0d7de", marginBottom:6 }}>{email || "Your account"}</div>
              <button onClick={() => { setShowMenu(false); router.push("/user/dashboard"); }}
                style={{ display:"block", width:"100%", padding:"6px 8px", fontSize:13, color:"#1a1a2e", background:"none", border:"none", textAlign:"left", cursor:"pointer", borderRadius:6 }}>
                Your account
              </button>
              <button onClick={() => { localStorage.removeItem("user_token"); localStorage.removeItem("user_refresh_token"); router.replace("/"); }}
                style={{ display:"block", width:"100%", padding:"6px 8px", fontSize:13, color:"#cf222e", background:"none", border:"none", textAlign:"left", cursor:"pointer", borderRadius:6 }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft:64, flex:1, padding:"40px 48px", maxWidth:900 }}>
        {children}
      </main>
    </div>
  );
}
