"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

declare global { interface Window { Razorpay: any; } } // eslint-disable-line @typescript-eslint/no-explicit-any

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("rzp-js")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-js"; s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface PricingRow {
  plan_id:        string;
  billing_period: string;  // "monthly" | "quarterly" | "annual"
  price_per_month: number;
  total_price:    number;
  discount_pct:   number;
  badge:          string;
  savings_label:  string;
  sort_order:     number;
}

const inp: React.CSSProperties = { width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #d0d7de", fontSize:14, outline:"none", boxSizing:"border-box", background:"#fff", color:"#1a1a2e" };
const lbl: React.CSSProperties = { display:"block", fontSize:12, fontWeight:600, color:"#57606a", marginBottom:5 };

const PERIOD_LABELS: Record<string, string> = { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };

export default function BillingPage() {
  const router = useRouter();
  const [planId,     setPlanId]     = useState("pro");
  const [planName,   setPlanName]   = useState("Pro");
  const [period,     setPeriod]     = useState("annual");
  const [step,       setStep]       = useState<"choose"|"pay">("choose");
  const [fullName,   setFullName]   = useState("");
  const [country,    setCountry]    = useState("IN");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [pricing,    setPricing]    = useState<PricingRow[]>([]);
  const [priceLoad,  setPriceLoad]  = useState(true);

  // Load plan info from localStorage and fetch pricing from API
  useEffect(() => {
    const pid  = localStorage.getItem("billing_plan_id")   || "pro";
    const pnm  = localStorage.getItem("billing_plan_name") || "Pro";
    const nm   = localStorage.getItem("user_full_name")    || "";
    setPlanId(pid);
    setPlanName(pnm);
    setFullName(nm);

    fetch(`${API_BASE}/api/plan-pricing?plan_id=${pid}`)
      .then(r => r.json())
      .then(d => {
        if (d.pricing?.length) {
          setPricing(d.pricing);
          setPeriod(d.pricing[0].billing_period);   // default to first (annual)
        }
      })
      .catch(() => {})
      .finally(() => setPriceLoad(false));
  }, []);

  const sel = pricing.find(p => p.billing_period === period) || pricing[0];

  const handlePay = useCallback(async () => {
    if (!fullName.trim()) { setError("Full name is required."); return; }
    setError(""); setLoading(true);
    try {
      const token = localStorage.getItem("user_token") || "";
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_id: planId, billing_period: period }),
      });
      const order = await orderRes.json();
      if (order.error === 1) { setError(order.message || "Failed to create order."); return; }

      // Free plan — no Razorpay needed
      if (order.free) {
        localStorage.setItem("user_plan_status", "active");
        localStorage.setItem("user_plan_id", planId);
        setSuccess(`${planName} plan activated! Redirecting…`);
        setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) { setError("Failed to load payment gateway."); return; }

      const rzp = new window.Razorpay({
        key:         order.key_id,
        amount:      order.amount,
        currency:    "INR",
        name:        "SecureLint",
        description: `${planName} — ${PERIOD_LABELS[period] || period}`,
        order_id:    order.order_id,
        prefill:     { name: fullName },
        theme:       { color: "#1a7f37" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan_id:             planId,
              billing_period:      period,
            }),
          });
          const ver = await verRes.json();
          if (ver.error === 1) { setError(ver.message || "Verification failed."); return; }
          localStorage.setItem("user_plan_status", "active");
          localStorage.setItem("user_plan_id",     planId);
          setSuccess(`${planName} plan activated! Redirecting…`);
          setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch { setError("Something went wrong. Please try again."); }
    finally  { setLoading(false); }
  }, [fullName, planId, planName, period, router]);

  return (
    <div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:4 }}>
        {step === "choose" ? `Choose billing option for your ${planName} plan` : "Enter your payment details"}
      </h1>
      {step === "choose" && <div style={{ fontSize:13, color:"#57606a", marginBottom:4, display:"flex", gap:16 }}>
        <span style={{ color:"#1a7f37", fontWeight:600, borderBottom:"2px solid #1a7f37", paddingBottom:4 }}>1. Choose billing</span>
        <span style={{ color:"#57606a", paddingBottom:4 }}>2. Review and purchase</span>
      </div>}
      {step === "pay" && <div style={{ fontSize:13, color:"#57606a", marginBottom:4, display:"flex", gap:16 }}>
        <span style={{ color:"#57606a", paddingBottom:4 }}>1. Choose billing</span>
        <span style={{ color:"#1a7f37", fontWeight:600, borderBottom:"2px solid #1a7f37", paddingBottom:4 }}>2. Review and purchase</span>
      </div>}
      <div style={{ height:1, background:"#d0d7de", marginBottom:32 }} />

      {step === "choose" && (
        <div style={{ maxWidth:560 }}>
          {priceLoad ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"40px 0" }}>
              <div style={{ width:24, height:24, border:"3px solid #d0d7de", borderTop:"3px solid #1a7f37", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
            </div>
          ) : (
            <>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
                {pricing.map(p => {
                  const isSelected = period === p.billing_period;
                  return (
                    <div key={p.billing_period} onClick={() => setPeriod(p.billing_period)}
                      style={{ padding:"20px 24px", borderRadius:10, border:`2px solid ${isSelected ? "#1a7f37" : "#d0d7de"}`, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", transition:"border-color .15s" }}>
                      {p.badge && <div style={{ position:"absolute", top:-10, left:16, background:"#1a7f37", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 10px", borderRadius:20 }}>{p.badge}</div>}
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:"#1a1a2e", marginBottom:3 }}>{PERIOD_LABELS[p.billing_period] || p.billing_period}</div>
                        <div style={{ fontSize:13, color:"#57606a" }}>
                          Billed as one payment of ₹{p.total_price.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:16, fontWeight:700, color:"#1a1a2e" }}>₹{p.price_per_month.toLocaleString("en-IN")} <span style={{ fontSize:13, fontWeight:400 }}>/month</span></div>
                        {p.savings_label && <div style={{ fontSize:12, color:"#1a7f37", fontWeight:600, background:"#dafbe1", padding:"2px 8px", borderRadius:10, marginTop:4, display:"inline-block" }}>{p.savings_label}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setStep("pay")} disabled={!sel}
                style={{ padding:"12px 32px", borderRadius:8, background: sel ? "#1a7f37" : "#94d3a2", color:"#fff", fontSize:15, fontWeight:700, border:"none", cursor: sel ? "pointer" : "not-allowed" }}>
                Select →
              </button>
            </>
          )}
        </div>
      )}

      {step === "pay" && sel && (
        <div style={{ display:"flex", gap:40, flexWrap:"wrap" }}>
          {/* Order summary */}
          <div style={{ minWidth:240, flex:1 }}>
            <h2 style={{ fontSize:17, fontWeight:700, color:"#1a1a2e", marginBottom:16 }}>Your order summary</h2>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14 }}>
              <span style={{ color:"#57606a" }}>Plan</span>
              <span style={{ fontWeight:700, color:"#1a1a2e" }}>SecureLint {planName}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14, paddingBottom:12, borderBottom:"1px solid #d0d7de" }}>
              <span style={{ color:"#57606a" }}>Billing</span>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, color:"#1a1a2e" }}>{PERIOD_LABELS[sel.billing_period] || sel.billing_period}</div>
                {sel.savings_label && <div style={{ fontSize:11, color:"#1a7f37", fontWeight:600, background:"#dafbe1", padding:"1px 7px", borderRadius:10, display:"inline-block" }}>{sel.savings_label}</div>}
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontSize:16 }}>
              <span style={{ color:"#57606a" }}>Today&apos;s order</span>
              <span style={{ fontWeight:800, color:"#1a1a2e" }}>₹{sel.total_price.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ fontSize:12, color:"#57606a", marginTop:8 }}>
              Your plan renews on {new Date(Date.now() + (sel.billing_period === "annual" ? 365 : sel.billing_period === "quarterly" ? 90 : 30) * 86400000).toLocaleDateString("en-IN", { month:"long", day:"numeric", year:"numeric" })}.
            </div>
            <div style={{ marginTop:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#1a1a2e", marginBottom:10 }}>How {planName} elevates your security</div>
              {["Unlimited secret scans","Real-time threat detection","API access & integrations","Priority email support"].map((f,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#57606a", marginBottom:7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#1a7f37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div style={{ flex:2, minWidth:300 }}>
            <h2 style={{ fontSize:17, fontWeight:700, color:"#1a1a2e", marginBottom:20 }}>Enter your payment details</h2>

            {error   && <div style={{ padding:"10px 14px", borderRadius:8, background:"#ffebe9", border:"1px solid #cf222e40", color:"#cf222e", fontSize:13, marginBottom:14 }}>{error}</div>}
            {success && <div style={{ padding:"10px 14px", borderRadius:8, background:"#dafbe1", border:"1px solid #1a7f3740", color:"#1a7f37", fontSize:13, marginBottom:14 }}>{success}</div>}

            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Full name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Rahul Sharma" style={inp} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <label style={lbl}>Country / Region</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inp, appearance:"none" }}>
                  {["IN","US","GB","AU","CA","SG","DE","FR"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>State</label>
                <input type="text" placeholder="Maharashtra" style={inp} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <label style={lbl}>Pincode</label>
                <input type="text" placeholder="400001" style={inp} />
              </div>
              <div>
                <label style={lbl}>City</label>
                <input type="text" placeholder="Mumbai" style={inp} />
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Address</label>
              <input type="text" placeholder="Flat/House No., Building, Street" style={inp} />
            </div>

            <button onClick={handlePay} disabled={loading || !!success}
              style={{ width:"100%", padding:"14px", borderRadius:8, background: loading || success ? "#94d3a2" : "#1a7f37", color:"#fff", fontSize:15, fontWeight:700, border:"none", cursor: loading || success ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              {loading
                ? <><div style={{ width:16, height:16, border:"2px solid #ffffff60", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Processing…</>
                : `Complete purchase — ₹${sel.total_price.toLocaleString("en-IN")}`}
            </button>
            <div style={{ fontSize:11, color:"#57606a", textAlign:"center", marginTop:10 }}>
              Secured by Razorpay · UPI, Cards, Net Banking accepted
            </div>
            <button onClick={() => setStep("choose")} style={{ display:"block", margin:"12px auto 0", background:"none", border:"none", color:"#57606a", fontSize:13, cursor:"pointer" }}>
              ← Back to billing options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
