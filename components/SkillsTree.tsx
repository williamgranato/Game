'use client';
import { SKILLS } from '../data/skills';
import { useGameV2State } from '../hooks/useGameV2State';
import React from 'react';

export default function SkillsTree(){
  const { state, upgradeSkill } = useGameV2State();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Árvore de Habilidades</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {SKILLS.map(s => {
          const current = (state.skills || {})[s.id] || 0;
          const can = current < s.maxLevel;
          return (
            <div key={s.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{s.name} <span className="text-xs opacity-70">({s.branch})</span></h3>
                  <p className="text-sm opacity-80">{s.bonus}</p>
                </div>
                <div className="text-sm">Nv. {current}/{s.maxLevel}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button disabled={!can} onClick={()=>upgradeSkill(s.id, s.cost)} className={"px-3 py-1.5 rounded-xl border " + (can ? "bg-indigo-700/70 hover:bg-indigo-700 border-indigo-600/50" : "bg-zinc-800 border-zinc-700 opacity-60 cursor-not-allowed")}>
                  Melhorar (⨯ {s.cost} prata)
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
