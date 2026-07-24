"use client";
import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import { LazyCard } from "@/components/dashboard/CardLoader";
import {
  fetchSettings, updateSettings,
  fetchGroups, fetchTeam,
  createGroup, renameGroup, deleteGroup,
  addGroupMembers, removeGroupMember,
} from "@/lib/adminApi";

const cs: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 14 };

// ── Exact DB column names → UI toggle keys (1-to-1, no invented names) ──────
const DB_BOOL_COLS: Record<string, string> = {
  show_risk_score:           "showRiskScore",
  show_recent_activity:      "showRecentActivity",
  animated_charts:           "animatedCharts",
  auto_refresh:              "autoRefresh",
  enable_detection:          "enableDetection",
  auto_mask_critical:        "autoMaskCritical",
  show_notifications:        "showNotifications",
  mask_console:              "maskConsole",
  scan_large_docs:           "scanLargeDocs",
  realtime_updates:          "realtimeUpdates",
  auto_mask_editor:          "autoMaskEditor",
  site_exclusions_status:    "siteExclusionsStatus",
  global_masking_status:     "globalMaskingStatus",
  enterprise_data_collection:"enterpriseDataCollection",
  email_dlp_enabled:         "emailDlpEnabled",
  preserve_context:          "preserveContext",
  auto_mask_textareas:       "autoMaskTextareas",
  auto_mask_inputs:          "autoMaskInputs",
  overlay_input:             "overlayInput",
  overlay_textarea:          "overlayTextarea",
  overlay_editor:            "overlayEditor",
  block_network_secrets:     "blockNetworkSecrets",
  block_form_submission:     "blockFormSubmission",
  aggressive_email_blocking: "aggressiveEmailBlocking",
  detect_critical:           "detectCritical",
  detect_high:               "detectHigh",
  detect_medium:             "detectMedium",
  detect_low:                "detectLow",
  notify_critical:           "notifyCritical",
  notify_high:               "notifyHigh",
};

const defaultToggles: Record<string, boolean> = {
  showRiskScore: true, showRecentActivity: true, animatedCharts: true, autoRefresh: true,
  enableDetection: true, autoMaskCritical: true, showNotifications: true,
  maskConsole: false, scanLargeDocs: false, realtimeUpdates: true,
  autoMaskEditor: true, siteExclusionsStatus: false, globalMaskingStatus: true,
  enterpriseDataCollection: true, emailDlpEnabled: true,
  preserveContext: true, autoMaskTextareas: true, autoMaskInputs: false,
  overlayInput: true, overlayTextarea: true, overlayEditor: true,
  blockNetworkSecrets: true, blockFormSubmission: true, aggressiveEmailBlocking: true,
  detectCritical: true, detectHigh: true, detectMedium: true, detectLow: false,
  notifyCritical: true, notifyHigh: true,
};

type Section = "dashboard" | "detection" | "masking" | "overlay" | "network" | "severity" | "notifications" | "enterprise";

