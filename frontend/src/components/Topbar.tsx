import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Settings2, UserCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { usePolling } from "../hooks/usePolling";
import { fetchHealth, fetchIncidents } from "../services/api";
import { getToken } from "../store/authStore";
import { formatDateTime } from "../utils/format";
import BrandLogo from "./BrandLogo";

type TopbarProps = {
title: string;
};

type TokenProfile = {
email: string;
role: string;
tenantId: string;
};

function parseTokenProfile(): TokenProfile {
const token = getToken();
if (!token) {
return { email: "unknown", role: "admin", tenantId: "-" };
}

try {
const parts = token.split(".");
if (parts.length < 2) {
return { email: "unknown", role: "admin", tenantId: "-" };
}

const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
const payload = JSON.parse(atob(padded)) as {
email?: string;
role?: string;
tenant_id?: string;
};

return {
email: payload.email ?? "unknown",
role: payload.role ?? "admin",
tenantId: payload.tenant_id ?? "-",
};
} catch {
return { email: "unknown", role: "admin", tenantId: "-" };
}
}

export default function Topbar({ title }: TopbarProps) {
const location = useLocation();
const isSettingsPage = location.pathname === "/settings";
const [profileOpen, setProfileOpen] = useState(false);
const [notificationsOpen, setNotificationsOpen] = useState(false);
const profileRef = useRef<HTMLDivElement | null>(null);
const notificationsRef = useRef<HTMLDivElement | null>(null);

const profile = useMemo(parseTokenProfile, []);
const initials = useMemo(() => {
if (!profile.email || profile.email === "unknown") {
return "U";
}
return profile.email.slice(0, 1).toUpperCase();
}, [profile.email]);

const { data: incidents } = usePolling(fetchIncidents, 5000);
const { data: health, error: healthError } = usePolling(fetchHealth, 5000);

const isLive = !healthError && String(health?.status ?? "").toLowerCase() === "ok";
const recentNotifications = useMemo(() => {
const list = incidents ?? [];
return [...list]
.filter((incident) => String(incident.status).toLowerCase() === "open")
.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
.slice(0, 6);
}, [incidents]);
const criticalCount = useMemo(() => {
return recentNotifications.filter((incident) => String(incident.severity).toLowerCase() === "critical").length;
}, [recentNotifications]);

useEffect(() => {
const onPointerDown = (event: MouseEvent) => {
const target = event.target as Node;
if (profileRef.current && !profileRef.current.contains(target)) {
setProfileOpen(false);
}
if (notificationsRef.current && !notificationsRef.current.contains(target)) {
setNotificationsOpen(false);
}
};

document.addEventListener("mousedown", onPointerDown);
return () => document.removeEventListener("mousedown", onPointerDown);
}, []);

return (
<header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/70 bg-bg/95 px-8 py-5 backdrop-blur-md">
<div className="flex items-center gap-4">
<BrandLogo size={36} withWordmark={false} />
<div>
<p className="text-xs uppercase tracking-[0.16em] text-slate-500">Cloud iOS AIOps</p>
<h2 className="text-3xl font-bold tracking-tight text-text">{title}</h2>
</div>
</div>
<div className="flex items-center gap-3">
<span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${isLive ? "border-success/40 bg-success/12 text-success" : "border-danger/40 bg-danger/12 text-danger"}`}>
<span className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-success animate-pulse" : "bg-danger animate-pulse"}`} />
{isLive ? "Live" : "Degraded"}
</span>
<Link
to="/settings"
className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
isSettingsPage
? "border-accent/70 bg-accent/20 text-accent"
: "border-slate-700 bg-slate-900 text-slate-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
}`}
>
<Settings2 size={16} />
Settings
</Link>

<div className="relative" ref={notificationsRef}>
<button
type="button"
onClick={() => setNotificationsOpen((value) => !value)}
className="relative rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200 transition hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
aria-label="Open notifications"
>
<Bell size={18} />
{criticalCount > 0 ? (
<span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
{criticalCount}
</span>
) : null}
</button>

{notificationsOpen ? (
<div className="absolute right-0 top-12 z-50 w-96 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-panel">
<div className="mb-3 flex items-center justify-between">
<h3 className="text-sm font-bold text-text">Notifications</h3>
<span className="text-xs text-slate-400">{recentNotifications.length} open alerts</span>
</div>
<div className="max-h-80 space-y-2 overflow-auto pr-1">
{recentNotifications.length === 0 ? (
<p className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-xs text-slate-400">
No active notifications.
</p>
) : (
recentNotifications.map((incident) => (
<div key={incident.id} className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3">
<div className="flex items-center justify-between gap-2">
<p className="truncate text-xs font-semibold text-text">{incident.root_cause}</p>
<span
className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
String(incident.severity).toLowerCase() === "critical"
? "bg-danger/20 text-danger"
: "bg-warning/20 text-warning"
}`}
>
{incident.severity}
</span>
</div>
<p className="mt-1 text-[11px] text-slate-400">{incident.ai_action.split("_").join(" ")}</p>
<p className="mt-1 text-[10px] text-slate-500">{formatDateTime(incident.created_at)}</p>
</div>
))
)}
</div>
</div>
) : null}
</div>

<div className="relative" ref={profileRef}>
<button
type="button"
onClick={() => setProfileOpen((value) => !value)}
className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-bold text-text transition hover:-translate-y-0.5 hover:border-primary/55 hover:text-primary"
aria-label="Open profile"
>
{initials}
</button>

{profileOpen ? (
<div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-panel">
<div className="mb-4 flex items-center gap-3">
<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
{initials}
</div>
<div>
<p className="text-sm font-semibold text-text">{profile.email}</p>
<p className="text-xs uppercase tracking-[0.18em] text-slate-500">{profile.role}</p>
</div>
</div>

<div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
<div className="flex items-center justify-between text-slate-400">
<span className="inline-flex items-center gap-1 text-slate-300">
<UserCircle2 size={14} /> Profile Email
</span>
<span className="font-semibold text-text">{profile.email}</span>
</div>
<div className="flex items-center justify-between text-slate-400">
<span className="text-slate-300">Role</span>
<span className="font-semibold uppercase text-text">{profile.role}</span>
</div>
<div className="flex items-center justify-between text-slate-400">
<span className="text-slate-300">Tenant ID</span>
<span className="max-w-[9rem] truncate font-semibold text-text" title={profile.tenantId}>
{profile.tenantId}
</span>
</div>
</div>
</div>
) : null}
</div>
</div>
</header>
);
}
