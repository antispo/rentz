import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import API_URL from './api';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Typography, Grid, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Toolbar from '@material-ui/core/Toolbar';

export default class GamesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: undefined
    };
  }
  loadGames = () => {
    axios.get(API_URL + '/games/').then(res => {
      this.setState({ games: res.data });
    });
  };
  componentDidMount = () => {
    this.loadGames();
  };
  deleteGame = id => {
    if (window.confirm('Delete?')) {
      axios.get(API_URL + '/games/delete/' + id).then(res => {
        this.loadGames();
      });
    }
  };
  render() {
    return (
      <Container maxWidth="sm">
        {/* <h4>Games List</h4> */}
        <div className="list-group">
          {this.state.games !== undefined &&
            this.state.games.map((g, k) => {
              return (
                // <Link to={'/game/' + g._id} className="nav-link" key={k}>
                <Paper
                  id={g._id}
                  style={{ padding: 5, margin: 5 }}
                  elevation={3}
                  key={k}
                >
                  <Grid container>
                    <Toolbar style={{ flexGrow: 1 }}>
                      <Grid item xs={6} align="left">
                        <Typography variant="h6" color="primary">
                          <Link to={'/game/' + g._id} className="nav-link">
                            <Button variant="contained" color="primary">
                              Open
                            </Button>
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="right">
                        <Button
                          // variant="contained"
                          // color="secondary"
                          onClick={() => {
                            this.deleteGame(g._id);
                          }}
                        >
                          <DeleteIcon color="secondary" />
                        </Button>
                      </Grid>
                    </Toolbar>
                    <Grid item align="right" xs={12}>
                      <Paper elevation={3} style={{ padding: 10, margin: 10 }}>
                        <Grid container spacing={2}>
                          {g.players.map((player, k) => {
                            return (
                              <Grid item key={k} xs={3}>
                                <Paper
                                  style={{ paddingRight: 5 }}
                                  elevation={0}
                                >
                                  <Grid container>
                                    <Grid item xs>
                                      <Typography>{player.name}</Typography>
                                    </Grid>
                                    <Grid item xs>
                                      <Typography>{player.score}</Typography>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Paper>
                      <Grid item xs={12}>
                        <Paper elevation={0}>
                          <Typography variant="caption">
                            {new Date(g.timestamp).toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
                // </Link>
              );
            })}
        </div>
      </Container>
    );
  }
}
