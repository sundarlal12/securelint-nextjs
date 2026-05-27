"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Activity,
  Globe,
  Building2,
  ChevronRight,
} from "lucide-react";
import { SecureLintIconLight } from "@/components/SecureLintLogo";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://securelint-api.vercel.app";


  const COUNTRIES = [
    "India","United States","United Kingdom","Canada","Australia","Singapore",
    "Germany","France","Japan","South Korea","Brazil","South Africa",
    "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
    "Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Bolivia",
    "Bosnia and Herzegovina","Botswana","Bulgaria","Cambodia","Cameroon","Chile",
    "China","Colombia","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark",
    "Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia",
    "Finland","Georgia","Ghana","Greece","Guatemala","Honduras","Hungary",
    "Iceland","Indonesia","Iraq","Ireland","Israel","Italy","Jamaica","Jordan",
    "Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia","Lebanon","Libya",
    "Liechtenstein","Lithuania","Luxembourg","Malaysia","Maldives","Malta",
    "Mexico","Moldova","Mongolia","Morocco","Mozambique","Myanmar","Nepal",
    "Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Oman","Pakistan",
    "Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal",
    "Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia",
    "Slovakia","Slovenia","Somalia","Spain","Sri Lanka","Sudan","Sweden",
    "Switzerland","Syria","Taiwan","Tanzania","Thailand","Tunisia","Turkey",
    "Uganda","Ukraine","United Arab Emirates","Uruguay","Uzbekistan","Venezuela",
    "Vietnam","Yemen","Zambia","Zimbabwe",
  ];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  fontSize: 15,
  outline: "none",
  background: "#fff",
  color: "#0f172a",
  transition: "all .2s ease",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  fontFamily: "Inter, sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 600,
  color: "#0f172a",
};

const requiredStyle: React.CSSProperties = {
  color: "#ef4444",
  marginLeft: 3,
};

