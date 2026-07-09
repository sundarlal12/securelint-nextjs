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
    /* extension-specific actions kept as-is via Detected label */
    case "sync":     return "Synced" as Incident["alertStatus"];
    case "install":  return "Installed" as Incident["alertStatus"];
    case "uninstall":return "Uninstalled" as Incident["alertStatus"];
    case "info":     return "Info" as Incident["alertStatus"];
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

  /* ── Phishing mail / Gmail_Phish specific fields ── */
  const incidentTypeRaw = String(extra.incidentType ?? "");
  const isPhishingMail  = rawType === "phishing_mail" || rawType === "phishing_mail_v2" ||
                          incidentTypeRaw === "Gmail_Phish" || incidentTypeRaw.includes("Phish") ||
                          rawType === "Gmail_Phish";
  const isPhishingSite  = !isPhishingMail && (
                          rawType === "phishing" || rawType === "phishing_site" ||
                          (inc.type as string | undefined) === "phishing_site");

  /* ── Phishing site — raw enhanced detection data ── */
  const rawEnhanced     = (extra.rawEnhanced as Record<string, unknown>) ?? {};
  const phishSiteUrl    = String(rawEnhanced.url ?? extra.tabUrl ?? (rawTabUrl.startsWith("chrome") ? "" : rawTabUrl) ?? "");
  const phishSiteScore  = extra.score ?? extra.site_score ?? rawEnhanced.score;
  const phishSiteRisk   = extra.riskScore ?? "";
  const phishSiteVerdict= String(extra.verdict ?? extra.status ?? "");
  const phishSiteStatus = String(extra.site_status ?? extra.status ?? "");
  const sslObj          = (extra.ssl as Record<string,unknown>) ?? {};
  const whoisObj        = (extra.whois as Record<string,unknown>) ?? {};
  const googleObj       = (rawEnhanced.google  as Record<string,unknown>) ?? {};
  const tankphishObj    = (rawEnhanced.tankphish as Record<string,unknown>) ?? {};
  const slObj           = (rawEnhanced.securelint as Record<string,unknown>) ?? {};
  const transRptObj     = (extra.transparencyReport as Record<string,unknown>) ?? {};
  const blocklistObj    = (extra.blocklist as Record<string,unknown>) ?? {};

  const phishAuth      = (extra.auth   as Record<string, unknown>) ?? {};
  const phishFlags     = (extra.flags  as Record<string, unknown>) ?? {};
  const phishHeaders   = (extra.headers as Record<string, unknown>) ?? {};
  const phishSecurity  = (extra.security as Record<string, unknown>) ?? {};
  const phishSignals: { sev: string; text: string; layer: string }[] =
    Array.isArray(extra.signals) ? (extra.signals as { sev: string; text: string; layer: string }[]) : [];
  const bodyUrls: string[] = Array.isArray(extra.bodyUrls) ? (extra.bodyUrls as string[]) : [];

  const phishScore     = String(phishSecurity.riskScore ?? extra.site_score ?? riskScore ?? "");
  const phishVerdict   = String(phishSecurity.verdictLabel ?? extra.verdict ?? siteStatus ?? "");
  const phishSubject   = String(phishHeaders.subject ?? "");
  const phishFrom      = String(phishHeaders.from ?? "");
  const phishFromDisp  = String(phishHeaders.fromDisplay ?? "");
  const phishSendingIp = String(phishHeaders.sendingIp ?? "");
  const phishDomain    = String(phishHeaders.fromDomain ?? domain);

  // Derive a clean human-readable attack type
  const attackType =
    isPhishingMail                                           ? "Phishing Mail Detected" :
    rawType === "phishing" || rawType === "phishing_site"    ? "Phishing Page Blocked" :
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
    preview: isPhishingMail ? (phishSubject || domain) : isPhishingSite ? (phishSiteUrl || domain) : domain,
    alertTitle: `${attackType} — ${isPhishingMail ? (phishSubject || domain) : isPhishingSite ? (phishSiteUrl || domain) : domain}`,
    alertDesc: [
      `Incident type: ${attackType}`,
      `Domain: ${isPhishingMail ? phishDomain : domain}${phishScore ? ` · risk score ${phishScore}` : ""}`,
      isPhishingMail ? `From: ${phishFrom}${phishFromDisp ? ` (${phishFromDisp})` : ""}` : (wafReason ? `WAF rule triggered: ${wafReason.replace(/_/g, " ")}` : `Site verdict: ${siteStatus}`),
      `Response: ${alertStatus} by SecureLint`,
      `Severity classification: ${severity}`,
    ].join("\n"),
    details: [
      { icon: "", label: "Employee",         value: name },
      { icon: "", label: "Email",            value: email },
      { icon: "", label: "Incident Type",    value: attackType },
      { icon: "", label: "Domain",           value: isPhishingMail ? phishDomain : domain },
      { icon: "", label: "Full URL",         value: tabUrl },
      { icon: "", label: "Page Title",       value: tabTitle },
      { icon: "", label: "Site Status",      value: siteStatus },
      { icon: "", label: "Risk Score",       value: phishScore || riskScore },
      wafReason ? { icon: "", label: "WAF Rule",  value: wafReason.replace(/_/g, " ") } : null,
      blockType  ? { icon: "", label: "Block Type", value: blockType } : null,
      { icon: "", label: "Severity",         value: severity },
      { icon: "", label: "Action",           value: alertStatus },
      { icon: "", label: "Browser ID",       value: browserId },
      { icon: "", label: "Extension Ver",    value: extVer },
      { icon: "", label: "Incident ID",      value: `PHI-${incId}` },
      /* phishing-mail rich fields */
      ...(isPhishingMail ? [
        { icon: "", label: "_phish_subject",    value: phishSubject },
        { icon: "", label: "_phish_from",       value: phishFrom },
        { icon: "", label: "_phish_fromDisp",   value: phishFromDisp },
        { icon: "", label: "_phish_sendingIp",  value: phishSendingIp },
        { icon: "", label: "_phish_fromDomain", value: phishDomain },
        { icon: "", label: "_phish_score",      value: phishScore },
        { icon: "", label: "_phish_verdict",    value: phishVerdict },
        { icon: "", label: "_phish_incType",    value: incidentTypeRaw },
        { icon: "", label: "_phish_auth",       value: JSON.stringify(phishAuth) },
        { icon: "", label: "_phish_flags",      value: JSON.stringify(phishFlags) },
        { icon: "", label: "_phish_signals",    value: JSON.stringify(phishSignals) },
        { icon: "", label: "_phish_bodyUrls",   value: JSON.stringify(bodyUrls) },
        { icon: "", label: "_isPhishMail",      value: "true" },
      ] : []),
      /* phishing-site rich fields */
      ...(isPhishingSite ? [
        { icon: "", label: "_psite_url",          value: phishSiteUrl },
        { icon: "", label: "_psite_score",        value: phishSiteScore != null ? String(phishSiteScore) : "" },
        { icon: "", label: "_psite_riskScore",    value: phishSiteRisk  != null ? String(phishSiteRisk)  : "" },
        { icon: "", label: "_psite_verdict",      value: phishSiteVerdict },
        { icon: "", label: "_psite_status",       value: phishSiteStatus },
        { icon: "", label: "_psite_ssl",          value: JSON.stringify(sslObj) },
        { icon: "", label: "_psite_whois",        value: JSON.stringify(whoisObj) },
        { icon: "", label: "_psite_google",       value: JSON.stringify(googleObj) },
        { icon: "", label: "_psite_tankphish",    value: JSON.stringify(tankphishObj) },
        { icon: "", label: "_psite_securelint",   value: JSON.stringify(slObj) },
        { icon: "", label: "_psite_transparency", value: JSON.stringify(transRptObj) },
        { icon: "", label: "_psite_blocklist",    value: JSON.stringify(blocklistObj) },
        { icon: "", label: "_isPhishSite",        value: "true" },
      ] : []),
    ].filter((d): d is { icon: string; label: string; value: string } =>
      d !== null && Boolean(d.value) && d.value !== "undefined" && d.value !== "[]"
    ),
    maskedContent: isPhishingMail ? (phishFrom || tabUrl) : (tabUrl || domain),
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
  extension_install:          "Extension Installed",
  extension_uninstall:        "Extension Uninstalled",
  extension_sync:             "Extension Synced",
  extension_malicious:        "Malicious Extension",
  extension_blacklist:        "Blacklisted Extension",
  blacklist_extensions_visit: "Blacklisted Extension Visit",
  extension_all:              "Extension Activity",
  extension_type:             "Extension Activity",
};

