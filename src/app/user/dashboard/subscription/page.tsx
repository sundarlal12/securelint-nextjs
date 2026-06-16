"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCachedProfile, getCachedPlans, revalidateProfile, revalidatePlans } from "@/lib/userCache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";
const G = "#007b70";   // teal-green matching design
const G_DARK = "#00665c";
const BORDER = "#e5e7eb";
const TEXT = "#111827";
const MUTED = "#6b7280";

interface Plan { id: string; name: string; price_monthly: number | null; }

const FEATURES: Record<string, { text: string; bold?: boolean }[]> = {
  pro: [
    { text: "Real-time phishing detection on every page", bold: true },
    { text: "SSL certificate real-time check" },
    { text: "Domain age real-time alert (new domains flagged)" },
    { text: "Suspicious redirect chain detection" },
    { text: "Real-time URL risk scoring" },
    { text: "API key & secret detection — 100+ patterns" },
    { text: "AWS, GCP, Azure credential masking" },
    { text: "JWT, OAuth & database password masking" },
    { text: "AI Brand Detection (any company worldwide)" },
    { text: "Homograph / IDN & typosquat protection" },
    { text: "Crypto scam & fake dApp detection" },
    { text: "Password breach monitoring (HaveIBeenPwned)" },
    { text: "Clickjacking & pastejacking protection" },
    { text: "Link hover scanner — risk score before click" },
    { text: "Real-time desktop threat notifications" },
    { text: "Advanced scan history & weekly stats" },
    { text: "Detects scams in 100+ languages" },
    { text: "Multi-layer AI engine with auto failover" },
    { text: "Priority support" },
  ],
  enterprise: [
    { text: "Everything included in Pro", bold: true },
    { text: "Real-time phishing, SSL & domain age checks for all users" },
    { text: "Aggressive email DLP & send blocking" },
    { text: "WAF / social-domain blocking" },
    { text: "Centralized admin dashboard" },
    { text: "Custom policy management" },
    { text: "Incident reporting & audit logs" },
    { text: "Enterprise data collection & telemetry" },
    { text: "Unlimited team members" },
    { text: "Dedicated support & SLA" },
  ],
};

