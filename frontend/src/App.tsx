import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameLobby from './pages/GameLobby';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameLobby />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;