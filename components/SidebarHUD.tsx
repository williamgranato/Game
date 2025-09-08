'use client';
import React from 'react';
import { useGameV2State } from '../hooks/useGameV2State';
import Image from 'next/image';

export default function SidebarHUD(){
  const { state } = useGameV2State();
  const w = state.wallet || { gold:0, silver:0, bronze:0, copper:0 };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-3 shadow">
      <div className="font-semibold">Carteira</div>
      <div className="grid grid-cols-2 gap-1 text-sm opacity-90">
        <div className="flex items-center gap-1"><Image src="/images/items/gold.png" width={16} height={16} alt="ouro"/> Ouro</div><div>{w.gold}</div>
        <div className="flex items-center gap-1"><Image src="/images/items/silver.png" width={16} height={16} alt="prata"/> Prata</div><div>{w.silver}</div>
        <div className="flex items-center gap-1"><Image src="/images/items/bronze.png" width={16} height={16} alt="bronze"/> Bronze</div><div>{w.bronze}</div>
        <div className="flex items-center gap-1"><Image src="/images/items/copper.png" width={16} height={16} alt="cobre"/> Cobre</div><div>{w.copper}</div>
      </div>
    </div>
  );
}
