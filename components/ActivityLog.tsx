'use client';
import React from 'react';
import { useGameV2State } from '../hooks/useGameV2State';

export default function ActivityLog(){
  const { state } = useGameV2State();
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3 text-sm max-h-72 overflow-auto">
      <div className="font-semibold mb-1">Atividades</div>
      <ul className="space-y-1">
        {state.logs.map((l,i)=>(<li key={i} className="opacity-90">{l}</li>))}
      </ul>
    </div>
  );
}
