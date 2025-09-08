
'use client';
import React from "react";

export default function TabGuildaView({ ctx }){
  const {
    season, contracts, activeContractId, setActiveContractId,
    fmtMoney, advance, resolveContract, spend, pushLog,
    toBronze, rank
  } = ctx;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Quadro da Guilda</h2>
        <span className="text-xs text-zinc-400">Estação: {season.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {contracts.map(c=>(
          <div key={c.id} className={`border border-zinc-800 rounded-xl p-3 bg-zinc-900/50 space-y-2 ${activeContractId===c.id?'ring-2 ring-yellow-500':''}`}>
            <div className="flex items-center justify-between"><div className="font-semibold">{c.title}</div><div className="text-xs text-zinc-400">★{c.stars}</div></div>
            <div className="text-sm text-zinc-300">Recompensa: <b>{fmtMoney(c.reward)}</b></div>
            <div className="text-xs text-zinc-400">Risco {c.risk.toFixed(1)} · Tempo {c.time}h · Expira em {c.expiresIn}h</div>
            <div className="text-xs text-zinc-400">Tipo: {c.type}</div>
            {c.status==='aceito' && <div className="w-full h-2 bg-zinc-800 rounded overflow-hidden"><div className="h-2 bg-emerald-600 transition-all" style={{ width:`${(c.progress/c.time)*100}%` }}/></div>}
            <div className="flex gap-2 flex-wrap">
              {c.status==='disponivel' && <button onClick={()=>{ 
                ctx.setContracts(cs=>cs.map(x=>x.id===c.id?{...x,status:'aceito'}:x));
                setActiveContractId(c.id);
              }} className="btn btn-primary text-sm">Aceitar</button>}
              {c.status==='aceito' && (<>
                <button onClick={()=>advance(3, activeContractId)} className="btn text-sm">Trabalhar +3h</button>
                <button onClick={()=>resolveContract(c.id)} className="btn btn-good text-sm">Concluir</button>
                <button onClick={()=>{
                  const fee=Math.round(c.reward*0.1);
                  if(!spend(fee)){ pushLog({t:'warn',msg:'Sem moedas para a multa (10%).'}); return; }
                  ctx.setContracts(cs=>cs.map(x=>x.id===c.id?{...x,status:'abandonado'}:x));
                  if(activeContractId===c.id) setActiveContractId(null);
                  pushLog({t:'warn',msg:`Contrato abandonado. Multa ${fmtMoney(fee)}.`});
                }} className="btn btn-danger text-sm">Abandonar</button>
              </>)}
              {c.status!=='disponivel' && c.status!=='aceito' && <span className="text-xs text-zinc-500 italic">{c.status}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={()=>{
          const fee=toBronze({copper:2});
          if(!ctx.spend(fee)){ pushLog({t:'warn',msg:'Sem moedas para a taxa da guilda.'}); return; }
          ctx.setContracts(Array.from({length:6},()=>ctx.rollContract(ctx.rank.key,ctx.season)));
          pushLog({t:'info',msg:'Quadro atualizado.'});
        }} className="btn btn-primary">Atualizar Quadro (2c)</button>
        <button onClick={()=>{ setActiveContractId(null); pushLog({t:'info', msg:'Nenhum contrato ativo selecionado.'}); }} className="btn">Desmarcar Contrato Ativo</button>
      </div>
    </div>
  );
}
