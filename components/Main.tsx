'use client';
import React, { useState } from 'react';
import ThemeFrame from './ThemeFrame';
import HeaderStatus from './HeaderStatus';
import GuildMissions from './GuildMissions';
import SkillsTree from './SkillsTree';
import ReputationPanel from './ReputationPanel';
import AuctionHouse from './AuctionHouse';
import Bestiary from './Bestiary';
import EventsBoard from './EventsBoard';
import SidebarHUD from './SidebarHUD';
import ActivityLog from './ActivityLog';

const TABS = [
  { id:'guild', name:'Guilda' },
  { id:'skills', name:'Habilidades' },
  { id:'auction', name:'Leilão' },
  { id:'bestiary', name:'Bestiário' },
  { id:'events', name:'Eventos' },
];

export default function Main(){
  const [tab,setTab]=useState('guild');
  return (
    <ThemeFrame>
      <HeaderStatus/>
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4 shadow-2xl">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={"px-3 py-1.5 rounded-xl border " + (tab===t.id ? "bg-amber-700/70 border-amber-600/50" : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800") }>{t.name}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2 space-y-4">
            {tab==='guild' && (<><GuildMissions/><ReputationPanel/></>)}
            {tab==='skills' && (<SkillsTree/>)}
            {tab==='auction' && (<AuctionHouse/>)}
            {tab==='bestiary' && (<Bestiary/>)}
            {tab==='events' && (<EventsBoard/>)}
          </div>
          <div className="md:col-span-1 space-y-4">
            <SidebarHUD/>
            <ActivityLog/>
          </div>
        </div>
      </div>
    </ThemeFrame>
  );
}
