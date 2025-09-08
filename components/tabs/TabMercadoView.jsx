
'use client';
import React from "react";

export default function TabMercadoView({ ctx }){
  const { rotatingOffers, QUALITY, qualityStyle, fmtMoney, buyFromOffers } = ctx;
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Mercado (ofertas a cada 6h)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rotatingOffers.map(o=>(
          <div key={o.id} className={`border rounded-xl p-3 bg-zinc-900/60 ${qualityStyle(o.q).border}`}>
            <div className="flex items-center gap-2">
              <img src={o.icon} className="w-8 h-8 border border-zinc-700 rounded" alt=""/>
              <div className="font-medium">{o.name} <span className={`${qualityStyle(o.q).text}`}>({QUALITY[o.q].name})</span></div>
            </div>
            <div className="text-xs text-zinc-400 mt-1">Preço: {fmtMoney(o.price)} · Estoque: {o.stock}</div>
            <div className="mt-2"><button disabled={o.stock<=0} onClick={()=>buyFromOffers(o.id)} className="btn btn-good disabled:opacity-40">Comprar</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
