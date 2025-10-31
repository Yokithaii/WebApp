import type { Session, CheckItem } from "../lib/storage";
export default function StepChecklist({ session, onNext, onUpdate }:
  { session: Session; onNext:()=>void; onUpdate:(p:Partial<Session>)=>void }){
  const toggle=(id:string)=>{
    const list = session.checklist.map(it => it.id===id ? {...it, done:!it.done} : it);
    onUpdate({ checklist:list });
  };
  return (<div>
    <h2 style={{color:"var(--madi-blue)"}}>3) Чек-лист контекста</h2>
    <div className="grid">
      {session.checklist.map((it:CheckItem)=>(
        <div key={it.id} className="card" style={{display:"flex",alignItems:"center",gap:12}}>
          <input type="checkbox" checked={it.done} onChange={()=>toggle(it.id)}/>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
    <div style={{marginTop:12}}><button className="btn secondary" onClick={onNext}>К сводке</button></div>
  </div>);
}
