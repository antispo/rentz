import React from 'react'
import DateTimePicker from 'react-datetime-picker'

import axios from 'axios'

import { RentzGame } from './rentz.component'

import API_URL from './api'

export default class CreateGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp: new Date(),
            currentPlayer: '',
            players: []
        }
        this.myRef = React.createRef()
    }
    onChangeGameTimestamp = date => {
        this.setState({timestamp: date})   
    }
    handleNewPlayer = e => {
        this.setState({ currentPlayer: e.target.value})
    }
    addPlayer = () => {
        this.setState( prevState => {
            prevState.players.push({name: prevState.currentPlayer, score: 0})
            prevState.currentPlayer = ''
            return prevState
        })
    }
    onSubmit = e => {
        e.preventDefault()

        //console.log(`CreateGame: ${this.state.timestamp.valueOf()}`)

        const newGame = {
            timestamp: this.state.timestamp,
            players: this.state.players,
            history: [new RentzGame(this.state.players)]
        }


        axios.post(API_URL + '/games/add', newGame)
            .then( res => {
                // console.log(res.data._id)
                this.props.history.push('/game/' + res.data._id)
            })

        // this.setState({timestamp: new Date(), players: []})
    }
    render() {
        return (
            <div className="w-75">
                <h4>Create Game</h4>
                    <div className="form-group">
                        <label>Date & Time: </label>
                        <br />
                        <div className="table-light mw-20">
                            <DateTimePicker onChange={this.onChangeGameTimestamp} value={this.state.timestamp} />
                        </div>
                        <br />
                        <div>
                            Players:
                            {this.state.players.length !== 0 && 
                                this.state.players.map( (p,k) => {
                                    return (
                                        <div key={k}>
                                            <label className="form-control">
                                                {p.name}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <input witdh={5} cols={5} type="text" name="player" ref={this.myRef}
                                    className="form-control"
                                    value={this.state.currentPlayer} 
                                    onChange={this.handleNewPlayer} />
                            </div>
                            <div className="col-4">
                                <button className="btn btn-secondary btn-block" onClick={ e => {
                                    this.addPlayer()
                                    console.log(this.myRef)
                                    this.myRef.current.focus()
                                }}>Add</button>
                            </div>
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
        )
    }
}