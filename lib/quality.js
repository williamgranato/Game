export const QUALITY = {
  regular:{ key:"regular", name:"Regular", mult:1.00, cls:"q-regular" },
  incomum:{ key:"incomum", name:"Incomum", mult:1.06, cls:"q-incomum" },
  raro:{ key:"raro", name:"Raro", mult:1.14, cls:"q-raro" },
  epico:{ key:"epico", name:"Épico", mult:1.35, cls:"q-epico" },
  lendario:{ key:"lendario", name:"Lendário", mult:1.60, cls:"q-lendario" },
  mitico:{ key:"mitico", name:"Mítico", mult:1.90, cls:"q-mitico" },
  divino:{ key:"divino", name:"Divino", mult:2.30, cls:"q-divino" },
};
export const QUALITY_ORDER = ["regular","incomum","raro","epico","lendario","mitico","divino"];
export function qualityMult(q){ return (QUALITY[q]?.mult ?? 1); }
export function qualityStyle(q){ const cls = QUALITY[q]?.cls ?? QUALITY.regular.cls; return { border:`border ${cls}`, text:cls.replace('border','text') }; }
export function withQualityKey(id,q){ return `${id}__${q}`; }
export function parseQualityKey(key){ const i=key.indexOf("__"); if(i<0) return {id:key,q:"regular"}; return {id:key.slice(0,i), q:key.slice(i+2)}; }
export function rollQuality(bonus=0){
  const r = Math.random()*(100+bonus);
  if(r>97) return "divino";
  if(r>93) return "mitico";
  if(r>86) return "lendario";
  if(r>76) return "epico";
  if(r>60) return "raro";
  if(r>35) return "incomum";
  return "regular";
}