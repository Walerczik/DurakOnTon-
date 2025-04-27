import React, { useState } from 'react';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState('');
  const [playersCount, setPlayersCount] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  return (
    <div className="app-container">
      {!gameStarted ? (
        <Lobby
          setGameStarted={setGameStarted}
          setGameType={setGameType}
          setPlayersCount={setPlayersCount}
        />
      ) : gameOver ? (
        <GameOverScreen winner={winner} />
      ) : (
        <GameBoard
          gameType={gameType}
          playersCount={playersCount}
          setGameOver={setGameOver}
          setWinner={setWinner}
        />
      )}
    </div>
  );
}

export default App;
