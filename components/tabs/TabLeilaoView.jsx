
'use client';
import React from "react";

export default function TabLeilaoView({ ctx }){
  const { auction, ITEMS, fmtMoney, buyLot } = ctx;
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Leilão Semanal</h2>
      {auction.open ? (
        <div className="space-y-2">
          {auction.lots.map(lot=>(
            <div key={lot.id} className="flex items-center justify-between border border-zinc-800 rounded-xl p-2 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <img src={ITEMS.find(i=>i.id===lot.item)?.icon} alt="" className="w-6 h-6"/>
                <div className="text-sm">{lot.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-zinc-400">{fmtMoney(lot.price)}</div>
                <button disabled={lot.sold} onClick={()=>buyLot(lot.id)} className="btn disabled:opacity-40 text-sm">Arrematar</button>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-sm text-zinc-300">Fechado. Abre a cada 7 dias e fecha em 2 dias.</div>}
    </div>
  );
}
