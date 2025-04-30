import React from 'react';

function GameSettings({ settings, setSettings, onSubmit }) {
  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="game-settings">
      <h3>Настройки комнаты</h3>
      <div>
        <label>Количество игроков:</label>
        <select name="players" value={settings.players} onChange={handleChange}>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div>
        <label>Тип игры:</label>
        <select name="mode" value={settings.mode} onChange={handleChange}>
          <option value="classic">Подкидной</option>
          <option value="transferable">Переводной</option>
        </select>
      </div>
      <button onClick={onSubmit}>Создать</button>
    </div>
  );
}

export default GameSettings;
