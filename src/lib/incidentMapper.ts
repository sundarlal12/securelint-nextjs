import type { Incident, BrowserInfo } from "@/components/dashboard/IncidentReportLayout";

function mapBrowserInfo(raw: unknown): BrowserInfo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const b = raw as Record<string, unknown>;
  return {
    os:              b.os           ? String(b.os)           : undefined,
    deviceType:      b.deviceType   ? String(b.deviceType)   : undefined,
    browserName:     b.browserName  ? String(b.browserName)  : undefined,
    browserVersion:  b.browserVersion ? String(b.browserVersion) : undefined,
    viewportWidth:   typeof b.viewportWidth  === "number" ? b.viewportWidth  : undefined,
    viewportHeight:  typeof b.viewportHeight === "number" ? b.viewportHeight : undefined,
  };
}

// ── Colour palette for user avatars ──────────────────────────────────────────
const AVATAR_COLORS = [
  "#1e3a8a","#1f4a3c","#92400e","#4a1d96",
  "#7c3aed","#0e7490","#065f46","#991b1b",
];
function avatarColor(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ── Derive display name + initials from email ─────────────────────────────────
function nameFromEmail(email: string): { name: string; initials: string } {
  const local = (email ?? "").split("@")[0] ?? "unknown";
  const parts = local.split(/[._-]/).filter(Boolean);
  const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : local.slice(0, 2).toUpperCase();
  return { name, initials };
}

// ── Parse ISO timestamp → human strings ──────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function parseTimestamp(ts: string): { detectedAt: string; detectedTime: string } {
  try {
    const d = new Date(ts);
    // Use local date components so detectedAt and detectedTime are in the same timezone
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    const detectedAt = `${yyyy}-${mm}-${dd}`;   // local date for filter
    let h = d.getHours(), min = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const detectedTime = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${yyyy} · ${h}:${String(min).padStart(2, "0")} ${ampm}`;
    return { detectedAt, detectedTime };
  } catch {
    return { detectedAt: ts ?? "", detectedTime: "" };
  }
}

// ── Map raw `action` field → Incident alertStatus ────────────────────────────
function mapAction(action: string): Incident["alertStatus"] {
  switch ((action ?? "").toLowerCase()) {
    case "blocked":  return "Blocked";
    case "mask":
    case "masked":   return "Masked";
    case "flagged":  return "Flagged";
    case "quarantine":
    case "quarantined": return "Quarantined";
    default:         return "Detected";
  }
}

// ── Capitalize severity ───────────────────────────────────────────────────────
function mapSeverity(s: string): Incident["severity"] {
  const cap = s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "High";
  if (["Critical","High","Medium","Low"].includes(cap)) return cap as Incident["severity"];
  return "High";
}

// ── Extract real URL/domain from extension warning pages ─────────────────────
// e.g. chrome-extension://xxx/warning.html?url=https%3A%2F%2Fx.com%2F&domain=x.com
// Returns the value of `domain` param (or decoded `url` param, or the raw input)
function resolveUrl(raw: string): string {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    if (u.protocol === "chrome-extension:" || u.protocol === "moz-extension:" || u.protocol === "safari-extension:") {
      // Prefer explicit domain param, fall back to decoded url param
      const domain = u.searchParams.get("domain");
      if (domain) return domain;
      const embeddedUrl = u.searchParams.get("url");
      if (embeddedUrl) {
        try { return new URL(embeddedUrl).hostname; } catch { return embeddedUrl; }
      }
      return u.hostname; // fallback to extension host (not useful but safe)
    }
    return raw; // normal URL — keep as-is
  } catch {
    return raw;
  }
}

// ── Shorten a URL for preview column ─────────────────────────────────────────
function shortUrl(url: string): string {
  const resolved = resolveUrl(url);
  try { return new URL(resolved).hostname; } catch { return (resolved ?? "").slice(0, 40); }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECRETS mapper
// ─────────────────────────────────────────────────────────────────────────────
export function mapSecretIncident(
  inc: Record<string, unknown>,
  icon: React.ReactNode,
): Incident {
  const email = String(inc.user_email ?? "");
  const { name, initials } = nameFromEmail(email);
  const { detectedAt, detectedTime } = parseTimestamp(String(inc.timestamp ?? inc.created_at ?? ""));
  const secretType = String(inc.secret_type ?? "Secret");
  const severity   = mapSeverity(String(inc.severity ?? "high"));
  const alertStatus = mapAction(String(inc.action ?? ""));
  const maskedContent = String(inc.masked_preview ?? "");
  const tabUrl    = resolveUrl(String(inc.tab_url ?? ""));
  const tabTitle  = String(inc.tab_title ?? "");
  const browserId = String(inc.browser_id ?? "");
  const extVer    = String(inc.extension_version ?? "");
  const incId     = String(inc.id ?? "");

  return {
    id: incId,
    initials,
    initialsColor: avatarColor(email),
    name,
    email,
    secretType,
    secretIcon: icon,
    severity,
    alertStatus,
    detectedAt,
    detectedTime,
    preview: maskedContent || shortUrl(tabUrl),
    alertTitle: `${secretType} secret exposure — ${alertStatus}`,
    alertDesc: [
      `Credential type: ${secretType} identified in an active browser session`,
      `Response: Secret automatically ${alertStatus.toLowerCase()} to prevent exposure`,
      `Session context: ${tabTitle ? `"${tabTitle}"` : shortUrl(tabUrl)}`,
      `Scan engine: Real-time browser extension monitoring`,
      `Severity classification: ${severity}`,
    ].join("\n"),
    details: [
      { icon: "👤", label: "Employee",       value: name },
      { icon: "📧", label: "Email",          value: email },
      { icon: "🔑", label: "Secret Type",    value: secretType },
      { icon: "⚠️", label: "Severity",       value: severity },
      { icon: "✅", label: "Action",         value: alertStatus },
      { icon: "🌐", label: "Page URL",       value: tabUrl },
      { icon: "📋", label: "Page Title",     value: tabTitle },
      { icon: "🖥️", label: "Browser ID",    value: browserId },
      { icon: "📦", label: "Extension Ver",  value: extVer },
      { icon: "#️⃣", label: "Incident ID",   value: `INC-${incId}` },
    ].filter(d => d.value && d.value !== "undefined"),
    maskedContent: maskedContent || "(no preview available)",
    browserInfo: mapBrowserInfo(inc.browser_info),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PHISHING (url_visit) mapper
// ─────────────────────────────────────────────────────────────────────────────
export function mapPhishingIncident(
  inc: Record<string, unknown>,
  icon: React.ReactNode,
): Incident {
  const email = String(inc.user_email ?? "");
  const { name, initials } = nameFromEmail(email);
  const { detectedAt, detectedTime } = parseTimestamp(String(inc.timestamp ?? inc.created_at ?? ""));
  const alertStatus = mapAction(String(inc.action ?? "blocked"));
  const severity    = mapSeverity(String(inc.severity ?? "high"));
  const extra       = (inc.extra as Record<string, unknown>) ?? {};
  const rawTabUrl   = String(inc.tab_url ?? "");
  const tabUrl      = resolveUrl(rawTabUrl);
  const domain      = String(extra.domain ?? shortUrl(rawTabUrl));
  const siteStatus  = String(extra.status ?? extra.site_status ?? extra.verdict ?? "unknown");
  const riskScore   = String(extra.riskScore ?? extra.score ?? "");
  const tabTitle    = String(inc.tab_title ?? "");
  const browserId   = String(inc.browser_id ?? "");
  const extVer      = String(inc.extension_version ?? "");
  const incId       = String(inc.id ?? "");
  const rawType = String(inc.secret_type ?? "");

  // Extract reason / blockType from extension warning page URL query params
  let wafReason = "";
  let blockType = "";
  try {
    const u = new URL(rawTabUrl);
    if (u.protocol === "chrome-extension:" || u.protocol === "moz-extension:") {
      wafReason = u.searchParams.get("reason") ?? "";
      blockType = u.searchParams.get("blockType") ?? "";
    }
  } catch { /* not a valid URL */ }

  // Also check extra.reasons array (e.g. ["waf:social_domain"])
  const extraReasons: string[] = Array.isArray(extra.reasons)
    ? (extra.reasons as string[])
    : [];
  const reasonStr = wafReason || extraReasons.join(" ") || "";

  // Derive a clean human-readable attack type
  const attackType =
    rawType === "phishing"                                   ? "Phishing Page Blocked" :
    reasonStr.includes("waf_social_domain") ||
      reasonStr.includes("social_domain")                   ? "Social Domain Block" :
    reasonStr.includes("waf_domain_block") ||
      blockType === "waf"                                    ? "WAF Domain Block" :
    reasonStr.includes("malware")                           ? "Malware Site" :
    reasonStr.includes("phishing")                          ? "Phishing Blocked" :
    siteStatus === "danger"                                  ? "Malicious Site" :
    siteStatus === "suspicious"                              ? "Suspicious Site" :
    siteStatus === "safe"                                    ? "Allowlisted Visit" :
                                                              "Blocked Site";

  return {
    id: incId,
    initials,
    initialsColor: avatarColor(email),
    name,
    email,
    secretType: attackType,
    secretIcon: icon,
    severity,
    alertStatus,
    detectedAt,
    detectedTime,
    preview: domain,
    alertTitle: `${attackType} — ${domain}`,
    alertDesc: [
      `Incident type: ${attackType}`,
      `Domain: ${domain}${riskScore ? ` · risk score ${riskScore}` : ""}`,
      wafReason ? `WAF rule triggered: ${wafReason.replace(/_/g, " ")}` : `Site verdict: ${siteStatus}`,
      `Response: Access ${alertStatus.toLowerCase()} by SecureLint WAF`,
      `Detection method: Threat intelligence, AI scoring, and WAF heuristics`,
      `Severity classification: ${severity}`,
    ].join("\n"),
    details: [
      { icon: "", label: "Employee",         value: name },
      { icon: "", label: "Email",            value: email },
      { icon: "", label: "Incident Type",    value: attackType },
      { icon: "", label: "Domain",           value: domain },
      { icon: "", label: "Full URL",         value: tabUrl },
      { icon: "", label: "Site Status",      value: siteStatus },
      { icon: "", label: "Risk Score",       value: riskScore },
      wafReason ? { icon: "", label: "WAF Rule",  value: wafReason.replace(/_/g, " ") } : null,
      blockType  ? { icon: "", label: "Block Type", value: blockType } : null,
      { icon: "", label: "Severity",         value: severity },
      { icon: "", label: "Action",           value: alertStatus },
      { icon: "", label: "Page Title",       value: tabTitle },
      { icon: "", label: "Browser ID",       value: browserId },
      { icon: "", label: "Extension Ver",    value: extVer },
      { icon: "", label: "Incident ID",      value: `PHI-${incId}` },
    ].filter((d): d is { icon: string; label: string; value: string } =>
      d !== null && Boolean(d.value) && d.value !== "undefined"
    ),
    maskedContent: tabUrl || domain,
    browserInfo: mapBrowserInfo(inc.browser_info),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL DLP (email_recipient) mapper
// ─────────────────────────────────────────────────────────────────────────────
export function mapDlpIncident(
  inc: Record<string, unknown>,
  icon: React.ReactNode,
): Incident {
  const email = String(inc.user_email ?? "");
  const { name, initials } = nameFromEmail(email);
  const { detectedAt, detectedTime } = parseTimestamp(String(inc.timestamp ?? inc.created_at ?? ""));
  const alertStatus  = mapAction(String(inc.action ?? "blocked"));
  const severity     = mapSeverity(String(inc.severity ?? "high"));
  const recipients    = inc.recipientDomains;
  // Normalise to array then back so we can pipe-separate for chip rendering
  const recipientArr: string[] = Array.isArray(recipients)
    ? (recipients as string[]).filter(Boolean)
    : typeof recipients === "string" && recipients
      ? recipients.split(",").map(s => s.trim()).filter(Boolean)
      : [];
  const recipientStr = recipientArr.join("|");  // "|" used as split key in detail panel
  const tabUrl       = resolveUrl(String(inc.tab_url ?? ""));
  const tabTitle     = String(inc.tab_title ?? "");
  const maskedContent = String(inc.masked_preview ?? "");
  const browserId    = String(inc.browser_id ?? "");
  const extVer       = String(inc.extension_version ?? "");
  const incId        = String(inc.id ?? "");
  const extra        = (inc.extra as Record<string, unknown>) ?? {};
  const dataType     = String(extra.dataType ?? extra.data_type ?? "Sensitive Data");

  return {
    id: incId,
    initials,
    initialsColor: avatarColor(email),
    name,
    email,
    secretType: "Email DLP",
    secretIcon: icon,
    severity,
    alertStatus,
    detectedAt,
    detectedTime,
    preview: shortUrl(tabUrl) || (tabTitle ? tabTitle.slice(0, 40) : recipientArr[0] ?? "—"),
    alertTitle: `Outbound email DLP violation — ${alertStatus}`,
    alertDesc: [
      `Policy trigger: ${dataType} detected in outbound email activity`,
      `Response: Transmission ${alertStatus.toLowerCase()} per active DLP policy`,
      recipientArr.length ? `Recipient domains involved: ${recipientArr.join(", ")}` : "Recipient domain: not captured",
      `Detection method: DLP content inspection engine`,
      `Severity classification: ${severity}`,
    ].join("\n"),
    details: [
      { icon: "👤", label: "Employee",       value: name },
      { icon: "📧", label: "Email",          value: email },
      { icon: "📤", label: "Recipients",     value: recipientStr },
      { icon: "🔑", label: "Data Type",      value: dataType },
      { icon: "⚠️", label: "Severity",       value: severity },
      { icon: "✅", label: "Action",         value: alertStatus },
      { icon: "🌐", label: "Page URL",       value: tabUrl },
      { icon: "📋", label: "Page Title",     value: tabTitle },
      { icon: "🖥️", label: "Browser ID",    value: browserId },
      { icon: "📦", label: "Extension Ver",  value: extVer },
      { icon: "#️⃣", label: "Incident ID",   value: `DLP-${incId}` },
    ].filter(d => d.value && d.value !== "undefined"),
    maskedContent: maskedContent || recipientArr.join(", ") || tabUrl || "(no preview available)",
    browserInfo: mapBrowserInfo(inc.browser_info),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTENSION (browser extension activity) mapper
// ─────────────────────────────────────────────────────────────────────────────
const EXT_TYPE_LABELS: Record<string, string> = {
  extension_install:    "Extension Installed",
  extension_uninstall:  "Extension Uninstalled",
  extension_sync:       "Extension Synced",
  extension_malicious:  "Malicious Extension",
  extension_blacklist:  "Blacklisted Extension",
  extension_all:        "Extension Activity",
  extension_type:       "Extension Activity",
};

function resolveExtensionName(extensions: unknown): { extName: string; extId: string } {
  if (!extensions) return { extName: "", extId: "" };
  const tryObj = (o: Record<string, unknown>) => ({
    extName: String(o.name ?? o.extension_name ?? o.title ?? ""),
    extId:   String(o.id   ?? o.extension_id   ?? o.ext_id   ?? ""),
  });
  if (Array.isArray(extensions) && extensions.length > 0) return tryObj(extensions[0] as Record<string, unknown>);
  if (typeof extensions === "object") return tryObj(extensions as Record<string, unknown>);
  return { extName: "", extId: "" };
}

export function mapExtensionIncident(
  inc: Record<string, unknown>,
  icon: React.ReactNode,
): Incident {
  const email = String(inc.user_email ?? "");
  const { name, initials } = nameFromEmail(email);
  const { detectedAt, detectedTime } = parseTimestamp(String(inc.timestamp ?? inc.created_at ?? ""));
  const rawType     = String(inc.type ?? inc.secret_type ?? "extension_type");
  const activityType = EXT_TYPE_LABELS[rawType] ?? "Extension Activity";
  const alertStatus  = mapAction(String(inc.action ?? "sync"));
  const severity     = mapSeverity(String(inc.severity ?? "medium"));
  const { extName, extId } = resolveExtensionName(inc.extensions);
  const browserId    = String(inc.browser_id ?? "");
  const extVer       = String(inc.extension_version ?? "");
  const tabUrl       = resolveUrl(String(inc.tab_url ?? ""));
  const tabTitle     = String(inc.tab_title ?? "");
  const incId        = String(inc.id ?? "");

  return {
    id: incId,
    initials,
    initialsColor: avatarColor(email),
    name,
    email,
    secretType: activityType,
    secretIcon: icon,
    severity,
    alertStatus,
    detectedAt,
    detectedTime,
    preview: extName || extId || tabUrl,
    alertTitle: `${activityType}${extName ? ` — ${extName}` : ""} — ${alertStatus}`,
    alertDesc: [
      `Activity type: ${activityType}`,
      extName  ? `Extension: ${extName}` : "",
      extId    ? `Extension ID: ${extId}` : "",
      `Response: ${alertStatus.toLowerCase()} by SecureLint`,
      `Severity: ${severity}`,
    ].filter(Boolean).join("\n"),
    details: [
      { icon: "👤",  label: "Employee",      value: name },
      { icon: "📧",  label: "Email",         value: email },
      { icon: "🧩",  label: "Activity Type", value: activityType },
      { icon: "📦",  label: "Extension",     value: extName },
      { icon: "#️⃣", label: "Extension ID",  value: extId },
      { icon: "⚠️",  label: "Severity",      value: severity },
      { icon: "✅",  label: "Action",        value: alertStatus },
      { icon: "🌐",  label: "Page URL",      value: tabUrl },
      { icon: "📋",  label: "Page Title",    value: tabTitle },
      { icon: "🖥️",  label: "Browser ID",   value: browserId },
      { icon: "📦",  label: "Extension Ver", value: extVer },
      { icon: "#️⃣", label: "Incident ID",   value: `EXT-${incId}` },
    ].filter(d => d.value && d.value !== "undefined"),
    maskedContent: extName || extId || "(no extension data)",
    browserInfo: mapBrowserInfo(inc.browser_info),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Compute stats from incident array
// ─────────────────────────────────────────────────────────────────────────────
import type { ReportStats } from "@/components/dashboard/IncidentReportLayout";
export function computeStats(incidents: Incident[]): Partial<ReportStats> {
  return {
    total:    incidents.length,
    blocked:  incidents.filter(i => i.alertStatus === "Blocked").length,
    flagged:  incidents.filter(i => i.alertStatus === "Flagged").length,
    critical: incidents.filter(i => i.severity === "Critical").length,
  };
}
