const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const gameRoutes = express.Router()

const PORT = 3002

let Game = require('./game.model')

const app = express()

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/games', {useNewUrlParser: true, useUnifiedTopology: true})
const connection = mongoose.connection

connection.once('open', function() {
    console.log('Connect to mongo: OK')
})

gameRoutes.route('/').get(function(req, res) {
    Game.find(function(err, games) {
        if (err) {
            console.log(err)
        } else {
            res.json(games)
        }
    })
})

gameRoutes.route('/:id').get( (req, res) => {
    let id = req.params.id
    // console.log(id)
    Game.findById(id, (err, game) => {
        if (err) {
            console.log(err)
        } else {
            res.json(game)
        }
    })
})

gameRoutes.route('/add').post( (req, res) => {
    let game = new Game(req.body)
    game.save()
        .then( g => {
            res.json(g)
        })
        .catch( e => {
            res.json(e)
        })

})

gameRoutes.route('/update/:id').post( (req, res) => {
    // console.log("UPDATE:", req.body)
    Game.findById(req.params.id, (err, game) => {
        if (err) {
            res.status(404).json(err)
        } else {
            console.log('GAME: ', game)
            game.players = req.body.players
            game.scores = req.body.scores
            console.log('GAME after req.body: ', game)
            game.save()
                .then( g => {
                    res.json(g)
                })
                .catch( e => {
                    res.status(400).json(e)
                })
        }
    })
})

app.use('/games', gameRoutes)

app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`)
})