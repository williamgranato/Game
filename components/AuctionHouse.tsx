'use client';
import React, { useState } from 'react';
import { useGameV2State } from '../hooks/useGameV2State';

export default function AuctionHouse(){
  const { state, addAuction, buyAuction } = useGameV2State();
  const [item,setItem]=useState('Couro de Lobo');
  const [qty,setQty]=useState(1);
  const [silver,setSilver]=useState(5);
  function list(){
    addAuction({ id:String(Math.random()).slice(2), item, qty, price:{silver}, seller:'Você', expiresAt: Date.now()+24*3600*1000 });
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Casa de Leilões</h2>
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
        <div className="grid md:grid-cols-4 gap-2">
          <input className="bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-700" value={item} onChange={e=>setItem(e.target.value)} placeholder="Item"/>
          <input className="bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-700" type="number" value={qty} onChange={e=>setQty(parseInt(e.target.value||'1'))}/>
          <input className="bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-700" type="number" value={silver} onChange={e=>setSilver(parseInt(e.target.value||'0'))}/>
          <button onClick={list} className="rounded-xl bg-emerald-700/70 hover:bg-emerald-700 border border-emerald-600/50 px-3 py-2">Listar</button>
        </div>
      </div>
      <div className="grid gap-2">
        {state.auction.map(a=>(
          <div key={a.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-3 flex items-center justify-between">
            <div>
              <div className="font-bold">{a.item} ×{a.qty}</div>
              <div className="text-sm opacity-80">Preço: {a.price.silver||0} prata · Vendedor: {a.seller}</div>
            </div>
            <button onClick={()=>buyAuction(a.id)} className="rounded-xl bg-amber-700/70 hover:bg-amber-700 border border-amber-600/50 px-3 py-2">Comprar</button>
          </div>
        ))}
        {state.auction.length===0 && <div className="text-sm opacity-70">Nenhum lote no momento.</div>}
      </div>
    </div>
  );
}
