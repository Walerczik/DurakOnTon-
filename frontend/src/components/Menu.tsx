import React, { useState } from 'react';
import './Menu.css';

type Props = {
  onSelectMode: (mode: string) => void;
};

const Menu: React.FC<Props> = ({ onSelectMode }) => {
  const [showModes, setShowModes] = useState(false);

  return (
    <div className="menu">
      <img src="/logo.png" alt="Logo" className="logo" />
      {!showModes ? (
        <button onClick={() => setShowModes(true)}>Найти игру</button>
      ) : (
        <div className="mode-buttons">
          <button onClick={() => onSelectMode('classic')}>Обычный</button>
          <button onClick={() => onSelectMode('podkidnoy')}>Подкидной</button>
          <button onClick={() => onSelectMode('perevodnoy')}>Переводной</button>
        </div>
      )}
    </div>
  );
};

export default Menu;
