import { useNavigate } from "react-router-dom";
import { socket } from "../api/socket";

function ModeSelection() {
  const navigate = useNavigate();

  const selectMode = (mode: "classic" | "transferable") => {
    socket.emit("selectMode", mode);
    navigate("/game");
  };

  return (
    <div className="mode-selection">
      <h1>Выбери режим игры</h1>
      <button className="btn" onClick={() => selectMode("classic")}>Подкидной</button>
      <button className="btn" onClick={() => selectMode("transferable")}>Переводной</button>
    </div>
  );
}

export default ModeSelection;
