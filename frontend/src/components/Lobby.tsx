import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

function Lobby() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate("/mode");
  };

  return (
    <div className="lobby">
      <img src={Logo} alt="Logo" className="logo" />
      <button onClick={handleJoin} className="btn">Присоединиться к игре</button>
    </div>
  );
}

export default Lobby;
