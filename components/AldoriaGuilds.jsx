
'use client';
import React, { useEffect, useMemo, useState } from "react";
import { QUALITY, QUALITY_ORDER, qualityMult, qualityStyle, withQualityKey, parseQualityKey, rollQuality } from "../lib/quality";
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
const BIOMES = ["Floresta Baixa","Campos de Lys","Serra de Karth"];

const ICONS = {
  forca: "/images/sword.svg",
  destreza: "/images/arrows.svg",
  vigor: "/images/armor.svg",
  arcano: "/images/potion.svg",
  carisma: "/images/leather.svg",
  sagacidade: "/images/herb.svg"
};

export default function AldoriaGuilds(){
  const [dbPlayerId,setDbPlayerId] = useState(null);
  const slot = 0;

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
    rank: 'bronze',
    abilityCD:0
  });
  const [inventory,setInventory] = useState({
    herb_common:0, ore_iron:0, leather_raw:0, potion_minor:1, arrows_20:0, repair_kit:1, dagger_iron:0, armor_leather:0
  });
  const [contracts,setContracts] = useState([]);
  const [modifiers,setModifiers] = useState({});
  const [auction,setAuction] = useState({ lots:[], open:false });
  const [prevPrices,setPrevPrices] = useState({});
  const [diary,setDiary] = useState({ contracts:0, coins:0, crafted:0, battlesWon:0, battlesLost:0 });
  const [priceHist,setPriceHist] = useState({});
  const [showDebug,setShowDebug] = useState(false);
  const [uiQuality, setUiQuality] = useState({});
  const [tab, setTab] = useState('principal');
  const [activeContractId, setActiveContractId] = useState(null);

  // ===== DB load (Player + GameState) =====
  useEffect(() => {
    (async () => {
      try {
        const resP = await fetch('/api/players');
        const arr = await resP.json();
        if (Array.isArray(arr) && arr.length > 0) {
          const p = arr[0];
          setDbPlayerId(p.id);
          setUser(p.name);
          setPlayer(prev => ({ ...prev, name: p.name, hp: p.hp, stamina: p.stamina, level: p.level, money: p.money, created: true }));
          localStorage.setItem('ag_player_id', String(p.id));

          const resS = await fetch(`/api/state?playerId=${p.id}&slot=${slot}`);
          const state = await resS.json();
          if (state && Object.keys(state).length) {
            state.day       != null && setDay(state.day);
            state.hour      != null && setHour(state.hour);
            state.seasonIdx != null && setSeasonIdx(state.seasonIdx);
            state.player    && setPlayer(state.player);
            state.inventory && setInventory(state.inventory);
            state.contracts && setContracts(state.contracts);
            state.modifiers && setModifiers(state.modifiers);
            state.auction   && setAuction(state.auction);
            state.prevPrices&& setPrevPrices(state.prevPrices);
            state.diary     && setDiary(state.diary);
            state.priceHist && setPriceHist(state.priceHist);
            state.rotatingOffers && setRotatingOffers(state.rotatingOffers||[]);
            state.activeContractId != null && setActiveContractId(state.activeContractId);
            state.tab       && setTab(state.tab);
            state.uiQuality && setUiQuality(state.uiQuality);
          }else{
            // inicializa quadro de contratos na 1ª vez
            setContracts(Array.from({length:6},()=>rollContract(player.rank, season)));
          }
        }
      } catch (e) { console.error('Falha ao carregar do banco:', e); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Autosave full state every 30s =====
  useEffect(() => {
    const id = dbPlayerId || Number(localStorage.getItem('ag_player_id'));
    if (!id) return;
    const t = setInterval(() => {
      const state = { day, hour, seasonIdx, player, inventory, contracts, modifiers, auction, prevPrices, diary, priceHist, rotatingOffers, activeContractId, tab, uiQuality };
      fetch('/api/state', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ playerId:id, slot, state }) });
      fetch('/api/players', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, name: player.name, level: player.level, hp: player.hp, stamina: player.stamina, money: player.money }) });
    }, 30000);
    return () => clearInterval(t);
  }, [dbPlayerId, day, hour, seasonIdx, player, inventory, contracts, modifiers, auction, prevPrices, diary, priceHist, activeContractId, tab, uiQuality]);

  const rankIdx = useMemo(()=>{ let i=0; for(let r=0;r<RANKS.length;r++) if(player.rp>=RANKS[r].rpReq) i=r; return i; }, [player.rp]);
  const rank = RANKS[rankIdx];

  const prices = useMemo(()=>{ const p={}; for(const it of ITEMS) p[it.id]=priceFor(it,day+hour/24,modifiers,season); return p; }, [day,hour,modifiers,season]);
  function unitPrice(id,q='regular'){ return Math.round(prices[id] * qualityMult(q)); }
  function pushLog(x){ setLog(l=>[ (typeof x==='string'?{t:'info',msg:x}:{t:x.t||'info',msg:x.msg}), ...l.slice(0,299) ]); }

  function priceFor(item, time, modifiers, season){
    const mod = modifiers[item.id]||1;
    const seasonal = (item.id.includes('herb')? season.herbMod : item.id.includes('ore')? season.oreMod : season.foodMod);
    const k = 0.12;
    const demand = 1 + 0.08*Math.sin(time/2);
    const price = item.base * (1 + k*(demand-1)) * mod * seasonal;
    return Math.round(clamp(price,item.base*0.6,item.base*2.2));
  }

  function weightedRand(pairs){const sum=pairs.reduce((a,[,w])=>a+w,0); let r=Math.random()*sum; for(const[v,w] of pairs){ if((r-=w)<=0) return v; } return pairs[0][0];}
  function rollContract(rankKey, season){
    const type = weightedRand([['coleta', season.key==='primavera'?3:1], ['caca',2], ['escolta', season.key==='inverno'?3:2], ['entrega',2], ['producao',2]]);
    const biome=BIOMES[rand(0,BIOMES.length-1)];
    const stars= Math.min(5, Math.max(1, {bronze:rand(1,2),iron:rand(2,3),silver:rand(2,4),gold:rand(3,5),platinum:rand(3,5),adamantite:5}[rankKey]||1 ));
    const distance=rand(1,4), qty=rand(6,24), time=rand(4,12);
    const risk=stars*(1+distance*0.2);
    const baseReward=Math.round((50+stars*40+distance*30)*(1+Math.random()));
    const penalty=Math.round(baseReward*0.25);
    const expiresIn = rand(16,48);
    return { id:uid(), title:`${type.toUpperCase()} em ${biome}`, type, biome, stars, distance, qty, time, risk, reward:baseReward, penalty, status:'disponivel', progress:0, expiresIn, expiresTotal:expiresIn };
  }

  function earn(b){ setPlayer(p=>({...p, money: p.money + b })); setDiary(d=>({...d, coins:d.coins + b })); }
  function spend(b){ if(player.money<b) return false; setPlayer(p=>({...p, money: p.money - b })); return true; }
  function addItem(idOrKey,qty,q='regular'){ const key=idOrKey.includes('__')?idOrKey:withQualityKey(idOrKey,q); setInventory(inv=>({...inv, [key]: (inv[key]||0)+qty })); }
  function removeItem(idOrKey,qty,q='regular'){ const key=idOrKey.includes('__')?idOrKey:withQualityKey(idOrKey,q); setInventory(inv=>({...inv, [key]: Math.max(0,(inv[key]||0)-qty) })); }

  function advance(hours=1, activeId=null){
    let h=hour+hours, d=day;
    while(h>=24){ h-=24; d+=1; dailyTick(d); }
    setHour(h); setDay(d);
    setContracts(cs=>cs.map(c=>{
      const expiresIn=Math.max(0, c.expiresIn - hours);
      if(c.status==='aceito'){
        const add = (activeId && c.id===activeId) ? hours : 0;
        const progress=clamp(c.progress + add, 0, c.time);
        return { ...c, progress, expiresIn };
      }
      const status = (expiresIn<=0 && c.status==='disponivel') ? 'expirado' : c.status;
      return { ...c, expiresIn, status };
    }));
    if(player.abilityCD>0) setPlayer(p=>({...p, abilityCD: Math.max(0,p.abilityCD-hours)}));
    if(hours>=6) setPlayer(p=>({...p, stamina: clamp((p.stamina??100)+10, 0, 100)}));
    pushLog({t:'info',msg:`O tempo passou ${hours}h${activeId?` (trabalho no contrato ativo)`:''}.`});
  }

  function dailyTick(newDay){
    if((newDay-1)%10===0 && newDay>1){ setSeasonIdx(i=>i+1); pushLog({t:'info',msg:'Mudança de estação!'}); }
    const i = ITEMS[rand(0,ITEMS.length-1)];
    const shock = rand(0,1) ? 1+Math.random()*0.35 : 1-Math.random()*0.25;
    setModifiers(m=>({...m,[i.id]: Math.max(0.6, Math.min(1.8, (m[i.id]||1)*shock)) }));
    setPrevPrices(()=>prices);
    setPriceHist(h=>{ const nh={...h}; for(const it of ITEMS){ const arr=[...(nh[it.id]||[]), prices[it.id]]; nh[it.id]=arr.slice(-7); } return nh; });
    if((newDay%7)===1) openAuction();
    if((newDay%7)===3) closeAuctionAuto();
    setContracts(cs=>{ const kept=cs.filter(c=>c.status!=='expirado'); while(kept.length<6) kept.push(rollContract(rank.key,season)); return kept; });
    pushLog({t:'info',msg:`Caravana alterou oferta de ${i.name}.`});
  }

  function openAuction(){ const lots=[0,1,2].map(()=>{ const it=ITEMS[rand(0,ITEMS.length-1)]; return { id:uid(), item:it.id, name:it.name, price: Math.round(it.base*(1.4+Math.random()*0.8)), sold:false }; }); setAuction({ lots, open:true }); pushLog({t:'info',msg:'Leilão semanal aberto!'}); }
  function closeAuctionAuto(){ setAuction(a=>({...a,open:false})); pushLog({t:'info',msg:'Leilão encerrado.'}); }
  function buyLot(lid){ setAuction(a=>{ const lot=a.lots.find(l=>l.id===lid); if(!lot||lot.sold) return a; const cost=lot.price*(1 - (player?.talents?.comercio||0)*0.02); if(!spend(Math.round(cost))){ pushLog({t:'error',msg:'Moedas insuficientes.'}); return a; } addItem(lot.item,1, 'regular'); pushLog({t:'success',msg:`Arrematou ${lot.name} por ${fmtMoney(Math.round(cost))}.`}); return {...a, lots:a.lots.map(l=>l.id===lid?{...l,sold:true}:l)}; }); }

  function buy(id,qty=1,q='regular'){ const price = unitPrice(id,q)*qty*(1- ((player?.trade||0) + (player?.talents?.comercio||0)*3)*0.003 ); const cost=Math.round(price); if(!spend(cost)){ pushLog({t:'error',msg:'Moedas insuficientes.'}); return; } addItem(id,qty,q); pushLog({t:'success',msg:`Comprou ${qty}x ${ITEMS.find(i=>i.id===id)?.name} (${QUALITY[q].name}) por ${fmtMoney(cost)}.`}); }
  function sell(idOrKey,qty=1,q=null){ let key=idOrKey; if(!key.includes('__')) key = withQualityKey(idOrKey, q||'regular'); if((inventory[key]||0)<qty){ pushLog({t:'warn',msg:'Você não tem itens suficientes desta qualidade.'}); return; } const {id, q:_q} = parseQualityKey(key); const gain = Math.round(unitPrice(id,_q) * qty * (0.8 + ((player?.trade||0) + (player?.talents?.comercio||0) * 3) * 0.002)); removeItem(key,qty); earn(gain); pushLog({t:'success',msg:`Vendeu ${qty}x ${ITEMS.find(i=>i.id===id)?.name} (${QUALITY[_q].name}) por ${fmtMoney(gain)}.`}); }

  function craft(rid){
    const r=RECIPES.find(x=>x.id===rid); if(!r) return;
    for(const [id,need] of Object.entries(r.req)) if(((inventory[id]||0) + (inventory[withQualityKey(id,'regular')]||0)) < need){ pushLog({t:'warn',msg:'Materiais insuficientes.'}); return; }
    for(const [id,need] of Object.entries(r.req)){
      let remain=need;
      const keyReg = id;
      const keyQual = withQualityKey(id,'regular');
      const haveReg = inventory[keyReg]||0;
      const takeReg = Math.min(haveReg, remain);
      if(takeReg>0){ removeItem(keyReg, takeReg); remain -= takeReg; }
      if(remain>0){ const haveKey = inventory[keyQual]||0; const take = Math.min(haveKey, remain); if(take>0){ removeItem(keyQual, take); remain -= take; } }
    }
    const skill = (player?.talents?.coleta||0) * 5;
    const pass = Math.random()*100 < (60 + skill - r.diff);
    if(pass){
      const q = rollQuality((player?.talents?.coleta||0) * 0.05);
      addItem(r.makes, r.qty, q);
      pushLog({ t:'success', msg:`Crafting concluído: ${r.name} (${QUALITY[q].name}).` });
      setDiary(d=>({...d, crafted:d.crafted+1 }));
    }else{
      pushLog({ t:'error', msg:'Falha no crafting. Materiais perdidos.' });
    }
  }

  function bestVariantKey(baseId){
    for(let i=QUALITY_ORDER.length-1;i>=0;i--){
      const key = withQualityKey(baseId, QUALITY_ORDER[i]);
      if((inventory[key]||0)>0) return key;
    }
    if((inventory[baseId]||0)>0) return baseId;
    return null;
  }
  function equipItem(baseId){
    const key = bestVariantKey(baseId); if(!key){ pushLog({t:'warn',msg:'Você não possui esse item.'}); return; }
    const { q } = parseQualityKey(key);
    if(baseId==='dagger_iron') setPlayer(p=>({...p, equip:{...p.equip, weapon:key, weaponDur:100 }}));
    if(baseId==='armor_leather') setPlayer(p=>({...p, equip:{...p.equip, armor:key,  armorDur:100 }}));
    pushLog({t:'success',msg:`Equipou ${ITEMS.find(i=>i.id===baseId)?.name} (${QUALITY[q].name}).`});
  }
  function repair(){ if((inventory.repair_kit||0)<=0){ pushLog({t:'warn',msg:'Sem Kit de Reparos.'}); return; } setPlayer(p=>({...p, equip:{...p.equip, weaponDur:Math.min(100,(p.equip?.weaponDur??0)+30), armorDur:Math.min(100,(p.equip?.armorDur??0)+30)}})); removeItem('repair_kit',1); pushLog({t:'info',msg:'Reparos realizados (+30 durabilidade).'}); }

  function useAbility(){ if((player?.abilityCD||0)>0){ pushLog({t:'warn',msg:'Habilidade em recarga.'}); return; } setPlayer(p=>({...p,abilityCD:6})); pushLog({t:'info',msg:'Golpe Poderoso preparado (+25% poder no próximo combate).'}); }
  function drinkPotion(){ if((inventory.potion_minor||0)<=0){ pushLog({t:'warn',msg:'Sem poções.'}); return; } removeItem('potion_minor',1); setPlayer(p=>({...p,hp:Math.min(100,(p.hp??100)+35),stamina:100})); pushLog({t:'info',msg:'Poção menor utilizada.'}); }
  function rest(h=6){ const cost=toBronze({copper:3}); if(!spend(cost)){ pushLog({t:'warn',msg:'Sem moedas para a hospedaria.'}); return; } setPlayer(p=>({...p,hp:Math.min(100,(p.hp??100)+40),stamina:100})); advance(h, null); pushLog({t:'info',msg:`Descansou ${h}h. Custo ${fmtMoney(cost)}.`}); }

  function gainXP(amount){
    setPlayer(p=>{
      let xp=(p.xp??0)+amount, level=(p.level??1), talentPts=(p.talentPts??0);
      let req = 100 + (level-1)*50;
      const ev=[];
      while(xp>=req){ xp-=req; level+=1; talentPts+=1; ev.push(`Subiu para o nível ${level}! +1 ponto de talento.`); req = 100 + (level-1)*50; }
      if(ev.length) ev.forEach(e=>pushLog({t:'success',msg:e}));
      return {...p, xp, level, talentPts};
    });
  }

  function resolveCombat(player, risk, ability){
    let power = (player?.power||0) + (player?.talents?.combate||0)*3;
    if(player?.equip?.weapon){
      const { q } = parseQualityKey(player.equip.weapon);
      if(player.equip.weapon.includes('dagger_iron')) power += 6;
      power += {regular:0,incomum:1,raro:2,epico:4,lendario:6,mitico:8,divino:10}[q]||0;
    }
    if(ability==='golpe') power *= 1.25;
    const critChance = 0.05 + (player?.talents?.crit||0)*0.02;
    const dodge = 0.03 + (player?.talents?.esquiva||0)*0.015;
    const roll = Math.random()*(power + risk*12);
    const threshold = 28 + risk*12;
    let crit = Math.random() < critChance;
    let win = roll >= threshold || crit;
    let wounds = Math.random() < (win ? 0.25*(1-dodge) : 0.6*(1-dodge));
    return { win, wounds, crit, roll, threshold, power, critChance, dodge };
  }

  function resolveContract(id){
    const c=contracts.find(x=>x.id===id); if(!c || c.status!=='aceito'){ pushLog({t:'warn',msg:'Contrato inválido.'}); return; }
    if(c.progress<c.time){ pushLog({t:'warn',msg:'Ainda não há progresso suficiente.'}); return; }

    let success=true, reward=c.reward, rpGain=Math.max(1, c.stars*2);
    if(c.type==='caca'){
      const outcome = resolveCombat(player, c.risk, (player?.abilityCD??0)===0?'golpe':null);
      success = outcome.win; if(!success) reward = 0;
      if(outcome.wounds) setPlayer(p=>({...p, hp: Math.max(0, Math.min(100, (p.hp??100) - rand(5,20))) }));
      if(outcome.crit) rpGain += 1;
      setPlayer(p=>({...p, equip:{...p.equip, weaponDur: Math.max(0,(p.equip?.weaponDur??0) - rand(5,12)), armorDur: Math.max(0,(p.equip?.armorDur??0) - rand(3,8))}}));
      if((player?.abilityCD??0)===0) setPlayer(p=>({...p, abilityCD: 6 }));
    }else if(c.type==='coleta'){
      const dropId = rand(0,1) ? 'herb_common' : 'ore_iron';
      const bonus = (player?.talents?.coleta||0) * 0.03;
      const got = Math.round(rand(Math.floor(c.qty*0.6), c.qty) * (1 + (player?.talents?.coleta||0) * 0.1));
      for(let i=0;i<got;i++){ const q = rollQuality(bonus); addItem(dropId,1,q); }
      pushLog({t:'success',msg:`Você coletou ${got}x ${ITEMS.find(i=>i.id===dropId)?.name} (qualidades variadas).`});
    }else if(c.type==='producao'){
      const need = { leather_raw: Math.ceil(c.qty/3), ore_iron: Math.ceil(c.qty/4) };
      const missing = Object.entries(need).filter(([id,q]) => ((inventory[id]||0) + (inventory[withQualityKey(id,'regular')]||0)) < q);
      if(missing.length){ pushLog({t:'warn',msg:'Faltam materiais para produção.'}); return; }
      for(const [id,need] of Object.entries(need)){
        let remain=need;
        const keyReg = id;
        const keyQual = withQualityKey(id,'regular');
        const haveReg = inventory[keyReg]||0;
        const takeReg = Math.min(haveReg, remain);
        if(takeReg>0){ removeItem(keyReg, takeReg); remain -= takeReg; }
        if(remain>0){ const haveKey = inventory[keyQual]||0; const take = Math.min(haveKey, remain); if(take>0){ removeItem(keyQual, take); remain -= take; } }
      }
    }else if(c.type==='escolta'||c.type==='entrega'){
      const ambush = Math.random() < 0.35*(c.stars/5);
      if(ambush){
        const outcome = resolveCombat(player, c.risk+1, (player?.abilityCD??0)===0?'golpe':null);
        success = outcome.win;
        if(outcome.wounds) setPlayer(p=>({...p, hp: Math.max(0, Math.min(100, (p.hp??100) - rand(10,25))) }));
        setPlayer(p=>({...p, equip:{...p.equip, weaponDur: Math.max(0,(p.equip?.weaponDur??0) - rand(3,9)), armorDur: Math.max(0,(p.equip?.armorDur??0) - rand(4,10))}}));
        if((player?.abilityCD??0)===0) setPlayer(p=>({...p, abilityCD: 6 }));
      }
    }

    if(success){
      const early = c.expiresIn > c.expiresTotal*0.5;
      const bonus = early ? Math.round(reward*0.1) : 0;
      const tax = Math.round((reward+bonus)*0.1);
      earn(reward + bonus - tax);
      setPlayer(p=>({...p, rp: (p.rp??0) + rpGain }));
      setDiary(d=>({...d, contracts:d.contracts+1, battlesWon: d.battlesWon + (c.type==='caca' ? 1:0)}));
      gainXP(c.stars*20);
      pushLog({t:'success',msg:`Contrato concluído! Recompensa ${fmtMoney(reward - tax)}${bonus?` + bônus ${fmtMoney(bonus)}`:''} (taxa 10%). RP +${rpGain}.`});
    }else{
      const penalty=c.penalty; spend(penalty); setDiary(d=>({...d, battlesLost:d.battlesLost + (c.type==='caca' ? 1:0)}));
      pushLog({t:'error',msg:`Falha no contrato. Penalidade ${fmtMoney(penalty)}.`});
    }
    setContracts(cs=>cs.map(x=>x.id===id?{...x,status:'concluido'}:x));
  }

  // Rotating offers each 6h
  const [rotatingOffers,setRotatingOffers] = useState([]);
  function rollOffers(){
    const offers = [];
    const count = 6;
    for(let i=0;i<count;i++){
      const it = ITEMS[rand(0,ITEMS.length-1)];
      const q = QUALITY_ORDER[rand(0,QUALITY_ORDER.length-1)];
      const qty = rand(1,4);
      const price = Math.round((prices[it.id]||it.base) * qualityMult(q) * (0.9+Math.random()*0.4));
      offers.push({ id:uid(), item:it.id, name:it.name, icon:it.icon, q, qty, price, stock: rand(1,3) });
    }
    return offers;
  }
  useEffect(()=>{ if(hour % 6 === 0){ setRotatingOffers(rollOffers()); } }, [hour]);
  useEffect(()=>{ if(!rotatingOffers || rotatingOffers.length===0){ setRotatingOffers(rollOffers()); } }, []);

  function buyFromOffers(offerId){
    const offer = rotatingOffers.find(o=>o.id===offerId);
    if(!offer || offer.stock<=0){ pushLog({t:'warn', msg:'Oferta indisponível.'}); return; }
    const cost = offer.price;
    if(!spend(cost)){ pushLog({t:'error', msg:'Moedas insuficientes.'}); return; }
    addItem(offer.item, 1, offer.q);
    setRotatingOffers(arr=>arr.map(o=>o.id===offerId?{...o, stock:o.stock-1}:o));
    pushLog({t:'success', msg:`Comprou 1x ${offer.name} (${QUALITY[offer.q].name}) por ${fmtMoney(cost)}.`});
  }

  function AuthScreen(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    function doFake(){
      setUser('Aventureiro');
      setPlayer(p=>({...p, created:true, name:'Aventureiro'}));
      setContracts(Array.from({length:6},()=>rollContract('bronze', season)));
    }
    return (
      <div className="max-w-md mx-auto card mt-10">
        <h1 className="text-2xl font-bold mb-2">Aldória Guilds</h1>
        <p className="text-zinc-400 text-sm mb-4">Login/Registro local (temporário). Criação vira banco quando confirmar personagem.</p>
        <button className="btn btn-good w-full" onClick={doFake}>Entrar</button>
      </div>
    );
  }

  function CreationScreen(){
    const defaultAttrs = { forca:0,destreza:0,vigor:0,arcano:0,carisma:0,sagacidade:0, points:10 };
    const [name,setName] = useState(player?.name || '');
    const [attrs,setAttrs] = useState(player?.attrs || defaultAttrs);
    const [appearance,setAppearance] = useState(player?.appearance || { gender:'male', clazz:'warrior' });

    function addAttr(k,delta){
      if(delta>0 && attrs.points<=0) return;
      if(delta<0 && attrs[k]<=0) return;
      setAttrs(a=>({...a, [k]: a[k]+delta, points: a.points - delta}));
    }
    function classHint(c){
      if(c==='warrior') return 'Guerreiro: +2 Força, +1 Vigor. Item inicial: Adaga.';
      if(c==='rogue') return 'Ladino: +2 Destreza, +1 Sagacidade. Item inicial: Poção.';
      if(c==='mage') return 'Mago: +2 Arcano, +1 Sagacidade. Item inicial: Poção.';
      return '';
    }
    async function confirm(){
      if(!name.trim()){ return; }
      const mods = { forca:0, destreza:0, vigor:0, arcano:0, sagacidade:0 };
      if(appearance.clazz==='warrior'){ mods.forca+=2; mods.vigor+=1; }
      if(appearance.clazz==='rogue'){ mods.destreza+=2; mods.sagacidade+=1; }
      if(appearance.clazz==='mage'){ mods.arcano+=2; mods.sagacidade+=1; }
      const final = {
        forca: attrs.forca+mods.forca,
        destreza: attrs.destreza+mods.destreza,
        vigor: attrs.vigor+mods.vigor,
        arcano: attrs.arcano+mods.arcano,
        carisma: attrs.carisma,
        sagacidade: attrs.sagacidade+mods.sagacidade,
        points: 0
      };
      setPlayer(p=>({...p, name, attrs:final, appearance, created:true,
        power: 10 + final.forca*2 + final.destreza,
        trade: 5 + Math.floor(final.sagacidade/2),
        hp: 100 + final.vigor*5
      }));
      // create DB record for player
      try{
        const res = await fetch('/api/players', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, level:1, hp:100, stamina:100, money: player.money })});
        const created = await res.json();
        setDbPlayerId(created.id);
        localStorage.setItem('ag_player_id', String(created.id));
        // contratos iniciais
        setContracts(Array.from({length:6},()=>rollContract('bronze', season)));
      }catch(e){ console.error(e); }
    }

    const rows = [
      ['forca','Força'],['destreza','Destreza'],['vigor','Vigor'],
      ['arcano','Arcano'],['carisma','Carisma'],['sagacidade','Sagacidade']
    ];

    return (
      <div className="max-w-6xl mx-auto bg-zinc-900/70 p-8 rounded-2xl shadow-xl space-y-6 border border-yellow-700 mt-10">
        <h2 className="text-2xl font-bold text-yellow-300 text-center">Criação de Personagem</h2>

        <div className="flex justify-center">
          <div className="card mb-4 w-80">
            <label className="block mb-1 text-sm text-zinc-300">Nome do Aventureiro</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Digite o nome..." className="w-full px-3 py-2 rounded bg-zinc-800 outline-none" />
          </div>
          <div className="ml-6">
            <img src={appearance.gender==='female'?'/images/avatar_f.svg':'/images/avatar_m.svg'} width={64} height={64} alt="avatar" className="rounded-xl border border-zinc-800"/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="font-semibold mb-2">Aparência</div>
            <div className="flex gap-2 mb-2">
              <button className={`btn ${appearance.gender==='male'?'btn-primary':''}`} onClick={()=>setAppearance(a=>({...a,gender:'male'}))}>Masculino</button>
              <button className={`btn ${appearance.gender==='female'?'btn-primary':''}`} onClick={()=>setAppearance(a=>({...a,gender:'female'}))}>Feminino</button>
            </div>
            <div className="text-xs text-zinc-400">Mais opções em breve.</div>
            <div className="mt-3">
              <div className="font-semibold mb-2">Classe</div>
              {['warrior','rogue','mage'].map(c=>(
                <label key={c} className={`flex items-start gap-2 p-3 rounded-xl border ${appearance.clazz===c?'border-yellow-500 bg-yellow-500/10':'border-zinc-700'}`}>
                  <input type="radio" checked={appearance.clazz===c} onChange={()=>setAppearance(a=>({...a,clazz:c}))} className="mt-1"/>
                  <div>
                    <div className="capitalize font-medium">{c}</div>
                    <div className="text-xs text-zinc-400">{classHint(c)}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card md:col-span-2">
            <div className="font-semibold mb-2">Atributos (10 pts)</div>
            {rows.map(([k,label])=>(
              <div key={k} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={ICONS[k]} alt="" className="w-5 h-5 opacity-90"/>
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-zinc-400">
                      {k==='forca' && 'Aumenta o poder físico.'}
                      {k==='destreza' && 'Melhora acerto e velocidade.'}
                      {k==='vigor' && 'Aumenta HP máximo.'}
                      {k==='arcano' && 'Magias e habilidades.'}
                      {k==='carisma' && 'Negociação/eventos sociais.'}
                      {k==='sagacidade' && 'Eficiência em comércio/coleta.'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn" onClick={()=>addAttr(k,-1)}>-</button>
                  <div className="text-lg w-8 text-center">{attrs[k]}</div>
                  <button className="btn" onClick={()=>addAttr(k,1)}>+</button>
                </div>
              </div>
            ))}
            <div className="mt-2">Pontos restantes: <span className="badge badge-info">{attrs.points}</span></div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn btn-danger" onClick={()=>setAttrs(defaultAttrs)}>Resetar</button>
          <button className="btn btn-good" onClick={confirm}>Confirmar</button>
        </div>
      </div>
    );
  }

  if(!user) return <AuthScreen/>;
  if(!player.created) return <CreationScreen/>;

  const ctx = {
    player, day, hour, season, RANKS, rankIdx, ICONS,
    inventory, uiQuality, setUiQuality,
    contracts, setContracts, activeContractId, setActiveContractId,
    rotatingOffers, auction, diary, modifiers, priceHist, prevPrices, rank, toBronze,
    ITEMS, RECIPES, QUALITY, QUALITY_ORDER, withQualityKey, parseQualityKey, qualityStyle,
    fmtMoney, unitPrice, pushLog,
    buy, sell, equipItem, drinkPotion, useAbility, repair, craft,
    advance, resolveContract, spend, buyFromOffers, buyLot, rollContract,
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <HeaderHUD
          user={user}
          player={player}
          day={day}
          hour={hour}
          season={season}
          rankIcon={RANKS[rankIdx].icon}
          rankName={RANKS[rankIdx].name}
          onRest={()=>{ const cost=toBronze({copper:3}); if(!spend(cost)){ pushLog({t:'warn',msg:'Sem moedas para a hospedaria.'}); return; } setPlayer(p=>({...p,hp:Math.min(100,(p.hp??100)+40),stamina:100})); advance(6, null); pushLog({t:'info',msg:`Descansou 6h. Custo ${fmtMoney(cost)}.`}); }}
          onLogout={()=>{ localStorage.removeItem('ag_session'); location.reload(); }}
        />

        <nav className="flex gap-2 flex-wrap mt-2">
          {['principal','guilda','mercado','leilao','crafting'].map(t=>(
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-xl border ${
                tab===t
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200 shadow'
                  : 'border-zinc-700 bg-zinc-800/60 text-zinc-200'
              } transition-all flex items-center gap-2`}
            >
              {t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
        </nav>

        {tab==='principal' && <TabPrincipalView ctx={ctx}/>}
        {tab==='guilda'    && <TabGuildaView    ctx={ctx}/>}
        {tab==='mercado'   && <TabMercadoView   ctx={ctx}/>}
        {tab==='leilao'    && <TabLeilaoView    ctx={ctx}/>}
        {tab==='crafting'  && <TabCraftingView  ctx={ctx}/>}

        <div className="card">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Registro</h2><button onClick={()=>setShowDebug(!showDebug)} className="btn">{showDebug?'Fechar Debug':'Abrir Debug'}</button></div>
          {showDebug ? (
            <pre className="text-xs whitespace-pre-wrap">
{JSON.stringify({time:{day,hour,season:season.name}, player, prices, prevPrices, contracts, modifiers, priceHist, diary, rotatingOffers, activeContractId}, null, 2)}
            </pre>
          ) : <div className="text-sm text-zinc-400">Abra para ver estados internos.</div>}
        </div>

        <footer className="text-center text-xs text-zinc-500 pt-2">Protótipo — salva no SQLite e restaura na inicialização. Visual com Tailwind e imagens locais.</footer>
      </div>
    </div>
  );
}
