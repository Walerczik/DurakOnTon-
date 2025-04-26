import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const GameLobby = () => {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<'podkidnoy' | 'perevodnoy' | null>(null);

  const handleStart = () => {
    if (gameType) {
      navigate(`/game?type=${gameType}`);
    }
  };

  return (
    <div className="lobby">
      <img src="/Logo.png" alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
      <h1>Выберите тип игры</h1>
      <button onClick={() => setGameType('podkidnoy')}>Подкидной</button>
      <button onClick={() => setGameType('perevodnoy')}>Переводной</button>

      {gameType && (
        <div style={{ marginTop: '20px' }}>
          <p>Выбран: {gameType === 'podkidnoy' ? 'Подкидной' : 'Переводной'}</p>
          <button onClick={handleStart}>Начать игру</button>
        </div>
      )}
    </div>
  );
};

export default GameLobby;
