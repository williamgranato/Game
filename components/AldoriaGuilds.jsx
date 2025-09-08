'use client';
import React, { useEffect, useState } from "react";
import { QUALITY, QUALITY_ORDER, qualityMult, qualityStyle, withQualityKey, parseQualityKey } from "../lib/quality";
import { ITEMS, RECIPES } from "../lib/items";

import HeaderHUD from "./ui/HeaderHUD";
import TabPrincipalView from "./tabs/TabPrincipalView";
import TabGuildaView from "./tabs/TabGuildaView";
import TabMercadoView from "./tabs/TabMercadoView";
import TabLeilaoView from "./tabs/TabLeilaoView";
import TabCraftingView from "./tabs/TabCraftingView";

const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const rand  = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const uid   = ()=>Math.random().toString(36).slice(2);

const BRONZE_PER_COPPER=10, BRONZE_PER_SILVER=100, BRONZE_PER_GOLD=1000;
const toBronze = ({gold=0,silver=0,copper=0,bronze=0})=> gold*BRONZE_PER_GOLD + silver*BRONZE_PER_SILVER + copper*BRONZE_PER_COPPER + bronze;
function fromBronze(total){const gold=Math.floor(total/BRONZE_PER_GOLD); total%=BRONZE_PER_GOLD; const silver=Math.floor(total/BRONZE_PER_SILVER); total%=BRONZE_PER_SILVER; const copper=Math.floor(total/BRONZE_PER_COPPER); total%=BRONZE_PER_COPPER; return {gold,silver,copper,bronze:total};}
function fmtMoney(b){const {gold,silver,copper,bronze}=fromBronze(b); const parts=[]; if(gold)parts.push(`${gold} ouro`); if(silver)parts.push(`${silver} prata`); if(copper)parts.push(`${copper} cobre`); if(!gold && !silver && !copper) parts.push(`${bronze} bronze`); return parts.join(" · ");}

const SEASONS=[
  {key:"primavera",name:"Primavera",herbMod:1.2,oreMod:0.95,foodMod:0.95, icon:"🌸"},
  {key:"verao",name:"Verão",     herbMod:1.1,oreMod:1.0, foodMod:1.0,  icon:"☀️"},
  {key:"outono",name:"Outono",    herbMod:1.0,oreMod:1.05,foodMod:1.1,  icon:"🍂"},
  {key:"inverno",name:"Inverno",  herbMod:0.8,oreMod:1.15,foodMod:1.2,  icon:"❄️"},
];
const RANKS=[
  {key:"bronze",name:"Bronze",rpReq:0, icon:"🥉"},
  {key:"iron",name:"Ferro",rpReq:50, icon:"⚙️"},
  {key:"silver",name:"Prata",rpReq:150, icon:"🥈"},
  {key:"gold",name:"Ouro",rpReq:350, icon:"🥇"},
  {key:"platinum",name:"Platina",rpReq:700, icon:"💎"},
  {key:"adamantite",name:"Adamantita",rpReq:1200, icon:"🛡️"},
];

