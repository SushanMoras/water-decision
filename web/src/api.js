const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchDistricts() {
  const res = await fetch(`${API_BASE}/api/districts`);
  if (!res.ok) throw new Error("Failed to fetch districts");
  return res.json();
}

export async function fetchVillages(district = "Sangrur") {
  const res = await fetch(`${API_BASE}/api/villages?district=${encodeURIComponent(district)}`);
  if (res.status === 503) {
    const err = await res.json();
    throw new Error(err.detail?.error || "Real data not loaded for this district yet");
  }
  if (!res.ok) throw new Error("Failed to fetch villages");
  return res.json();
}

export async function fetchVillage(id) {
  const res = await fetch(`${API_BASE}/api/villages/${id}`);
  if (!res.ok) throw new Error("Failed to fetch village details");
  return res.json();
}

export async function fetchForecast(id, season = "2027-pre-summer") {
  const res = await fetch(`${API_BASE}/api/villages/${id}/forecast?season=${encodeURIComponent(season)}`);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}

export async function fetchActions(id, season = "kharif") {
  const res = await fetch(`${API_BASE}/api/villages/${id}/actions?season=${encodeURIComponent(season)}`);
  if (!res.ok) throw new Error("Failed to fetch actions");
  return res.json();
}

export async function postScenario(data) {
  const res = await fetch(`${API_BASE}/api/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail?.error || "Scenario evaluation failed");
  }
  return res.json();
}

export async function fetchCropsMeta() {
  const res = await fetch(`${API_BASE}/api/meta/crops`);
  if (!res.ok) throw new Error("Failed to fetch crop metadata");
  return res.json();
}

export async function fetchSourcesMeta() {
  const res = await fetch(`${API_BASE}/api/meta/sources`);
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}

export function getBriefPdfUrl(id, season = "2027-pre-summer") {
  return `${API_BASE}/api/villages/${id}/brief.pdf?season=${encodeURIComponent(season)}`;
}
