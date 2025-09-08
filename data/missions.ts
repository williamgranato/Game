export type Mission = {
  id: string;
  title: string;
  tier: 'daily'|'weekly'|'special';
  timeMinutes: number;
  staminaCost: number;
  reqLevel: number;
  rewards: { gold?: number; silver?: number; exp?: number; items?: string[]; reputation?: number };
  description: string;
};

export const MISSIONS: Mission[] = [
  { id: 'rat_cave', title: 'Limpar a caverna de ratos', tier: 'daily', timeMinutes: 10, staminaCost: 5, reqLevel: 1, rewards: { silver: 5, exp: 30, items: ['Pele de Rato'] , reputation: 1}, description: 'Ratos infestaram as margens de Ronoa.' },
  { id: 'herb_run', title: 'Coleta de Ervas em Buena', tier: 'daily', timeMinutes: 20, staminaCost: 8, reqLevel: 2, rewards: { silver: 8, exp: 45, items: ['Erva-vento'] , reputation: 1}, description: 'A guilda precisa de ingredientes para poções.' },
  { id: 'wolf_pack', title: 'Alcateia nos campos', tier: 'weekly', timeMinutes: 60, staminaCost: 15, reqLevel: 4, rewards: { gold: 1, exp: 120, items: ['Couro de Lobo'] , reputation: 2}, description: 'Lobos têm atacado caravanas.' },
  { id: 'spider_nest', title: 'Ninho de Aranhas Gigantes', tier: 'special', timeMinutes: 180, staminaCost: 25, reqLevel: 6, rewards: { gold: 3, exp: 400, items: ['Seda Pegajosa'], reputation: 4 }, description: 'Elimine a matriarca e traga evidências.' },
];
