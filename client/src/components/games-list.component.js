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
                            <div id={g._id} key={k} className="list-group-item list-group-item-action">
                                {/* <a hrev={"" + g._id} >{g.timestamp}</a> */}
                                <Link to={"/game/" + g._id} className="nav-link">
                                    {(new Date(g.timestamp).toLocaleString())}
                                </Link>
                                <div className="row">
                                    {g.players.map( (player, key) => {
                                        return (
                                            <div className="col-1" key={key}>
                                                {player.name} 
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

