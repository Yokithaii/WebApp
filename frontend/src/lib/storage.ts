export type CheckItem = { id: string; label: string; done: boolean; note?: string; url?: string };

export type Session = {
  id: string;
  createdAt: string;
  quote: string;
  person?: string;
  date?: string;
  queries: { label: string; url: string }[];
  checklist: CheckItem[];
  findings: { sourceUrl?: string; sourceType?: string; sourceDate?: string; discrepancies?: string[] };
};

const KEY = "madi_history_v1";

// ✅ Возвращаем строго Session[]
export function loadHistory(): Session[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Session[]) : [];
  } catch {
    return [];
  }
}

// ✅ Явно указываем тип массива и элемента
export function saveSession(s: Session) {
  const all: Session[] = loadHistory();
  const i = all.findIndex((x: Session) => x.id === s.id);
  if (i >= 0) all[i] = s; else all.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}
