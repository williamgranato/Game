'use client';
import { MISSIONS } from '../data/missions';
import { useGameV2State } from '../hooks/useGameV2State';
import { BadgeCheck, Timer, Sword } from 'lucide-react';
import React from 'react';

export default function GuildMissions(){
  const { state, startMission, finishMission } = useGameV2State();
  const now = Date.now();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Missões da Guilda</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {MISSIONS.map(m => {
          const active = state.activeMissions.find(a => a.missionId===m.id);
          const remaining = active ? Math.max(0, active.endsAt - now) : 0;
          const minsLeft = Math.ceil(remaining/60000);
          return (
            <div key={m.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{m.title}</h3>
                  <p className="text-sm opacity-80">{m.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-zinc-700">{m.tier}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1"><Timer size={16}/> {m.timeMinutes}m</span>
                <span>Stamina: {m.staminaCost}</span>
                <span>Requer Nível: {m.reqLevel}</span>
              </div>
              <div className="mt-3 flex gap-2">
                {!active ? (
                  <button onClick={()=>startMission(m.id, m.timeMinutes, m.staminaCost)} className="px-3 py-1.5 rounded-xl bg-emerald-700/70 hover:bg-emerald-700 transition shadow border border-emerald-600/50 flex items-center gap-2">
                    <Sword size={16}/> Iniciar
                  </button>
                ) : remaining>0 ? (
                  <div className="text-amber-300 text-sm">Em progresso… {minsLeft} min</div>
                ) : (
                  <button onClick={()=>finishMission(m.id, m.rewards)} className="px-3 py-1.5 rounded-xl bg-amber-700/70 hover:bg-amber-700 transition shadow border border-amber-600/50 flex items-center gap-2">
                    <BadgeCheck size={16}/> Concluir
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
