function GameOver({ winner }: { winner: string }) {
  return (
    <div className="game-over">
      <h1>{winner === window.localStorage.getItem("playerId") ? "Ты победил!" : "Ты проиграл"}</h1>
    </div>
  );
}

export default GameOver;
