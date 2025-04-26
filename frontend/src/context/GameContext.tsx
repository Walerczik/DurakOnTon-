import React, { createContext, useState, ReactNode } from 'react';

interface Card {
  suit: string;
  value: number;
}

interface GameState {
  hand: Card[];
  deck: Card[];
}

interface GameContextType {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    hand: [],
    deck: [],
  });

  return (
    <GameContext.Provider value={{ state, setState }}>
      {children}
    </GameContext.Provider>
  );
};