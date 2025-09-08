
export function fmtCoins(total){
  total=Math.max(0,Math.floor(total||0));
  const gold=Math.floor(total/1000);
  const silver=Math.floor((total%1000)/100);
  const bronze=Math.floor((total%100)/10);
  const copper=total%10;
  return {gold,silver,bronze,copper};
}
export function coinsToTotal({gold=0,silver=0,bronze=0,copper=0}={}){
  return gold*1000+silver*100+bronze*10+copper;
}
