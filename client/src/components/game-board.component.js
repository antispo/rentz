import React from 'react'

class GameBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plays: props.plays
        }
    }
}

export default GameBoard