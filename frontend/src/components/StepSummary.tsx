import type { Session } from "../lib/storage";
export default function StepSummary({ session, onRestart }:{session:Session; onRestart:()=>void}){
  return (<div>
    <h2 style={{color:"var(--madi-blue)"}}>4) Сводка</h2>
    <div className="card">
      <p><strong>Цитата:</strong> «{session.quote}»</p>
      {session.person && <p><strong>Персона:</strong> {session.person}</p>}
      {session.date && <p><strong>Дата (ожид.):</strong> {session.date}</p>}
      <p><strong>Открытые поиски:</strong></p>
      <ul>{session.queries.map((q,i)=>(<li key={i}><a className="link" href={q.url} target="_blank">{q.label}</a></li>))}</ul>
      <p><strong>Чек-лист:</strong> {session.checklist.filter(x=>x.done).length}/{session.checklist.length} выполнено</p>
    </div>
    <div style={{marginTop:12,display:"flex",gap:8}}><button className="btn" onClick={onRestart}>Новая проверка</button></div>
  </div>);
}
