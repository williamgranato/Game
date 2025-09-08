'use client';
import { useGameV2State } from '../hooks/useGameV2State';
import React from 'react';

export default function ReputationPanel(){
  const { state } = useGameV2State();
  const rep = state.player.reputation;
  let title = 'Desconhecido';
  if(rep>=10) title='Respeitado';
  if(rep>=25) title='Renomado';
  if(rep>=50) title='Lenda Viva';
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
      <h2 className="text-xl font-semibold">Fama & Reputação</h2>
      <p className="opacity-80">Reputação atual: <span className="font-bold">{rep}</span></p>
      <p className="opacity-80">Título: <span className="font-bold">{title}</span></p>
      <p className="text-sm opacity-70 mt-2">A reputação desbloqueia missões melhores e reduz taxas no leilão.</p>
    </div>
  );
}