export default function ContactSalesPage() {
  const [form, setForm] = useState({
    work_email: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_name: "",
    company_size: "",
    function: "",
    management_level: "",
    country: "India",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/contact/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc 0%, #eef2ff 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <style>{`
        *{
          box-sizing:border-box;
        }

        html{
          scroll-behavior:smooth;
        }

        input:focus,
        select:focus,
        textarea:focus{
          border-color:#40826d !important;
          box-shadow:0 0 0 4px rgba(64,130,109,.15) !important;
        }

        .primary-btn{
          transition:all .25s ease;
        }

        .primary-btn:hover{
          transform:translateY(-1px);
          opacity:.96;
        }

        .floating-card{
          backdrop-filter:blur(16px);
        }

        @media (max-width: 980px){
          .main-grid{
            grid-template-columns:1fr !important;
          }

          .hero-heading{
            font-size:42px !important;
          }
        }

        @media (max-width: 640px){
          .hero-heading{
            font-size:34px !important;
          }

          .form-grid{
            grid-template-columns:1fr !important;
          }

          .container{
            padding-left:20px !important;
            padding-right:20px !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          height: 76,
          borderBottom: "1px solid rgba(148,163,184,.18)",
          background: "rgba(255,255,255,.7)",
          backdropFilter: "blur(14px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            <SecureLintIconLight size={36} />
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                SecureLint
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2,
                }}
              >
                Enterprise Security Platform
              </div>
            </div>
          </Link>

          <Link
            href="/#pricing"
            style={{
              textDecoration: "none",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Back to Pricing
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div
        className="container"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "56px 28px 72px",
        }}
      >
        {/* Page heading — centered, like the screenshot */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "#0f172a", letterSpacing: "-1.2px", marginBottom: 14 }}>
            Contact our Enterprise Sales team
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Get in touch to see how SecureLint can protect your organization from phishing, leaks &amp; browser threats.
          </p>
        </div>

        <div
          className="main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: ".9fr 1.1fr",
            gap: 72,
            alignItems: "start",
          }}
        >
          {/* RIGHT SECTION — content */}
          <div style={{ order: 2 }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#475569", marginBottom: 32 }}>
              SecureLint helps enterprise teams stop phishing attacks,
              prevent sensitive data exposure, and enforce browser-level
              security policies across every employee device.
            </p>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                gap: 18,
                marginBottom: 42,
              }}
            >
              {[
                {
                  value: "99.9%",
                  label: "Threat Detection Accuracy",
                },
                {
                  value: "14+",
                  label: "Security Layers",
                },
                {
                  value: "50K+",
                  label: "Protected Users",
                },
                {
                  value: "24/7",
                  label: "Monitoring & Support",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,.8)",
                    border: "1px solid rgba(226,232,240,.7)",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow:
                      "0 10px 30px rgba(15,23,42,.04)",
                  }}
                >
                  <div
                    style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#40826d",
                    marginBottom: 8,
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#64748b",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* FEATURES */}
            <div
              style={{
                background:
                  "linear-gradient(135deg,#0f172a 0%, #111827 50%, #1e293b 100%)",
                borderRadius: 28,
                padding: 36,
                color: "#fff",
                boxShadow: "0 20px 60px rgba(15,23,42,.2)",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Why security teams choose SecureLint
              </div>

              <p
                style={{
                  fontSize: 15,
                  color: "#cbd5e1",
                  lineHeight: 1.8,
                  marginBottom: 30,
                }}
              >
                Enterprise-grade browser protection with centralized
                policy controls, phishing defense, and real-time DLP.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {[
                  {
                    icon: <ShieldCheck size={22} />,
                    title: "Phishing Detection Engine",
                    desc:
                      "AI-powered multi-layer phishing detection before pages fully load.",
                  },
                  {
                    icon: <Lock size={22} />,
                    title: "Sensitive Data Protection",
                    desc:
                      "Prevent secrets, tokens, passwords, and PII from leaking.",
                  },
                  {
                    icon: <Activity size={22} />,
                    title: "Real-Time Security Monitoring",
                    desc:
                      "Track incidents, browser activity, and policy violations instantly.",
                  },
                  {
                    icon: <Globe size={22} />,
                    title: "Browser-wide Protection",
                    desc:
                      "Works across Gmail, ChatGPT, Slack, LinkedIn, and more.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: "rgba(255,255,255,.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          color: "#cbd5e1",
                          lineHeight: 1.7,
                          fontSize: 14,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUSTED */}
            <div style={{ marginTop: 42 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 22, textTransform: "uppercase", letterSpacing: ".1em" }}>
                Trusted by innovative companies
              </div>

              <style>{`
                .logo-item img { filter: grayscale(100%) opacity(.55); transition: filter .25s ease; }
                .logo-item:hover img { filter: grayscale(0%) opacity(1); }
              `}</style>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 24px", alignItems: "center" }}>
                {[
                  { name: "MyGate",    logo: "/icons/MyGate1.png"   },
                  { name: "VAPTLabs", logo: "/icons/vapt.png"      },
                  { name: "Paysquare", logo: "/icons/paysquare.png" },
                  { name: "Aurum",     logo: "/icons/aurm.svg"      },
                  { name: "RKCL",      logo: "/icons/rkcl.webp"     },
                
                  // { name: "DrDroid",   logo: "/icons/drdroid.svg"   },
              
                ].map((co) => (
                  <div key={co.name} className="logo-item" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={co.logo} alt={co.name} style={{ maxHeight: 30, maxWidth: 100, objectFit: "contain" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM — order:1 places it on the left */}
          <div
            className="floating-card"
            style={{
              order: 1,
              background: "rgba(255,255,255,.86)",
              border: "1px solid rgba(255,255,255,.6)",
              borderRadius: 32,
              padding: 36,
              boxShadow: "0 20px 60px rgba(15,23,42,.08)",
              position: "sticky",
              top: 100,
            }}
          >
            {success ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 10px",
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    margin: "0 auto 24px",
                    borderRadius: "50%",
                    background: "#40826d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <ShieldCheck size={42} />
                </div>

                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 14,
                  }}
                >
                  Thank you!
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: 1.8,
                    fontSize: 15,
                  }}
                >
                  Our enterprise sales team will contact you
                  within 1 business day.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginBottom: 30,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      background: "rgba(64,130,109,.08)",
                      borderRadius: 999,
                      color: "#40826d",
                      fontWeight: 700,
                      fontSize: 12,
                      marginBottom: 18,
                    }}
                  >
                    <Building2 size={15} />
                    Enterprise Contact Form
                  </div>

                  <h2
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      color: "#0f172a",
                      marginBottom: 12,
                      letterSpacing: "-1px",
                    }}
                  >
                    Contact Sales
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: 1.7,
                      fontSize: 15,
                    }}
                  >
                    Tell us about your organization and security
                    requirements.
                  </p>
                </div>

                {error && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "14px 16px",
                      borderRadius: 14,
                      marginBottom: 20,
                      fontSize: 14,
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div
                    className="form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        First name
                        <span style={requiredStyle}>*</span>
                      </label>

                      <input
                        required
                        style={inputStyle}
                        value={form.first_name}
                        onChange={(e) =>
                          set("first_name", e.target.value)
                        }
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Last name
                        <span style={requiredStyle}>*</span>
                      </label>

                      <input
                        required
                        style={inputStyle}
                        value={form.last_name}
                        onChange={(e) =>
                          set("last_name", e.target.value)
                        }
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>
                      Work email
                      <span style={requiredStyle}>*</span>
                    </label>

                    <input
                      type="email"
                      required
                      style={inputStyle}
                      value={form.work_email}
                      onChange={(e) =>
                        set("work_email", e.target.value)
                      }
                      placeholder="security@vaptlabs.com"
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>
                      Phone
                      <span style={requiredStyle}>*</span>
                    </label>

                    <input
                      required
                      style={inputStyle}
                      value={form.phone}
                      onChange={(e) =>
                        set("phone", e.target.value)
                      }
                      placeholder="+917597777505"
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>
                      Company name
                      <span style={requiredStyle}>*</span>
                    </label>

                    <input
                      required
                      style={inputStyle}
                      value={form.company_name}
                      onChange={(e) =>
                        set("company_name", e.target.value)
                      }
                      placeholder="VAPT Labs"
                    />
                  </div>

                  <div
                    className="form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        Company size
                        <span style={requiredStyle}>*</span>
                      </label>

                      <select
                        required
                        style={inputStyle}
                        value={form.company_size}
                        onChange={(e) =>
                          set("company_size", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="1-49">
                          1-49 employees
                        </option>
                        <option value="50-249">
                          50-249 employees
                        </option>
                        <option value="250-999">
                          250-999 employees
                        </option>
                        <option value="1000+">
                          1000+ employees
                        </option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Function
                        <span style={requiredStyle}>*</span>
                      </label>

                      <select
                        required
                        style={inputStyle}
                        value={form.function}
                        onChange={(e) =>
                          set("function", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="IT">IT</option>
                        <option value="Security">
                          Security
                        </option>
                        <option value="Engineering">
                          Engineering
                        </option>
                        <option value="Management">
                          Management
                        </option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 18,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        Management level
                        <span style={requiredStyle}>*</span>
                      </label>

                      <select
                        required
                        style={inputStyle}
                        value={form.management_level}
                        onChange={(e) =>
                          set(
                            "management_level",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select</option>
                        <option value="C-Level">
                          C-Level
                        </option>
                        <option value="VP">
                          VP-Level
                        </option>
                        <option value="Director">
                          Director
                        </option>
                        <option value="Manager">
                          Manager
                        </option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Country
                        <span style={requiredStyle}>*</span>
                      </label>

                      <select
                        required
                        style={inputStyle}
                        value={form.country}
                        onChange={(e) =>
                          set("country", e.target.value)
                        }
                      >
                        {COUNTRIES.map((country) => (
                          <option
                            key={country}
                            value={country}
                          >
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>
                      How can we help?
                    </label>

                    <textarea
                      style={{
                        ...inputStyle,
                        minHeight: 120,
                        resize: "vertical",
                      }}
                      value={form.message}
                      onChange={(e) =>
                        set("message", e.target.value)
                      }
                      placeholder="Tell us about your use case, browser security requirements, phishing concerns, or enterprise deployment needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-btn"
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 16,
                      padding: "16px 18px",
                      background: loading ? "#6aab96" : "#40826d",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: "0 10px 30px rgba(64,130,109,.3)",
                    }}
                  >
                    {loading ? "Submitting..." : "Contact Sales"}

                    {!loading && <ChevronRight size={18} />}
                  </button>

                  <div
                    style={{
                      marginTop: 22,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {[
                      "SOC 2",
                      "GDPR",
                      "ISO 27001",
                      "PCI DSS",
                      "Enterprise Ready",
                    ].map((badge) => (
                      <div
                        key={badge}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 999,
                          background: "rgba(64,130,109,.07)",
                          color: "#40826d",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      marginTop: 24,
                      color: "#64748b",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    By submitting this form, you agree to our
                    privacy policy and enterprise terms.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}