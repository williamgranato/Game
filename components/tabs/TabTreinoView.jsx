'use client';
import React from "react";
import { useCharacter } from "@/context/CharacterContext";

export default function TabTreinoView(){
  const { character, train, trainCost } = useCharacter();
  const attrs = character.attributes || {};
  const coins = character.coins || 0;

  const bars = [
    { key:'strength', label:'Força', desc:'Aumenta dano físico e carga.' },
    { key:'intelligence', label:'Inteligência', desc:'Aumenta dano mágico e eficiência.' },
    { key:'agility', label:'Agilidade', desc:'Aumenta velocidade e esquiva.' },
    { key:'vitality', label:'Vitalidade', desc:'Aumenta HP e resistência.' },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Treinamento</h2>
      <p className="text-sm text-zinc-400 mb-4">Use moedas para treinar atributos. O custo aumenta a cada nível treinado.</p>

      <div className="mb-4">
        <div className="text-sm">Level: <b>{character.level}</b></div>
        <div className="text-sm">XP: <b>{character.xp} / {character.xpToNextLevel}</b></div>
        <div className="w-full h-2 bg-zinc-800 rounded mt-1 overflow-hidden">
          <div className="h-2 bg-green-600" style={{ width: `${Math.min(100, Math.floor((character.xp / Math.max(1, character.xpToNextLevel)) * 100))}%` }} />
        </div>
        <div className="text-sm mt-2">Pontos de Habilidade: <b>{character.skillPoints}</b></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {bars.map(b => {
          const lv = attrs[b.key] || 1;
          const cost = trainCost(lv);
          const can = coins >= cost;
          return (
            <div key={b.key} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">{b.label} <span className="text-zinc-400 font-normal">Nv. {lv}</span></div>
                <button
                  onClick={() => train(b.key)}
                  className={`btn ${can ? 'btn-primary' : 'btn-disabled'}`}
                  disabled={!can}
                  title={can ? 'Treinar' : 'Moedas insuficientes'}
                >
                  Treinar ({cost})
                </button>
              </div>
              <div className="text-xs text-zinc-400 mt-1">{b.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm">
        Moedas disponíveis: <b>{coins}</b>
      </div>
    </div>
  );
}