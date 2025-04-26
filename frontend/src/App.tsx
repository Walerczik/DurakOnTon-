import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameTable from './components/GameTable';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;