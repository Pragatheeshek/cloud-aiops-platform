import type { IncidentStatus, Severity } from "../types";

export function formatNumber(value: number, digits = 1): string {
	return Number.isFinite(value) ? value.toFixed(digits) : "0.0";
}

export function formatTime(iso: string): string {
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return "-";
	return parsed.toLocaleTimeString();
}

export function formatDateTime(iso: string): string {
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return "-";
	return parsed.toLocaleString();
}

export function normalizeStatus(status: IncidentStatus): "OPEN" | "RESOLVED" {
	return String(status).toLowerCase() === "resolved" ? "RESOLVED" : "OPEN";
}

export function normalizeSeverity(severity: Severity): "CRITICAL" | "WARNING" | "NORMAL" {
	const value = String(severity).toLowerCase();
	if (value === "critical") return "CRITICAL";
	if (value === "normal") return "NORMAL";
	return "WARNING";
}
