/**
 * Brand icons for known secret/credential types.
 * Uses real image files from /public/icons/ where available,
 * falls back to SVG text badges for everything else.
 */

// ── Brands that have a real image file in /public/icons/ ─────────────────────
// pad: fraction of size used as padding (default 0.12). Use 0.05 for full-bleed logos.
const IMG_BRANDS: { match: RegExp; src: string; bg: string; pad?: number }[] = [
  { match: /PHISHING|URL_VISIT/i,   src: "/icons/phishing.svg", bg: "#1a0a0a", pad: 0.06 },
  { match: /AWS|AMAZON/i,           src: "/icons/aws.svg",    bg: "#232F3E" },
  { match: /STRIPE/i,               src: "/icons/stripe.svg", bg: "#0A2540" },
  { match: /SLACK/i,                src: "/icons/slack.svg",  bg: "#1a1a1a" },
  { match: /JWT|SECRET_KEY|API_KEY|TOKEN/i, src: "/icons/jwt.svg", bg: "#1a1a1a" },
  { match: /HUAWEI/i,               src: "/icons/huawei.svg",   bg: "#ffffff" },
  { match: /DOCKER/i,               src: "/icons/docker.svg",   bg: "#0d1218" },
  { match: /MONGO|POSTGRES|MYSQL|REDIS|DATABASE|DB_/i, src: "/icons/database.svg", bg: "#0d1218", pad: 0.05 },
];

// ── Text-badge fallbacks for everything else ──────────────────────────────────
type BrandDef = { bg: string; fg: string; label: string };

const BRANDS: { match: RegExp; def: BrandDef }[] = [
  { match: /GITHUB|GH_TOKEN/i,              def: { bg: "#24292E", fg: "#FFFFFF", label: "GH"  } },
  { match: /VERCEL/i,                        def: { bg: "#000000", fg: "#FFFFFF", label: "▲"   } },
  { match: /GOOGLE|GCP|FIREBASE/i,           def: { bg: "#4285F4", fg: "#FFFFFF", label: "G"   } },
  { match: /OPENAI|GPT|CHATGPT/i,            def: { bg: "#10A37F", fg: "#FFFFFF", label: "AI"  } },
  { match: /AZURE|MICROSOFT/i,               def: { bg: "#0078D4", fg: "#FFFFFF", label: "Az"  } },
  { match: /TWILIO/i,                        def: { bg: "#F22F46", fg: "#FFFFFF", label: "Tw"  } },
  { match: /SENDGRID/i,                      def: { bg: "#1A82E2", fg: "#FFFFFF", label: "SG"  } },
  { match: /HUGGING|HF_/i,                   def: { bg: "#FFD21E", fg: "#1A1A1A", label: "HF"  } },
  { match: /SUPABASE/i,                      def: { bg: "#3ECF8E", fg: "#1A1A1A", label: "Sb"  } },
  { match: /CLOUDFLARE/i,                    def: { bg: "#F38020", fg: "#FFFFFF", label: "CF"  } },
  { match: /DATADOG/i,                       def: { bg: "#632CA6", fg: "#FFFFFF", label: "DD"  } },
  { match: /SENTRY/i,                        def: { bg: "#362D59", fg: "#FFFFFF", label: "Se"  } },
  { match: /NPM/i,                           def: { bg: "#CB3837", fg: "#FFFFFF", label: "npm" } },
  { match: /HEROKU/i,                        def: { bg: "#430098", fg: "#FFFFFF", label: "Hk"  } },
  { match: /DIGITALOCEAN|DO_/i,              def: { bg: "#0080FF", fg: "#FFFFFF", label: "DO"  } },
  { match: /PRIVATE|RSA|SSH|PEM/i,           def: { bg: "#1F2937", fg: "#6EE7B7", label: "SSH" } },
];

const DEFAULT_DEF: BrandDef = { bg: "#1E293B", fg: "#94A3B8", label: "KEY" };

export function getSecretBrandDef(secretType: string): BrandDef {
  for (const { match, def } of BRANDS) {
    if (match.test(secretType)) return def;
  }
  return DEFAULT_DEF;
}

// GitHub — inline SVG Octocat (no image file available)
function GitHubIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect width={size} height={size} rx={size * 0.5} fill="#24292E" />
      <path
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        fill="#ffffff"
        transform="scale(0.75) translate(4,4)"
      />
    </svg>
  );
}

export function SecretBrandIcon({ secretType, size = 22 }: { secretType: string; size?: number }) {
  // 1. GitHub — inline SVG
  if (/GITHUB|GH_TOKEN/i.test(secretType)) return <GitHubIcon size={size} />;

  // 2. Brands with a real image file
  for (const brand of IMG_BRANDS) {
    if (brand.match.test(secretType)) {
      const pad = (brand.pad ?? 0.12) * size;
      return (
        <div style={{
          width: size, height: size, borderRadius: size * 0.28,
          background: brand.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", flexShrink: 0,
          padding: pad,
          boxSizing: "border-box",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.src}
            alt={secretType}
            style={{ objectFit: "contain", width: "100%", height: "100%", display: "block" }}
          />
        </div>
      );
    }
  }

  // 3. Text-badge fallback
  const { bg, fg, label } = getSecretBrandDef(secretType);
  const isSmall = label.length <= 2;
  const fontSize = isSmall ? Math.round(size * 0.42) : Math.round(size * 0.32);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ flexShrink: 0 }}>
      <rect width={size} height={size} rx={size * 0.28} fill={bg} />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fontSize={fontSize} fontWeight="800" fill={fg}
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
        letterSpacing="-0.3"
      >{label}</text>
    </svg>
  );
}
