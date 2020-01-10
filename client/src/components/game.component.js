import React from 'react';
import axios from 'axios';
import API_URL from './api';

import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FormControlLabel, Typography } from '@material-ui/core';

// import red from '@material-ui/core/colors/red';

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
    const play = [{ gameName: this.state.currentGame, gameScores: gameScores }];

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
        <div className="w-75">
          <div className="">
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

          <div className="w-50 align=center">
            <table className="table table-striped text-left table-dark table-sm table-hover">
              <thead className="table-primary">
                <tr>
                  {/* <th></th> */}
                  {this.state.players.map((p, k) => {
                    return (
                      <th
                        className={
                          p.name === this.state.currentPlayerName
                            ? 'text-warning'
                            : ''
                        }
                        key={k}
                      >
                        {p.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {gameState.map((g, k) => {
                  return (
                    <tr key={k}>
                      {/* <th
                        className={
                          g.name === this.state.currentGame
                            ? 'text-warning'
                            : ''
                        }
                      >
                        {g.name}
                      </th> */}
                      {g.players.map(p => {
                        return p.map((pp, kk) => {
                          return (
                            <td className="" key={kk}>
                              <FormControlLabel
                                control={
                                  <Checkbox
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
                                    className={pp.done ? 'gameIsDone' : ''}
                                  >
                                    {g.name}
                                  </Typography>
                                }
                              />
                            </td>
                          );
                        });
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <h5>
              {this.state.currentGame !== undefined &&
              this.state.currentPlayerName !== undefined
                ? `${this.state.currentGame} | ${this.state.currentPlayerName}`
                : `Select a game`}
            </h5>
          </div>

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
            <table className="table-striped text-center table-hover">
              <thead className="table-primary">
                <tr className="table-primary">
                  <th scope="col"></th>
                  {this.state.players.map((p, k) => {
                    return (
                      <th scope="col" key={k}>
                        {p.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {this.state.currentGame === undefined && <td>Select</td>}
                  {this.state.currentGame !== undefined && (
                    <td>
                      {/* <span>{this.state.currentGame}</span>{' '} */}
                      <span>{this.state.currentTotalPoints}</span>
                    </td>
                  )}
                  {this.state.players.map((p, k) => {
                    return (
                      <td key={k}>
                        {/* <div className="mw-25 width: 15px"> */}
                        <input
                          // type="number"
                          autoComplete="off"
                          name={p.name}
                          // onBlur={this.handleScoreChange}
                          onBlur={this.handleScoreChangeV2}
                          maxLength={7}
                          size={7}
                        />
                        {/* </div> */}
                      </td>
                    );
                  })}
                  <td>
                    <button className={'btn btn-primary btn-sm'} type="submit">
                      Update
                    </button>
                  </td>
                </tr>

                <tr className="table-warning text-dark">
                  <th>Totals: </th>
                  {this.state.players.map((p, k) => {
                    return <th key={k}>{p.score}</th>;
                  })}
                  {/* <th></th> */}
                </tr>

                {this.state.scores.map((s, k) => {
                  return (
                    <tr key={k}>
                      <td>{s[0].gameName}</td>
                      {s[0].gameScores.map((ss, kk) => {
                        return <td key={kk}>{ss.value}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </form>
          {/* <button className="btn btn-primary" onClick={this.saveGame}>Save Game</button> */}
        </div>
      );
    }
  }
}