const PLAN_META: Record<string, { audience: string; tagline: string }> = {
  pro:        { audience: "For Individuals Or Teams", tagline: "Real-time API key masking, phishing detection, SSL checks, and domain age alerts." },
  enterprise: { audience: "For Larger Organisations", tagline: "Everything in Pro plus enterprise DLP, email blocking, and admin dashboards." },
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
      <path d="M5 13l4 4L19 7" stroke={G} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans,        setPlans]        = useState<Plan[]>([]);
  const [currentPlan,  setCurrentPlan]  = useState("free");
  const [planStatus,   setPlanStatus]   = useState("pending");
  const [loading,      setLoading]      = useState(true);
  const [payuNotice,   setPayuNotice]   = useState("");

  // Suppress unused warning — API_BASE kept for future direct calls
  void API_BASE;

  function applyData(plans: Plan[], planId: string, status: string) {
    const withEnt = plans.some(p => p.id === "enterprise")
      ? plans
      : [...plans, { id:"enterprise", name:"Enterprise", price_monthly: null }];
    // Only show Pro and Enterprise — Basic/free is hidden
    const filtered = withEnt.filter(p => p.id !== "free" && p.id !== "basic");
    setPlans(filtered.length >= 2 ? filtered : [
      { id:"pro",        name:"Pro",        price_monthly: 1999 },
      { id:"enterprise", name:"Enterprise", price_monthly: null },
    ]);
    setCurrentPlan(planId);
    setPlanStatus(status);
  }

  useEffect(() => {
    const authToken = localStorage.getItem("user_token");
    if (!authToken) return;

    const payuResult = searchParams.get("payu");
    const payuTxnid  = searchParams.get("txnid") || "";
    const payuPlanId = searchParams.get("plan_id") || "";

    async function loadProfile() {
      const cachedProfile = getCachedProfile();
      const cachedPlans   = getCachedPlans();
      if (cachedProfile && cachedPlans.length) {
        applyData(cachedPlans, cachedProfile.plan?.id || "free", cachedProfile.plan_status || "pending");
        setLoading(false);
      }

      if (payuResult === "success" && payuTxnid) {
        await fetch(`${API_BASE}/api/payment/payu-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
          body: JSON.stringify({ txnid: payuTxnid, status: "success" }),
        }).catch(() => null);
      }

      const [freshPlans, freshProfile] = await Promise.all([
        revalidatePlans(),
        revalidateProfile(authToken ?? ""),
      ]);

      const plans  = freshPlans.length  ? freshPlans  : cachedPlans;
      const planId = freshProfile?.plan?.id   || payuPlanId || cachedProfile?.plan?.id   || "free";
      const status = freshProfile?.plan_status || cachedProfile?.plan_status || "pending";
      applyData(plans, planId, status);

      if (payuResult === "success") {
        if (status === "active") {
          setPayuNotice(`${planId.charAt(0).toUpperCase() + planId.slice(1)} plan activated successfully.`);
          localStorage.setItem("user_plan_status", "active");
          localStorage.setItem("user_plan_id", planId);
        } else if (payuTxnid) {
          setPayuNotice("Payment received. Your plan is still activating — refresh in a moment if needed.");
        } else {
          setPayuNotice("Payment may have succeeded but activation did not complete. Please contact support or try again from Billing.");
        }
        router.replace("/user/dashboard/subscription");
      }
    }

    loadProfile().finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function choosePlan(plan: Plan) {
    if (!plan.price_monthly) return;
    localStorage.setItem("billing_plan_id",   plan.id);
    localStorage.setItem("billing_plan_name", plan.name);
    localStorage.setItem("billing_price",     String(plan.price_monthly));
    router.push("/user/dashboard/billing");
  }

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ height:36, width:180, borderRadius:8, marginBottom:20, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:32 }}>
        {[1,2].map(i => <div key={i} style={{ height:400, borderRadius:10, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200%", animation:"shimmer 1.4s infinite" }} />)}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:TEXT, margin:0, letterSpacing:"-0.5px" }}>Subscription</h1>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="#d1d5db">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
        </svg>
      </div>
      <p style={{ fontSize:15, color:MUTED, marginBottom:44, lineHeight:1.5 }}>
        See your current plan details. Choose a plan to get the full SecureLint security experience.
      </p>

      {payuNotice && (
        <div style={{ padding:"14px 18px", borderRadius:10, background:"#f0fdf4", border:"1px solid #86efac", fontSize:13, color:"#16a34a", marginBottom:32 }}>
          {payuNotice}
        </div>
      )}

      {planStatus !== "active" && currentPlan !== "free" && !payuNotice && (
        <div style={{ padding:"14px 18px", borderRadius:10, background:"#fffbeb", border:"1px solid #fde68a", fontSize:13, color:"#92400e", marginBottom:32, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>Your <strong>{currentPlan}</strong> plan payment is pending.</span>
          <button onClick={() => router.push("/user/dashboard/billing")}
            style={{ color:G, background:"none", border:"none", cursor:"pointer", fontWeight:700, fontSize:13 }}>
            Complete payment →
          </button>
        </div>
      )}

      {/* 3-column plan grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:40 }}>
        {plans.map(plan => {
          const key      = plan.id;
          const meta     = PLAN_META[key] || PLAN_META.pro;
          const features = FEATURES[key] || FEATURES.pro;
          const isCurrent = currentPlan === plan.id;
          const isEnt     = plan.id === "enterprise";

          return (
            <div key={plan.id} style={{ display:"flex", flexDirection:"column" }}>
              {/* Audience */}
              <div style={{ fontSize:13, color:MUTED, fontWeight:500, marginBottom:8 }}>{meta.audience}</div>
              {/* Plan name */}
              <h2 style={{ fontSize:36, fontWeight:900, color:TEXT, margin:"0 0 12px", letterSpacing:"-1px", lineHeight:1.1 }}>
                {plan.name}
              </h2>
              {/* Tagline */}
              <p style={{ fontSize:14, color:MUTED, lineHeight:1.6, marginBottom:28, minHeight:44 }}>{meta.tagline}</p>

              {/* CTA */}
              {isCurrent ? (
                planStatus === "active" ? (
                  <div style={{ width:"100%", padding:"12px 0", borderRadius:10, background:"#eff2fc", textAlign:"center", fontSize:14, fontWeight:700, color:MUTED, marginBottom:32, border:`1px solid ${BORDER}`, boxSizing:"border-box" }}>
                    ✓ Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.setItem("billing_plan_id",   plan.id);
                      localStorage.setItem("billing_plan_name", plan.name);
                      localStorage.setItem("billing_price",     String(plan.price_monthly ?? 0));
                      router.push("/user/dashboard/billing");
                    }}
                    style={{
                      width:"100%", padding:"12px 0", borderRadius:10,
                      background:"#f97316", color:"#fff",
                      fontSize:14, fontWeight:700, border:"none",
                      cursor:"pointer", marginBottom:32,
                      boxSizing:"border-box", transition:"background .15s",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#ea6c05")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#f97316")}
                  >
                    ⏳ Complete Payment
                  </button>
                )
              ) : isEnt ? (
                <a href="/contact/sales"
                  style={{ display:"block", width:"100%", padding:"12px 0", borderRadius:10, background:G, color:"#fff", fontSize:14, fontWeight:700, textAlign:"center", textDecoration:"none", marginBottom:32, transition:"background .15s", boxSizing:"border-box" }}
                  onMouseEnter={e => (e.currentTarget.style.background = G_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.background = G)}>
                  Contact Sales
                </a>
              ) : (
                <button onClick={() => choosePlan(plan)}
                  style={{ width:"100%", padding:"12px 0", borderRadius:10, background:G, color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", marginBottom:32, transition:"background .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = G_DARK)}
                  onMouseLeave={e => (e.currentTarget.style.background = G)}>
                  Get Started
                </button>
              )}

              {/* Feature list */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                    <CheckIcon />
                    <span style={{ fontSize:14, color: f.bold ? TEXT : MUTED, fontWeight: f.bold ? 700 : 400, lineHeight:1.5 }}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
