import React from 'react'

import axios from 'axios'

import API_URL from './api'

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
            totalePoints: 0,
            loaded: false,
        }
        this.updateFormRef = React.createRef()
    }
    componentDidMount = () => {
        axios.get(API_URL + '/games/' + this.state._id)
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
                    prevState.index = res.data.history.length - 1
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
        // console.log(this.state.currentGame)
        // console.log(this.getCurrentlyEnteredPoints())
        if (this.state.currentGame !== undefined && this.getCurrentlyEnteredPoints() !== 0) {
            alert('You have points entered!')
            return
        }
        this.setState( prevState => {
            // const history = prevState.history
            const lastEntry = {...prevState.history[prevState.index]}
            lastEntry.gameState.forEach( gs => {
                gs.players.forEach( p => {
                    p.forEach( pp => {
                        if (id === pp.id) {
                            // console.log(pp)
                            prevState.currentGame = gs.name
                            prevState.currentTotalPoints = lastEntry.scoreBar[gs.name]
                            prevState.totalPoints = lastEntry.scoreBar[gs.name]
                            
                            //TODO: change it to 0 or 1
                            // console.log("pp.done", pp.done)
                            if ( pp.done === 0) {
                                pp.done = 1
                            } else if (pp.done === 1) {
                                pp.done = 0
                            }
                            // pp.done = !pp.done
                            // console.log("pp.done", pp.done)
                        }
                    })
                })
            })
            prevState.history.push(lastEntry)
            // console.log(lastEntry)
            prevState.index++
            return prevState
        }, () => {
            // console.log(this.state.history)
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
        }, () => {
            this.saveGame()
        })
    }
    handleScoreChange = (e) => {
        let value = parseInt(e.target.value)
        if (isNaN(value)) {
            value = 0
        }
        // console.log(value, this.state.currentTotalPoints)
        this.setState( prevState => {
            prevState.currentTotalPoints -= value
            return prevState
        })
    }
    saveGame = () => {
        let game = {...this.state}
        // console.log('saveGame', game.history)
        axios.post(API_URL + '/games/update/' + game._id, game)
            .then( res => {
                // console.log(res)
            })
            .catch( err => {
                // console.log(err)
            })
    }
    getCurrentlyEnteredPoints() {
        let sum = 0
        this.state.players.forEach( p => {
            // console.log(this.updateFormRef.current[p.name].value)
            let x = parseInt(this.updateFormRef.current[p.name].value)
            sum += (isNaN(x)) ? 0 : x
        })
        return sum
    }
    handleScoreChangeV2 = () => {
        // console.log(this.updateFormRef.current['d'])
        let sum = this.getCurrentlyEnteredPoints()
        // console.log("V2: ", sum)
        this.setState( { currentTotalPoints: this.state.totalPoints - sum})
    }

    isCurrentScoreReadyForUpdate = (e) => {
        // let sum = 0
        // this.state.players.forEach( p => {
        //     let x = parseInt(e.target[p.name].value)
        //     sum += (isNaN(x)) ? 0 : x
        // })
        // console.log(this.state.totalPoints, this.state.currentTotalPoints, sum)
        if ( this.state.currentTotalPoints !== 0 ) {
            return false
        }
        return true
    }

    render() {
        if (this.state.loaded === false) {
            return <div>Loading...</div>
        } else {
            // console.log(this.state.history, this.state.index)
        const gameState = this.state.history[this.state.index]
        
        // console.log("gameState", gameState)

        return (
            
            <div className="w-75">
                <div className="w-50">
                    <h5>
                        {/* Game {" "}
                        <span className="text-info sm">
                            {this.state._id}
                        </span>
                        {" "} from {" "} */}
                        <span className="text-info">
                            {(new Date(this.state.timestamp)).toLocaleString()}
                        </span>
                    </h5>
                </div>

                <div className="w-50 align=center">
                    <table className="table table-striped text-left table-dark table-sm table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th></th>
                                { gameState.players.map( (p, k) => {
                                    return <th className="" key={k}>{p.name}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            { gameState.gameState.map( (g, k) => {
                                // console.log(g)
                                return (
                                    <tr key={k}>
                                        <th className="">{g.name}</th>
                                        { g.players.map( (p) => {
                                            // console.log(p)
                                            return (
                                                p.map( (pp, kk) => { 
                                                    // console.log(pp.done)
                                                    return (
                                                        <td className="" key={kk}>
                                                            <input name={pp.name}
                                                                type="checkbox" 
                                                                checked={pp.done === 1} 
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
                </div>                
                
                
                <div>
                    <h3>Scores</h3>
                </div>
                
                
                
                <form
                    ref={this.updateFormRef}
                     onSubmit={ e => {
                    e.preventDefault()
                    // e.persist()
                    if ( this.state.currentGame === undefined ) {
                        alert("Please select a game");
                        return
                    }

                    // TODO: add this after the calcs are correct
                    // if ( this.state.currentTotalPoints)
                    if (this.isCurrentScoreReadyForUpdate(e) === false) {
                        alert('not all points were allocated')
                        return
                    }


                    const gameScores = []

                    // console.log(e.target)
                    this.state.players.forEach( p => {
                        // console.log("WTF ---------", p.name, e.target[54564645])
                        let enteredScore = parseInt(e.target[p.name].value)
                        // console.log(enteredScore)
                        if ( isNaN(enteredScore)) {
                            enteredScore = 0
                        }
                        gameScores.push({name: p.name, value: enteredScore })
                        e.target[p.name].value = ''
                    })

                    this.updateScores(gameScores)
                }}>
                    <table className="table-striped text-center table-hover">
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
                                { ( this.state.currentGame === undefined) &&
                                    <td>Select game</td>
                                } 
                                { ( this.state.currentGame !== undefined) &&
                                    <td>
                                        <span>{this.state.currentGame}</span>
                                        {" "}
                                        <span>{this.state.currentTotalPoints}</span>
                                    </td>
                                }
                                {this.state.players.map( (p, k) => {
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
                                    )
                                })}
                                <td>
                                    <button className={"btn btn-primary"} type="submit">Update</button>
                                </td>
                            </tr>

                            <tr className="table-warning text-dark">
                                <th>Totals: </th>
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
                            
                        </tbody>
                    </table>
                </form>
                {/* <button className="btn btn-primary" onClick={this.saveGame}>Save Game</button> */}
            </div>
        )
    }
    }
}