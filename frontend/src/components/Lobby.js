import React, { useState } from 'react';
import './Lobby.css';

const Lobby = ({ socket, setInGame, setRoomId, setPlayerHand }) => {
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleCreateRoom = () => {
    socket.emit('createRoom');
    socket.on('roomCreated', ({ roomId }) => {
      setRoomId(roomId);
      setInGame(true);
      setPlayerHand(generateHand());
    });
  };

  const handleJoinRoom = () => {
    if (joinRoomId) {
      socket.emit('joinRoom', { roomId: joinRoomId });
      socket.on('startGame', ({ roomId }) => {
        setRoomId(roomId);
        setInGame(true);
        setPlayerHand(generateHand());
      });
    }
  };

  const generateHand = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let hand = [];
    for (let i = 0; i < 6; i++) {
      hand.push(ranks[Math.floor(Math.random() * ranks.length)] + suits[Math.floor(Math.random() * suits.length)]);
    }
    return hand;
  };

  return (
    <div className="lobby">
      <h1>Dur
