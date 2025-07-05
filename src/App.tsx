import { Link, Routes, Route } from 'react-router-dom'
import React from 'react';
import logo from './logo.svg';
import './App.css';
import CreateMatch from './pages/CreateMatch';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Cricket match scorer
            </p>
            <Link className="App-link" to="/create-match">Create a Match</Link>
          </header>
        } />
        <Route path="/create-match" element={<CreateMatch />} />
      </Routes>
    </div>
  );
}

export default App;
