import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import GamesList from './components/games-list.component';
import CreateGame from './components/create-game.component';
import Game from './components/game.component';

import './App.css';

import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import { Button, AppBar, Toolbar } from '@material-ui/core';

function App() {
  return (
    <Router>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Link to="/">
            <Button color="inherit">Games</Button>
          </Link>
          <Link to="/create">
            <Button color="inherit">
              <AddBoxRoundedIcon></AddBoxRoundedIcon>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <div className="container align-center">
        <Route path="/" exact component={GamesList} />
        <Route path="/create" exact component={CreateGame} />
        <Route path="/game/:id" exact component={Game} />

        <br />
        <footer className="mw-100">
          <div className="text-center text-info">
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
