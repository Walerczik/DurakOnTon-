// В функции endTurn или passTurn — добор карт

const endTurn = () => {
  if (state.deck.length > 0) {
    const updatedHand = [...state.hand];
    while (updatedHand.length < 6 && state.deck.length > 0) {
      updatedHand.push(state.deck.pop()!);
    }
    setState(prev => ({
      ...prev,
      hand: updatedHand,
      opponentHand: Array(Math.min(6, prev.opponentHand.length + 1)).fill(null),
      currentPlayer: prev.playerId === 'player1' ? 'player2' : 'player1',
      table: [],
    }));
  }
};
