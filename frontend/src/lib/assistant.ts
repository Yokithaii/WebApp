import { buildQueries } from "./presets";
import type { Session, CheckItem } from "./storage";
export function buildChecklist(): CheckItem[] {
  return [
    { id:"who", label:"Кто говорит? (ФИО/организация)", done:false },
    { id:"where", label:"Где сказано? (интервью/пост/брифинг, ссылка)", done:false },
    { id:"when", label:"Когда сказано? (дата/время)", done:false },
    { id:"full", label:"Есть полный абзац/стенограмма?", done:false },
    { id:"edit", label:"Есть редакторская правка/пересказ?", done:false },
    { id:"lang", label:"Оригинальный язык и перевод?", done:false },
    { id:"confirm", label:"2+ независимых источника?", done:false },
  ];
}
export function startSession(quote:string, person?:string, date?:string): Session {
  const id = Math.random().toString(36).slice(2);
  return { id, createdAt:new Date().toISOString(), quote, person, date,
    queries: buildQueries(quote, person, date), checklist: buildChecklist(), findings:{} };
}
