const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Game = Schema({
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Game", Game)