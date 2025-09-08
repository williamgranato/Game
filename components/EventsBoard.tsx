'use client';
import React from 'react';
import { useGameV2State } from '../hooks/useGameV2State';

export default function EventsBoard(){
  const { addLog } = useGameV2State();
  const events=[
    { id:'arena', name:'Torneio da Arena', effect:'+50% EXP em missões por 24h' },
    { id:'dragon_hunt', name:'Caça ao Dragão', effect:'Eventos cooperativos — contribua com recursos.' },
  ];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
      <h2 className="text-xl font-semibold">Eventos Semanais</h2>
      <div className="mt-2 grid gap-2">
        {events.map(e=>(
          <div key={e.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div>
              <div className="font-bold">{e.name}</div>
              <div className="text-sm opacity-80">{e.effect}</div>
            </div>
            <button onClick={()=>addLog(`Você ingressou no evento: ${e.name}`)} className="px-3 py-1.5 rounded-xl bg-indigo-700/70 hover:bg-indigo-700 border border-indigo-600/50">Participar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
