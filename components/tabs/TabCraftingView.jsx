
'use client';
import React from "react";

export default function TabCraftingView({ ctx }){
  const { RECIPES, ITEMS, fmtMoney, craft } = ctx;
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Crafting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {RECIPES.map(r=>(
          <div key={r.id} className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/50">
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-zinc-400">Requer: {Object.entries(r.req).map(([id,q])=>`${ITEMS.find(i=>i.id===id)?.name||id} x${q}`).join(", ")}</div>
            <div className="text-xs text-zinc-400">Dificuldade: {r.diff}</div>
            <div className="flex gap-2 pt-2"><button onClick={()=>craft(r.id)} className="btn text-sm">Craftar</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
