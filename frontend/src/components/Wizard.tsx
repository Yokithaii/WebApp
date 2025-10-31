import { useState } from "react";
import StepQuote from "./StepQuote";
import StepQueries from "./StepQueries";
import StepChecklist from "./StepChecklist";
import StepSummary from "./StepSummary";
import Assistant from "./assistant/AssistantPanel";
import { startSession } from "../lib/assistant";
import { saveSession, type Session } from "../lib/storage";

export default function Wizard(){
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<Session|null>(null);

  const onStart = (quote:string, person?:string, date?:string)=>{
    const s = startSession(quote, person, date);
    setSession(s); saveSession(s); setStep(2);
  };
  const update = (patch: Partial<Session>)=>{
    if (!session) return; const s = { ...session, ...patch };
    setSession(s); saveSession(s);
  };

  return (<div className="card" style={{position:"relative"}}>
    {step===1 && <StepQuote onNext={onStart}/>}
    {step===2 && session && <StepQueries session={session} onNext={()=>setStep(3)} onUpdate={update}/>}
    {step===3 && session && <StepChecklist session={session} onNext={()=>setStep(4)} onUpdate={update}/>}
    {step===4 && session && <StepSummary  session={session} onRestart={()=>setStep(1)}/>}
    <div style={{display:"flex",gap:8,marginTop:12}}><span className="badge">Шаг {step} / 4</span></div>
    <Assistant session={session} goTo={(s)=>setStep(s)} />
  </div>);
}