/**
 * Real API stores rich extension data in `inc.extra` as a JSONB object.
 * `inc.extensions` is typically null; primary data lives in `extra`.
 */
function parseExtra(extra: unknown): Record<string, unknown> {
  if (!extra || typeof extra !== "object") return {};
  return extra as Record<string, unknown>;
}

export function mapExtensionIncident(
  inc: Record<string, unknown>,
  icon: React.ReactNode,
): Incident {
  const email = String(inc.user_email ?? "");
  const { name, initials } = nameFromEmail(email);
  const { detectedAt, detectedTime } = parseTimestamp(String(inc.timestamp ?? inc.created_at ?? ""));
  const rawType      = String(inc.type ?? inc.secret_type ?? "extension_type");
  const activityType = EXT_TYPE_LABELS[rawType] ?? "Extension Activity";
  const alertStatus  = mapAction(String(inc.action ?? "sync"));
  const severity     = mapSeverity(String(inc.severity ?? "medium"));
  const browserId    = String(inc.browser_id ?? "");
  const extVer       = String(inc.extension_version ?? "");
  const tabUrl       = resolveUrl(String(inc.tab_url ?? ""));
  const tabTitle     = String(inc.tab_title ?? "");
  const incId        = String(inc.id ?? "");

  /* ── Parse `extra` which is the primary rich payload ── */
  const extra        = parseExtra(inc.extra);
  const extName      = String(extra.extensionName ?? "");
  const extId        = String(extra.extensionId   ?? "");
  const extVersion   = String(extra.extensionVersion ?? extVer);
  const trigger      = String(extra.trigger ?? rawType);
  const totalExts    = Number(extra.totalExtensions   ?? 0);
  const maliciousCnt = Number(extra.maliciousCount    ?? 0);
  const suspiciousCnt= Number(extra.suspiciousCount   ?? 0);
  const sideloadedCnt= Number(extra.sideloadedCount   ?? 0);

  /* ── blacklist_extensions_visit specific fields ── */
  const isBlacklistVisit = rawType === "blacklist_extensions_visit";
  const cwsUrl           = String(extra.cwsUrl       ?? "");
  const riskScore        = extra.riskScore != null ? Number(extra.riskScore) : -1;
  const policyStatus     = String(extra.policyStatus ?? "");
  const detectionSource  = String(extra.detectionSource ?? "");
  const complianceRefs   = Array.isArray(extra.complianceRefs) ? (extra.complianceRefs as string[]) : [];
  const extPerms         = Array.isArray(extra.extensionPermissions) ? (extra.extensionPermissions as string[]) : [];
  const extInstallType   = String(extra.extensionInstallType ?? extra.installType ?? "");
  const extEnabled       = extra.extensionEnabled;

  /* ── serialise extensionsList for the drawer to consume ── */
  const extensionsList = Array.isArray(extra.extensionsList) ? extra.extensionsList : [];
  const maliciousList  = Array.isArray(extra.maliciousList)  ? extra.maliciousList  : [];
  const suspiciousList = Array.isArray(extra.suspiciousList) ? extra.suspiciousList : [];

  /* friendly display name from masked_preview if extra fields are empty */
  const maskedPreview = String(inc.masked_preview ?? "");
  const displayName   = extName || maskedPreview.split(" (")[0] || "(unknown)";

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
    preview: displayName,
    alertTitle: `${activityType}${displayName ? ` — ${displayName}` : ""} — ${alertStatus}`,
    alertDesc: [
      `Activity type: ${activityType}`,
      displayName ? `Extension: ${displayName}` : "",
      extId       ? `Extension ID: ${extId}` : "",
      totalExts   ? `Total extensions scanned: ${totalExts}` : "",
      maliciousCnt  ? `Malicious: ${maliciousCnt}` : "",
      suspiciousCnt ? `Suspicious: ${suspiciousCnt}` : "",
      `Response: ${alertStatus.toLowerCase()} by SecureLint`,
      `Severity: ${severity}`,
    ].filter(Boolean).join("\n"),
    details: [
      { icon: "👤",  label: "Employee",       value: name },
      { icon: "📧",  label: "Email",          value: email },
      { icon: "🧩",  label: "Activity Type",  value: activityType },
      { icon: "📦",  label: "Extension",      value: displayName },
      { icon: "#️⃣", label: "Extension ID",   value: extId },
      { icon: "🔢",  label: "Ext Version",    value: extVersion },
      { icon: "⚠️",  label: "Severity",       value: severity },
      { icon: "✅",  label: "Action",         value: alertStatus },
      { icon: "🌐",  label: "Page URL",       value: tabUrl },
      { icon: "📋",  label: "Page Title",     value: tabTitle },
      { icon: "🖥️",  label: "Browser ID",    value: browserId },
      { icon: "📦",  label: "Extension Ver",  value: extVer },
      { icon: "#️⃣", label: "Incident ID",    value: `EXT-${incId}` },
      /* serialised rich data consumed by the drawer */
      { icon: "🔍",  label: "_extTrigger",     value: trigger },
      { icon: "🔍",  label: "_extName",        value: displayName },
      { icon: "🔍",  label: "_extId",          value: extId },
      { icon: "🔍",  label: "_extVersion",     value: extVersion },
      { icon: "🔍",  label: "_extInstallType", value: extInstallType },
      { icon: "🔍",  label: "_extEnabled",     value: extEnabled === true ? "true" : extEnabled === false ? "false" : "" },
      { icon: "🔍",  label: "_totalExts",      value: String(totalExts) },
      { icon: "🔍",  label: "_maliciousCnt",   value: String(maliciousCnt) },
      { icon: "🔍",  label: "_suspiciousCnt",  value: String(suspiciousCnt) },
      { icon: "🔍",  label: "_sideloadedCnt",  value: String(sideloadedCnt) },
      { icon: "🔍",  label: "_extensionsList", value: JSON.stringify(extensionsList) },
      { icon: "🔍",  label: "_maliciousList",  value: JSON.stringify(maliciousList) },
      { icon: "🔍",  label: "_suspiciousList", value: JSON.stringify(suspiciousList) },
      /* blacklist_extensions_visit specific */
      ...(isBlacklistVisit ? [
        { icon: "🔗",  label: "_cwsUrl",          value: cwsUrl },
        { icon: "📊",  label: "_riskScore",        value: riskScore >= 0 ? String(riskScore) : "" },
        { icon: "📋",  label: "_policyStatus",     value: policyStatus },
        { icon: "🔎",  label: "_detectionSource",  value: detectionSource },
        { icon: "🔑",  label: "_extPerms",         value: JSON.stringify(extPerms) },
        { icon: "📜",  label: "_complianceRefs",   value: JSON.stringify(complianceRefs) },
      ] : []),
    ].filter(d => d.value && d.value !== "undefined" && d.value !== "0" && d.value !== "[]" && d.value !== "-1"),
    maskedContent: displayName || "(no extension data)",
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
