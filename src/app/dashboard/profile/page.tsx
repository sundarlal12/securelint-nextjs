"use client";
import { useState, useEffect } from "react";
import { fetchProfile } from "@/lib/adminApi";
import Link from "next/link";

const card: React.CSSProperties = { background: "#0d1117", border: "1px solid #21262d", borderRadius: 14 };
const sk = (w: number | string, h: number, r = 5): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: "#1b222c",
  animation: "sk-pulse 1.4s ease-in-out infinite", display: "inline-block",
});

interface Profile {
  email: string;
  display_name: string;
  org_id: string;
  role: string;
  company_name: string;
  plan: string;
  plan_status: string;
  registered_at: string;
  user_id: string;
}

function Row({ label, value, mono = false, copyable = false }: {
  label: string; value: string; mono?: boolean; copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #161b22", gap: 16 }}>
      <span style={{ fontSize: 12, color: "#6e7681", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0, minWidth: 150 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 13, color: "#e6edf3", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all", textAlign: "right" }}>{value || "—"}</span>
        {copyable && value && (
          <button onClick={copy} style={{ flexShrink: 0, padding: "2px 8px", fontSize: 10, fontWeight: 600, border: "1px solid #30363d", borderRadius: 6, background: copied ? "#0f2318" : "transparent", color: copied ? "#39d353" : "#8b949e", cursor: "pointer" }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, color, background: bg, border: `1px solid ${border}`, textTransform: "capitalize" }}>
      {label}
    </span>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then((d) => { if (d) setProfile(d as Profile); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avatarLetter = (profile?.display_name || profile?.email || "A")[0]?.toUpperCase();
  const registeredDate = profile?.registered_at
    ? new Date(profile.registered_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const roleColor   = profile?.role === "owner" ? { color: "#a855f7", bg: "#1a0a2e", border: "#6b21a8" } : { color: "#2dd4bf", bg: "#0a2022", border: "#0e7490" };
  const planColor   = profile?.plan_status === "active" ? { color: "#39d353", bg: "#0f2318", border: "#134d2f" } : { color: "#f59e0b", bg: "#2d1a00", border: "#78350f" };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:.4}50%{opacity:.9}}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/dashboard/settings" style={{ fontSize: 12, color: "#8b949e", textDecoration: "none" }}>Settings</Link>
          <span style={{ color: "#4a5568" }}>/</span>
          <span style={{ fontSize: 12, color: "#e6edf3" }}>My Profile</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.5px", margin: "8px 0 4px" }}>My Profile</h2>
        <p style={{ fontSize: 14, color: "#8b949e", margin: 0 }}>Your enterprise account and organisation details.</p>
      </div>

      {/* Identity card */}
      <div style={{ ...card, padding: "28px 28px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          {/* Avatar */}
          {loading
            ? <div style={sk(72, 72, 36)} />
            : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #39d353, #1fa97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#041109", flexShrink: 0, boxShadow: "0 0 0 3px #0d1117, 0 0 0 5px #39d35344" }}>
                {avatarLetter}
              </div>
            )
          }
          <div>
            {loading
              ? <><div style={sk(160, 18, 4)} /><div style={{ ...sk(120, 12, 3), marginTop: 8 }} /></>
              : <>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.3px" }}>{profile?.display_name || "Admin"}</div>
                  <div style={{ fontSize: 13, color: "#8b949e", marginTop: 3 }}>{profile?.email}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <Badge label={profile?.role || "admin"} {...roleColor} />
                    <Badge label={`${profile?.plan || "enterprise"} · ${profile?.plan_status || "active"}`} {...planColor} />
                  </div>
                </>
            }
          </div>
        </div>

        <div style={{ height: 1, background: "#21262d", marginBottom: 4 }} />

        {/* Details rows */}
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #161b22", display: "flex", justifyContent: "space-between" }}>
                <div style={sk(110, 10)} /><div style={sk(180, 10)} />
              </div>
            ))
          : <>
              <Row label="Full Name"        value={profile?.display_name || "—"} />
              <Row label="Email Address"    value={profile?.email || "—"} />
              <Row label="Role"             value={(profile?.role || "admin").charAt(0).toUpperCase() + (profile?.role || "admin").slice(1)} />
              <Row label="Organisation ID"  value={profile?.org_id || "—"} mono copyable />
              <Row label="User ID"          value={profile?.user_id || "—"} mono copyable />
              {profile?.company_name && <Row label="Company" value={profile.company_name} />}
              <Row label="Member Since"     value={registeredDate} />
            </>
        }
      </div>

      {/* Plan card */}
      <div style={{ ...card, padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e6edf3" }}>Subscription &amp; Plan</span>
          {!loading && <Badge label={`${profile?.plan_status || "active"}`} {...planColor} />}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Plan",     value: loading ? "" : (profile?.plan || "Enterprise").charAt(0).toUpperCase() + (profile?.plan || "Enterprise").slice(1), accent: "#39d353" },
            { label: "Status",   value: loading ? "" : (profile?.plan_status || "Active").charAt(0).toUpperCase() + (profile?.plan_status || "Active").slice(1), accent: profile?.plan_status === "active" ? "#39d353" : "#f59e0b" },
            { label: "Access",   value: loading ? "" : "Unlimited",  accent: "#2dd4bf" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "14px 16px", background: "#0a0e14", borderRadius: 10, border: "1px solid #161b22" }}>
              {loading
                ? <><div style={sk("50%", 16, 4)} /><div style={{ ...sk("70%", 10, 3), marginTop: 6 }} /></>
                : <>
                    <div style={{ fontSize: 18, fontWeight: 800, color: m.accent }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: "#6e7681", marginTop: 4 }}>{m.label}</div>
                  </>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
