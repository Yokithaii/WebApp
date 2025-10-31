import { useState } from "react";
export default function StepQuote({ onNext }:{ onNext:(q:string,p?:string,d?:string)=>void }){
  const [q,setQ]=useState(""); const [p,setP]=useState(""); const [d,setD]=useState("");
  const valid = q.trim().split(/\s+/).length >= 6;
  return (<div>
    <h2 style={{color:"var(--madi-blue)"}}>1) Вставьте цитату</h2>
    <label className="label">Цитата</label>
    <textarea rows={5} className="input" value={q} onChange={e=>setQ(e.target.value)}
      placeholder='Например: "Мы закроем парк завтра из-за безопасности"'/>
    <div className="grid grid2" style={{marginTop:12}}>
      <div><label className="label">Кто сказал (необязательно)</label>
        <input className="input" value={p} onChange={e=>setP(e.target.value)} placeholder="ФИО / организация"/></div>
      <div><label className="label">Дата (необязательно)</label>
        <input className="input" value={d} onChange={e=>setD(e.target.value)} placeholder="ГГГГ-ММ-ДД"/></div>
    </div>
    {!valid && <p className="label" style={{color:"var(--madi-orange)"}}>Совет: лучше ≥6 слов, иначе много шума.</p>}
    <div style={{marginTop:12}}><button className="btn" disabled={!valid} onClick={()=>onNext(q,p||undefined,d||undefined)}>Далее</button></div>
  </div>);
}
