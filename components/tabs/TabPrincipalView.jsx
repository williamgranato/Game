'use client';
import React from "react";

export default function TabPrincipalView({ ctx }){
  const {
    player, day, hour, season, RANKS, rankIdx, ICONS,
    inventory, ITEMS, QUALITY, QUALITY_ORDER, parseQualityKey, qualityStyle,
    fmtMoney
  } = ctx;

// Cálculo de slots usados (pilhas de até 100 por chave)
const usedSlots = Object.values(inventory).reduce((acc, qty)=> acc + Math.ceil(Math.max(0, qty||0)/100), 0);
const totalSlots = player?.inventorySlots ?? 10;


  const safeEquip = (player && player.equip) ? player.equip : { weapon:null, armor:null, weaponDur:0, armorDur:0 };

  function qualityName(q){
    return QUALITY[q]?.name || "Normal";
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Aventureiro</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={player?.appearance?.gender==='female'?'/images/avatar_f.svg':'/images/avatar_m.svg'} width={64} height={64} alt="avatar" className="rounded-xl border border-zinc-800"/>
            <div>
              <div className="text-zinc-300">Nível {player.level} · XP {player.xp}</div>
              <div className="text-zinc-400">{RANKS[rankIdx].icon} {RANKS[rankIdx].name} · Dia {day}, {String(hour).padStart(2,'0')}:00 — {season.icon} {season.name}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm pt-2">
          <div>Moedas: <b title={player.money}>{fmtMoney(player.money)} 💰</b></div>
          <div>Slots usados: {usedSlots} / {totalSlots}</div>
          <div>Arma: {safeEquip.weapon? parseQualityKey(safeEquip.weapon).q.toUpperCase(): "(nenhuma)"} <span className="badge badge-info">{safeEquip.weaponDur ?? 0}%</span></div>
          <div>Armadura: {safeEquip.armor? parseQualityKey(safeEquip.armor).q.toUpperCase(): "(nenhuma)"} <span className="badge badge-info">{safeEquip.armorDur ?? 0}%</span></div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Inventário</h2>
      <div className="text-xs text-zinc-400 mb-2">Slots: {usedSlots} / {totalSlots}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ITEMS.map(it=>{
            // Checar quantidade total (somando variantes de qualidade)
            const totalCount = QUALITY_ORDER.reduce((sum,q)=>{
              const key = (q==='regular'? it.id : it.id+":"+q);
              return sum + (inventory[key]||0);
            }, 0);
            if(!totalCount) return null;

            // Pega a melhor qualidade presente
            const qPresent = QUALITY_ORDER.find(q=>{
              const key = (q==='regular'? it.id : it.id+":"+q);
              return (inventory[key]||0)>0;
            }) || "regular";

            const key = (qPresent==='regular'? it.id : it.id+":"+qPresent);
            const count = inventory[key]||0;
            const style = qualityStyle(qPresent);

            return (
              <div key={it.id} className={`p-3 rounded-xl border ${style.border} bg-zinc-900/60 flex flex-col`}>
                <img src={it.icon} alt="" className="w-12 h-12 mx-auto mb-2 rounded border border-zinc-700"/>
                <div className={`font-medium text-center ${style.text}`} title={qualityName(qPresent)}>
                  {it.name} (x{count})
                </div>
                <div className="text-xs text-zinc-400 text-center mt-1">
                  Valor de mercado: {fmtMoney(it.base)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}