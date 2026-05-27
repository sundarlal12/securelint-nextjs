"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PricingCard, type PricingPlanDefinition } from "./PricingCard";
import LoginModal from "@/components/auth/LoginModal";
import s from "./PricingSection.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Period = "monthly" | "quarterly" | "annual";

interface Plan { id: string; name: string; price_monthly: number | null; }
interface PricingRow {
  billing_period: Period;
  price_per_month: number;
  total_price: number;
  discount_pct: number;
  savings_label: string;
}

const PERIOD_LABELS: Record<Period, string> = {
  monthly:   "Monthly",
  quarterly: "Quarterly",
  annual:    "Annual",
};

const FEATURES: Record<string, string[]> = {
  free: [
    "Secret detection & masking",
    "100+ real-time security checks",
    "Safe domain check",
    "URL pattern analysis",
    "Typosquat detection",
    "Crowd-powered protection",
    "Google Safe Browsing",
    "Free hosting detection",
    "Basic overlay on inputs & textareas",
    "Medium & low severity detection",
    "Export detection reports",
  ],
  pro: [
    "Everything in Free",
    "AI Brand Detection (any company worldwide)",
    "Clickjacking protection",
    "Pastejacking guard (blocks & restores clipboard)",
    "Hidden text attack protection",
    "Password breach monitoring (HaveIBeenPwned)",
    "Link hover scanner (score before click)",
    "Manual URL checker",
    "Real-time desktop notifications",
    "Advanced scan history & weekly stats",
    "Detects scams in 100+ languages",
    "Crypto scam & fake dApp detection",
    "Social engineering detection",
    "Fake CAPTCHA & ClickFix protection",
    "Multi-layer AI engine with auto failover",
    "Draggable widget & smart positioning",
    "Lifetime updates during subscription",
    "Early access to new features",
  ],
  enterprise: [
    "Everything in Pro",
    "Aggressive email DLP blocking",
    "WAF / social-domain protection",
    "Enterprise data collection",
    "Centralized admin dashboard",
    "Custom policy management",
    "Incident reporting & audit logs",
    "Dedicated support & SLA",
  ],
};

