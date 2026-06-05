"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE    = process.env.NEXT_PUBLIC_API_BASE         || "https://securelint-api.vercel.app";
const RZP_KEY_ID  = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID  || "";
const PAYPAL_CID  = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

declare global {
  interface Window {
    Razorpay: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    paypal: any;   // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const G      = "#007b70";
const G_DARK = "#00665c";
const BORDER = "#e5e7eb";
const TEXT   = "#111827";
const MUTED  = "#6b7280";

// ── Priority countries shown at top ──────────────────────────────────────────
const TOP_COUNTRIES = [
  "Australia","Brazil","Canada","China","Germany","Hong Kong","India",
  "Japan","New Zealand","Saudi Arabia","Singapore","South Africa",
  "South Korea","United Arab Emirates","United Kingdom","United States",
];

// ── Full world country list ───────────────────────────────────────────────────
const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola",
  "Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba",
  "Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belgium",
  "Belize","Benin","Bermuda","Bhutan","Bolivia",
  "Bonaire, Sint Eustatius and Saba","Bosnia and Herzegovina","Botswana",
  "Bouvet Island","British Indian Ocean Territory","Brunei Darussalam",
  "Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde",
  "Cayman Islands","Central African Republic","Chad","Chile","Christmas Island",
  "Cocos (Keeling) Islands","Colombia","Comoros","Congo",
  "Congo, the Democratic Republic of the","Cook Islands","Costa Rica",
  "Cote D'Ivoire","Croatia","Cuba","Cura\u00e7ao","Cyprus","Czech Republic",
  "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France",
  "French Guiana","French Polynesia","French Southern Territories","Gabon",
  "Gambia","Georgia","Ghana","Gibraltar","Greece","Greenland","Grenada",
  "Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Heard Island and Mcdonald Islands","Holy See (Vatican City State)",
  "Honduras","Hungary","Iceland","Indonesia","Iran, Islamic Republic of","Iraq",
  "Ireland","Isle of Man","Israel","Italy","Jamaica","Jersey","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
  "Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia",
  "Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Madagascar",
  "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique",
  "Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of",
  "Moldova, Republic of","Monaco","Mongolia","Montenegro","Montserrat",
  "Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Caledonia","Nicaragua","Niger","Nigeria","Niue","Norfolk Island",
  "North Korea","North Macedonia, Republic of","Northern Mariana Islands",
  "Norway","Oman","Pakistan","Palau","Palestinian Territory, Occupied",
  "Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn",
  "Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Rwanda",
  "Saint Barth\u00e9lemy","Saint Helena","Saint Kitts and Nevis","Saint Lucia",
  "Saint Martin (French part)","Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Senegal","Serbia","Seychelles","Sierra Leone",
  "Sint Maarten (Dutch part)","Slovakia","Slovenia","Solomon Islands",
  "Somalia","South Georgia and the South Sandwich Islands","South Sudan",
  "Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Sweden",
  "Switzerland","Syrian Arab Republic","Taiwan","Tajikistan",
  "Tanzania, United Republic of","Thailand","Timor-Leste","Togo","Tokelau",
  "Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Turks and Caicos Islands","Tuvalu","Uganda","Ukraine",
  "United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu",
  "Venezuela","Vietnam","Virgin Islands, British","Virgin Islands, U.S.",
  "Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe",
  "\u00c5land Islands",
];

// ── Indian states ─────────────────────────────────────────────────────────────
const INDIA_STATES: { code: string; name: string }[] = [
  { code:"AN", name:"Andaman and Nicobar" },
  { code:"AP", name:"Andhra Pradesh" },
  { code:"AR", name:"Arunachal Pradesh" },
  { code:"AS", name:"Assam" },
  { code:"BR", name:"Bihar" },
  { code:"CH", name:"Chandigarh" },
  { code:"CT", name:"Chhattisgarh" },
  { code:"DH", name:"Dadra And Nagar Haveli And Daman And Diu" },
  { code:"DL", name:"Delhi" },
  { code:"GA", name:"Goa" },
  { code:"GJ", name:"Gujarat" },
  { code:"HR", name:"Haryana" },
  { code:"HP", name:"Himachal Pradesh" },
  { code:"JK", name:"Jammu and Kashmir" },
  { code:"JH", name:"Jharkhand" },
  { code:"KA", name:"Karnataka" },
  { code:"KL", name:"Kerala" },
  { code:"LA", name:"Ladakh" },
  { code:"LD", name:"Lakshadweep" },
  { code:"MP", name:"Madhya Pradesh" },
  { code:"MH", name:"Maharashtra" },
  { code:"MN", name:"Manipur" },
  { code:"ML", name:"Meghalaya" },
  { code:"MZ", name:"Mizoram" },
  { code:"NL", name:"Nagaland" },
  { code:"OR", name:"Odisha" },
  { code:"PY", name:"Puducherry" },
  { code:"PB", name:"Punjab" },
  { code:"RJ", name:"Rajasthan" },
  { code:"SK", name:"Sikkim" },
  { code:"TN", name:"Tamil Nadu" },
  { code:"TG", name:"Telangana" },
  { code:"TR", name:"Tripura" },
  { code:"UP", name:"Uttar Pradesh" },
  { code:"UT", name:"Uttarakhand" },
  { code:"WB", name:"West Bengal" },
];

interface PricingRow {
  plan_id: string; billing_period: string;
  price_per_month: number; total_price: number;
  discount_pct: number; badge: string; savings_label: string; sort_order: number;
}

const PERIOD_LABELS: Record<string, string> = {
  monthly:"Monthly", quarterly:"Quarterly", annual:"Annual",
};

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

function Stepper({ step }: { step: "choose" | "pay" }) {
  return (
    <nav style={{ display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:500 }}>
      <span style={{ color:step==="choose"?G:MUTED, fontWeight:step==="choose"?700:500, borderBottom:step==="choose"?`2px solid ${G}`:"none", paddingBottom:2 }}>
        1. Choose billing
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ color:step==="pay"?G:MUTED, fontWeight:step==="pay"?700:500, borderBottom:step==="pay"?`2px solid ${G}`:"none", paddingBottom:2 }}>
        2. Review and purchase
      </span>
    </nav>
  );
}

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("rzp-js")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-js"; s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function loadPayPal(clientId: string, currency: string): Promise<boolean> {
  return new Promise(resolve => {
    const existingId = "paypal-js";
    if (document.getElementById(existingId)) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = existingId;
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BillingPage() {
  const router = useRouter();
  const [planId,       setPlanId]      = useState("pro");
  const [planName,     setPlanName]    = useState("Pro");
  const [period,       setPeriod]      = useState("annual");
  const [step,         setStep]        = useState<"choose"|"pay">("choose");
  const [fullName,     setFullName]    = useState("");
  const [country,      setCountry]     = useState("India");
  const [state,        setState]       = useState("");
  const [pincode,      setPincode]     = useState("");
  const [city,         setCity]        = useState("");
  const [address,      setAddress]     = useState("");
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState("");
  const [success,      setSuccess]     = useState("");
  const [pricing,      setPricing]     = useState<PricingRow[]>([]);
  const [priceLoad,    setPriceLoad]   = useState(true);
  const [ppRendered,   setPpRendered]  = useState(false);

  const isIndia = country === "India";

  // Reset state when country changes
  useEffect(() => { setState(""); }, [country]);

  // Re-render PayPal buttons when country changes away from India
  useEffect(() => { if (!isIndia) setPpRendered(false); }, [isIndia]);

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

  // ── Razorpay (India only) ─────────────────────────────────────────────────
  const handleRazorpay = useCallback(async () => {
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

  // ── PayPal button renderer (international) ────────────────────────────────
  const renderPayPalButtons = useCallback(async () => {
    if (ppRendered || !sel) return;
    const container = document.getElementById("paypal-btn-container");
    if (!container) return;
    container.innerHTML = "";

    // USD amount — round to 2dp
    const usdAmount = (sel.total_price / 83).toFixed(2);

    const loaded = await loadPayPal(PAYPAL_CID, "USD");
    if (!loaded || !window.paypal) {
      setError("Failed to load PayPal. Please try again.");
      return;
    }

    window.paypal.Buttons({
      style: { layout:"vertical", color:"gold", shape:"rect", label:"pay", height:48 },
      createOrder: (_data: unknown, actions: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        return actions.order.create({
          purchase_units: [{
            amount: { value: usdAmount, currency_code:"USD" },
            description: `SecureLint ${planName} — ${PERIOD_LABELS[period] || period}`,
          }],
          payer: { name: { given_name: fullName.split(" ")[0] || fullName, surname: fullName.split(" ").slice(1).join(" ") || "" } },
        });
      },
      onApprove: async (_data: unknown, actions: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        setLoading(true);
        try {
          const capture = await actions.order.capture();
          const paypalOrderId = capture.id;
          const token = localStorage.getItem("user_token") || "";
          // Notify backend
          const verRes = await fetch(`${API_BASE}/api/payment/paypal-verify`, {
            method:"POST",
            headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
            body: JSON.stringify({ paypal_order_id:paypalOrderId, plan_id:planId, billing_period:period, country }),
          }).catch(() => null);
          const ver = verRes ? await verRes.json().catch(() => ({})) : {};
          if (ver?.error === 1) { setError(ver.message || "Verification failed."); }
          else {
            localStorage.setItem("user_plan_status","active");
            localStorage.setItem("user_plan_id", planId);
            setSuccess(`${planName} activated! Redirecting…`);
            setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
          }
        } catch { setError("Payment could not be verified. Contact support."); }
        finally { setLoading(false); }
      },
      onError: () => { setError("PayPal encountered an error. Please try again."); },
      onCancel: () => { setError("Payment cancelled."); },
    }).render("#paypal-btn-container");

    setPpRendered(true);
  }, [ppRendered, sel, planId, planName, period, fullName, country, router]);

  // Auto-render PayPal buttons when switching to pay step for non-India
  useEffect(() => {
    if (step === "pay" && !isIndia && sel && !ppRendered) {
      // slight delay so DOM is ready
      const t = setTimeout(() => renderPayPalButtons(), 200);
      return () => clearTimeout(t);
    }
  }, [step, isIndia, sel, ppRendered, renderPayPalButtons]);

  // Re-render PayPal when fullName or period changes (new order details)
  useEffect(() => {
    if (step === "pay" && !isIndia) { setPpRendered(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, period]);

  const validateCommon = () => {
    if (!fullName.trim()) { setError("Full name is required."); return false; }
    if (!country)         { setError("Please select your country."); return false; }
    if (!city.trim())     { setError("City is required."); return false; }
    if (!address.trim())  { setError("Address is required."); return false; }
    return true;
  };

  const handleProceedPay = () => {
    if (!validateCommon()) return;
    setError("");
    if (!isIndia) {
      // For PayPal: proceed to render buttons
      setStep("pay");
    } else {
      handleRazorpay();
    }
  };

  return (
    <div style={{ width:"100%" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .billing-plan-row{transition:all .15s;}
        .billing-plan-row:hover{border-color:#007b70 !important;background:#f0fdfb !important;}
        input:focus,select:focus{border-color:#007b70 !important;box-shadow:0 0 0 3px rgba(0,123,112,.1);}
      `}</style>

      {/* Title + stepper */}
      <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center" }}>
        <h1 style={{ fontSize:30, fontWeight:800, color:TEXT, marginBottom:8, letterSpacing:"-0.6px", lineHeight:1.2 }}>
          {step==="choose" ? `Choose a billing option for your ${planName} plan` : "Review and complete your purchase"}
        </h1>
        <p style={{ fontSize:15, color:MUTED, marginBottom:36, lineHeight:1.6 }}>
          {step==="choose"
            ? "Pick the billing period that works best for you."
            : "Fill in your details to activate your plan instantly."}
        </p>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:44 }}>
          <Stepper step={step} />
        </div>
      </div>

      {/* ── Step 1: Choose billing ── */}
      {step === "choose" && (
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          {priceLoad ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
              <div style={{ width:28, height:28, border:`3px solid ${BORDER}`, borderTop:`3px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
              {pricing.map((p, idx) => {
                const isSelected = period === p.billing_period;
                return (
                  <div key={p.billing_period} className="billing-plan-row"
                    onClick={() => setPeriod(p.billing_period)}
                    style={{
                      padding: p.badge ? "28px 28px 22px" : "22px 28px",
                      border: isSelected ? `2px solid ${G}` : `1px solid ${BORDER}`,
                      borderRadius:12, background: isSelected ? "#f0fdfb" : idx===0 ? "#fff" : "#f9fafb",
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
                        <span style={{ fontSize:13, fontWeight:400, color:MUTED }}>/month</span>
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
          )}
        </div>
      )}

      {/* ── Step 2: Payment ── */}
      {step === "pay" && sel && (
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", gap:0, borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,.08)", border:`1px solid ${BORDER}`, overflow:"hidden", background:"#fff" }}>

          {/* Order summary — left */}
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
              <span style={{ fontWeight:800, color:TEXT }}>
                {isIndia
                  ? `₹${sel.total_price.toLocaleString("en-IN")}`
                  : `$${(sel.total_price / 83).toFixed(2)} USD`}
              </span>
            </div>
            <div style={{ fontSize:12, color:MUTED, marginBottom:28 }}>
              Your plan renews on{" "}
              {new Date(Date.now() + (sel.billing_period==="annual"?365:sel.billing_period==="quarterly"?90:30)*86400000)
                .toLocaleDateString("en-IN",{month:"long",day:"numeric",year:"numeric"})}.
            </div>
            <h3 style={{ fontSize:13, fontWeight:700, color:TEXT, marginBottom:14 }}>How {planName} elevates your security</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {["Unlimited secret scans across all editors","Real-time phishing & threat detection","API access & browser integrations","Priority email support"].map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:MUTED }}>
                  <CheckIcon />{f}
                </div>
              ))}
            </div>
          </div>

          {/* Payment form — right */}
          <div style={{ flex:1, padding:"36px 32px" }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:TEXT, marginBottom:24, letterSpacing:"-0.4px" }}>Enter your payment details</h2>

            {error   && <div style={{ padding:"10px 14px", borderRadius:8, background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:16 }}>{error}</div>}
            {success && <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a", fontSize:13, marginBottom:16 }}>{success}</div>}

            {/* Full name */}
            <div style={{ marginBottom:18 }}>
              <label style={LBL}>Full name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Rahul Sharma" style={INP} />
            </div>

            {/* Country */}
            <div style={{ marginBottom:18 }}>
              <label style={LBL}>Country / Region</label>
              <select
                value={country}
                onChange={e => { setCountry(e.target.value); setPpRendered(false); }}
                style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                <option value="" disabled hidden>Select</option>
                <option value="separator" disabled>----------</option>
                {TOP_COUNTRIES.map(c => <option key={`top-${c}`} value={c}>{c}</option>)}
                <option value="separator2" disabled>----------</option>
                {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* State — India only */}
            {isIndia && (
              <div style={{ marginBottom:18 }}>
                <label style={LBL}>State</label>
                <select value={state} onChange={e => setState(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                  <option value="" disabled hidden>Select</option>
                  <option value="separator" disabled>----------</option>
                  {INDIA_STATES.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            )}

            {/* Pincode + City */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
              <div>
                <label style={LBL}>{isIndia ? "Pincode" : "Postal / ZIP code"}</label>
                <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder={isIndia ? "400001" : "10001"} style={INP} maxLength={10} />
              </div>
              <div>
                <label style={LBL}>City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" style={INP} />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom:28 }}>
              <label style={LBL}>Flat / House No., Building, Street</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123, Sector 5, MG Road" style={INP} />
            </div>

            {/* ── India: Razorpay button ── */}
            {isIndia && (
              <>
                <button onClick={handleRazorpay} disabled={loading || !!success}
                  style={{
                    width:"100%", padding:"15px", borderRadius:10,
                    background: loading||success ? "#a3d9d5" : G,
                    color:"#fff", fontSize:16, fontWeight:800, border:"none",
                    cursor: loading||success ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    letterSpacing:"-0.2px",
                  }}
                  onMouseEnter={e => { if (!loading&&!success) e.currentTarget.style.background=G_DARK; }}
                  onMouseLeave={e => { if (!loading&&!success) e.currentTarget.style.background=G; }}>
                  {loading
                    ? <><div style={{ width:18, height:18, border:"2px solid #ffffff50", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Processing…</>
                    : `Complete purchase — ₹${sel.total_price.toLocaleString("en-IN")}`}
                </button>
                <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:10 }}>
                  🔒 Secured by Razorpay · UPI, Cards &amp; Net Banking accepted
                </div>
              </>
            )}

            {/* ── International: PayPal ── */}
            {!isIndia && (
              <>
                <div style={{ marginBottom:14, padding:"12px 16px", borderRadius:8, background:"#fef9ee", border:"1px solid #fde68a", fontSize:13, color:"#92400e" }}>
                  💡 Paying from <strong>{country}</strong>. Amount: <strong>${(sel.total_price/83).toFixed(2)} USD</strong>
                </div>
                {/* PayPal renders its button here */}
                <div id="paypal-btn-container" style={{ minHeight:52 }}>
                  {!ppRendered && (
                    <div style={{ display:"flex", justifyContent:"center", padding:"12px 0" }}>
                      <div style={{ width:22, height:22, border:`3px solid ${BORDER}`, borderTop:`3px solid #003087`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                    </div>
                  )}
                </div>
                <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:10 }}>
                  🔒 Secured by PayPal · Credit/Debit Cards accepted
                </div>
              </>
            )}

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
