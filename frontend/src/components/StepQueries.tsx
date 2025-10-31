import { useEffect, useState } from "react";
import type { Session } from "../lib/storage";

type Props = { session: Session; onNext: ()=>void; onUpdate:(p:Partial<Session>)=>void };

export default function StepQueries({ session, onNext }: Props) {
  const [previews, setPreviews] = useState<Record<string,{title:string,desc:string,icon:string,ok:boolean}>>({});
  const [working, setWorking] = useState(session.queries);

  async function check(url:string){
    try{
      const r = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      const j = await r.json();
      setPreviews(p=>({...p, [url]:{title:j.title||"",desc:j.description||"",icon:j.icon||"", ok: j.hasResults!==false}}));
      return j.hasResults!==false;
    }catch{return false;}
  }

  useEffect(()=>{
    (async()=>{
      const oks = await Promise.all(session.queries.map(q=>check(q.url)));
      const filtered = session.queries.filter((q,i)=> oks[i] || q.label.includes("Интервью"));
      setWorking(filtered);
    })();
  }, [session]);

  const openAll = async ()=>{
    if (!working.length) return;
    if (!confirm(`Открыть ${working.length} вкладок?`)) return;
    working.forEach((q,i)=> setTimeout(()=>window.open(q.url,"_blank"), 150*i));
  };

  return (
    <div>
      <h2 style={{color:"var(--madi-blue)"}}>2) Откройте готовые поиски</h2>
      <p className="label">Мы не даём «вердиктов» — показываем где искать первоисточник. Неработающие пресеты скрыты автоматически.</p>
      <div className="grid">
        {working.map((q,i)=>(
          <a key={i} className="card link" href={q.url} target="_blank" rel="noreferrer">
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {previews[q.url]?.icon && <img src={previews[q.url].icon} alt="" width={16} height={16}/>}
              <strong>{q.label}</strong>
            </div>
            {previews[q.url]?.title && <div className="label" style={{marginTop:6}}>{previews[q.url].title}</div>}
            {previews[q.url]?.desc && <div className="label">{previews[q.url].desc}</div>}
          </a>
        ))}
        {!working.length && <div className="label">Для этой цитаты ничего не найдено. Попробуйте убрать кавычки или укоротить запрос.</div>}
      </div>
      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button className="btn" onClick={openAll} disabled={!working.length}>Открыть все</button>
        <button className="btn secondary" onClick={onNext}>Продолжить к чек-листу</button>
      </div>
    </div>
  );
}
