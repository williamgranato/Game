"use client";
import { createContext, useContext, useState } from "react";

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
  const [character, setCharacter] = useState({
    hp: 100,
    stamina: 50,
    coins: 10,
    level: 1,
  });

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  return useContext(CharacterContext);
}
