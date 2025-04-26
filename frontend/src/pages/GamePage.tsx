import { useLocation } from 'react-router-dom';
import GameControls from '../components/GameControls';
import Card from '../components/Card';

const GamePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const gameType = params.get('type');

  return (
    <div>
      <h1>Игра: {gameType === 'podkidnoy' ? 'Подкидной' : 'Переводной'}</h1>
      <div className="game-board">
        {/* Здесь будет колода, карты игроков */}
        <div className="player-cards">
          {/* Пример карты */}
          <Card value="6" suit="hearts" />
          <Card value="7" suit="spades" />
        </div>

        {/* Кнопки "Отбой" и "Беру" */}
        <GameControls />
      </div>
    </div>
  );
};

export default GamePage;
