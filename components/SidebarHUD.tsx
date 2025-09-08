'use client';
import React from 'react';
import { useGameV2State } from '../hooks/useGameV2State';
export default function SidebarHUD(){
  const { state } = useGameV2State();
  const w = state.wallet;
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4 space-y-2">
      <div className="font-semibold">Status</div>
      <div className="text-sm opacity-90">Nível {state.player.level} · EXP {state.player.exp}</div>
      <div className="text-sm opacity-90">Stamina {state.player.stamina}</div>
      <div className="text-sm opacity-90">Reputação {state.player.reputation}</div>
      <div className="h-px bg-zinc-800 my-2" />
      <div className="font-semibold">Carteira</div>
      <div className="grid grid-cols-2 gap-1 text-sm opacity-90">
        <div>Ouro</div><div>{w.gold}</div>
        <div>Prata</div><div>{w.silver}</div>
        <div>Bronze</div><div>{w.bronze}</div>
        <div>Cobre</div><div>{w.copper}</div>
      </div>
    </div>
  );
}
