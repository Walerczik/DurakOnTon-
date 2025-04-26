import { socket } from "../api/socket";

function Controls() {
  const endTurn = () => {
    socket.emit("endTurn");
  };

  const takeCards = () => {
    socket.emit("takeCards");
  };

  return (
    <div className="controls">
      <button className="btn" onClick={endTurn}>Отбой</button>
      <button className="btn" onClick={takeCards}>Беру</button>
    </div>
  );
}

export default Controls;
