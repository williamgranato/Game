"use client";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const STORAGE_KEY = "rpg:character:v1";

const defaultCharacter = {
  hp: 100,
  stamina: 50,
  coins: 50,          // moeda para treinos
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  skillPoints: 0,
  attributes: {
    strength: 1,
    intelligence: 1,
    agility: 1,
    vitality: 1,
  },
  lastSaveAt: null,
};

const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [character, setCharacter] = useState(defaultCharacter);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // defensively merge with defaults to avoid missing keys
        setCharacter(prev => ({
          ...prev,
          ...parsed,
          attributes: { ...defaultCharacter.attributes, ...(parsed.attributes||{}) }
        }));
      }
    } catch (e) {
      console.warn("Character load failed:", e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const toSave = { ...character, lastSaveAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch (e) {
      console.warn("Character save failed:", e);
    }
  }, [character]);

  const xpNeeded = useMemo(() => character.xpToNextLevel, [character.xpToNextLevel]);

  const gainXP = useCallback((amount) => {
    setCharacter(prev => {
      let xp = Math.max(0, (prev.xp || 0) + (amount || 0));
      let level = prev.level || 1;
      let skillPoints = prev.skillPoints || 0;
      let xpToNext = prev.xpToNextLevel || 100;

      // level up loop (handles big XP gains)
      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        skillPoints += 1;
        // simple growth curve: +20% each level
        xpToNext = Math.floor(xpToNext * 1.2 + 10);
      }

      return { ...prev, xp, level, skillPoints, xpToNextLevel: xpToNext };
    });
  }, []);

  const addCoins = useCallback((amount) => {
    setCharacter(prev => ({ ...prev, coins: Math.max(0, (prev.coins||0) + (amount||0)) }));
  }, []);

  const spendCoins = useCallback((amount) => {
    let ok = false;
    setCharacter(prev => {
      const have = prev.coins || 0;
      ok = have >= amount;
      if (!ok) return prev;
      return { ...prev, coins: have - amount };
    });
    return ok;
  }, []);

  const trainCost = useCallback((attrLevel) => {
    // base cost grows ~25% por nível do atributo
    const base = 10;
    const cost = Math.floor(base * Math.pow(1.25, Math.max(0, attrLevel-1)));
    return Math.max(1, cost);
  }, []);

  const train = useCallback((attrName) => {
    setCharacter(prev => {
      const current = prev.attributes?.[attrName] ?? 1;
      const cost = Math.floor(10 * Math.pow(1.25, Math.max(0, current-1)));
      if ((prev.coins||0) < cost) {
        // not enough money
        return prev;
      }
      const updated = {
        ...prev,
        coins: (prev.coins||0) - cost,
        attributes: { ...prev.attributes, [attrName]: current + 1 }
      };
      return updated;
    });
    // dar um pouco de XP por treino
    setTimeout(() => gainXP(5), 0);
  }, [gainXP]);

  const value = useMemo(() => ({
    character,
    setCharacter,
    gainXP,
    addCoins,
    spendCoins,
    trainCost,
    train,
  }), [character, gainXP, addCoins, spendCoins, trainCost, train]);

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter(){
  return useContext(CharacterContext);
}