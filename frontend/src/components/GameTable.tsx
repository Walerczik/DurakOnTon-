import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import Card from './Card';
import './GameTable.css';

const GameTable = () => {
  const { state, playCard, takeCards, passTurn } = useContext(GameContext);

  const isAttacker = state.currentPlayer === state.playerId;
  const isDefender = !isAttacker;

  return (
    <div className="game-container">
      <div className="opponent-hand">
        {state.opponentHand.map((_, i) => (
          <div key={i} className="card-back" />
        ))}
      </div>

      <div className="table">
        {state.table.map((pair, i) => (
          <div key={i} className="card-pair">
            <Card card={pair.attack} />
            {pair.defense && (
              <Card card={pair.defense} className="defense-card" />
            )}
          </div>
        ))}
      </div>

      <div className="deck-container">
        <div className="deck">
          {state.deck.length > 1 && <div className="card-back" />}
          {state.trumpCard && (
            <Card
              card={state.trumpCard}
              className="trump-card"
              rotated
            />
          )}
        </div>
        <div className="deck-count">{state.deck.length}</div>
      </div>

      <div className="player-hand">
        {state.hand.map((card, i) => (
          <Card key={i} card={card} onClick={() => playCard(card)} />
        ))}
      </div>

      <div className="action-buttons">
        {isDefender && (
          <button onClick={takeCards}>Беру</button>
        )}
        {isAttacker && (
          <button onClick={passTurn}>Отбой</button>
        )}
      </div>
    </div>
  );
};

export default GameTable;
