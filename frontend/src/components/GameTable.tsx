import React from 'react';
import './GameTable.css';

type Card = {
  suit: string;
  value: string;
};

type Player = {
  id: string;
  hand: Card[];
};

type Props = {
  player: Player;
  opponent: Player | null;
  tableCards: { attack: Card; defense?: Card }[];
  deck: Card[];
  trumpCard: Card | null;
  onCardClick: (card: Card) => void;
  onTake: () => void;
  onPass: () => void;
  isMyTurn: boolean;
  isDefending: boolean;
};

const GameTable: React.FC<Props> = ({
  player,
  opponent,
  tableCards,
  deck,
  trumpCard,
  onCardClick,
  onTake,
  onPass,
  isMyTurn,
  isDefending,
}) => {
  return (
    <div className="game-table">
      {opponent && (
        <div className="opponent-hand">
          {opponent.hand.map((_, i) => (
            <img key={i} src="/card-back.png" alt="Opponent card" className="card" />
          ))}
        </div>
      )}

      <div className="table-cards">
        {tableCards.map(({ attack, defense }, i) => (
          <div className="card-pair" key={i}>
            <img
              src={`/cards/${attack.value}_of_${attack.suit}.png`}
              alt="Attack card"
              className="card"
            />
            {defense && (
              <img
                src={`/cards/${defense.value}_of_${defense.suit}.png`}
                alt="Defense card"
                className="card defense"
              />
            )}
          </div>
        ))}
      </div>

      <div className="player-hand">
        {player.hand.map((card, i) => (
          <img
            key={i}
            src={`/cards/${card.value}_of_${card.suit}.png`}
            alt={`${card.value} of ${card.suit}`}
            className="card"
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>

      <div className="action-buttons">
        {isMyTurn && (
          <button onClick={isDefending ? onTake : onPass}>
            {isDefending ? 'Беру' : 'Отбой'}
          </button>
        )}
      </div>

      <div className="deck-area">
        {deck.length > 1 && <img src="/card-back.png" alt="Deck" className="card" />}
        {trumpCard && (
          <img
            src={`/cards/${trumpCard.value}_of_${trumpCard.suit}.png`}
            alt="Trump"
            className="card trump-card"
          />
        )}
        <div style={{ color: '#fff', marginTop: '10px' }}>В колоде: {deck.length}</div>
      </div>
    </div>
  );
};

export default GameTable;