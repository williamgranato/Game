'use client';
import React from "react";
import { useCharacter } from "../../context/CharacterContext";

const BRONZE_PER_COPPER=10, BRONZE_PER_SILVER=100, BRONZE_PER_GOLD=1000;
function fromBronze(total){
  total = Math.max(0, Math.floor(total||0));
  const gold = Math.floor(total/BRONZE_PER_GOLD); total%=BRONZE_PER_GOLD;
  const silver = Math.floor(total/BRONZE_PER_SILVER); total%=BRONZE_PER_SILVER;
  const copper = Math.floor(total/BRONZE_PER_COPPER); total%=BRONZE_PER_COPPER;
  return { gold, silver, copper, bronze: total };
}

export default function HeaderHUD({ user, player, day, hour, season, rankIcon, rankName, onRest, onLogout }){
  const { gold, silver, copper, bronze } = fromBronze(player?.money??0);
  const seasonBg = {
    'Primavera': 'from-green-900 via-pink-900 to-green-800',
    'Verão': 'from-yellow-800 via-orange-700 to-yellow-900',
    'Outono': 'from-yellow-900 via-red-800 to-orange-900',
    'Inverno': 'from-blue-900 via-cyan-800 to-blue-950',
  }[season?.name] || 'from-zinc-900 to-zinc-800';

  const { character } = useCharacter() || { character: null };
  const level = character?.level ?? null;
  const xp = character?.xp ?? null;
  const xpMax = character?.xpToNextLevel ?? null;
  const charCoins = character?.coins ?? null;

  return (
    <header className={`bg-gradient-to-r ${seasonBg} header-frame rounded-2xl px-4 py-3 shadow-lg border border-zinc-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between transition-all`}>
      <div className="flex items-center gap-3">
        <img src="/images/avatar.png" width={64} height={64} alt="avatar" className="rounded-xl border border-zinc-800 shadow-medieval"/>
        <div>
          <img src="/images/logo.png" alt="Logo" className="h-12 md:h-16 object-contain mb-1"/>
          <p className="text-zinc-200">Dia {day}, {String(hour).padStart(2,'0')}:00 — {season?.icon} {season?.name} · Aventureiro: {rankName} {rankIcon} · {user}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="text-sm bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2 leading-5 min-w-[160px] shadow">
          <div className="flex items-center gap-2"><img src="/images/items/gold.png" className="w-5 h-5" alt="Ouro"/>{gold}</div>
          <div className="flex items-center gap-2"><img src="/images/items/silver.png" className="w-5 h-5" alt="Prata"/>{silver}</div>
          <div className="flex items-center gap-2"><img src="/images/items/copper.png" className="w-5 h-5" alt="Cobre"/>{copper}</div>
          <div className="flex items-center gap-2"><img src="/images/items/bronze.png" className="w-5 h-5" alt="Bronze"/>{bronze}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onRest} className="btn btn-good hover:scale-105 transition-transform">Descansar</button>
          <button onClick={onLogout} className="btn btn-danger hover:scale-105 transition-transform">Sair</button>
        </div>
      </div>

      {level && xpMax ? (
        <div className="mt-2 text-xs flex items-center gap-4 w-full">
          <div>Nível: <b>{level}</b></div>
          <div className="flex-1">
            <div className="w-full h-2 bg-zinc-800 rounded overflow-hidden">
              <div className="h-2 bg-green-600" style={{ width: `${Math.min(100, Math.floor((xp / Math.max(1, xpMax)) * 100))}%` }} />
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">{xp} / {xpMax} XP</div>
          </div>
          <div className="hidden md:block">Moedas (treino): <b>{charCoins ?? 0}</b></div>
        </div>
      ) : null}
    </header>
  );
}
