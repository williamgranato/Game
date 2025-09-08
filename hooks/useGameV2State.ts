'use client';
import { useEffect, useState } from 'react';
import type { Rank } from '../data/ranks';
import { rankFromReputation } from '../data/ranks';

export function useGameV2State(){
  const [state,setState]=useState<any>({ player:{reputation:0}, activeMissions:[] });

  useEffect(()=>{
    // Sync missão ativa com o backend no load
    (async()=>{
      try{
        const res = await fetch('/api/missions/active');
        if(res.ok){
          const data = await res.json();
          if(data.active){
            setState((s:any)=>({...s, activeMissions:[data.active]}));
          }
        }
      }catch(e){}
    })();
  },[]);

  function playerRank(): Rank {
    return rankFromReputation(state.player.reputation);
  }

  async function startMissionServer(missionId:string, rank:Rank){
    try{
      const res = await fetch('/api/missions/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({missionId,rank})});
      if(!res.ok) throw new Error('fail');
      const data = await res.json();
      setState((s:any)=>({...s, activeMissions:[data.progress]}));
      return true;
    }catch(e){ return false; }
  }

  async function finishMissionServer(missionId:string){
    try{
      const res = await fetch('/api/missions/finish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({missionId})});
      const data = await res.json();
      if(res.ok){
        setState((s:any)=>({...s, activeMissions:[]}));
      }
      return data;
    }catch(e){ return null; }
  }

  return { state, setState, playerRank, startMissionServer, finishMissionServer };
}
