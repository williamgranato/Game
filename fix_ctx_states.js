const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'components', 'AldoriaGuilds.jsx');
if(!fs.existsSync(file)){
  console.error('Arquivo não encontrado:', file);
  process.exit(1);
}
let src = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file + '.bak', src, 'utf8');

function ensureOnce(block, marker){
  if(!src.includes(marker)){
    src = src.replace(/const \[inventory,setInventory\][\s\S]*?\);\s*/m, (m)=> m + "\n" + block + "\n");
    console.log('Inserido:', marker);
  }
}

// 1) Estados ausentes
const states = [
  { code: "const [contracts,setContracts] = useState([]);", marker: "setContracts] = useState" },
  { code: "const [activeContractId,setActiveContractId] = useState(null);", marker: "setActiveContractId] = useState" },
  { code: "const [prevPrices,setPrevPrices] = useState({});", marker: "setPrevPrices] = useState" },
  { code: "const [auction,setAuction] = useState({ lots:[], open:false });", marker: "setAuction] = useState" },
  { code: "const [diary,setDiary] = useState({ contracts:0, coins:0, crafted:0, battlesWon:0, battlesLost:0 });", marker: "setDiary] = useState" },
  { code: "const [modifiers,setModifiers] = useState({});", marker: "setModifiers] = useState" },
  { code: "const [priceHist,setPriceHist] = useState({});", marker: "setPriceHist] = useState" },
];
states.forEach(s => ensureOnce(s.code, s.marker));

// 2) rankIdx antes do ctx
if(!src.includes("const rankIdx = ")){
  src = src.replace(/const ctx\s*=\s*\{/, 
    "const rankIdx = RANKS.findIndex(r => r.key === (player?.rank||'bronze'));\n\nconst ctx = {");
  console.log('Inserido: rankIdx');
}

// 3) Ajustes do ctx
src = src.replace(/inventoryUsedSlots:\s*inventoryUsedSlots\(\)/, "inventoryUsedSlots: calcUsedSlots(inventory)");
src = src.replace(/,\s*uiQuality\s*,\s*setUiQuality\s*,?/, ",");

// 4) inventorySlots padrão 10
src = src.replace(/inventorySlots:\s*20/g, "inventorySlots: 10");

// 5) Helpers de slot/stack + addItem corrigido
if(!src.includes("const STACK_SIZE = 100;")){
  src = src.replace(/function addItem[\s\S]*?function removeItem/, `
  // ==== INVENTORY SLOTS & STACKING ====
  const STACK_SIZE = 100;
  function calcUsedSlots(inv){
    let used = 0;
    for (const [k,v] of Object.entries(inv||{})){
      const qty = Math.max(0, v|0);
      if (qty > 0){
        used += Math.ceil(qty / STACK_SIZE);
      }
    }
    return used;
  }

  function addItem(idOrKey, qty, q='regular'){
    const key = idOrKey.includes('__') ? idOrKey : withQualityKey(idOrKey, q);
    setInventory(inv => {
      const before = inv[key] || 0;
      const toAdd = qty || 0;
      const newQty = before + toAdd;

      const usedBeforeTotal = calcUsedSlots(inv);
      const usedBeforeKey = Math.ceil(Math.max(0, before)/STACK_SIZE);
      const usedAfterKey  = Math.ceil(Math.max(0, newQty)/STACK_SIZE);
      const usedAfterTotal = usedBeforeTotal - usedBeforeKey + usedAfterKey;

      const slots = player?.inventorySlots ?? 10;
      if (usedAfterTotal > slots){
        pushLog({ t:'warn', msg:'Inventário cheio. Compre uma melhoria de mochila no Mercado.' });
        return inv;
      }
      return { ...inv, [key]: newQty };
    });
  }
  function removeItem`);
  console.log('Inseridos: STACK_SIZE, calcUsedSlots, addItem fix');
} else {
  // Mesmo se já existir, garantimos que addItem tenha chaves corretas
  src = src.replace(/function addItem[\s\S]*?\}\n\s*function removeItem/, `function addItem(idOrKey, qty, q='regular'){
    const key = idOrKey.includes('__') ? idOrKey : withQualityKey(idOrKey, q);
    setInventory(inv => {
      const before = inv[key] || 0;
      const toAdd = qty || 0;
      const newQty = before + toAdd;

      const usedBeforeTotal = calcUsedSlots(inv);
      const usedBeforeKey = Math.ceil(Math.max(0, before)/STACK_SIZE);
      const usedAfterKey  = Math.ceil(Math.max(0, newQty)/STACK_SIZE);
      const usedAfterTotal = usedBeforeTotal - usedBeforeKey + usedAfterKey;

      const slots = player?.inventorySlots ?? 10;
      if (usedAfterTotal > slots){
        pushLog({ t:'warn', msg:'Inventário cheio. Compre uma melhoria de mochila no Mercado.' });
        return inv;
      }
      return { ...inv, [key]: newQty };
    });
  }\n  function removeItem`);
  console.log('Ajustado: addItem braces');
}

// 6) Mercado: usar it.base
src = src.replace(/const price = .*?;/g, "const price = Math.round(it.base * qualityMult(q) * (0.9+Math.random()*0.4));");

fs.writeFileSync(file, src, 'utf8');
console.log('Patch aplicado com sucesso em', file);