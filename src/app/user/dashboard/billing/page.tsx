"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE   = process.env.NEXT_PUBLIC_API_BASE      || "https://securelint-api.vercel.app";
const RZP_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

declare global { interface Window { Razorpay: any; } } // eslint-disable-line @typescript-eslint/no-explicit-any

const G      = "#007b70";
const G_DARK = "#00665c";
const BORDER = "#e5e7eb";
const TEXT   = "#111827";
const MUTED  = "#6b7280";

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
  plan_id: string; billing_period: string;
  price_per_month: number; total_price: number;
  discount_pct: number; badge: string; savings_label: string; sort_order: number;
}

const PERIOD_LABELS: Record<string, string> = { monthly:"Monthly", quarterly:"Quarterly", annual:"Annual" };

const INP: React.CSSProperties = {
  width:"100%", padding:"10px 14px", borderRadius:8,
  border:`1px solid ${BORDER}`, fontSize:14, color:TEXT,
  outline:"none", boxSizing:"border-box", background:"#fff",
  transition:"border-color .15s",
};
const LBL: React.CSSProperties = {
  display:"block", fontSize:13, fontWeight:700, color:TEXT, marginBottom:6,
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
      <path d="M5 13l4 4L19 7" stroke={G} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Step indicator
function Stepper({ step }: { step: "choose" | "pay" }) {
  return (
    <nav style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:500 }}>
      <span style={{
        color: step === "choose" ? G : MUTED,
        fontWeight: step === "choose" ? 700 : 500,
        borderBottom: step === "choose" ? `2px solid ${G}` : "none",
        paddingBottom:2,
      }}>1. Choose billing</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color:"#d1d5db" }}>
        <path d="M9 18l6-6-6-6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{
        color: step === "pay" ? G : MUTED,
        fontWeight: step === "pay" ? 700 : 500,
        borderBottom: step === "pay" ? `2px solid ${G}` : "none",
        paddingBottom:2,
      }}>2. Review and purchase</span>
    </nav>
  );
}

