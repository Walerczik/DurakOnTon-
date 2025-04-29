import React, { useEffect, useState } from 'react';
import { socket } from '../api';
import PlayerHand from './PlayerHand';
import Controls from './Controls';
import './GameBoard.css';

function GameBoard({ gameState }) {
  const [localState, setLocalState] = useState(gameState);

  useEffect(() => {
    socket.on('gameUpdate', (state) => {
      setLocalState(state);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  if (!localState) return <div>Загрузка игры...</div>;

  return (
    <div className="game-board">
      <h2>Игра {localState.roomId}</h2>
      <div className="deck">
        <div className="deck-stack">
          <img src="/card_back.png" alt="Deck" className="card" />
          <div className="deck-count">Осталось: {localState.deck.length}</div>
        </div>
        {localState.trump && (
          <div className="trump">
            <img src={`/cards/${localState.trump.rank}_of_${localState.trump.suit}.png`} alt="Trump" className="card trump-card" />
          </div>
        )}
      </div>

      <div className="players-info">
        {localState.players.map(player => (
          <div key={player.id} className="player-info">
            {player.username} — {player.hand.length} карт
          </div>
        ))}
      </div>

      <PlayerHand hand={localState.players[0].hand} />

      <Controls roomId={localState.roomId} />

    </div>
  );
}

export default GameBoard;
