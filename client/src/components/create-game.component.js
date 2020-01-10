import React from 'react';
import DateTimePicker from 'react-datetime-picker';
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

    // this.setState({timestamp: new Date(), players: []})
  };

  removePlayer = name => {
    const newPlayers = this.state.players.filter(p => {
      return p.name !== name;
    });
    this.setState({ players: newPlayers });
  };

  render() {
    return (
      <div className="w-50">
        <Typography variant="h4" style={{ marginTop: 10, marginBottom: 10 }}>
          Create Game
        </Typography>
        <div className="form-group">
          <label>Date & Time: </label>
          <br />
          <div className="table-light mw-20">
            <DateTimePicker
              onChange={this.onChangeGameTimestamp}
              value={this.state.timestamp}
            />
          </div>
          <br />
          <div className="row">
            <div className="col-8">
              <input
                type="text"
                name="player"
                ref={this.myRef}
                className="form-control"
                value={this.state.currentPlayer}
                onChange={this.handleNewPlayer}
              />
            </div>
            <div className="col-4">
              <button
                className="btn btn-secondary btn-block"
                onClick={e => {
                  this.addPlayer();
                  console.log(this.myRef);
                  this.myRef.current.focus();
                }}
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  className=""
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  Players
                </Typography>
                <div className="">
                  <List dense={false}>
                    {this.state.players.length !== 0 &&
                      this.state.players.map((p, k) => {
                        return (
                          <ListItem key={k}>
                            <ListItemText primary={p.name} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={e => {
                                  this.removePlayer(p.name);
                                }}
                              >
                                <DeleteIcon color="primary" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
              </Grid>
            </Grid>
          </div>
          <br />
          <button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={this.onSubmit}
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
}
