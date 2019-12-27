import React from 'react'
import DateTimePicker from 'react-datetime-picker'

import axios from 'axios'

export default class CreateGame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp: new Date()
        }
    }
    onChangeGameTimestamp = date => {
        this.setState({timestamp: date})   
    }
    onSubmit = e => {
        e.preventDefault()

        //console.log(`CreateGame: ${this.state.timestamp.valueOf()}`)

        const newGame = {
            timestam: this.state.timestamp
        }

        axios.post('http://localhost:3002/games/add', newGame)
            .then( res => {
                console.log(res)
            })

        this.setState({timestamp: ''})
    }
    render() {
        return (
            <div>
                <h4>Create Game</h4>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Date & Time: </label>
                        <br />
                        <DateTimePicker onChange={this.onChangeGameTimestamp} value={this.state.timestamp} />
                        <br />
                        <button className="btn btn-primary" type="submit">New Game</button>
                    </div>
                </form>
            </div>
        )
    }
}