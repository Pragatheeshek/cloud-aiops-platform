import { fetchIncidents } from "../services/api";
import type { Incident } from "../types";

let cache: Incident[] = [];

export async function loadIncidents(): Promise<Incident[]> {
	cache = await fetchIncidents();
	return cache;
}

export function getIncidentCache(): Incident[] {
	return cache;
}
