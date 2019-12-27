import React from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

export default class GamesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            games: undefined
        }
    }
    componentDidMount = () => {
        axios.get('http://localhost:3002/games/')
            .then( res => {
                // console.log(res.data)
                this.setState( {games: res.data } )
            })
    }
    render() {
        return (
            <div>
                <h4>Games List</h4>
                {this.state.games !== undefined && this.state.games.length !== 0 && this.state.games.map( (g, k) => {
                    return (
                        <div id={g._id} key={k}>
                            {/* <a hrev={"" + g._id} >{g.timestamp}</a> */}
                            <Link to={"/game/" + g._id} className="nav-link">{g.timestamp}</Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}