import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import GamesList from './components/games-list.component';
import CreateGame from './components/create-game.component';
import Game from './components/game.component';

import logo from './logo.svg';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container align-center w-75">
        <nav className="navbar navbar-expand align-center  navbar-dark bg-primary w-75">
          <a
            className="navbar-brand"
            href="http://mihaiv.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} width="30" height="30" alt="Rentz Games" />
          </a>
          {/* <Link to="/" className="navbar-brand">Rentz</Link> */}
          <div className="">
            <ul className="navbar-nav">
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  Games
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/create" className="nav-link">
                  New Game
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Route path="/" exact component={GamesList} />
        <Route path="/create" exact component={CreateGame} />
        <Route path="/game/:id" exact component={Game} />

        <br />
        <footer className="mw-100">
          <div className="text-center w-50 text-info">
            <h6>
              &copy; 2019 - 2020{' '}
              <a
                target="_blank"
                href="https://mihaiv.info"
                rel="noopener noreferrer"
              >
                mihaiv.info
              </a>
            </h6>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
