/**
 * Search index for the dashboard's command bar.
 *
 * Everything listed here resolves to a destination that actually exists —
 * controls and settings sections carry a query param the target page reads, so
 * selecting a result opens the specific thing rather than dropping the user on
 * a page to hunt for it.
 *
 * `keywords` exist so people can search the vocabulary they actually use
 * ("api key", "leak", "2fa") rather than having to guess our labels.
 */

export type SearchGroup = "Pages" | "Controls" | "Settings" | "Reports";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  group: SearchGroup;
  keywords: string[];
}

export const SEARCH_INDEX: SearchEntry[] = [
  // ── Pages ────────────────────────────────────────────────────────────────
  {
    id: "page-overview", group: "Pages",
    title: "Security Overview", description: "Detections, weekly activity and fleet posture",
    href: "/dashboard",
    keywords: ["dashboard", "home", "overview", "summary", "charts", "trend"],
  },
  {
    id: "page-live-threats", group: "Pages",
    title: "Live Threats", description: "Real-time threat feed across the fleet",
    href: "/dashboard/live-threats",
    keywords: ["threat", "attack", "realtime", "live", "feed", "alerts", "incidents"],
  },
  {
    id: "page-secret-scanner", group: "Pages",
    title: "Secret Scanner", description: "Exposed API keys, tokens and credentials",
    href: "/dashboard/secret-scanner",
    keywords: ["secret", "api key", "apikey", "token", "credential", "password", "leak", "aws", "stripe", "jwt", "github"],
  },
  {
    id: "page-phishing", group: "Pages",
    title: "Phishing Monitoring", description: "Phishing email and page detection",
    href: "/dashboard/ai-monitoring",
    keywords: ["phishing", "phish", "email", "mail", "spoof", "impersonation", "scam", "ai"],
  },
  {
    id: "page-browser-protection", group: "Pages",
    title: "Browser Protection", description: "Extension monitoring and safe browsing",
    href: "/dashboard/browser-protection",
    keywords: ["browser", "chrome", "firefox", "edge", "extension", "safe browsing"],
  },
  {
    id: "page-team", group: "Pages",
    title: "Team Activity", description: "Per-member exposure and compliance scores",
    href: "/dashboard/team-activity",
    keywords: ["team", "members", "people", "users", "employees", "staff", "score"],
  },
  {
    id: "page-compliance", group: "Pages",
    title: "Compliance", description: "SOC 2, ISO 27034, GDPR and PCI DSS posture",
    href: "/dashboard/compliance",
    keywords: ["compliance", "soc2", "soc 2", "iso", "gdpr", "pci", "audit", "framework"],
  },
  {
    id: "page-integrations", group: "Pages",
    title: "Integrations", description: "GitHub, GitLab, AWS, Jira and Slack connections",
    href: "/dashboard/integrations",
    keywords: ["integration", "connect", "github", "gitlab", "aws", "jira", "slack", "webhook"],
  },
  {
    id: "page-devsecops", group: "Pages",
    title: "DevSecOps", description: "Pipeline and repository security posture",
    href: "/dashboard/devsecops",
    keywords: ["devsecops", "pipeline", "ci", "cd", "repository", "repo", "build"],
  },
  {
    id: "page-profile", group: "Pages",
    title: "My Profile", description: "Account, organisation and plan details",
    href: "/dashboard/profile",
    keywords: ["profile", "account", "me", "org", "organisation", "plan", "subscription", "billing"],
  },

  // ── Reports ──────────────────────────────────────────────────────────────
  {
    id: "report-index", group: "Reports",
    title: "Incident Reports", description: "All detected incidents and policy violations",
    href: "/dashboard/incident-reports",
    keywords: ["report", "incident", "violation", "history", "log"],
  },
  {
    id: "report-secrets", group: "Reports",
    title: "Secrets Report", description: "Exposed credentials across repos and cloud",
    href: "/dashboard/incident-reports/secrets",
    keywords: ["secret", "credential", "api key", "token", "report", "exposure"],
  },
  {
    id: "report-phishing", group: "Reports",
    title: "Phishing Mail Report", description: "Intercepted phishing email incidents",
    href: "/dashboard/incident-reports/phishing",
    keywords: ["phishing", "mail", "email", "report", "sender", "domain"],
  },
  {
    id: "report-email-dlp", group: "Reports",
    title: "Email DLP Report", description: "Outbound data-loss prevention violations",
    href: "/dashboard/incident-reports/email-dlp",
    keywords: ["dlp", "data loss", "email", "outbound", "exfiltration", "report"],
  },
  {
    id: "report-extensions", group: "Reports",
    title: "Extensions Report", description: "Malicious and sideloaded browser extensions",
    href: "/dashboard/incident-reports/extensions",
    keywords: ["extension", "addon", "add-on", "malicious", "sideload", "report"],
  },

  // ── Controls (deep-linked via ?control=) ─────────────────────────────────
  {
    id: "ctrl-phishing_site", group: "Controls",
    title: "Phishing Site Detection", description: "Detect and block phishing websites in real time",
    href: "/dashboard/controls?control=phishing_site",
    keywords: ["phishing", "site", "website", "block", "url"],
  },
  {
    id: "ctrl-phishing_mail", group: "Controls",
    title: "Phishing Mail Detection", description: "AI phishing email detection in Gmail and Outlook",
    href: "/dashboard/controls?control=phishing_mail",
    keywords: ["phishing", "mail", "email", "gmail", "outlook"],
  },
  {
    id: "ctrl-waf_domain", group: "Controls",
    title: "Domain & URL Blocking", description: "Block specific domains, URLs or social-engineering sites",
    href: "/dashboard/controls?control=waf_domain",
    keywords: ["domain", "url", "block", "waf", "allowlist", "blocklist"],
  },
  {
    id: "ctrl-session_theft", group: "Controls",
    title: "Session Theft Detection", description: "Detect stolen sessions via User Agent markers",
    href: "/dashboard/controls?control=session_theft",
    keywords: ["session", "theft", "hijack", "cookie", "token"],
  },
  {
    id: "ctrl-malicious_extension", group: "Controls",
    title: "Malicious Extension Blocking", description: "Block or warn on blacklisted browser extensions",
    href: "/dashboard/controls?control=malicious_extension",
    keywords: ["extension", "addon", "malicious", "block", "blacklist"],
  },
  {
    id: "ctrl-email_dlp", group: "Controls",
    title: "Cross-Domain Mail Control", description: "Monitor outbound email to external domains",
    href: "/dashboard/controls?control=email_dlp",
    keywords: ["dlp", "email", "outbound", "external", "domain"],
  },
  {
    id: "ctrl-secret_masking", group: "Controls",
    title: "Secret Masking", description: "Detect and mask secrets as they are typed",
    href: "/dashboard/controls?control=secret_masking",
    keywords: ["secret", "mask", "api key", "redact", "hide"],
  },
  {
    id: "ctrl-enterprise_data", group: "Controls",
    title: "Enterprise Data Collection", description: "What telemetry the extension reports centrally",
    href: "/dashboard/controls?control=enterprise_data",
    keywords: ["telemetry", "data", "collection", "privacy", "enterprise"],
  },
  {
    id: "ctrl-blur_secrets", group: "Controls",
    title: "Blur Secrets in Meeting Mode", description: "Hide secrets during screen shares and calls",
    href: "/dashboard/controls?control=blur_secrets",
    keywords: ["blur", "meeting", "screen share", "zoom", "call", "privacy"],
  },

  // ── Settings sections (deep-linked via ?section=) ────────────────────────
  {
    id: "set-detection", group: "Settings",
    title: "Detection settings", description: "What the extension scans for",
    href: "/dashboard/settings?section=detection",
    keywords: ["detection", "scan", "detect", "rules"],
  },
  {
    id: "set-masking", group: "Settings",
    title: "Masking settings", description: "How detected secrets are masked",
    href: "/dashboard/settings?section=masking",
    keywords: ["mask", "masking", "redact", "hide", "obfuscate"],
  },
  {
    id: "set-overlay", group: "Settings",
    title: "Overlay settings", description: "SecureLint indicators on inputs and editors",
    href: "/dashboard/settings?section=overlay",
    keywords: ["overlay", "indicator", "input", "editor", "textarea", "icon"],
  },
  {
    id: "set-network", group: "Settings",
    title: "Network Protection", description: "Block requests and form submissions carrying secrets",
    href: "/dashboard/settings?section=network",
    keywords: ["network", "xhr", "fetch", "request", "form", "block"],
  },
  {
    id: "set-severity", group: "Settings",
    title: "Severity Levels", description: "How incidents are graded critical to low",
    href: "/dashboard/settings?section=severity",
    keywords: ["severity", "critical", "high", "medium", "low", "grade", "priority"],
  },
  {
    id: "set-notifications", group: "Settings",
    title: "Notifications", description: "Browser and email alerting preferences",
    href: "/dashboard/settings?section=notifications",
    keywords: ["notification", "alert", "notify", "email", "toast"],
  },
  {
    id: "set-enterprise", group: "Settings",
    title: "Enterprise Policy", description: "Org-wide policy and group assignment",
    href: "/dashboard/settings?section=enterprise",
    keywords: ["enterprise", "policy", "group", "org", "sso", "2fa", "mfa"],
  },
  {
    id: "set-groups", group: "Settings",
    title: "Groups", description: "Create and manage policy groups",
    href: "/dashboard/settings?tab=groups",
    keywords: ["group", "team", "policy", "assign", "members"],
  },
];

/** Result carries its score so the caller can keep the ranking stable. */
export interface SearchResult extends SearchEntry {
  score: number;
}

/**
 * Ranks entries against a query. Scoring favours, in order: a title that starts
 * with the query, a title that contains it, an exact keyword hit, then a
 * description hit — so typing "sec" surfaces "Secret Scanner" above an entry
 * that merely mentions secrets in prose.
 */
export function searchDashboard(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const entry of SEARCH_INDEX) {
    const title = entry.title.toLowerCase();
    const desc = entry.description.toLowerCase();

    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (title.includes(q)) score = 60;
    else if (entry.keywords.some((k) => k === q)) score = 55;
    else if (entry.keywords.some((k) => k.startsWith(q))) score = 40;
    else if (entry.keywords.some((k) => k.includes(q))) score = 30;
    else if (desc.includes(q)) score = 20;

    if (score > 0) results.push({ ...entry, score });
  }

  // Stable ordering: score first, then index order, so equal scores don't
  // shuffle between renders.
  return results
    .sort((a, b) =>
      b.score - a.score ||
      SEARCH_INDEX.indexOf(a as SearchEntry) - SEARCH_INDEX.indexOf(b as SearchEntry))
    .slice(0, limit);
}
