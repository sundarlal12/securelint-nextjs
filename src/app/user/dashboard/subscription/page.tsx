"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface Plan { id: string; name: string; price_monthly: number; }

const FEATURES: Record<string, string[]> = {
  free:       ["Browser extension access", "Basic secret detection", "5 scans / day"],
  beginner:   ["Browser extension access", "Basic secret detection", "5 scans / day"],
  pro:        ["Everything in Beginner", "Unlimited scans", "API access", "Priority support", "Advanced analytics"],
  enterprise: ["Everything in Pro", "Team organisation", "Custom policies", "Dedicated support", "SLA guarantee"],
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans,       setPlans]       = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [planStatus,  setPlanStatus]  = useState("pending");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    Promise.all([
      fetch(`${API_BASE}/api/plans`).then(r => r.json()),
      fetch(`${API_BASE}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([planData, me]) => {
      const filtered = (planData.plans || []).filter((p: Plan) => p.id !== "enterprise")
        .map((p: Plan) => ({ ...p, name: p.id === "free" ? "Beginner" : p.name }));
      setPlans(filtered.length ? filtered : [{ id:"free",name:"Beginner",price_monthly:0 },{ id:"pro",name:"Pro",price_monthly:29 }]);
      setCurrentPlan(me.plan?.id || "free");
      setPlanStatus(me.plan_status || "pending");
    }).finally(() => setLoading(false));
  }, []);

  function choosePlan(plan: Plan) {
    if (plan.price_monthly === 0) return; // free — nothing to pay
    localStorage.setItem("billing_plan_id",   plan.id);
    localStorage.setItem("billing_plan_name", plan.name);
    localStorage.setItem("billing_price",     String(plan.price_monthly));
    router.push("/user/dashboard/billing");
  }

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:28 }}>Subscription</h1>
      {[1,2].map(i => <div key={i} style={{ height:160, borderRadius:10, background:"linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", marginBottom:14 }} />)}
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:6 }}>Subscription</h1>
      <p style={{ fontSize:14, color:"#57606a", marginBottom:28 }}>See your current plan details. Choose a plan to unlock the full SecureLint experience.</p>

      {/* Plan cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
        {plans.map(plan => {
          const isCurrent = currentPlan === plan.id;
          const isPro     = plan.id === "pro";
          const accent    = isPro ? "#1a7f37" : "#57606a";
          const features  = FEATURES[plan.id] || FEATURES[plan.name?.toLowerCase()] || [];
          return (
            <div key={plan.id} style={{ background:"#fff", border:`1.5px solid ${isCurrent ? "#1a7f37" : "#d0d7de"}`, borderRadius:12, padding:"24px 20px", position:"relative" }}>
              {isPro && <div style={{ position:"absolute", top:-10, left:20, background:"#1a7f37", color:"#fff", fontSize:10, fontWeight:800, padding:"3px 12px", borderRadius:20 }}>POPULAR</div>}
              <div style={{ fontSize:11, color:"#57606a", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>
                {isPro ? "For Individuals Or Teams" : "For Individuals"}
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>{plan.name}</div>
              <div style={{ fontSize:13, color:"#57606a", marginBottom:16 }}>
                {plan.price_monthly === 0 ? "Get started for free, always." : `Everything you need for advanced security.`}
              </div>

              {isCurrent ? (
                <div style={{ padding:"10px", borderRadius:8, background:"#f6f8fa", textAlign:"center", fontSize:13, fontWeight:600, color:"#57606a", marginBottom:16 }}>
                  {planStatus === "active" ? "✓ Current Plan" : "⏳ Payment Pending"}
                </div>
              ) : (
                <button onClick={() => choosePlan(plan)}
                  style={{ width:"100%", padding:"10px", borderRadius:8, background: accent, color:"#fff", fontSize:13, fontWeight:700, border:"none", cursor:"pointer", marginBottom:16 }}>
                  {plan.price_monthly === 0 ? "Downgrade" : "Get Started →"}
                </button>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#1a1a2e" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1a7f37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {planStatus !== "active" && (
        <div style={{ padding:"16px 20px", borderRadius:10, background:"#fff8c5", border:"1px solid #d4a60050", fontSize:13, color:"#7d4e00" }}>
          Your <strong>{currentPlan}</strong> plan is pending payment.{" "}
          <button onClick={() => router.push("/user/dashboard/billing")}
            style={{ color:"#1a7f37", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontSize:13 }}>
            Complete payment →
          </button>
        </div>
      )}
    </div>
  );
}
