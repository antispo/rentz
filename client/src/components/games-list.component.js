import React from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import API_URL from './api';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export default class GamesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: undefined
    };
  }
  componentDidMount = () => {
    axios.get(API_URL + '/games/').then(res => {
      this.setState({ games: res.data });
    });
  };
  render() {
    return (
      <Container maxWidth="sm">
        {/* <h4>Games List</h4> */}
        <div className="list-group">
          {this.state.games !== undefined &&
            this.state.games.map((g, k) => {
              return (
                <Link to={'/game/' + g._id} className="nav-link" key={k}>
                  <Paper
                    id={g._id}
                    style={{ padding: 5, margin: 5 }}
                    elevation={3}
                  >
                    {/* <a hrev={"" + g._id} >{g.timestamp}</a> */}
                    <div className="row">
                      <div className="col-12">
                        <h6>{new Date(g.timestamp).toLocaleString()}</h6>
                      </div>
                      <div className="col-6 text-right">{/* {g._id} */}</div>
                    </div>
                    <div className="row text-center text-info">
                      {g.players.map((player, k) => {
                        return (
                          <div className="col-3" key={k}>
                            {player.name}: {player.score}
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-12 text-right">
                      <small>{g._id}</small>
                    </div>
                  </Paper>
                </Link>
              );
            })}
        </div>
      </Container>
    );
  }
}
