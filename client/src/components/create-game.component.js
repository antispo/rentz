import React from 'react';
import axios from 'axios';
import { createRentzGame } from './rentz.component';
import API_URL from './api';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import { Button, TextField } from '@material-ui/core';

export default class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: new Date(),
      currentPlayer: '',
      players: []
    };
    this.myRef = React.createRef();
  }
  onChangeGameTimestamp = date => {
    this.setState({ timestamp: date });
  };
  handleNewPlayer = e => {
    this.setState({ currentPlayer: e.target.value });
  };
  addPlayer = () => {
    this.setState(prevState => {
      prevState.players.push({ name: prevState.currentPlayer, score: 0 });
      prevState.currentPlayer = '';
      return prevState;
    });
  };
  onSubmit = e => {
    e.preventDefault();

    let s = 0;
    for (let i = 1; i < this.state.players.length; i++) {
      s += i * 100;
    }

    let rombs = -40 * this.state.players.length;
    // king queens rombs hands & decar :D
    let totalsMinus = -100 - 100 - 100 + rombs - 80;

    const newGame = {
      timestamp: this.state.timestamp,
      players: this.state.players,
      history: [createRentzGame(this.state.players)],
      scoreBar: {
        select: '---',
        Dame: -100,
        Romburi: rombs,
        Popa: -100,
        Decar: 100,
        Levate: -80,
        Whist: 80,
        'Totale+': -totalsMinus,
        'Totale-': totalsMinus,
        Rentz: s
      }
    };

    axios.post(API_URL + '/games/add', newGame).then(res => {
      this.props.history.push('/game/' + res.data._id);
    });
  };

  removePlayer = name => {
    const newPlayers = this.state.players.filter(p => {
      return p.name !== name;
    });
    this.setState({ players: newPlayers });
  };

  render() {
    return (
      <React.Fragment>
        <Typography variant="h5" style={{ marginTop: 10, marginBottom: 10 }}>
          Create Game
        </Typography>
        <TextField
          ref={this.myRef}
          label="New player"
          value={this.state.currentPlayer}
          onChange={this.handleNewPlayer}
        ></TextField>
        <Button
          color="primary"
          size="large"
          disabled={this.state.currentPlayer.length <= 3}
          onClick={e => {
            this.addPlayer();
            this.myRef.current.focus();
          }}
        >
          <AddBoxRoundedIcon></AddBoxRoundedIcon>
        </Button>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense={false}>
                {this.state.players.length !== 0 &&
                  this.state.players.map((p, k) => {
                    return (
                      <ListItem button key={k}>
                        <ListItemText primary={p.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            variant="contained"
                            edge="end"
                            aria-label="delete"
                            onClick={e => {
                              this.removePlayer(p.name);
                            }}
                          >
                            <DeleteIcon color="secondary" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
              </List>
            </Grid>
          </Grid>
        </div>
        <br />
        <Button
          variant="contained"
          type="submit"
          onClick={this.onSubmit}
          color="primary"
          disabled={this.state.players.length < 3}
        >
          New Game
        </Button>
      </React.Fragment>
    );
  }
}