export default function AldoriaGuilds(){
  const [dbPlayerId,setDbPlayerId] = useState(null);
  const [user,setUser] = useState(null);
  const [day,setDay] = useState(1);
  const [hour,setHour] = useState(8);
  const [seasonIdx,setSeasonIdx] = useState(0);
  const season = SEASONS[seasonIdx % SEASONS.length];

  const [log,setLog] = useState([{ t:'success', msg:'Bem-vindo à Guilda!' }]);
  const [player,setPlayer] = useState({
    created:false, name:'',
    level:1, xp:0,
    hp:100, stamina: 100, power:10, trade:5, rp:0,
    talents:{ comercio:0, coleta:0, combate:0, crit:0, esquiva:0 },
    talentPts: 10,
    attrs:{ forca:0, destreza:0, vigor:0, arcano:0, carisma:0, sagacidade:0, points:10 },
    appearance:{ gender:'male', hair:'short_brown', skin:'light', face:'base', clazz:'warrior' },
    equip:{ weapon:null, armor:null, weaponDur:100, armorDur:100 },
    money: toBronze({ copper: 60 }),
    inventorySlots: 10,
    rank: 'bronze',
    abilityCD:0
  });
  const [inventory,setInventory] = useState({
    herb_common:0, ore_iron:0, leather_raw:0, potion_minor:1, arrows_20:0, repair_kit:1, dagger_iron:0, armor_leather:0
  });

  const [contracts,setContracts] = useState([]);
  const [activeContractId,setActiveContractId] = useState(null);
  const [prevPrices,setPrevPrices] = useState({});
  const [auction,setAuction] = useState({ lots:[], open:false });
  const [diary,setDiary] = useState({ contracts:0, coins:0, crafted:0, battlesWon:0, battlesLost:0 });
  const [modifiers,setModifiers] = useState({});
  const [priceHist,setPriceHist] = useState({});
  const [tab,setTab] = useState('principal');

  const STACK_SIZE = 100;
  function calcUsedSlots(inv){
    let used = 0;
    for (const [k,v] of Object.entries(inv||{})){
      const qty = Math.max(0, v|0);
      if (qty > 0) used += Math.ceil(qty / STACK_SIZE);
    }
    return used;
  }

  function addItem(idOrKey, qty, q='regular'){
    const key = idOrKey.includes('__') ? idOrKey : withQualityKey(idOrKey, q);
    setInventory(inv => {
      const before = inv[key] || 0;
      const toAdd = qty || 0;
      const newQty = before + toAdd;

      const usedBeforeTotal = calcUsedSlots(inv);
      const usedBeforeKey = Math.ceil(Math.max(0, before)/STACK_SIZE);
      const usedAfterKey  = Math.ceil(Math.max(0, newQty)/STACK_SIZE);
      const usedAfterTotal = usedBeforeTotal - usedBeforeKey + usedAfterKey;

      const slots = player?.inventorySlots ?? 10;
      if (usedAfterTotal > slots){
        pushLog({ t:'warn', msg:'Inventário cheio. Compre uma melhoria de mochila no Mercado.' });
        return inv;
      }
      return { ...inv, [key]: newQty };
    });
  }

  function removeItem(idOrKey,qty,q='regular'){
    const key = idOrKey.includes('__')?idOrKey:withQualityKey(idOrKey,q);
    setInventory(inv=>({...inv, [key]: Math.max(0,(inv[key]||0)-qty) }));
  }

  // === Utility functions ===
  function spend(amount){
    if(player.money < amount) return false;
    setPlayer(p => ({...p, money: p.money - amount}));
    return true;
  }

  function pushLog(entry){
    setLog(logs => [...logs, { ...entry, time: Date.now() }]);
  }

  function rollContract(rankKey, season){
    return {
      id: uid(),
      title: `Contrato de ${rankKey}`,
      status: 'disponivel',
      req: { ore_iron: 1 },
      reward: { money: 5 },
      expiresIn: 24
    };
  }

  // Rotating offers (mercado)
  const [rotatingOffers,setRotatingOffers] = useState([]);
  function rollOffers(){
    const offers = [];
    const count = 6;
    for(let i=0;i<count;i++){
      const it = ITEMS[rand(0,ITEMS.length-1)];
      const q = QUALITY_ORDER[rand(0,QUALITY_ORDER.length-1)];
      const qty = rand(1,4);
      const price = Math.round(it.base * qualityMult(q) * (0.9+Math.random()*0.4));
      offers.push({ id:uid(), item:it.id, name:it.name, icon:it.icon, q, qty, price, stock: rand(1,3) });
    }
    return offers;
  }
  useEffect(()=>{ if(hour % 6 === 0){ setRotatingOffers(rollOffers()); } }, [hour]);
  useEffect(()=>{ if(!rotatingOffers || rotatingOffers.length===0){ setRotatingOffers(rollOffers()); } }, []);

  function buyFromOffers(offerId){
    const offer = rotatingOffers.find(o=>o.id===offerId);
    if(!offer || offer.stock<=0) return;
    if(player.money < offer.price) return;
    setPlayer(p=>({...p, money: p.money - offer.price }));
    addItem(offer.item, offer.qty, offer.q);
    setRotatingOffers(rs=>rs.map(r=> r.id===offerId?{...r, stock:r.stock-1}:r));
  }

  const rankIdx = RANKS.findIndex(r => r.key === (player?.rank||'bronze'));

  const ctx = {
    player, day, hour, season, RANKS, rankIdx,
    inventory, inventorySlots: player.inventorySlots, inventoryUsedSlots: calcUsedSlots(inventory),
    contracts, setContracts, activeContractId, setActiveContractId,
    rotatingOffers, auction, diary, modifiers, priceHist, prevPrices, playerRank: player.rank, toBronze,
    ITEMS, RECIPES, QUALITY, QUALITY_ORDER, withQualityKey, parseQualityKey, qualityStyle,
    fmtMoney,
    buyFromOffers, addItem, removeItem,
    spend, pushLog, rollContract
  };

  return (
    <div className="p-2 md:p-4">
      <HeaderHUD user={user} player={player} day={day} hour={hour} season={season} rankIcon={RANKS[rankIdx].icon} rankName={RANKS[rankIdx].name} onRest={()=>{}} onLogout={()=>{}}/>
      <div className="flex gap-2 my-4">
        {["principal","guilda","mercado","leilao","crafting"].map(t=>(
          <button
            key={t}
            onClick={()=>setTab(t)}
            className={`px-3 py-1.5 rounded-xl border ${tab===t ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200 shadow' : 'border-zinc-700 bg-zinc-800/60 text-zinc-200'} transition-all flex items-center gap-2`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      {tab==='principal' && <TabPrincipalView ctx={ctx}/>}
      {tab==='guilda'    && <TabGuildaView    ctx={ctx}/>}
      {tab==='mercado'   && <TabMercadoView   ctx={ctx}/>}
      {tab==='leilao'    && <TabLeilaoView    ctx={ctx}/>}
      {tab==='crafting'  && <TabCraftingView  ctx={ctx}/>}
    </div>
  );
}