export default function BillingPage() {
  const router = useRouter();
  const [planId,    setPlanId]    = useState("pro");
  const [planName,  setPlanName]  = useState("Pro");
  const [period,    setPeriod]    = useState("annual");
  const [step,      setStep]      = useState<"choose"|"pay">("choose");
  const [fullName,  setFullName]  = useState("");
  const [country,   setCountry]   = useState("India");
  const [state,     setState]     = useState("");
  const [pincode,   setPincode]   = useState("");
  const [city,      setCity]      = useState("");
  const [address,   setAddress]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [pricing,   setPricing]   = useState<PricingRow[]>([]);
  const [priceLoad, setPriceLoad] = useState(true);

  useEffect(() => {
    const pid = localStorage.getItem("billing_plan_id")   || "pro";
    const pnm = localStorage.getItem("billing_plan_name") || "Pro";
    const nm  = localStorage.getItem("user_full_name")    || "";
    setPlanId(pid); setPlanName(pnm); setFullName(nm);
    fetch(`${API_BASE}/api/plan-pricing?plan_id=${pid}`)
      .then(r => r.json())
      .then(d => {
        if (d.pricing?.length) { setPricing(d.pricing); setPeriod(d.pricing[0].billing_period); }
      })
      .catch(() => {})
      .finally(() => setPriceLoad(false));
  }, []);

  const sel = pricing.find(p => p.billing_period === period) || pricing[0];

  const handlePay = useCallback(async () => {
    if (!fullName.trim())   { setError("Full name is required."); return; }
    if (!state)             { setError("Please select your state."); return; }
    if (!pincode.trim() || pincode.trim().length < 4) { setError("Please enter a valid pincode."); return; }
    if (!city.trim())       { setError("City is required."); return; }
    if (!address.trim())    { setError("Address is required."); return; }
    setError(""); setLoading(true);
    try {
      const token = localStorage.getItem("user_token") || "";
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ plan_id:planId, billing_period:period }),
      });
      const order = await orderRes.json();
      if (order.error === 1) { setError(order.message || "Failed to create order."); return; }
      if (order.free) {
        localStorage.setItem("user_plan_status","active");
        localStorage.setItem("user_plan_id", planId);
        setSuccess(`${planName} activated! Redirecting…`);
        setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
        return;
      }
      const loaded = await loadRazorpay();
      if (!loaded) { setError("Failed to load payment gateway."); return; }
      const rzp = new window.Razorpay({
        key: order.key_id || RZP_KEY_ID, amount: order.amount, currency:"INR",
        name:"SecureLint", description:`${planName} — ${PERIOD_LABELS[period] || period}`,
        order_id: order.order_id, prefill:{ name:fullName },
        theme:{ color: G },
        handler: async (response: { razorpay_order_id:string; razorpay_payment_id:string; razorpay_signature:string }) => {
          const verRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method:"POST",
            headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
            body: JSON.stringify({ ...response, plan_id:planId, billing_period:period }),
          });
          const ver = await verRes.json();
          if (ver.error === 1) { setError(ver.message || "Verification failed."); return; }
          localStorage.setItem("user_plan_status","active");
          localStorage.setItem("user_plan_id", planId);
          setSuccess(`${planName} activated! Redirecting…`);
          setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
        },
        modal:{ ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch { setError("Something went wrong. Please try again."); }
    finally  { setLoading(false); }
  }, [fullName, state, pincode, city, address, planId, planName, period, router]);

  return (
    <div style={{ width:"100%" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}
        .billing-plan-row { transition: all .15s; }
        .billing-plan-row:hover { border-color: #007b70 !important; background: #f0fdfb !important; }
        input:focus, select:focus { border-color: #007b70 !important; box-shadow: 0 0 0 3px rgba(0,123,112,.1); }
      `}</style>

      {/* ── Centred column for title + stepper ── */}
      <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center" }}>
        <h1 style={{ fontSize:30, fontWeight:800, color:TEXT, marginBottom:8, letterSpacing:"-0.6px", lineHeight:1.2 }}>
          {step === "choose"
            ? `Choose a billing option for your ${planName} plan`
            : "Review and complete your purchase"}
        </h1>
        <p style={{ fontSize:15, color:MUTED, marginBottom:36, lineHeight:1.6 }}>
          {step === "choose"
            ? "Pick the billing period that works best for you. All plans include the full feature set."
            : "Fill in your details to activate your plan instantly."}
        </p>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:44 }}>
          <Stepper step={step} />
        </div>
      </div>

      {/* ─── Step 1: Choose billing ─── */}
      {step === "choose" && (
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          {priceLoad ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
              <div style={{ width:28, height:28, border:`3px solid ${BORDER}`, borderTop:`3px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
            </div>
          ) : (
            <>
              {/* Billing options — each row is its own card to allow badge overflow */}
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
                {pricing.map((p, idx) => {
                  const isSelected = period === p.billing_period;
                  return (
                    <div key={p.billing_period} className="billing-plan-row"
                      onClick={() => setPeriod(p.billing_period)}
                      style={{
                        padding: p.badge ? "28px 28px 22px" : "22px 28px",
                        border: isSelected ? `2px solid ${G}` : `1px solid ${BORDER}`,
                        borderRadius:12,
                        background: isSelected ? "#f0fdfb" : idx === 0 ? "#fff" : "#f9fafb",
                        cursor:"pointer", position:"relative",
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
                        boxShadow: isSelected ? `0 0 0 3px ${G}18` : "0 2px 8px rgba(0,0,0,.04)",
                      }}>
                      {p.badge && (
                        <div style={{ position:"absolute", top:-13, left:18, background:G, color:"#fff", fontSize:10, fontWeight:800, padding:"3px 12px", borderRadius:5, textTransform:"uppercase", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
                          {p.badge}
                        </div>
                      )}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:22, fontWeight:800, color:TEXT, letterSpacing:"-0.5px" }}>
                          {PERIOD_LABELS[p.billing_period] || p.billing_period}
                        </div>
                        {p.total_price > 0 && (
                          <div style={{ fontSize:13, color:MUTED, marginTop:3 }}>
                            Billed as one payment of ₹{p.total_price.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                        <div style={{ fontSize:18, fontWeight:800, color:TEXT }}>
                          ₹{p.price_per_month.toLocaleString("en-IN")}
                          <span style={{ fontSize:13, fontWeight:400, color:MUTED }}> /month</span>
                        </div>
                        {p.savings_label && (
                          <span style={{ background:"#d1fae5", color:"#065f46", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                            {p.savings_label}
                          </span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); setPeriod(p.billing_period); setStep("pay"); }}
                          style={{ marginTop:4, padding:"8px 22px", borderRadius:8, background:G, color:"#fff", fontSize:13, fontWeight:700, border:"none", cursor:"pointer" }}
                          onMouseEnter={e => (e.currentTarget.style.background = G_DARK)}
                          onMouseLeave={e => (e.currentTarget.style.background = G)}>
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      )}

      {/* ─── Step 2: Payment ─── */}
      {step === "pay" && sel && (
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", gap:0, borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,.08)", border:`1px solid ${BORDER}`, overflow:"hidden", background:"#fff" }}>

          {/* Order summary — left gray panel */}
          <div style={{ width:"38%", minWidth:260, background:"#f9fafa", borderRight:`1px solid ${BORDER}`, padding:"36px 28px", display:"flex", flexDirection:"column" }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:TEXT, marginBottom:24 }}>Your order summary</h2>
            <div style={{ fontSize:14, display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ color:MUTED }}>Plan</span>
              <span style={{ fontWeight:700, color:TEXT }}>SecureLint {planName}</span>
            </div>
            <div style={{ fontSize:14, display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ color:MUTED }}>Billing</span>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, color:TEXT }}>{PERIOD_LABELS[sel.billing_period] || sel.billing_period}</div>
                {sel.savings_label && (
                  <span style={{ background:"#d1fae5", color:"#065f46", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, display:"inline-block", marginTop:3 }}>
                    {sel.savings_label}
                  </span>
                )}
              </div>
            </div>
            <div style={{ marginTop:20, marginBottom:4, display:"flex", justifyContent:"space-between", fontSize:16 }}>
              <span style={{ fontWeight:700, color:TEXT }}>Today&apos;s order</span>
              <span style={{ fontWeight:800, color:TEXT }}>₹{sel.total_price.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ fontSize:12, color:MUTED, marginBottom:28 }}>
              Your plan renews on{" "}
              {new Date(Date.now() + (sel.billing_period === "annual" ? 365 : sel.billing_period === "quarterly" ? 90 : 30) * 86400000)
                .toLocaleDateString("en-IN", { month:"long", day:"numeric", year:"numeric" })}.
            </div>
            <h3 style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:14 }}>How {planName} elevates your security</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:2 }}>
              {["Unlimited secret scans across all editors","Real-time phishing & threat detection","API access & browser integrations","Priority email support"].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:MUTED }}>
                  <CheckIcon />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Payment form — right white panel */}
          <div style={{ flex:1, padding:"36px 32px" }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:TEXT, marginBottom:24, letterSpacing:"-0.4px" }}>Enter your payment details</h2>

            {error   && <div style={{ padding:"10px 14px", borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:16 }}>{error}</div>}
            {success && <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a", fontSize:13, marginBottom:16 }}>{success}</div>}

            {/* Full name */}
            <div style={{ marginBottom:18 }}>
              <label style={LBL}>Full name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Rahul Sharma" style={INP} />
            </div>

            {/* Country + State */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
              <div>
                <label style={LBL}>Country / Region</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                  {["India","United States","United Kingdom","Australia","Canada","Singapore","Germany","France"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LBL}>State</label>
                <select value={state} onChange={e => setState(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                  <option value="">Select</option>
                  {["Andhra Pradesh","Delhi","Gujarat","Karnataka","Kerala","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pincode + City */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
              <div>
                <label style={LBL}>Pincode</label>
                <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="400001" style={INP} maxLength={6} />
              </div>
              <div>
                <label style={LBL}>City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" style={INP} />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom:28 }}>
              <label style={LBL}>Flat/House No., Building, Street</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123, Sector 5, MG Road" style={INP} />
            </div>

            {/* Submit */}
            <button onClick={handlePay} disabled={loading || !!success}
              style={{
                width:"100%", padding:"15px", borderRadius:10,
                background: loading || success ? "#a3d9d5" : G,
                color:"#fff", fontSize:16, fontWeight:800, border:"none",
                cursor: loading || success ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                letterSpacing:"-0.2px",
              }}
              onMouseEnter={e => { if (!loading && !success) e.currentTarget.style.background = G_DARK; }}
              onMouseLeave={e => { if (!loading && !success) e.currentTarget.style.background = G; }}>
              {loading
                ? <><div style={{ width:18, height:18, border:"2px solid #ffffff50", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Processing…</>
                : `Complete purchase — ₹${sel.total_price.toLocaleString("en-IN")}`}
            </button>
            <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:10 }}>
              🔒 Secured by Razorpay · UPI, Cards &amp; Net Banking accepted
            </div>
            <button onClick={() => setStep("choose")}
              style={{ display:"block", margin:"14px auto 0", background:"none", border:"none", color:MUTED, fontSize:13, cursor:"pointer" }}>
              ← Back to billing options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
