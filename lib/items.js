
// lib/items.js
export const ITEMS = [
  { id: "dagger_iron", name: "Adaga de Ferro", base: 50, icon: "/images/items/dagger_iron.png" },
  { id: "armor_leather", name: "Armadura de Couro", base: 80, icon: "/images/items/armor_leather.png" },
  { id: "potion_minor", name: "Poção Menor de Cura", base: 30, icon: "/images/items/potion_minor.png" },
  { id: "repair_kit", name: "Kit de Reparos", base: 45, icon: "/images/items/repair_kit.png" },
  { id: "arrows_20", name: "Flechas (20)", base: 15, icon: "/images/items/arrows_20.png" },
  { id: "herb_common", name: "Erva Comum", base: 12, icon: "/images/items/herb_common.png" },
  { id: "ore_iron", name: "Minério de Ferro", base: 25, icon: "/images/items/ore_iron.png" },
  { id: "leather_raw", name: "Couro Cru", base: 20, icon: "/images/items/leather_raw.png" },
];

// Receitas de crafting
export const RECIPES = [
  {
    id: "potion_minor",
    name: "Poção Menor de Cura",
    req: { herb_common: 2 },
    makes: "potion_minor",
    qty: 1,
    diff: 20,
  },
  {
    id: "armor_leather",
    name: "Armadura de Couro",
    req: { leather_raw: 2 },
    makes: "armor_leather",
    qty: 1,
    diff: 40,
  },
];
