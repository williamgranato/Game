'use client';
import { BESTIARY } from '../data/bestiary';
import React from 'react';

export default function Bestiary(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bestiário</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {BESTIARY.map(b=>(
          <div key={b.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{b.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full border border-zinc-700">{b.danger}</span>
            </div>
            <p className="text-sm opacity-80 mt-1">{b.lore}</p>
            <p className="text-sm opacity-80 mt-2"><b>Fraquezas:</b> {b.weakness.join(', ')}</p>
            <p className="text-sm opacity-80"><b>Dropa:</b> {b.drops.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
