'use client';
import React from 'react';
import Image from 'next/image';
import { useGameV2State } from '../hooks/useGameV2State';

export default function HeaderStatus(){
  const { state } = useGameV2State();
  const w = state.wallet || { gold:0, silver:0, bronze:0, copper:0 };
  const player = state.player || { level:1, exp:0, reputation:0 };

  const expNeeded = 100 + player.level * 50;
  const expPercent = Math.min(100, (player.exp / expNeeded) * 100);

  const seasonNames = ['🌸 Primavera','☀️ Verão','🍂 Outono','❄️ Inverno'];
  const seasonIdx = Math.floor(((new Date().getMonth()+1) % 12) / 3);
  const season = seasonNames[seasonIdx];

  let title = 'Desconhecido';
  if(player.reputation>=10) title='Respeitado';
  if(player.reputation>=25) title='Renomado';
  if(player.reputation>=50) title='Lenda Viva';

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4 mb-4 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image src="/images/avatar.png" width={72} height={72} alt="Avatar"
              className="rounded-2xl border-4 border-amber-500 shadow-lg"/>
          </div>
          <div>
            <div className="text-lg font-bold">Nível {player.level}</div>
            <div className="text-sm opacity-80">Reputação: {player.reputation} · {title}</div>
            <div className="text-sm opacity-80">{season}</div>
            <div className="w-40 h-3 bg-zinc-800 rounded-full overflow-hidden mt-1 shadow-inner">
              <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-yellow-200" style={{width: expPercent+'%'}}></div>
            </div>
            <div className="text-xs opacity-70">EXP {player.exp}/{expNeeded}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/icons/gold.png" width={20} height={20} alt="ouro"/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-[0_0_5px_#facc15]">Ouro:</span> {w.gold}
          </div>
          <div className="flex items-center gap-2">
            <Image src="/icons/silver.png" width={20} height={20} alt="prata"/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 drop-shadow-[0_0_5px_#9ca3af]">Prata:</span> {w.silver}
          </div>
          <div className="flex items-center gap-2">
            <Image src="/icons/bronze.png" width={20} height={20} alt="bronze"/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-700 drop-shadow-[0_0_5px_#fb923c]">Bronze:</span> {w.bronze}
          </div>
          <div className="flex items-center gap-2">
            <Image src="/icons/copper.png" width={20} height={20} alt="cobre"/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-600 drop-shadow-[0_0_5px_#f87171]">Cobre:</span> {w.copper}
          </div>
        </div>
      </div>
    </div>
  );
}
