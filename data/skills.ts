export type Skill = {
  id: string;
  name: string;
  branch: 'Força'|'Agilidade'|'Inteligência'|'Carisma';
  level: number;
  maxLevel: number;
  cost: number;
  bonus: string;
};

export const SKILLS: Skill[] = [
  { id:'sword_mastery', name:'Maestria de Espada', branch:'Força', level:0, maxLevel:5, cost: 10, bonus:'+2% dano por nível' },
  { id:'evasion', name:'Evasão', branch:'Agilidade', level:0, maxLevel:5, cost: 10, bonus:'+2% esquiva por nível' },
  { id:'alchemy', name:'Alquimia', branch:'Inteligência', level:0, maxLevel:5, cost: 12, bonus:'+3% eficiência de poções' },
  { id:'bargain', name:'Barganha', branch:'Carisma', level:0, maxLevel:5, cost: 15, bonus:'-2% taxas de leilão por nível' },
];