const sections: { id: Section; label: string; d: string }[] = [
  { id: "dashboard",     label: "Dashboard",          d: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { id: "detection",     label: "Detection",           d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "masking",       label: "Masking",             d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18" },
  { id: "overlay",       label: "Overlay",             d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "network",       label: "Network Protection",  d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { id: "severity",      label: "Severity Levels",     d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" },
  { id: "notifications", label: "Notifications",       d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { id: "enterprise",    label: "Enterprise Policy",   d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{ position: "relative", width: 40, height: 22, borderRadius: 11, background: on ? "#0a0a0a" : "#e4e4e7", border: "none", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(16,17,20,0.32)" }} />
    </button>
  );
}

function Row({ title, desc, uiKey, t, toggle, tag }: { title: string; desc: string; uiKey: string; t: Record<string, boolean>; toggle: (k: string) => void; tag?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #e9e9ec" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{title}</span>
          {tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#bbf7d0", color: "#16a34a", border: "1px solid #16a34a33" }}>{tag}</span>}
        </div>
        <div style={{ fontSize: 11, color: "#52525b", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Toggle on={!!t[uiKey]} onChange={() => toggle(uiKey)} />
    </div>
  );
}

function Hdr({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a" }}>{title}</div>
      <div style={{ fontSize: 12, color: "#52525b", marginTop: 4 }}>{desc}</div>
      <div style={{ height: 1, background: "#e9e9ec", marginTop: 12 }} />
    </div>
  );
}

// ── Tag-input chip editor ────────────────────────────────────────────────────
function TagInput({
  label, hint, values, onChange, placeholder,
}: {
  label: string; hint: string;
  values: string[]; onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const v = draft.trim().toLowerCase();
    if (!v || values.includes(v)) { setDraft(""); return; }
    onChange([...values, v]);
    setDraft("");
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && draft === "" && values.length) remove(values.length - 1);
  };

  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #e9e9ec" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#52525b", marginBottom: 10 }}>{hint}</div>
      {/* chip box */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
          minHeight: 42, padding: "6px 10px", borderRadius: 8,
          border: "1px solid #dcdce0", background: "#f4f4f5", cursor: "text",
        }}
      >
        {values.map((v, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            background: "#bbf7d0", border: "1px solid #16a34a33", color: "#16a34a",
            fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          }}>
            {v}
            <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#16a34a", padding: 0, lineHeight: 1, fontSize: 13, fontWeight: 700 }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={values.length === 0 ? (placeholder ?? "Type and press Enter or comma…") : ""}
          style={{
            flex: 1, minWidth: 140, border: "none", outline: "none",
            background: "transparent", color: "#0a0a0a", fontSize: 12,
            padding: "2px 4px",
          }}
        />
      </div>
      <div style={{ fontSize: 10, color: "#8e8e93", marginTop: 5 }}>Press <kbd style={{ background: "#e9e9ec", border: "1px solid #dcdce0", borderRadius: 4, padding: "1px 5px", color: "#52525b", fontFamily: "monospace" }}>Enter</kbd> or <kbd style={{ background: "#e9e9ec", border: "1px solid #dcdce0", borderRadius: 4, padding: "1px 5px", color: "#52525b", fontFamily: "monospace" }}>,</kbd> to add · <kbd style={{ background: "#e9e9ec", border: "1px solid #dcdce0", borderRadius: 4, padding: "1px 5px", color: "#52525b", fontFamily: "monospace" }}>⌫</kbd> to remove last</div>
    </div>
  );
}

/* ── Types for Groups tab ────────────────────────────────────────────────── */
type GroupDef = {
  id: string; group_name: string; org_id?: string;
  member_count?: number;
  members?: { user_id: string; email: string; role: string }[];
};
type TeamMember = { user_id: string; email: string | null; role?: string };

/* ── Groups management tab ───────────────────────────────────────────────── */
function GroupsTab() {
  const [groups,      setGroups]      = useState<GroupDef[]>([]);
  const [team,        setTeam]        = useState<TeamMember[]>([]);
  const [selGroup,    setSelGroup]    = useState<GroupDef | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [newName,     setNewName]     = useState("");
  const [creating,    setCreating]    = useState(false);
  const [renaming,    setRenaming]    = useState<string | null>(null);
  const [renameVal,   setRenameVal]   = useState("");
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [addSearch,   setAddSearch]   = useState("");
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [adding,      setAdding]      = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [gd, td] = await Promise.all([
      fetchGroups() as Promise<{ groups?: GroupDef[] } | null>,
      fetchTeam()   as Promise<{ team?: TeamMember[] } | null>,
    ]);
    if (gd?.groups) setGroups(gd.groups);
    if (td?.team)   setTeam(td.team);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* refresh selected group after mutations */
  const refreshSelected = (updatedGroups: GroupDef[]) => {
    if (selGroup) {
      const found = updatedGroups.find(g => g.id === selGroup.id);
      setSelGroup(found ?? null);
    }
  };

  /* Create group */
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    const res = await createGroup(name) as { group?: GroupDef } | null;
    if (res?.group) {
      const next = [...groups, { ...res.group, member_count: 0, members: [] }];
      setGroups(next);
      setNewName("");
      showToast(`Group "${name}" created`);
    } else {
      showToast("Failed to create group — please try again", false);
    }
    setCreating(false);
  };

  /* Rename group */
  const handleRename = async (id: string) => {
    const name = renameVal.trim();
    if (!name) { setRenaming(null); return; }
    const res = await renameGroup(id, name) as { group_name?: string } | null;
    if (res) {
      const next = groups.map(g => g.id === id ? { ...g, group_name: name } : g);
      setGroups(next);
      refreshSelected(next);
      showToast("Group renamed");
    } else {
      showToast("Failed to rename group", false);
    }
    setRenaming(null);
  };

  /* Delete group */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this group? Members won't be deleted from the org.")) return;
    setDeleting(id);
    const res = await deleteGroup(id) as { error?: number } | null;
    if (res !== null) {
      const next = groups.filter(g => g.id !== id);
      setGroups(next);
      if (selGroup?.id === id) setSelGroup(null);
      showToast("Group deleted");
    } else {
      showToast("Failed to delete group", false);
    }
    setDeleting(null);
  };

  /* Add member */
  const handleAddMember = async (userId: string) => {
    if (!selGroup) return;
    setAdding(userId);
    const res = await addGroupMembers(selGroup.id, [userId]) as { added?: string[]; error?: number; message?: string } | null;
    setAdding(null);
    if (res !== null && res.error === 0) {
      const member = team.find(m => m.user_id === userId);
      const label = member?.email || userId.slice(0, 8) + "…";
      const newMember = { user_id: userId, email: member?.email ?? "", role: member?.role ?? "member" };
      const next = groups.map(g =>
        g.id === selGroup.id
          ? { ...g, members: [...(g.members ?? []), newMember], member_count: (g.member_count ?? 0) + 1 }
          : g
      );
      setGroups(next);
      refreshSelected(next);
      setAddSearch("");
      showToast(`Added ${label}`);
    } else {
      const reason = res?.message ?? "Server error — check if the user belongs to this organisation";
      showToast(`Could not add member: ${reason}`, false);
    }
  };

  /* Remove member */
  const handleRemoveMember = async (userId: string) => {
    if (!selGroup) return;
    const res = await removeGroupMember(selGroup.id, userId) as { error?: number } | null;
    if (res !== null) {
      const next = groups.map(g =>
        g.id === selGroup.id
          ? { ...g, members: (g.members ?? []).filter(m => m.user_id !== userId), member_count: Math.max(0, (g.member_count ?? 1) - 1) }
          : g
      );
      setGroups(next);
      refreshSelected(next);
      showToast("Member removed");
    } else {
      showToast("Failed to remove member", false);
    }
  };

  /* Members not yet in selected group — search by email or user_id prefix */
  const groupMemberIds = new Set((selGroup?.members ?? []).map(m => m.user_id));
  const addableMembers = team.filter(m =>
    !groupMemberIds.has(m.user_id) &&
    (addSearch === "" ||
      (m.email ?? "").toLowerCase().includes(addSearch.toLowerCase()) ||
      m.user_id.startsWith(addSearch))
  );

  const cs2: React.CSSProperties = { background: "#ffffff", border: "1px solid #e9e9ec", borderRadius: 12 };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* Left: Groups list */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ ...cs2, overflow: "hidden" }}>
          {/* Create new group */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #e9e9ec" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>New Group</div>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                placeholder="Group name…"
                style={{ flex: 1, padding: "8px 10px", background: "#f4f4f5", border: "1px solid #dcdce0", borderRadius: 7, color: "#0a0a0a", fontSize: 12, outline: "none" }} />
              <button onClick={handleCreate} disabled={creating || !newName.trim()}
                style={{ padding: "8px 12px", background: "#0a0a0a", border: "none", borderRadius: 7, color: "#ffffff", fontSize: 12, fontWeight: 700, cursor: creating ? "wait" : "pointer", opacity: !newName.trim() ? 0.5 : 1 }}>
                {creating ? "…" : "+ Add"}
              </button>
            </div>
          </div>

          {/* Groups list */}
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {loading && <div style={{ padding: 16, fontSize: 12, color: "#52525b" }}>Loading…</div>}
            {!loading && groups.length === 0 && (
              <div style={{ padding: 16, fontSize: 12, color: "#52525b", textAlign: "center" }}>
                No groups yet. Create one above.
              </div>
            )}
            {groups.map(g => (
              <div key={g.id}
                onClick={() => setSelGroup(g)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderBottom: "1px solid #e9e9ec", cursor: "pointer", background: selGroup?.id === g.id ? "#f4f4f5" : "transparent", borderLeft: selGroup?.id === g.id ? "3px solid #16a34a" : "3px solid transparent", transition: ".15s" }}>

                {renaming === g.id ? (
                  <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleRename(g.id); if (e.key === "Escape") setRenaming(null); }}
                    onBlur={() => handleRename(g.id)}
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, padding: "3px 6px", background: "#ffffff", border: "1px solid #0a0a0a", borderRadius: 5, color: "#0a0a0a", fontSize: 12, outline: "none" }} />
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.group_name}</div>
                    <div style={{ fontSize: 10, color: "#52525b", marginTop: 1 }}>{g.member_count ?? 0} member{(g.member_count ?? 0) !== 1 ? "s" : ""}</div>
                  </div>
                )}

                {renaming !== g.id && (
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    {/* rename */}
                    <button title="Rename" onClick={() => { setRenaming(g.id); setRenameVal(g.group_name); }}
                      style={{ padding: "3px 6px", background: "none", border: "none", cursor: "pointer", color: "#52525b", borderRadius: 4, fontSize: 12 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#0a0a0a")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#52525b")}>✎</button>
                    {/* delete */}
                    <button title="Delete" onClick={() => handleDelete(g.id)} disabled={deleting === g.id}
                      style={{ padding: "3px 6px", background: "none", border: "none", cursor: "pointer", color: "#52525b", borderRadius: 4, fontSize: 12 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#52525b")}>🗑</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Group members panel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!selGroup ? (
          <div style={{ ...cs2, padding: "40px 20px", textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 12px" }}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#dcdce0" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#dcdce0" strokeWidth="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#dcdce0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontSize: 14, color: "#52525b" }}>Select a group to manage its members</div>
          </div>
        ) : (
          <div style={{ ...cs2, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e9e9ec", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a" }}>{selGroup.group_name}</div>
                <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{selGroup.member_count ?? 0} member{(selGroup.member_count ?? 0) !== 1 ? "s" : ""}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#bbf7d0", border: "1px solid #16a34a33", color: "#16a34a" }}>Enterprise Group</span>
            </div>

            {/* Add member search */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #e9e9ec" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Add Members</div>
              <input value={addSearch} onChange={e => setAddSearch(e.target.value)}
                placeholder="Search employees by email…"
                style={{ width: "100%", padding: "9px 12px", background: "#f4f4f5", border: "1px solid #dcdce0", borderRadius: 8, color: "#0a0a0a", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              {addSearch && addableMembers.length > 0 && (
                <div style={{ marginTop: 6, border: "1px solid #dcdce0", borderRadius: 8, overflow: "hidden", maxHeight: 180, overflowY: "auto" }}>
                  {addableMembers.slice(0, 10).map(m => (
                    <div key={m.user_id}
                      onClick={() => handleAddMember(m.user_id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid #e9e9ec", cursor: "pointer", transition: ".1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f4f4f5")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <div>
                        <div style={{ fontSize: 12, color: "#0a0a0a" }}>{m.email || <span style={{ color: "#52525b", fontStyle: "italic" }}>{m.user_id.slice(0, 12)}… (no email)</span>}</div>
                        <div style={{ fontSize: 10, color: "#52525b", marginTop: 1, textTransform: "capitalize" }}>{m.role ?? "member"}</div>
                      </div>
                      <button
                        disabled={adding === m.user_id}
                        style={{ padding: "4px 12px", background: "#bbf7d0", border: "1px solid #16a34a33", borderRadius: 6, color: "#16a34a", fontSize: 11, fontWeight: 700, cursor: adding === m.user_id ? "wait" : "pointer", opacity: adding === m.user_id ? 0.6 : 1 }}>
                        {adding === m.user_id ? "…" : "+ Add"}
                      </button>
                    </div>
                  ))}
                  {addableMembers.length > 10 && <div style={{ padding: "8px 12px", fontSize: 11, color: "#52525b" }}>+{addableMembers.length - 10} more — refine search</div>}
                </div>
              )}
              {addSearch && addableMembers.length === 0 && (
                <div style={{ marginTop: 6, padding: "8px 12px", fontSize: 12, color: "#52525b" }}>No matching employees not already in this group.</div>
              )}
            </div>

            {/* Members list */}
            <div style={{ maxHeight: 440, overflowY: "auto" }}>
              {(!selGroup.members || selGroup.members.length === 0) ? (
                <div style={{ padding: "20px", fontSize: 12, color: "#52525b", textAlign: "center" }}>
                  No members yet — search above to add employees.
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", padding: "8px 20px", background: "#f4f4f5", borderBottom: "1px solid #e9e9ec" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5 }}>Employee</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", minWidth: 60 }}>Role</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right", minWidth: 60 }}>Remove</span>
                  </div>
                  {selGroup.members.map(m => (
                    <div key={m.user_id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #e9e9ec", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        {/* Avatar initials */}
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#16a34a", flexShrink: 0 }}>
                          {(m.email ?? "?")[0].toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: "#0a0a0a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</div>
                          <div style={{ fontSize: 10, color: "#52525b", marginTop: 1 }}>{m.user_id.slice(0, 8)}…</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, textTransform: "capitalize", color: m.role === "admin" || m.role === "owner" ? "#16a34a" : "#52525b", background: "#f4f4f5", border: "1px solid #dcdce0", borderRadius: 20, padding: "2px 8px", textAlign: "center", whiteSpace: "nowrap" }}>
                        {m.role ?? "member"}
                      </span>
                      <button onClick={() => handleRemoveMember(m.user_id)} title="Remove from group"
                        style={{ padding: "4px 10px", background: "none", border: "1px solid #dcdce0", borderRadius: 6, cursor: "pointer", color: "#52525b", fontSize: 11, whiteSpace: "nowrap" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626"; (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#dcdce0"; (e.currentTarget as HTMLButtonElement).style.color = "#52525b"; }}>
                        Remove
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, maxWidth: 380,
          background: toast.ok ? "#bbf7d0" : "#f8f3f3",
          border: `1px solid ${toast.ok ? "#16a34a55" : "#dc262655"}`,
          borderRadius: 10, padding: "11px 18px",
          color: toast.ok ? "#86efac" : "#b91c1c",
          fontSize: 13, zIndex: 100, boxShadow: "0 8px 24px rgba(16,17,20,0.32)",
          lineHeight: 1.5,
        }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [mainTab, setMainTab]         = useState<"settings" | "groups">("settings");
  const [active, setActive]           = useState<Section>("dashboard");

  /**
   * Deep link: ?section=<id> selects a settings section and ?tab=groups opens
   * the Groups tab, so search results land on the right panel.
   *
   * Read from location rather than useSearchParams, which would require a
   * Suspense boundary and breaks the `output: "export"` build. Initial state
   * stays server-safe; this only adjusts it after mount.
   */
  /* eslint-disable react-hooks/set-state-in-effect --
     Reading the URL is the "synchronise from an external system" case: the
     query string is not React state and is only available after mount, since
     this page is prerendered by `output: "export"` where `window` is absent.
     Doing it in a lazy useState initialiser instead would diverge from the
     prerendered HTML and cause a hydration mismatch. Runs once. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "groups") setMainTab("groups");
    const section = params.get("section");
    if (section && sections.some(s => s.id === section)) setActive(section as Section);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const [t, setT]                     = useState(defaultToggles);
  const [maskStyle, setMaskStyle]     = useState("smart");
  const [saving, setSaving]           = useState(false);
  const [loaded, setLoaded]           = useState(false);

  // ── Array fields ────────────────────────────────────────────────────────────
  const [wafSocialDomains,     setWafSocialDomains]     = useState<string[]>([]);
  const [siteExclusions,       setSiteExclusions]       = useState<string[]>([]);
  const [enterpriseEmailDomains, setEnterpriseEmailDomains] = useState<string[]>([]);

  const toggle = (k: string) => setT(prev => ({ ...prev, [k]: !prev[k] }));

  useEffect(() => {
    fetchSettings().then((data) => {
      const raw = data as Record<string, unknown> | null;
      const s: Record<string, unknown> = (raw?.settings as Record<string, unknown>) ?? raw ?? {};
      const merged = { ...defaultToggles };
      for (const [dbCol, uiKey] of Object.entries(DB_BOOL_COLS)) {
        if (dbCol in s && typeof s[dbCol] === "boolean") merged[uiKey] = s[dbCol] as boolean;
      }
      if (typeof s.masking_style === "string") setMaskStyle(s.masking_style);

      const toStrArr = (v: unknown): string[] =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

      setWafSocialDomains(toStrArr(s.waf_social_domain));
      setSiteExclusions(toStrArr(s.site_exclusions));
      setEnterpriseEmailDomains(toStrArr(s.enterprise_email_domains));

      setT(merged);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const [dbCol, uiKey] of Object.entries(DB_BOOL_COLS)) {
        payload[dbCol] = t[uiKey] ?? false;
      }
      payload.masking_style           = maskStyle;
      payload.waf_social_domain       = wafSocialDomains;
      payload.site_exclusions         = siteExclusions;
      payload.enterprise_email_domains = enterpriseEmailDomains;
      await updateSettings(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1400 }}>
      {/* Page header */}
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 660, color: "#0a0a0a", letterSpacing: "-0.028em", margin: 0 }}>Settings</h2>
        <p style={{ fontSize: 14, color: "#52525b", marginTop: 6 }}>Manage your SecureLint preferences, security policies, and organisation groups.</p>
      </div>

      {/* ── Main tabs: Settings | Groups ───────────────────────────────────── */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e9e9ec", paddingBottom: 0 }}>
        {(["settings", "groups"] as const).map(tab => {
          const labels: Record<string, string> = { settings: "⚙ Settings", groups: "👥 Groups" };
          const active2 = mainTab === tab;
          return (
            <button key={tab} onClick={() => setMainTab(tab)}
              style={{ padding: "9px 22px", background: "none", border: "none", borderBottom: active2 ? "2px solid #0a0a0a" : "2px solid transparent", color: active2 ? "#0a0a0a" : "#52525b", fontSize: 13, fontWeight: active2 ? 700 : 400, cursor: "pointer", transition: ".15s", marginBottom: -1 }}>
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── Groups tab ─────────────────────────────────────────────────────── */}
      {mainTab === "groups" && <GroupsTab />}

      {/* ── Settings tab ───────────────────────────────────────────────────── */}
      {mainTab === "settings" && <>

      {!loaded && mainTab === "settings" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 10, background: "#f4f4f5", border: "1px solid #e9e9ec", color: "#52525b", fontSize: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
            <circle cx="12" cy="12" r="9" stroke="#e9e9ec" strokeWidth="2.5"/><path d="M12 3a9 9 0 019 9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading settings…
        </div>
      )}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ flexShrink: 0, width: 200 }}>
          <div style={{ ...cs, overflow: "hidden" }}>
            <LazyCard delay={200}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActive(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px",
                  fontSize: 12, border: "none", cursor: "pointer", textAlign: "left",
                  borderBottom: "1px solid #e9e9ec",
                  borderLeft: active === s.id ? "3px solid #0a0a0a" : "3px solid transparent",
                  background: active === s.id ? "#f4f4f5" : "transparent",
                  color: active === s.id ? "#0a0a0a" : "#52525b",
                  fontWeight: active === s.id ? 600 : 400, transition: "all .15s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d={s.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {s.label}
                </button>
              ))}
            </LazyCard>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...cs, padding: "24px" }}>
            <LazyCard delay={400}>

              {active === "dashboard" && (
                <div>
                  <Hdr title="Dashboard Settings" desc="Customize your analytics dashboard experience" />
                  <Row title="Show Risk Score"      desc="Display security risk assessment on the overview cards"  uiKey="showRiskScore"      t={t} toggle={toggle} />
                  <Row title="Show Recent Activity" desc="Display recent detections on the overview page"          uiKey="showRecentActivity" t={t} toggle={toggle} />
                  <Row title="Animated Charts"      desc="Enable smooth animations for charts and graphs"          uiKey="animatedCharts"     t={t} toggle={toggle} />
                  <Row title="Auto Refresh"         desc="Automatically refresh dashboard data every 5 minutes"   uiKey="autoRefresh"        t={t} toggle={toggle} />
                </div>
              )}

              {active === "detection" && (
                <div>
                  <Hdr title="Detection Settings" desc="Control how SecureLint detects secrets and threats across all websites" />
                  <Row title="Enable Detection"          desc="Turn secret and threat detection on or off globally"                     uiKey="enableDetection"    t={t} toggle={toggle} />
                  <Row title="Auto-mask Critical Secrets" desc="Automatically mask high-risk secrets in textareas and editors"         uiKey="autoMaskCritical"   t={t} toggle={toggle} tag="Recommended" />
                  <Row title="Auto-mask in Editors"      desc="Extend auto-masking to code editors and rich-text contenteditable elements" uiKey="autoMaskEditor" t={t} toggle={toggle} />
                  <Row title="Show Notifications"        desc="Display browser notifications when secrets are detected"                uiKey="showNotifications"  t={t} toggle={toggle} />
                  <Row title="Mask Secrets in Console"   desc="Automatically mask secrets appearing in browser developer console"     uiKey="maskConsole"        t={t} toggle={toggle} />
                  <Row title="Scan Large Documents"      desc="Enable scanning for documents over 50KB (may impact performance)"      uiKey="scanLargeDocs"      t={t} toggle={toggle} />
                  <Row title="Real-time Updates"         desc="Update masking highlights as you type (disable for better performance)" uiKey="realtimeUpdates"    t={t} toggle={toggle} />
                  <Row title="Email DLP"                 desc="Detect and prevent sensitive data from leaving the org via email"      uiKey="emailDlpEnabled"    t={t} toggle={toggle} tag="Enterprise" />
                </div>
              )}

              {active === "masking" && (
                <div>
                  <Hdr title="Masking Options" desc="Configure how and where secrets are masked" />

                  {/* Masking style selector */}
                  <div style={{ padding: "14px 0", borderBottom: "1px solid #e9e9ec" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 6 }}>Masking Style</div>
                    <div style={{ fontSize: 11, color: "#52525b", marginBottom: 12 }}>Controls the visual style used when a secret is masked</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(["smart", "full", "partial"] as const).map(opt => (
                        <button key={opt} onClick={() => setMaskStyle(opt)} style={{
                          padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all .15s",
                          border: maskStyle === opt ? "1.5px solid #16a34a" : "1px solid #e9e9ec",
                          background: maskStyle === opt ? "#f0fdf4" : "#f4f4f5",
                          color: maskStyle === opt ? "#16a34a" : "#52525b",
                        }}>
                          {opt === "smart" ? "Smart" : opt === "full" ? "Full (████)" : "Partial (AB..XY)"}
                          {opt === "smart" && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "#bbf7d0", color: "#16a34a" }}>Recommended</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Row title="Global Masking Status"       desc="Master switch — when off, no masking occurs anywhere"                    uiKey="globalMaskingStatus" t={t} toggle={toggle} />
                  <Row title="Preserve Context"            desc="Maintain URL structure and field names when masking"                    uiKey="preserveContext"     t={t} toggle={toggle} />
                  <Row title="Auto-masking in Textareas"   desc="Auto-mask secrets in textareas and contenteditable elements (on by default)" uiKey="autoMaskTextareas" t={t} toggle={toggle} />
                  <Row title="Auto-masking in Input Boxes" desc="Auto-mask INPUT fields — off by default to avoid breaking forms"       uiKey="autoMaskInputs"      t={t} toggle={toggle} />
                  <Row title="Auto-masking in Editors"     desc="Apply masking in code editors (VS Code Web, CodeMirror, Monaco, etc.)" uiKey="autoMaskEditor"      t={t} toggle={toggle} />
                </div>
              )}

              {active === "overlay" && (
                <div>
                  <Hdr title="Overlay Settings" desc="Control whether the SecureLint overlay icon appears on each element type" />
                  <Row title="Overlay on Input Fields"  desc="Show the overlay icon on <input> elements"                     uiKey="overlayInput"    t={t} toggle={toggle} />
                  <Row title="Overlay on Textareas"     desc="Show the overlay icon on <textarea> elements"                  uiKey="overlayTextarea" t={t} toggle={toggle} />
                  <Row title="Overlay on Editors"       desc="Show the overlay icon on contenteditable / rich-text editors"  uiKey="overlayEditor"   t={t} toggle={toggle} />
                </div>
              )}

              {active === "network" && (
                <div>
                  <Hdr title="Network Protection" desc="Control how SecureLint intercepts network requests containing secrets" />
                  <Row title="Block Network Secrets"          desc="Detect and block XHR/fetch/WebSocket requests sending unmasked secrets"  uiKey="blockNetworkSecrets"     t={t} toggle={toggle} tag="Recommended" />
                  <Row title="Block Form Submissions"         desc="Prevent form submissions that contain unmasked detected secrets"          uiKey="blockFormSubmission"     t={t} toggle={toggle} />
                  <Row title="Aggressive Email Blocking"      desc="Enhanced interception for Gmail, Outlook, and Yahoo Mail outbound emails" uiKey="aggressiveEmailBlocking" t={t} toggle={toggle} tag="Enterprise" />
                </div>
              )}

              {active === "severity" && (
                <div>
                  <Hdr title="Severity Detection Levels" desc="Choose which severity levels trigger detection, masking, and alerting" />
                  {([
                    { k: "detectCritical", label: "Critical", desc: "API keys, DB credentials, private keys — immediate risk",       c: "#dc2626" },
                    { k: "detectHigh",     label: "High",     desc: "Access tokens, OAuth secrets, webhook URLs — significant risk", c: "#c2410c" },
                    { k: "detectMedium",   label: "Medium",   desc: "Internal URLs, environment variables — moderate risk",          c: "#b45309" },
                    { k: "detectLow",      label: "Low",      desc: "Test keys, sample tokens, documentation patterns — low risk",   c: "#3f6212" },
                  ]).map(sev => (
                    <div key={sev.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #e9e9ec" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: sev.c, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{sev.label}</div>
                          <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{sev.desc}</div>
                        </div>
                      </div>
                      <Toggle on={!!t[sev.k]} onChange={() => toggle(sev.k)} />
                    </div>
                  ))}
                </div>
              )}

              {active === "notifications" && (
                <div>
                  <Hdr title="Notifications" desc="Choose which severity levels trigger real-time browser notifications" />
                  <Row title="Critical Alerts" desc="Get notified immediately when a critical secret is detected" uiKey="notifyCritical" t={t} toggle={toggle} />
                  <Row title="High Alerts"     desc="Get notified when a high-severity secret is detected"        uiKey="notifyHigh"    t={t} toggle={toggle} />
                </div>
              )}

              {active === "enterprise" && (
                <div>
                  <Hdr title="Enterprise Policy" desc="Controls specific to your enterprise plan — applied across all enrolled employees" />
                  <Row title="Enterprise Data Collection"   desc="Allow anonymized threat telemetry to improve detection for your org"     uiKey="enterpriseDataCollection" t={t} toggle={toggle} tag="Enterprise" />
                  <Row title="Site Exclusions"              desc="Enable the org-wide site allowlist / exclusions list"                    uiKey="siteExclusionsStatus"     t={t} toggle={toggle} />
                  <Row title="Email DLP Enforcement"        desc="Enforce DLP policy on all outbound email activity for enrolled users"    uiKey="emailDlpEnabled"          t={t} toggle={toggle} tag="Enterprise" />
                  <Row title="Global Masking Policy"        desc="Force masking on for all enrolled users, overriding individual settings" uiKey="globalMaskingStatus"      t={t} toggle={toggle} />

                  {/* ── Array fields ───────────────────────────────────────── */}
                  <TagInput
                    label="WAF Social Domain Blocklist"
                    hint="Domains blocked by the WAF social-domain rule — employees will see a warning page when visiting these."
                    placeholder="e.g. instagram.com, tiktok.com"
                    values={wafSocialDomains}
                    onChange={setWafSocialDomains}
                  />
                  <TagInput
                    label="Site Exclusions (Allowlist)"
                    hint="Domains excluded from all SecureLint scanning and blocking for your organization."
                    placeholder="e.g. internal.company.com, staging.acme.io"
                    values={siteExclusions}
                    onChange={setSiteExclusions}
                  />
                  <TagInput
                    label="Enterprise Email Domains"
                    hint="Trusted email domains for your organization. Used for DLP policy scoping and employee identification."
                    placeholder="e.g. acme.com, acme.io"
                    values={enterpriseEmailDomains}
                    onChange={setEnterpriseEmailDomains}
                  />

                  {/* Plan badge */}
                  <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #16a34a33", display: "flex", alignItems: "center", gap: 12 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>Enterprise Plan Active</div>
                      <div style={{ fontSize: 10, color: "#52525b", marginTop: 2 }}>All enterprise policies and controls are available for your organization.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #e9e9ec", display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={handleSave} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 8,
                  border: "none", background: saving ? "#8e8e93" : "#0a0a0a", color: "#ffffff",
                  fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.8 : 1,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                {saving && <span style={{ fontSize: 11, color: "#52525b" }}>Updating your settings…</span>}
              </div>

            </LazyCard>
          </div>
        </div>
      </div>
      </>}

    </div>
  );
}
