
'use client';
import React from "react";

export default function TabPrincipalView({ ctx }){
  const {
    player, day, hour, season, RANKS, rankIdx, ICONS,
    inventory, uiQuality, setUiQuality,
    ITEMS, QUALITY, QUALITY_ORDER, withQualityKey, parseQualityKey, qualityStyle,
    fmtMoney, unitPrice, buy, sell, equipItem,
    drinkPotion, useAbility, repair, contracts
  } = ctx;

  const safeEquip = (player && player.equip) ? player.equip : { weapon:null, armor:null, weaponDur:0, armorDur:0 };

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
          <div className="space-y-2 w-full md:w-auto md:min-w-[320px]">
            <div className="flex items-center gap-2">
              <span>HP</span>
              <div className="bar w-full">
                <div className="bar-fill bar-hp transition-all duration-700" style={{width:`${player.hp}%`}}/>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Stamina</span>
              <div className="bar w-full">
                <div className="bar-fill bar-sta transition-all duration-700" style={{width:`${player.stamina}%`}}/>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm pt-2">
          <div>Moedas: <b title={player.money}>{fmtMoney(player.money)} 💰</b></div>
          <div>Comércio: {player.trade} · Talentos: {player.talentPts}</div>
          <div>Arma: {safeEquip.weapon? parseQualityKey(safeEquip.weapon).q.toUpperCase(): "(nenhuma)"} <span className="badge badge-info">{safeEquip.weaponDur ?? 0}%</span></div>
          <div>Armadura: {safeEquip.armor? parseQualityKey(safeEquip.armor).q.toUpperCase(): "(nenhuma)"} <span className="badge badge-info">{safeEquip.armorDur ?? 0}%</span></div>
          <div>Contratos ativos: {contracts.filter(c=>c.status==='aceito' && c.progress < c.time).length}</div>
        </div>
        <div className="flex gap-2 pt-2 flex-wrap">
          <button onClick={drinkPotion} className="btn">Beber Poção</button>
          <button onClick={useAbility} className="btn">Golpe Poderoso {player.abilityCD>0?`(${player.abilityCD}h)`:''}</button>
          <button onClick={repair} className="btn">Usar Kit de Reparos</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Atributos</h2>
        {[["forca","Força"],["destreza","Destreza"],["vigor","Vigor"],["arcano","Arcano"],["carisma","Carisma"],["sagacidade","Sagacidade"]].map(([k,label])=>(
          <div key={k} className="flex items-center justify-between mb-1 text-sm">
            <div className="flex items-center gap-2">
              <img src={ICONS[k]} className="w-4 h-4 opacity-90" alt=""/>
              <div className="text-zinc-300">{label}</div>
            </div>
            <div className="text-zinc-400">{player.attrs[k]}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Inventário Rápido</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {ITEMS.map(it=>{
            const qSel = uiQuality[it.id] || "regular";
            const priceShown = unitPrice(it.id, qSel);
            const presentVariants = QUALITY_ORDER.filter(q => (inventory[withQualityKey(it.id, q)] || 0) > 0 || (q==='regular' && (inventory[it.id]||0)>0));
            const style = qualityStyle(qSel);
            return (
              <div key={it.id} className={`flex items-center justify-between gap-2 border rounded-xl p-2 ${style.border}`}>
                <div className="flex items-center gap-2">
                  <img src={it.icon} alt="" className="w-8 h-8 rounded border border-zinc-700" />
                  <div>
                    <div className={`font-medium ${style.text}`}>{it.name} ({QUALITY[qSel].name})</div>
                    <div className="text-xs text-zinc-400">Preço: {fmtMoney(priceShown)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-2 py-1 rounded bg-zinc-800" value={qSel} onChange={(e)=>setUiQuality(u=>({...u,[it.id]:e.target.value}))}>
                    {QUALITY_ORDER.map(q => <option key={q} value={q}>{QUALITY[q].name}</option>)}
                  </select>
                  <div className="text-xs text-zinc-400">
                    {presentVariants.map(q => {
                      const key = withQualityKey(it.id, q);
                      const count = (q==='regular' ? (inventory[it.id]||0) : (inventory[key]||0));
                      if (!count) return null;
                      return <span key={q} className="ml-2">{QUALITY[q].name}: x{count}</span>;
                    })}
                  </div>
                  <button onClick={()=>buy(it.id,1,qSel)} className="btn">Comprar</button>
                  <button onClick={()=>sell(it.id,1,qSel)} className="btn">Vender</button>
                  {(it.id==='dagger_iron'||it.id==='armor_leather') && <button onClick={()=>equipItem(it.id)} className="btn btn-primary">Equipar</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
