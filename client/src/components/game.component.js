import React from 'react';
import axios from 'axios';
import API_URL from './api';

import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  FormControlLabel,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@material-ui/core';
import DoneOutlineTwoToneIcon from '@material-ui/icons/DoneOutlineTwoTone';
import Grid from '@material-ui/core/Grid';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    const id = props.location.pathname.replace('/game/', '');
    this.state = {
      players: [],
      _id: id,
      timestamp: '',
      history: [],
      index: 0,
      scores: [],
      sindex: 0,
      currentGame: undefined,
      currentTotalPoints: 0,
      totalePoints: 0,
      loaded: false,
      error: null
    };
    this.updateFormRef = React.createRef();
  }
  componentDidMount = () => {
    axios.get(API_URL + '/games/' + this.state._id).then(res => {
      // console.log(res.data);
      if (res.data === null) {
        this.setState({ error: 404, loaded: true });
        return;
      }
      this.setState(
        {
          _id: res.data._id,
          timestamp: res.data.timestamp,
          players: res.data.players,
          scores: res.data.scores,

          history: res.data.history,
          index: res.data.history.length - 1,

          scoreBar: res.data.scoreBar,

          loaded: true
        },
        () => {
          // console.log(this.state.history);
        }
      );
    });
  };

  hadleCheck = id => {
    if (
      this.state.currentGame !== undefined &&
      this.getCurrentlyEnteredPoints() !== 0
    ) {
      alert('You have points entered!');
      return;
    }
    this.setState(
      prevState => {
        // const history = prevState.history
        const lastEntry = { ...prevState.history[prevState.index] };
        // console.log(id);
        lastEntry.gameState.forEach(gs => {
          gs.players.forEach(p => {
            // console.log(p);
            p.forEach(pp => {
              // console.log(pp);
              if (id === pp.id) {
                prevState.currentGame = gs.name;
                prevState.currentTotalPoints = prevState.scoreBar[gs.name];
                prevState.totalPoints = prevState.scoreBar[gs.name];

                if (pp.done === 0) {
                  pp.done = 1;
                } else if (pp.done === 1) {
                  pp.done = 0;
                }
                // pp.done = !pp.done
              }
            });
          });
        });
        prevState.history.push(lastEntry);

        prevState.index++;
        return prevState;
      },
      () => {
        console.log('handleCheck: ', this.state.history);
      }
    );
  };

  hadleCheckV2 = id => {
    this.setState({ currentPlayerName: id.name });
    if (
      this.state.currentGame !== undefined &&
      this.getCurrentlyEnteredPoints() !== 0
    ) {
      alert('You have points entered!');
      return;
    }
    this.setState(
      prevState => {
        // const history = prevState.history
        const lastEntry = prevState.history[prevState.index];
        // console.log(id);
        lastEntry.forEach(gs => {
          gs.players.forEach(p => {
            // console.log(p);
            p.forEach(pp => {
              // console.log(pp);
              if (id.id === pp.id) {
                if (pp.done === 0) {
                  prevState.currentGame = gs.name;
                  prevState.currentTotalPoints = prevState.scoreBar[gs.name];
                  prevState.totalPoints = prevState.scoreBar[gs.name];
                  pp.done = 1;
                } else if (pp.done === 1) {
                  prevState.currentGame = undefined;
                  prevState.currentPlayerName = undefined;
                  pp.done = 0;
                }
                // pp.done = !pp.done
              }
            });
          });
        });
        prevState.history.push(lastEntry);

        prevState.index++;
        return prevState;
      },
      () => {
        // console.log('handleCheck: ', this.state.history);
      }
    );
  };

  updateScores = gameScores => {
    const play = [
      {
        gameName: this.state.currentGame,
        gameScores: gameScores,
        player: this.state.currentPlayerName
      }
    ];

    this.setState(
      prevState => {
        prevState.scores.push(play);
        prevState.sindex++;
        prevState.currentGame = undefined;
        prevState.currentPlayerName = undefined;
        prevState.players.forEach(p => {
          p.score = 0;
        });
        prevState.scores.forEach(s => {
          s[0].gameScores.forEach(gs => {
            prevState.players.forEach(p => {
              if (p.name === gs.name) {
                p.score += gs.value;
              }
            });
          });
        });
        return prevState;
      },
      () => {
        this.saveGame();
        // console.log(this.state.scores);
      }
    );
  };

  handleScoreChange = e => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) {
      value = 0;
    }

    this.setState(prevState => {
      prevState.currentTotalPoints -= value;
      return prevState;
    });
  };

  saveGame = () => {
    let game = { ...this.state };

    axios.post(API_URL + '/games/update/' + game._id, game).catch(err => {
      console.error(err);
    });
  };

  getCurrentlyEnteredPoints = () => {
    let sum = 0;
    this.state.players.forEach(p => {
      let x = parseInt(this.updateFormRef.current[p.name].value);
      sum += isNaN(x) ? 0 : x;
    });
    return sum;
  };

  handleScoreChangeV2 = () => {
    this.setState({
      currentTotalPoints:
        this.state.totalPoints - this.getCurrentlyEnteredPoints()
    });
  };

  isCurrentScoreReadyForUpdate = e => {
    if (this.state.currentTotalPoints !== 0) {
      return false;
    }
    return true;
  };

  render() {
    if (this.state.loaded === false) {
      return <div>Loading...</div>;
    } else if (this.state.error !== null) {
      return <div>Error: {this.state.error}</div>;
    } else {
      // console.log(this.state.index, this.state.history);
      const gameState = this.state.history[this.state.index];

      return (
        <div className="">
          <div className="" style={{ marginTop: 5 }}>
            <h5>
              {/* Game {" "}
                        <span className="text-info sm">
                            {this.state._id}
                        </span>
                        {" "} from {" "} */}
              <span className="text-info">
                {new Date(this.state.timestamp).toLocaleString()}
              </span>
            </h5>
          </div>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {this.state.players.map((p, k) => {
                    return (
                      <TableCell key={k}>
                        <Typography variant="h5" color="primary">
                          {p.name}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {gameState.map((g, k) => {
                  return (
                    <TableRow key={k}>
                      {g.players.map(p => {
                        return p.map((pp, kk) => {
                          return (
                            <TableCell key={kk}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    // size="small"
                                    checked={pp.done === 1}
                                    onChange={() => {
                                      this.hadleCheckV2(pp);
                                    }}
                                    value={g.name}
                                    icon={
                                      <CheckBoxOutlineBlankIcon
                                        fontSize="small"
                                        // color="primary"
                                        style={{ color: '999' }}
                                      />
                                    }
                                    checkedIcon={
                                      <CheckBoxIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    }
                                  />
                                }
                                label={
                                  <Typography
                                    variant="caption"
                                    className={pp.done ? 'gameIsDone' : ''}
                                  >
                                    {g.name}
                                  </Typography>
                                }
                              />
                            </TableCell>
                          );
                        });
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <div>
            <h5>
              {this.state.currentGame !== undefined &&
              this.state.currentPlayerName !== undefined
                ? `${this.state.currentGame} | ${this.state.currentPlayerName}`
                : `Select a game`}
            </h5>
          </div> */}
          <Grid container>
            {this.state.currentGame !== undefined &&
            this.state.currentPlayerName !== undefined ? (
              <Grid item xs>
                <Grid container>
                  <Grid item xs>
                    <Typography variant="h5" color="primary">
                      {this.state.currentPlayerName}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5" color="primary">
                      {this.state.currentGame}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="h5">Select a game</Typography>
              </Grid>
            )}
          </Grid>

          <form
            ref={this.updateFormRef}
            onSubmit={e => {
              e.preventDefault();
              // e.persist()
              if (this.state.currentGame === undefined) {
                alert('Please select a game');
                return;
              }

              // TODO: add this after the calcs are correct
              // if ( this.state.currentTotalPoints)
              if (this.isCurrentScoreReadyForUpdate(e) === false) {
                alert('not all points were allocated');
                return;
              }

              const gameScores = [];

              this.state.players.forEach(p => {
                let enteredScore = parseInt(e.target[p.name].value);

                if (isNaN(enteredScore)) {
                  enteredScore = 0;
                }
                gameScores.push({ name: p.name, value: enteredScore });
                e.target[p.name].value = '';
              });

              this.updateScores(gameScores);
            }}
          >
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Button type="submit">
                        <DoneOutlineTwoToneIcon color="primary"></DoneOutlineTwoToneIcon>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5" color="secondary">
                        {this.state.currentGame !== undefined &&
                          this.state.currentTotalPoints}
                      </Typography>
                    </TableCell>
                    {this.state.players.map((p, k) => {
                      return (
                        <TableCell key={k} align="right">
                          <input
                            autoComplete="off"
                            name={p.name}
                            onBlur={this.handleScoreChangeV2}
                            maxLength={5}
                            size={5}
                          />
                          {/* )} */}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {this.state.players.map((p, k) => {
                      return (
                        <TableCell key={k} align="right">
                          <Typography variant="h5" color="primary">
                            {p.name}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="h6" color="secondary">
                        {/* Totals: */}
                      </Typography>
                    </TableCell>
                    {this.state.players.map((p, k) => {
                      return (
                        <TableCell key={k} align="right">
                          <Typography variant="h6" color="secondary">
                            {p.score}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {this.state.scores.map((s, k) => {
                    return (
                      <TableRow key={k}>
                        <TableCell align="right">
                          <Typography>{s[0].player}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{s[0].gameName}</Typography>
                        </TableCell>
                        {s[0].gameScores.map((ss, kk) => {
                          return (
                            <TableCell key={kk} align="right">
                              {ss.value !== 0 ? ss.value : ''}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </form>
          {/* <button className="btn btn-primary" onClick={this.saveGame}>Save Game</button> */}
        </div>
      );
    }
  }
}
