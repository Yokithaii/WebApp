import { useEffect, useState } from "react";
import type { Session } from "../../lib/storage";

export default function Assistant({ session, goTo }:{ session: Session|null, goTo:(s:1|2|3|4)=>void }){
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{ if (e.key==="?" ) setOpen(o=>!o); };
    window.addEventListener("keydown", onKey); return ()=>window.removeEventListener("keydown", onKey);
  },[]);

  const tips:string[] = [];
  if (!session) tips.push("Начните со вставки цитаты на шаге 1.");
  if (session){
    const words = session.quote.trim().split(/\s+/).length;
    if (words < 6) tips.push("Цитата короткая — лучше ≥6 слов.");
    if (session.quote.includes("…") || session.quote.includes("...")) tips.push("Есть многоточие — возможен вырванный контекст.");
    if (!session.person) tips.push("Добавьте ФИО/организацию для более точных пресетов.");
    const done = session.checklist?.filter(x=>x.done).length || 0;
    tips.push(`Прогресс чек-листа: ${done}/${session.checklist?.length||7}`);
  }

  const openAll = async ()=>{
    if (!session) return;
    // простое открытие всех пресетов (без фильтрации)
    if (!confirm(`Открыть ${session.queries.length} вкладок?`)) return;
    session.queries.forEach((q,i)=> setTimeout(()=>window.open(q.url,"_blank"), 150*i));
  };

  const tme = session?.queries.find(q=>q.label.includes("t.me"));
  const interview = session?.queries.find(q=>q.label.includes("Интервью"));

  return (<>
    <button className="asst-toggle" onClick={()=>setOpen(o=>!o)}>Ассистент</button>
    <div className={`asst ${open?'open':''}`}>
      <div className="asst-title">Мастер‑помощник</div>
      <div style={{display:"flex",flexWrap:"wrap"}}>
        <button className="btn asst-btn" onClick={openAll} disabled={!session}>Открыть все</button>
        <button className="btn asst-btn" onClick={()=> tme && window.open(tme.url,"_blank")} disabled={!tme}>Проверить t.me</button>
        <button className="btn asst-btn" onClick={()=> interview && window.open(interview.url,"_blank")} disabled={!interview}>Интервью</button>
        <button className="btn asst-btn" onClick={()=>goTo(3)} disabled={!session}>Чек-лист</button>
        <button className="btn asst-btn" onClick={()=>goTo(4)} disabled={!session}>Сводка</button>
      </div>
      {tips.length ? <div className="asst-tip">Советы:<br/>• {tips.join("<br/>• ")}</div> : null}
      <div className="asst-tip">Нажмите <b>?</b>, чтобы быстро открыть/скрыть ассистента.</div>
    </div>
  </>);
}
