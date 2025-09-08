export type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS';

export const RANKS: { code: Rank; name: string; minReputation: number }[] = [
  { code:'F',  name:'Novato',   minReputation: 0 },
  { code:'E',  name:'Aprendiz', minReputation: 10 },
  { code:'D',  name:'Aventureiro', minReputation: 25 },
  { code:'C',  name:'Caçador',  minReputation: 50 },
  { code:'B',  name:'Herói',    minReputation: 90 },
  { code:'A',  name:'Elite',    minReputation: 140 },
  { code:'S',  name:'Lenda',    minReputation: 200 },
  { code:'SS', name:'Mito',     minReputation: 300 },
];

export function rankFromReputation(rep: number): Rank {
  let current: Rank = 'F';
  for(const r of RANKS){
    if(rep >= r.minReputation) current = r.code;
  }
  return current;
}
