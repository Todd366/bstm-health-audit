export interface LocalProfile { name: string; industry: string; location: string }
export interface LocalSettings { autoExportElos: boolean; saveHistory: boolean }
export interface HistoryEntry {
  id: string;
  createdAt: string;
  business: Record<string, any>;
  overall: number;
  categories: Record<string, number>;
  diagnosis: { strengths: string[]; weaknesses: string[] };
}

const KEY_PROFILE = "bstm_audit_profile";
const KEY_SETTINGS = "bstm_audit_settings";
const KEY_HISTORY = "bstm_audit_history";
const MAX_HISTORY = 50;

function readJSON(key: string): any {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: any): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const str = (v: any) => (typeof v === "string" ? v.slice(0, 200) : "");

export function getProfile(): LocalProfile {
  const p = readJSON(KEY_PROFILE) || {};
  return { name: str(p.name), industry: str(p.industry), location: str(p.location) };
}

export function saveProfile(p: LocalProfile): boolean {
  return writeJSON(KEY_PROFILE, {
    name: str(p.name).trim(),
    industry: str(p.industry).trim(),
    location: str(p.location).trim(),
  });
}

export function getSettings(): LocalSettings {
  const s = readJSON(KEY_SETTINGS) || {};
  return {
    autoExportElos: typeof s.autoExportElos === "boolean" ? s.autoExportElos : true,
    saveHistory: typeof s.saveHistory === "boolean" ? s.saveHistory : true,
  };
}

export function saveSettings(s: LocalSettings): boolean {
  return writeJSON(KEY_SETTINGS, s);
}

export function getHistory(): HistoryEntry[] {
  const h = readJSON(KEY_HISTORY);
  if (!Array.isArray(h)) return [];
  return h.filter(
    (e: any) =>
      e && typeof e.id === "string" && typeof e.overall === "number" && e.categories && e.diagnosis
  );
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "createdAt">): boolean {
  const id =
    typeof crypto !== "undefined" && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : String(Date.now());
  const next = [{ ...entry, id, createdAt: new Date().toISOString() }, ...getHistory()].slice(0, MAX_HISTORY);
  return writeJSON(KEY_HISTORY, next);
}

export function deleteHistory(id: string): boolean {
  return writeJSON(KEY_HISTORY, getHistory().filter((e) => e.id !== id));
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY_HISTORY);
  } catch {}
}
