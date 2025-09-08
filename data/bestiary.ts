export type Beast = {
  id: string;
  name: string;
  weakness: string[];
  drops: string[];
  danger: 'Comum'|'Raro'|'Letal';
  lore: string;
};

export const BESTIARY: Beast[] = [
  { id:'slime', name:'Slime Verde', weakness:['Fogo'], drops:['Gel Viscoso'], danger:'Comum', lore:'Criaturas gelatinosas onipresentes. Queimam fácil.' },
  { id:'wraith', name:'Espectro', weakness:['Prata','Luz'], drops:['Essência Etérea'], danger:'Raro', lore:'Espíritos vingativos. A prata os afeta.' },
  { id:'griffin', name:'Grifo', weakness:['Trovão'], drops:['Pena Real','Garra Afiada'], danger:'Letal', lore:'Guardião dos penhascos, extremamente territorial.' },
];
