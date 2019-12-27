import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import GamesList from './components/games-list.component'
import EditGame from './components/edit-game.component'
import CreateGame from './components/create-game.component'
import Game from './components/game.component'

import logo from './logo.svg'

import './App.css'

function App() {
  return (
    <Router>
      <div className="container">
        
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="http://mihaiv.info" target="_blank" rel="noopener noreferrer">
            <img src={logo} width="30" height="30" alt="Rentz Games" />
          </a>
          <Link to="/" className="navbar-brand">Rentz</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">Games</Link>
              </li>
              <li className="navbar-item">
                <Link to="/create" className="nav-link">New Game</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Route path="/" exact component={GamesList} />
        <Route path="/edit/:id" exact component={EditGame} />
        <Route path="/create" exact component={CreateGame} />
        <Route path="/game/:id" exact component={Game} />
      </div>
    </Router>
  );
}

export default App;