export function PricingSection() {
  const router = useRouter();
  const [period,      setPeriod]      = useState<Period>("annual");
  const [plans,       setPlans]       = useState<Plan[]>([]);
  const [proRows,     setProRows]     = useState<PricingRow[]>([]);
  const [freeRows,    setFreeRows]    = useState<PricingRow[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loginOpen,   setLoginOpen]   = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/plans`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/api/plan-pricing?plan_id=pro`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/api/plan-pricing?plan_id=free`).then(r => r.json()).catch(() => ({})),
    ]).then(([plansRes, proRes, freeRes]) => {
      if (plansRes.plans?.length) setPlans(plansRes.plans);
      if (proRes.pricing?.length)  setProRows(proRes.pricing);
      if (freeRes.pricing?.length) setFreeRows(freeRes.pricing);
    }).finally(() => setLoading(false));
  }, []);

  // Called when user clicks a paid plan CTA
  function handlePlanClick(planId: string, planName: string, priceMonthly: number) {
    const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
    if (token) {
      // Logged in — store billing intent and go to billing page
      localStorage.setItem("billing_plan_id",   planId);
      localStorage.setItem("billing_plan_name", planName);
      localStorage.setItem("billing_price",     String(priceMonthly));
      router.push("/user/dashboard/billing");
    } else {
      // Not logged in — save pending plan so LoginModal can redirect after login
      sessionStorage.setItem("pending_billing_plan_id",   planId);
      sessionStorage.setItem("pending_billing_plan_name", planName);
      sessionStorage.setItem("pending_billing_price",     String(priceMonthly));
      setLoginPrompt(true);
      setLoginOpen(true);
    }
  }

  const proRow     = proRows.find(r => r.billing_period === period)  || proRows[0];
  const freeRow    = freeRows.find(r => r.billing_period === period) || freeRows[0];
  const freePlan   = plans.find(p => p.id === "free");
  const proPlan    = plans.find(p => p.id === "pro");
  const entPlan    = plans.find(p => p.id === "enterprise");

  // Free price: from /api/plan-pricing for selected period, fallback to /api/plans
  const freeMonthly = freeRow?.price_per_month ?? freePlan?.price_monthly ?? 0;

  // Pro price: from /api/plan-pricing for selected period, fallback to /api/plans
  const proMonthly  = proRow?.price_per_month ?? proPlan?.price_monthly ?? 2999;
  const proTotal    = proRow?.total_price     ?? proMonthly;

  const proPrice: React.ReactNode = loading
    ? <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>Loading…</span>
    : <>₹{proMonthly.toLocaleString("en-IN")}<span className={s.inlinePer}>/mo</span></>;

  const proPeriodNote = proRow?.savings_label
    ? `Billed ₹${proTotal.toLocaleString("en-IN")} — ${proRow.savings_label}`
    : `Billed ₹${proTotal.toLocaleString("en-IN")} ${PERIOD_LABELS[period].toLowerCase()}`;

  const freeName = freePlan?.name ?? "Free";
  const proName  = proPlan?.name  ?? "Pro";

  const PLANS: PricingPlanDefinition[] = [
    {
      name:         freeName,
      priceDisplay: loading
        ? <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>Loading…</span>
        : <>{freeMonthly === 0 ? "₹0" : `₹${freeMonthly.toLocaleString("en-IN")}`}<span className={s.inlinePer}>/mo</span></>,
      period:       "Free forever for individuals",
      features:     FEATURES.free,
      ctaLabel:     "Get Started Free",
      ctaHref:      "",
      onCtaClick:   () => handlePlanClick("free", freeName, freeMonthly),
    },
    {
      name:         proName,
      priceDisplay: proPrice,
      period:       proPeriodNote,
      features:     FEATURES.pro,
      ctaLabel:     "Get Pro",
      ctaHref:      "",
      featured:     true,
      onCtaClick:   () => handlePlanClick("pro", proName, proMonthly),
    },
    {
      name:         entPlan?.name ?? "Enterprise",
      priceDisplay: "Contact Sales",
      priceSize:    "md",
      period:       "For teams & organizations",
      features:     FEATURES.enterprise,
      ctaLabel:     "Contact Sales →",
      ctaHref:      "/contact/sales",
    },
  ];

  return (
    <>
      <section id="pricing" className={s.section}>
        <div className={s.inner}>
          <header className={s.intro}>
            <h2>Choose the right plan</h2>
            <p>
              Start free. Upgrade when you need phishing protection, enterprise dashboards, or team-wide DLP.
            </p>
          </header>

          {/* Billing period toggle — above all cards */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
            {(["monthly", "quarterly", "annual"] as Period[]).map(p => {
              const row = proRows.find(r => r.billing_period === p);
              return (
                <button key={p} onClick={() => setPeriod(p)} type="button"
                  style={{
                    padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: `2px solid ${period === p ? "#1a7f37" : "#d0d7de"}`,
                    background: period === p ? "#1a7f37" : "#fff",
                    color: period === p ? "#fff" : "#57606a",
                    transition: "all .15s", position: "relative",
                  }}>
                  {PERIOD_LABELS[p]}
                  {row?.savings_label && period !== p && (
                    <span style={{
                      position: "absolute", top: -8, right: -4,
                      fontSize: 9, fontWeight: 800, background: "#f0fdf4",
                      color: "#1a7f37", border: "1px solid #1a7f3740",
                      padding: "1px 5px", borderRadius: 8,
                    }}>{row.discount_pct}% off</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Login prompt banner — shown when unauthenticated user clicks a plan */}
          {loginPrompt && !loginOpen && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
              padding: "14px 20px", borderRadius: 10, marginBottom: 24,
              background: "#fffbeb", border: "1px solid #f59e0b60",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🔐</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e" }}>Log in to continue</div>
                  <div style={{ fontSize: 12, color: "#78350f" }}>You need an account to subscribe to a plan.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setLoginOpen(true)}
                  style={{ padding: "8px 20px", borderRadius: 8, background: "#1a7f37", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Log in
                </button>
                <button onClick={() => setLoginPrompt(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, background: "transparent", color: "#78350f", fontSize: 13, border: "1px solid #f59e0b80", cursor: "pointer" }}>
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className={s.grid}>
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Login modal — opens when unauthenticated user clicks a plan */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        defaultTab="login"
      />
    </>
  );
}
