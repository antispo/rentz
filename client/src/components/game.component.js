import React from 'react'

import axios from 'axios'

export default class Game extends React.Component {
    constructor(props) {
        super(props)
        const id = props.location.pathname.replace("/game/", "")
        const players = [{ name: "Ioana", score: 0}, { name: "Magda", score: 0}, { name: "Mihai", score:0 }]
        this.state = {
            players: players,
            _id: id,
            timestamp: '',
            history: [new RentzGame(players)],
            index: 0,
            scores: [],
            sindex: 0,
            currentGame: undefined,
            currentTotalPoints: 0,
        }
    }
    componentDidMount = () => {
        axios.get('http://localhost:3002/games/' + this.state._id)
            .then( res => {
                this.setState(res.data)
            })
    }
    hadleCheck = (id) => {
        // console.log(this.state.index)
        this.setState( prevState => {
            const history = prevState.history
            const lastEntry = history[prevState.index]
            lastEntry.gameState.forEach( gs => {
                gs.players.forEach( p => {
                    p.forEach( pp => {
                        if (id === pp.id) {
                            prevState.currentGame = gs.name
                            prevState.currentTotalPoints = lastEntry.scoreBar[gs.name]
                            pp.done = !pp.done
                        }
                    })
                })
            })
            prevState.history.push(lastEntry)
            prevState.index++
            return prevState
        })
    }
    updateScores = (e) => {
        
        e.preventDefault()
        e.persist()
        
        
        const gameScores = []

        this.state.players.forEach( p => {
            gameScores.push({name: p.name, value: parseInt(e.target[p.name].value) })
            e.target[p.name].value = 0
        })

        const play = [{gameName: this.state.currentGame, gameScores: gameScores}]

        this.setState( prevState => {
            prevState.scores.push(play)
            prevState.sindex++
            prevState.currentGame = undefined
            prevState.players.forEach( p => {
                p.score = 0
            })
            prevState.scores.forEach( s => {
                s[0].gameScores.forEach( gs => {
                    prevState.players.forEach( p => {
                        if (p.name == gs.name) {
                            p.score += gs.value
                        }
                    })
                })
            })
            return prevState
        })
    }
    handleScoreChange = (e) => {
        const value = parseInt(e.target.value)
        // console.log(value, this.state.currentTotalPoints)
        this.setState( prevState => {
            prevState.currentTotalPoints -= value
            return prevState
        })
    }
    render() {
        const gameState = this.state.history[this.state.index]
        // console.log(this.state.currentGame)
        return (
            <div>
                <h4>Game <span>{this.state._id}</span> from <span>{this.state.timestamp}</span></h4>
                <table className="table table-striped text-center">
                    <thead className="text-center">
                        <tr>
                            <th></th>
                            { gameState.players.map( (p, k) => {
                                return <th key={k}>{p.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        { gameState.gameState.map( (g, k) => {
                            return (
                                <tr key={k}>
                                    <td>{g.name}</td>
                                    { g.players.map( (p) => {
                                        return (
                                            p.map( (pp, kk) => { 
                                                return (
                                                    <td key={kk}>
                                                        <input type="checkbox" checked={pp.done} onChange={ () => {
                                                            this.hadleCheck(pp.id)
                                                        } } />
                                                    </td>
                                                )
                                            })
                                        )
                                    })
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <form onSubmit={this.updateScores}>
                    <table className="table-striped text-center">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                {this.state.players.map( (p,k) =>{
                                    return (
                                        <th scope="col" key={k}>
                                            {p.name}
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                {this.state.players.map( (p,k) =>{
                                    return (
                                        <th key={k}>
                                            {p.score}
                                        </th>
                                    )
                                })}
                                {/* <th></th> */}
                            </tr>
                                {this.state.scores.map( (s, k) => {
                                    // console.log(s)
                                    return (
                                        <tr key={k}>
                                            <td>{s[0].gameName}</td>
                                            {s[0].gameScores.map( (ss, kk) => {
                                                // console.log(ss)
                                                return (
                                                    <td key={kk}>{ss.value}</td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            
                            <tr>
                                <td>
                                    { ( this.state.currentGame !== undefined) 
                                        && ( this.state.currentGame + " " + this.state.currentTotalPoints) 
                                        || ("Select game") }
                                </td>
                                {this.state.players.map( (p, k) => {
                                    return (
                                        <td key={k}>
                                            <input defaultValue={0} name={p.name} onBlur={this.handleScoreChange} />
                                        </td>
                                    )
                                })}
                                <td>
                                    <button className={"btn btn-primary"} type="submit">Update</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
}

class RentzGame {
    constructor(players) {
        this.players = players
        let s = 0
        for (let i=1; i<players.length; i++) {
            s += i * 100
        }
        let i = 0;
        this.gameState = (
            ["King", "queens", "rombs", "hands", "tplus", "tminus", "rents"].map( g => {
                return {
                    name: g,
                    players: [
                        players.map(p => {
                            i++
                            return { id: i, done: false, }
                        })                   
                    ]
                }
            })
        )

        this.scoreBar = {
            "select": "---",
            "King": -100, 
            "queens": -100,
            "rombs": -120,
            "hands": -80, 
            "tplus": 400,
            "tminus": -400,
            "rents": s
        }
    }
}