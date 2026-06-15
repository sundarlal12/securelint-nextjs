"use client";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { BillingStepCtx } from "./billing-step-ctx";

const API_BASE    = process.env.NEXT_PUBLIC_API_BASE         || "https://securelint-api.vercel.app";
const RZP_KEY_ID  = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID  || "";
const PAYPAL_CID  = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const GPAY_MID    = process.env.NEXT_PUBLIC_GPAY_MERCHANT_ID || "";

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

function loadGooglePay(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("gpay-js")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "gpay-js";
    s.src = "https://pay.google.com/gp/p/js/pay.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BillingPage() {
  const router = useRouter();
  const { setStep: setLayoutStep } = useContext(BillingStepCtx);
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
  const [ppRendered,    setPpRendered]   = useState(false);
  const [gpayRendered,  setGpayRendered]  = useState(false);
  const [gpayAvailable, setGpayAvailable] = useState(true);
  const [payuLoading,   setPayuLoading]   = useState(false);
  const [payuPhone,     setPayuPhone]      = useState("");
  const [intlTab,       setIntlTab]      = useState<"googlepay"|"paypal"|"payu">("paypal");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ppInstanceRef  = useRef<any>(null);
  const ppContainerRef = useRef<HTMLDivElement>(null);
  const gpayContainerRef = useRef<HTMLDivElement>(null);

  const isIndia = country === "India";

  // Sync local step → layout header stepper
  useEffect(() => { setLayoutStep(step); }, [step, setLayoutStep]);

  // Reset state when country changes
  useEffect(() => { setState(""); }, [country]);

  // Reset payment buttons when country changes (non-India)
  useEffect(() => {
    if (!isIndia) {
      if (ppInstanceRef.current) {
        try { ppInstanceRef.current.close(); } catch { /* ignore */ }
        ppInstanceRef.current = null;
      }
      setPpRendered(false);
      setGpayRendered(false);
      setGpayAvailable(true);
    }
  }, [isIndia, country]);

  // Clean up PayPal on page unmount
  useEffect(() => {
    return () => {
      if (ppInstanceRef.current) {
        try { ppInstanceRef.current.close(); } catch { /* ignore */ }
        ppInstanceRef.current = null;
      }
    };
  }, []);

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

  // ── PayPal order config ────────────────────────────────────────────────────
  // createOrder calls our server which creates the order on PayPal server-side
  // (amount is set authoritatively on the backend, not trusted from the client).
  const makePayPalConfig = useCallback(() => ({
    createOrder: async () => {
      const token = localStorage.getItem("user_token") || "";
      const res = await fetch(`${API_BASE}/api/payment/paypal-create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_id: planId, billing_period: period }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : {};
      if (data?.error === 1) throw new Error(data.message || "Could not create order.");
      return data.order_id as string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onApprove: async (_data: unknown, actions: any) => {
      setLoading(true);
      try {
        const capture = await actions.order.capture();
        const token = localStorage.getItem("user_token") || "";
        const verRes = await fetch(`${API_BASE}/api/payment/paypal-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paypal_order_id: capture.id, plan_id: planId, billing_period: period, country }),
        }).catch(() => null);
        const ver = verRes ? await verRes.json().catch(() => ({})) : {};
        if (ver?.error === 1) { setError(ver.message || "Verification failed."); }
        else {
          localStorage.setItem("user_plan_status", "active");
          localStorage.setItem("user_plan_id", planId);
          setSuccess(`${planName} activated! Redirecting…`);
          setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
        }
      } catch { setError("Payment could not be verified. Contact support."); }
      finally { setLoading(false); }
    },
    onError: () => setError("PayPal encountered an error. Please try again."),
    onCancel: () => setError("Payment cancelled."),
  }), [planId, planName, period, country, router]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── PayPal tab: yellow PayPal button ──────────────────────────────────────
  const renderPayPalButtons = useCallback(async () => {
    if (ppRendered || !sel) return;
    if (ppInstanceRef.current) {
      try { ppInstanceRef.current.close(); } catch { /* ignore */ }
      ppInstanceRef.current = null;
    }
    const container = ppContainerRef.current;
    if (!container) return;
    if (!PAYPAL_CID) { setError("PayPal is not configured. Please contact support."); return; }
    const loaded = await loadPayPal(PAYPAL_CID, "USD");
    if (!loaded || !window.paypal) { setError("Failed to load PayPal. Please try again."); return; }
    const buttons = window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: { layout:"vertical", color:"gold", shape:"rect", label:"checkout", height:50 },
      ...makePayPalConfig(),
    });
    buttons.render(container);
    ppInstanceRef.current = buttons;
    setPpRendered(true);
  }, [ppRendered, sel, makePayPalConfig]);

  // ── Google Pay button renderer (international) ────────────────────────────
  const renderGooglePay = useCallback(async () => {
    if (gpayRendered || !sel) return;
    const container = gpayContainerRef.current;
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gw = window as any;
    const loaded = await loadGooglePay();
    if (!loaded || !gw.google?.payments?.api) {
      setGpayAvailable(false); return;
    }

    const usdAmount = (sel.total_price / 83).toFixed(2);

    const allowedPaymentMethods = [{
      type: "CARD",
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX", "DISCOVER"],
      },
      tokenizationSpecification: {
        type: "PAYMENT_GATEWAY",
        parameters: { gateway: "example", gatewayMerchantId: "exampleGatewayMerchantId" },
      },
    }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentsClient = new gw.google.payments.api.PaymentsClient({ environment: "TEST" });

    try {
      const { result } = await paymentsClient.isReadyToPay({ apiVersion:2, apiVersionMinor:0, allowedPaymentMethods });
      if (!result) { setGpayAvailable(false); return; }
      setGpayAvailable(true);

      const paymentDataRequest = {
        apiVersion: 2, apiVersionMinor: 0,
        allowedPaymentMethods,
        transactionInfo: { totalPriceStatus:"FINAL", totalPrice:usdAmount, currencyCode:"USD", countryCode:"US" },
        merchantInfo: { merchantName:"SecureLint", merchantId: GPAY_MID },
      };

      const button = paymentsClient.createButton({
        buttonColor: "black", buttonType: "pay", buttonSizeMode: "fill",
        onClick: async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const paymentData: any = await paymentsClient.loadPaymentData(paymentDataRequest);
            setLoading(true);
            const token = localStorage.getItem("user_token") || "";
            const verRes = await fetch(`${API_BASE}/api/payment/googlepay-verify`, {
              method:"POST",
              headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
              body: JSON.stringify({
                payment_token: paymentData.paymentMethodData.tokenizationData.token,
                plan_id: planId, billing_period: period, country,
              }),
            }).catch(() => null);
            const ver = verRes ? await verRes.json().catch(() => ({})) : {};
            if (ver?.error === 1) { setError(ver.message || "Verification failed."); }
            else {
              localStorage.setItem("user_plan_status","active");
              localStorage.setItem("user_plan_id", planId);
              setSuccess(`${planName} activated! Redirecting…`);
              setTimeout(() => router.replace("/user/dashboard/subscription"), 1500);
            }
          } catch { /* user cancelled */ }
          finally { setLoading(false); }
        },
      });

      container.innerHTML = "";
      container.appendChild(button);
      setGpayRendered(true);
    } catch { setGpayAvailable(false); }
  }, [gpayRendered, sel, planId, planName, period, country, router]);

  // ── PayU redirect handler ─────────────────────────────────────────────────
  // PayU requires a POST form submission (not GET redirect).
  // We build a hidden form, append it to the DOM, and auto-submit it.
  const handlePayU = useCallback(async () => {
    if (!sel || !fullName.trim()) { setError("Please enter your full name."); return; }
    const phoneDigits = payuPhone.replace(/\D/g, "");
    if (phoneDigits.length < 8) { setError("Please enter a valid phone number for PayU."); return; }
    setPayuLoading(true); setError("");
    try {
      const token = localStorage.getItem("user_token") || "";
      const res = await fetch(`${API_BASE}/api/payment/payu-create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_id: planId, billing_period: period, full_name: fullName, country, phone: phoneDigits }),
      }).catch(() => null);
      const data = res ? await res.json().catch(() => ({})) : {};
      if (data?.error === 1) { setError(data.message || "Could not initiate PayU payment."); return; }
      if (!data?.action_url || !data?.params) {
        setError("PayU did not return payment details. Please try again."); return;
      }
      // Build and auto-submit a hidden POST form to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action_url;
      Object.entries(data.params as Record<string, string>).forEach(([k, v]) => {
        const inp = document.createElement("input");
        inp.type = "hidden"; inp.name = k; inp.value = v;
        form.appendChild(inp);
      });
      document.body.appendChild(form);
      form.submit();
    } catch { setError("Failed to start PayU payment. Please try again."); setPayuLoading(false); }
    // Note: don't call setPayuLoading(false) on success — page is navigating away
  }, [sel, planId, period, fullName, country, payuPhone]);

  // Auto-render active tab's button when entering pay step (non-India)
  useEffect(() => {
    if (step !== "pay" || isIndia || !sel) return;
    let t: ReturnType<typeof setTimeout>;
    if (intlTab === "paypal" && !ppRendered) {
      t = setTimeout(() => renderPayPalButtons(), 200);
    } else if (intlTab === "googlepay" && !gpayRendered) {
      t = setTimeout(() => renderGooglePay(), 200);
    }
    return () => clearTimeout(t);
  }, [step, isIndia, sel, intlTab, ppRendered, gpayRendered, renderPayPalButtons, renderGooglePay]);

  // When fullName or period changes, reset buttons so they re-render with fresh order details
  useEffect(() => {
    if (step === "pay" && !isIndia) {
      if (ppInstanceRef.current) {
        try { ppInstanceRef.current.close(); } catch { /* ignore */ }
        ppInstanceRef.current = null;
      }
      setPpRendered(false);
      setGpayRendered(false);
    }
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

      {/* Page title — choose step only */}
      {step === "choose" && (
        <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center", marginBottom:44 }}>
          <h1 style={{ fontSize:30, fontWeight:800, color:TEXT, marginBottom:8, letterSpacing:"-0.6px", lineHeight:1.2 }}>
            {`Choose a billing option for your ${planName} plan`}
          </h1>
          <p style={{ fontSize:15, color:MUTED, lineHeight:1.6 }}>
            Pick the billing period that works best for you.
          </p>
        </div>
      )}

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
                  <span style={{ background:"#ccfbf1", color:"#0f766e", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:20, display:"inline-block", marginTop:5 }}>
                    {sel.savings_label}
                  </span>
                )}
              </div>
            </div>
            <div style={{ marginTop:16, marginBottom:4, display:"flex", justifyContent:"space-between", fontSize:16 }}>
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

            {/* ── India: full name + address fields + Razorpay ── */}
            {isIndia && (
              <>
                <div style={{ marginBottom:18 }}>
                  <label style={LBL}>Full name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Rahul Sharma" style={INP} />
                </div>
                {/* Country + State side-by-side */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                  <div>
                    <label style={LBL}>Country / Region</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="separator" disabled>----------</option>
                      {TOP_COUNTRIES.map(c => <option key={`top-${c}`} value={c}>{c}</option>)}
                      <option value="separator2" disabled>----------</option>
                      {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={LBL}>State</label>
                    <select value={state} onChange={e => setState(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                      <option value="" disabled hidden>Select</option>
                      <option value="separator" disabled>----------</option>
                      {INDIA_STATES.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                {/* Pincode + City */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                  <div>
                    <label style={LBL}>Pincode</label>
                    <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="400001" style={INP} maxLength={10} />
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

            {/* ── International: Google Pay | PayPal tabs ── */}
            {!isIndia && (
              <>
                {/* Tab switcher — always on top */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", background:"#f3f4f6", borderRadius:12, padding:4, gap:4, marginBottom:20 }}>
                  {/* Google Pay tab */}
                  <button
                    onClick={() => {
                      if (intlTab !== "googlepay") {
                        setGpayRendered(false); setGpayAvailable(true);
                        setIntlTab("googlepay");
                      }
                    }}
                    style={{
                      padding:"12px 8px", border:"none", cursor:"pointer", borderRadius:9,
                      background: intlTab==="googlepay" ? "#fff" : "transparent",
                      boxShadow: intlTab==="googlepay" ? `0 0 0 2px ${G}, 0 1px 4px rgba(0,0,0,.08)` : "none",
                      transition:"all .15s",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      opacity: intlTab==="googlepay" ? 1 : 0.5,
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/gpay.webp" alt="Google Pay" style={{ height:22, objectFit:"contain" }} />
                  </button>

                  {/* PayPal tab */}
                  <button
                    onClick={() => {
                      if (intlTab !== "paypal") {
                        if (ppInstanceRef.current) { try { ppInstanceRef.current.close(); } catch { /* ignore */ } ppInstanceRef.current = null; }
                        setPpRendered(false);
                        setIntlTab("paypal");
                      }
                    }}
                    style={{
                      padding:"12px 8px", border:"none", cursor:"pointer", borderRadius:9,
                      background: intlTab==="paypal" ? "#fff" : "transparent",
                      boxShadow: intlTab==="paypal" ? `0 0 0 2px ${G}, 0 1px 4px rgba(0,0,0,.08)` : "none",
                      transition:"all .15s",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      opacity: intlTab==="paypal" ? 1 : 0.5,
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/icons/paypal.svg" alt="PayPal" style={{ height:20, objectFit:"contain" }} />
                  </button>

                  {/* PayU tab */}
                  <button
                    onClick={() => { if (intlTab !== "payu") setIntlTab("payu"); }}
                    style={{
                      padding:"12px 8px", border:"none", cursor:"pointer", borderRadius:9,
                      background: intlTab==="payu" ? "#fff" : "transparent",
                      boxShadow: intlTab==="payu" ? `0 0 0 2px ${G}, 0 1px 4px rgba(0,0,0,.08)` : "none",
                      transition:"all .15s",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      opacity: intlTab==="payu" ? 1 : 0.5,
                    }}>
                    {/* PayU wordmark */}
                    <svg width="48" height="18" viewBox="0 0 120 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="28" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="30" fill={intlTab==="payu" ? "#FF6B00" : "#9ca3af"}>Pay</text>
                      <text x="56" y="28" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="30" fill={intlTab==="payu" ? "#1A1A2E" : "#9ca3af"}>U</text>
                    </svg>
                  </button>
                </div>

                {/* Shared fields — below tabs */}
                <div style={{ marginBottom:18 }}>
                  <label style={LBL}>Full name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" style={INP} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={LBL}>Country / Region</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...INP, appearance:"none", cursor:"pointer" }}>
                    <option value="" disabled hidden>Select</option>
                    <option value="separator" disabled>----------</option>
                    {TOP_COUNTRIES.map(c => <option key={`top-${c}`} value={c}>{c}</option>)}
                    <option value="separator2" disabled>----------</option>
                    {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/*
                  Both button containers are ALWAYS in the DOM (just hidden via display:none).
                  This prevents PayPal's removeChild error when the container unmounts mid-render.
                */}

                {/* ── Google Pay panel ──
                    IMPORTANT: gpayContainerRef must have zero React children.
                    The SDK manages its DOM directly; React children would cause
                    removeChild conflicts when gpayRendered flips. Use a sibling
                    spinner and toggle the container with display:none instead. */}
                <div style={{ display: intlTab === "googlepay" ? "block" : "none" }}>
                  {!gpayAvailable ? (
                    <div style={{ padding:"16px", borderRadius:8, background:"#fef9ee", border:"1px solid #fde68a", fontSize:13, color:"#92400e", textAlign:"center" }}>
                      Google Pay is not available on this browser. Please use the PayPal tab.
                    </div>
                  ) : (
                    <>
                      {/* Spinner lives OUTSIDE the ref — sibling, not child */}
                      {!gpayRendered && (
                        <div style={{ display:"flex", justifyContent:"center", padding:"14px 0" }}>
                          <div style={{ width:22, height:22, border:`3px solid ${BORDER}`, borderTop:`3px solid #4285F4`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                        </div>
                      )}
                      {/* SDK-owned container — always empty from React's perspective */}
                      <div ref={gpayContainerRef} style={{ width:"100%", minHeight: gpayRendered ? 52 : 0 }} />
                      {gpayRendered && (
                        <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:8 }}>
                          🔒 Secured by Google Pay · Visa, Mastercard, Amex accepted
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ── PayPal panel ──
                    Same rule: ppContainerRef has zero React children. */}
                <div style={{ display: intlTab === "paypal" ? "block" : "none" }}>
                  {/* Spinner lives OUTSIDE the ref */}
                  {!ppRendered && (
                    <div style={{ display:"flex", justifyContent:"center", padding:"14px 0" }}>
                      <div style={{ width:22, height:22, border:`3px solid ${BORDER}`, borderTop:`3px solid #003087`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                    </div>
                  )}
                  {/* SDK-owned container — always empty from React's perspective */}
                  <div ref={ppContainerRef} style={{ width:"100%", minHeight: ppRendered ? 52 : 0 }} />
                  {ppRendered && (
                    <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:8 }}>
                      🔒 Secured by PayPal · Credit &amp; debit cards accepted
                    </div>
                  )}
                </div>

                {/* ── PayU panel ── */}
                {intlTab === "payu" && (
                  <div>
                    <div style={{ marginBottom:18 }}>
                      <label style={LBL}>Phone number</label>
                      <input
                        type="tel"
                        value={payuPhone}
                        onChange={e => setPayuPhone(e.target.value)}
                        placeholder="+1 555 123 4567"
                        style={INP}
                      />
                    </div>
                    <button
                      onClick={handlePayU}
                      disabled={payuLoading || !!success}
                      style={{
                        width:"100%", padding:"15px", borderRadius:10,
                        background: payuLoading || success ? "#ffd4a0" : "#FF6B00",
                        color:"#fff", fontSize:16, fontWeight:800, border:"none",
                        cursor: payuLoading || success ? "not-allowed" : "pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                        letterSpacing:"-0.2px", transition:"background .15s",
                      }}
                      onMouseEnter={e => { if (!payuLoading && !success) e.currentTarget.style.background="#e05a00"; }}
                      onMouseLeave={e => { if (!payuLoading && !success) e.currentTarget.style.background="#FF6B00"; }}>
                      {payuLoading
                        ? <><div style={{ width:18, height:18, border:"2px solid #ffffff50", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} />Redirecting to PayU…</>
                        : <>Pay ₹{sel ? sel.total_price.toLocaleString("en-IN") : "—"} with PayU</>}
                    </button>
                    <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:8 }}>
                      🔒 Secured by PayU · Visa, Mastercard &amp; more accepted
                    </div>
                  </div>
                )}
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
