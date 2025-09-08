'use client';
import { useEffect, useState } from 'react';
export type Wallet = { gold:number; silver:number; bronze:number; copper:number };
export type Player = { name:string; level:number; exp:number; stamina:number; reputation:number; vipUntil?: number|null; };
export type AuctionLot = { id:string; item:string; qty:number; price:{gold?:number; silver?:number; bronze?:number; copper?:number}; seller:string; expiresAt:number };
export type ActiveMission = { missionId:string; endsAt:number };

const DEFAULT_STATE = {
  player: { name:'Aventureiro', level:1, exp:0, stamina:100, reputation:0, vipUntil:null } as Player,
  wallet: { gold:0, silver:50, bronze:0, copper:0 } as Wallet,
  skills: {} as Record<string, number>,
  auction: [] as AuctionLot[],
  activeMissions: [] as ActiveMission[],
  inventory: {} as Record<string, number>,
  logs: [] as string[]
};

export function useGameV2State(){
  const [state,setState]=useState<typeof DEFAULT_STATE>(DEFAULT_STATE);
  useEffect(()=>{
    const raw = localStorage.getItem('game_v2_state');
    if(raw){ try{ setState(JSON.parse(raw)); }catch{} }
  },[]);
  useEffect(()=>{
    localStorage.setItem('game_v2_state', JSON.stringify(state));
  },[state]);

  function addLog(msg:string){ setState(s=>({...s, logs:[`[${new Date().toLocaleTimeString()}] ${msg}`, ...s.logs].slice(0,100)})); }
  function spendStamina(n:number){ if(state.player.stamina<n) return false; setState(s=>({...s, player:{...s.player, stamina:s.player.stamina-n}})); return true; }
  function addMoney(delta:Partial<Wallet>){ setState(s=>({...s, wallet:{
    gold:(s.wallet.gold||0)+(delta.gold||0),
    silver:(s.wallet.silver||0)+(delta.silver||0),
    bronze:(s.wallet.bronze||0)+(delta.bronze||0),
    copper:(s.wallet.copper||0)+(delta.copper||0) }})); }
  function addExp(n:number){
    setState(s=>{
      let level=s.player.level, exp=s.player.exp+n; 
      while(exp>=100+level*50){ exp -= (100+level*50); level++; }
      return {...s, player:{...s.player, exp, level}};
    });
  }
  function addItem(name:string, qty:number){ setState(s=>({...s, inventory:{...s.inventory, [name]:(s.inventory[name]||0)+qty}})); }
  function upgradeSkill(id:string, cost:number){
    if(state.wallet.silver < cost) return false;
    setState(s=>({...s, wallet:{...s.wallet, silver:s.wallet.silver-cost}, skills:{...s.skills, [id]:(s.skills[id]||0)+1}}));
    addLog(`Habilidade ${id} melhorada.`);
    return true;
  }
  function startMission(missionId:string, durationMin:number, staminaCost:number){
    if(!spendStamina(staminaCost)) return false;
    const endsAt = Date.now()+durationMin*60*1000;
    setState(s=>({...s, activeMissions:[...s.activeMissions, {missionId, endsAt}]}));
    addLog(`Missão ${missionId} iniciada.`);
    return true;
  }
  function finishMission(missionId:string, rewards:any){
    setState(s=>({...s, activeMissions:s.activeMissions.filter(m=>m.missionId!==missionId)}));
    if(rewards.gold) addMoney({gold:rewards.gold});
    if(rewards.silver) addMoney({silver:rewards.silver});
    if(rewards.bronze) addMoney({bronze:rewards.bronze});
    if(rewards.copper) addMoney({copper:rewards.copper});
    if(rewards.exp) addExp(rewards.exp);
    if(rewards.items) rewards.items.forEach((it:string)=>addItem(it,1));
    if(rewards.reputation) setState(s=>({...s, player:{...s.player, reputation:s.player.reputation+(rewards.reputation||0)}}));
    addLog(`Missão ${missionId} concluída!`);
  }
  function listActive(){ return state.activeMissions; }
  function addAuction(lot:AuctionLot){ setState(s=>({...s, auction:[lot, ...s.auction]})); }
  function buyAuction(id:string){
    setState(s=>({...s, auction:s.auction.filter(a=>a.id!==id)}));
    addLog(`Lote ${id} comprado.`);
  }
  return { state, setState, addLog, addMoney, addExp, addItem, upgradeSkill, startMission, finishMission, listActive, addAuction, buyAuction };
}  
