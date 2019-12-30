import React from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

import API_URL from './api'

export default class GamesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            games: undefined
        }
    }
    componentDidMount = () => {
        axios.get(API_URL + '/games/')
            .then( res => {
                // console.log(res.data)
                this.setState( {games: res.data } )
            })
    }
    render() {
        return (
            <div>
                <h4>Games List</h4>
                <div className="list-group">
                    {this.state.games !== undefined && this.state.games.map( (g, k) => {
                        return (
                            <Link to={"/game/" + g._id} className="nav-link" key={k}>
                                <div id={g._id} className="list-group-item list-group-item-action">
                                    {/* <a hrev={"" + g._id} >{g.timestamp}</a> */}
                                   <div className="row">
                                       <div className="col-6">
                                            <h3>
                                                {(new Date(g.timestamp).toLocaleString())}
                                            </h3>
                                       </div>
                                       <div className="col-6 text-right">
                                           {g._id}
                                       </div>
                                   </div>
                                    <div className="row text-center text-info">
                                        {g.players.map( (player, k) => {
                                            return (
                                                <div
                                                    className="col-2" 
                                                    key={k}
                                                >
                                                    {player.name}: {player.score}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

