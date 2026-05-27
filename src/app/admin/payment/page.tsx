"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";

interface Plan { id: string; name: string; price_monthly: number; }

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("rzp-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id  = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["Browser extension access", "Basic secret detection", "5 scans/day", "Email alerts"],
  pro:  ["Everything in Free", "Unlimited scans", "API access", "Priority support", "Advanced analytics"],
};

export default function PaymentPage() {
  const router = useRouter();
  const [plans,       setPlans]       = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [selected,    setSelected]    = useState("free");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  useEffect(() => {
    if (!token) { router.replace("/admin/login"); return; }

    // Load plans
    fetch(`${API_BASE}/api/plans`)
      .then(r => r.json())
      .then(d => {
        const filtered = (d.plans || []).filter((p: Plan) => p.id !== "enterprise");
        setPlans(filtered.length ? filtered : [
          { id: "free", name: "Free",  price_monthly: 0  },
          { id: "pro",  name: "Pro",   price_monthly: 29 },
        ]);
      })
      .catch(() => setPlans([
        { id: "free", name: "Free",  price_monthly: 0  },
        { id: "pro",  name: "Pro",   price_monthly: 29 },
      ]));

    // Get current plan from localStorage
    const storedPlan = localStorage.getItem("admin_plan_id") || "free";
    setCurrentPlan(storedPlan);
    setSelected(storedPlan === "pro" ? "pro" : "free");
  }, [router, token]);

  const handlePayment = useCallback(async () => {
    setError(""); setLoading(true);
    try {
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ plan_id: selected }),
      });
      const order = await orderRes.json();

      if (order.error === 1) { setError(order.message || "Failed to create order."); return; }

      // Free plan activated directly
      if (order.free) {
        localStorage.setItem("admin_plan_status", "active");
        localStorage.setItem("admin_plan_id",     selected);
        setSuccess("Free plan activated! Redirecting...");
        setTimeout(() => router.replace("/dashboard"), 1500);
        return;
      }

      // Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) { setError("Failed to load payment gateway. Check your connection."); return; }

      const rzp = new window.Razorpay({
        key:         order.key_id,
        amount:      order.amount,
        currency:    order.currency,
        name:        "SecureLint",
        description: `${order.plan_name} Plan`,
        order_id:    order.order_id,
        theme:       { color: "#39d353" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify payment on backend
          const verRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan_id:             selected,
            }),
          });
          const ver = await verRes.json();
          if (ver.error === 1) { setError(ver.message || "Payment verification failed."); return; }

          localStorage.setItem("admin_plan_status", "active");
          localStorage.setItem("admin_plan_id",     selected);
          setSuccess(`${selected.charAt(0).toUpperCase() + selected.slice(1)} plan activated! Redirecting...`);
          setTimeout(() => router.replace("/dashboard"), 1500);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selected, token, router]);

  const accentFor = (id: string) => id === "pro" ? "#f59e0b" : "#8b949e";

  return (
    <div style={{ minHeight: "100vh", background: "#080b0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ width: "100%", maxWidth: 560, animation: "fadeIn .3s ease" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#0f2318,#1f4a3c)", border: "1px solid #39d35340", marginBottom: 14 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#39d353" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e6edf3" }}>Activate Your Plan</div>
          <div style={{ fontSize: 13, color: "#8b949e", marginTop: 6 }}>Choose a plan to unlock your SecureLint dashboard</div>
        </div>

        {/* Plan Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {(plans.length ? plans : [
            { id: "free", name: "Free", price_monthly: 0 },
            { id: "pro",  name: "Pro",  price_monthly: 29 },
          ]).map(plan => {
            const accent  = accentFor(plan.id);
            const isPro   = plan.id === "pro";
            const isActive = selected === plan.id;
            return (
              <div key={plan.id} onClick={() => setSelected(plan.id)}
                style={{ background: "#0d1117", border: `1.5px solid ${isActive ? (isPro ? "#f59e0b" : "#39d353") : "#21262d"}`, borderRadius: 14, padding: "20px 18px", cursor: "pointer", transition: "border-color .2s", position: "relative" }}>
                {isPro && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#0d1117", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 20, letterSpacing: "0.05em" }}>RECOMMENDED</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>{plan.name}</div>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${isActive ? accent : "#21262d"}`, background: isActive ? accent : "transparent", transition: ".2s" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: accent }}>₹{plan.price_monthly}</span>
                  <span style={{ fontSize: 12, color: "#6e7681" }}>/month</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(PLAN_FEATURES[plan.id] || []).map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#8b949e" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action area */}
        <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 14, padding: 24 }}>

          {/* Selected summary */}
          {selected && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "12px 14px", borderRadius: 10, background: "#161b22" }}>
              <div>
                <div style={{ fontSize: 12, color: "#6e7681", marginBottom: 2 }}>Selected Plan</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e6edf3" }}>
                  {plans.find(p => p.id === selected)?.name ?? selected}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: accentFor(selected) }}>
                  ₹{plans.find(p => p.id === selected)?.price_monthly ?? 0}
                </div>
                <div style={{ fontSize: 11, color: "#6e7681" }}>per month</div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1a0f0f", border: "1px solid #dc262644", color: "#dc2626", fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#0a1a10", border: "1px solid #39d35344", color: "#39d353", fontSize: 13, marginBottom: 14 }}>
              {success}
            </div>
          )}

          {/* Razorpay badge */}
          {selected !== "free" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6e7681", marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#39d353" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Secured by Razorpay · UPI, Cards, Net Banking accepted
            </div>
          )}

          <button onClick={handlePayment} disabled={loading || !!success}
            style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: loading || success ? "#1f4a3c" : "#39d353", color: "#0d1117", fontSize: 15, fontWeight: 700, cursor: loading || success ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background .2s" }}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: "2px solid #39d35360", borderTop: "2px solid #39d353", borderRadius: "50%", animation: "spin .8s linear infinite" }} />Processing...</>
              : selected === "free"
                ? "Activate Free Plan →"
                : `Pay ₹${plans.find(p => p.id === selected)?.price_monthly ?? 0} with Razorpay →`}
          </button>

          <div style={{ marginTop: 14, textAlign: "center", fontSize: 12, color: "#484f58" }}>
            {currentPlan !== "free" && (
              <span>Current plan: <strong style={{ color: "#8b949e" }}>{currentPlan}</strong> · </span>
            )}
            <button onClick={() => { localStorage.clear(); router.replace("/admin/login"); }}
              style={{ background: "none", border: "none", color: "#484f58", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
