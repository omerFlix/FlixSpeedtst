export type HistoryEntry = {
  t: number;
  d: number;
  u: number;
  p: number;
  demo: boolean;
};

const KEY = "flixspeed.history.v2";

export function loadHistory(): HistoryEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isEntry).slice(0, 20);
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry): void {
  const next = [entry, ...loadHistory()].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}

function isEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<HistoryEntry>;
  return (
    typeof v.t === "number" &&
    typeof v.d === "number" &&
    typeof v.u === "number" &&
    typeof v.p === "number" &&
    typeof v.demo === "boolean"
  );
}
