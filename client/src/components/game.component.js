import React from 'react'

import axios from 'axios'

export default class Game extends React.Component {
    constructor(props) {
        super(props)
        const id = props.location.pathname.replace("/game/", "")
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
            loaded: false,
        }
    }
    componentDidMount = () => {
        axios.get('http://localhost:3002/games/' + this.state._id)
            .then( res => {
                // console.log(res.data)
                this.setState( prevState => {
                    prevState._id = res.data._id
                    prevState.timestamp = res.data.timestamp
                    prevState.players = res.data.players
                    prevState.scores = res.data.scores
                    // prevState.players = players
                    // console.log("res.data.players", res.data.players)
                    prevState.history = res.data.history
                    // prevState.history.push(new RentzGame(res.data.players))
                    prevState.loaded = true
                    return prevState
                }, () => {
                    // console.log(this.state)
                })
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
                            // console.log(pp)
                            prevState.currentGame = gs.name
                            prevState.currentTotalPoints = lastEntry.scoreBar[gs.name]
                            
                            pp.done = !pp.done
                            console.log("pp.done", pp.done)
                        }
                    })
                })
            })
            prevState.history.push(lastEntry)
            // console.log(lastEntry)
            prevState.index++
            return prevState
        }, () => {
            console.log(this.state.history)
        })
    }
    updateScores = (gameScores) => {

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
                        if (p.name === gs.name) {
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
    saveGame = () => {
        let game = {...this.state}
        axios.post('http://localhost:3002/games/update/' + game._id, game)
            .then( res => {
                console.log(res)
            })
            .catch( err => {
                console.log(err)
            })
        console.log('saveGame', game)
    }
    render() {
        if (this.state.loaded === false) {
            return <div>Loading...</div>
        } else {
            console.log(this.state.history, this.state.index)
        const gameState = this.state.history[this.state.index]
        
        // console.log("gameState", gameState)

        return (
            
            <div>
                <div>
                    <h3>
                        Game {" "}
                        <span className="text-info">
                            {this.state._id}
                        </span>
                        {" "} from {" "}
                        <span className="text-info">
                            {(new Date(this.state.timestamp)).toLocaleString()}
                        </span>
                    </h3>
                </div>
                <table className="table table-striped text-center table-dark">
                    <thead className="text-center table-primary">
                        <tr>
                            <th></th>
                            { gameState.players.map( (p, k) => {
                                return <th key={k}>{p.name}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        { gameState.gameState.map( (g, k) => {
                            // console.log(g)
                            return (
                                <tr key={k}>
                                    <td>{g.name}</td>
                                    { g.players.map( (p) => {
                                        // console.log(p)
                                        return (
                                            p.map( (pp, kk) => { 
                                                return (
                                                    <td key={kk} className="">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={pp.done} 
                                                            onChange={ () => {
                                                                this.hadleCheck(pp.id)
                                                            }}
                                                            className=""
                                                        />
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
                
                
                
                <div>
                    <h3>Scores</h3>
                </div>
                
                
                
                <form onSubmit={ e => {
                    e.preventDefault()
                    // e.persist()

                    const gameScores = []

                    // console.log(e.target)
                    this.state.players.forEach( p => {
                        console.log("WTF ---------", p.name, e.target[54564645])
                        gameScores.push({name: p.name, value: parseInt(e.target[p.name].value) })
                        e.target[p.name].value = 0
                    })

                    this.updateScores(gameScores)
                }}>
                    <table className="table-striped text-center">
                        <thead className="table-primary">
                            <tr className="table-primary">
                                <th scope="col"></th>
                                {this.state.players.map( (p,k) =>{
                                    // console.log(p)
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
                                <td>Totals: </td>
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
                                        && this.state.currentGame + " " + this.state.currentTotalPoints }
                                    { ( this.state.currentGame === undefined) 
                                        && ("Select game") }
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
                <button className="btn btn-primary" onClick={this.saveGame}>Save Game</button>
            </div>
        )
    }
    }
}