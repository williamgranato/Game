"use client";
import React, { useEffect, useState } from "react";
import { useGameV2State } from "../hooks/useGameV2State";
import { MISSIONS } from "../data/missions";
import { Sword } from "lucide-react";

export default function GuildMissions() {
  const [tick,setTick] = useState(0);
  useEffect(()=>{ const id=setInterval(()=>setTick(t=>t+1),1000); return ()=>clearInterval(id); },[]);

  const { state, startMissionServer, finishMissionServer, playerRank } = useGameV2State();
  const myRank = playerRank();
  const hasActive = state.activeMissions && state.activeMissions.length>0;

  return (
    <div className="space-y-3">
      {MISSIONS.map(m=>{
        const active = state.activeMissions.find((a:any)=>a.missionId===m.id);
        const order = ["F","E","D","C","B","A","S","SS"];
        const allowed = order.indexOf(myRank) >= order.indexOf(m.rank);

        let remaining=0;
        if(active){ const now=Date.now(); remaining=Math.max(0,Math.floor((new Date(active.endsAt).getTime()-now)/1000)); }

        return (
          <div key={m.id} className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-3">
            <h3 className="font-bold">{m.title} <span className="text-xs opacity-70">[Rank {m.rank}]</span></h3>
            <p className="text-xs opacity-70">{m.description}</p>

            {!active ? (
              <button disabled={!allowed||hasActive}
                onClick={()=>startMissionServer(m.id,m.rank)}
                className={"mt-2 px-3 py-1.5 rounded-xl border flex items-center gap-2 "+
                  (allowed && !hasActive ? "bg-emerald-700/70 hover:bg-emerald-700 border-emerald-600/50" : "bg-zinc-800 border-zinc-700 opacity-50 cursor-not-allowed")}>
                <Sword size={16}/> Iniciar
              </button>
            ): remaining>0 ? (
              <div className="text-xs mt-1">⏳ Restam {remaining}s</div>
            ):(
              <button onClick={()=>finishMissionServer(m.id)}
                className="mt-2 px-3 py-1.5 rounded-xl border bg-amber-700/70 hover:bg-amber-700 border-amber-600/50 flex items-center gap-2">
                <Sword size={16}/> Concluir
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
