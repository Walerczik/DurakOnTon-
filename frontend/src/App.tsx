import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu';
import GameTable from './components/GameTable';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'https://durakonton.onrender.com');

function App() {
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [tableCards, setTableCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [trumpCard, setTrumpCard] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [mode, setMode] = useState(null);

  const handleJoin = () => {
    if (mode) {
      socket.emit('join', { mode });
    }
  };

  const handleCardClick = (card) => {
    socket.emit('play-card', card);
  };

  const handlePass = () => {
    socket.emit('pass');
  };

  const handleTake = () => {
    socket.emit('take');
  };

  useEffect(() => {
    socket.on('init', (data) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
      setDeck(data.deck);
      setTrumpCard(data.trumpCard);
    });

    socket.on('update', (data) => {
      setPlayer(data.player);
      setOpponent(data.opponent);
      setTableCards(data.tableCards);
      setDeck(data.deck);
      setTrumpCard(data.trumpCard);
      setIsMyTurn(data.isMyTurn);
      setIsDefending(data.isDefending);
    });

    return () => {
      socket.off('init');
      socket.off('update');
    };
  }, []);

  return (
    <div className="App">
      {!player ? (
        <Menu
          onSelectMode={(selectedMode) => {
            setMode(selectedMode);
            handleJoin();
          }}
        />
      ) : (
        <GameTable
          player={player}
          opponent={opponent}
          tableCards={tableCards}
          deck={deck}
          trumpCard={trumpCard}
          onCardClick={handleCardClick}
          onTake={handleTake}
          onPass={handlePass}
          isMyTurn={isMyTurn}
          isDefending={isDefending}
        />
      )}
    </div>
  );
}

export default App;