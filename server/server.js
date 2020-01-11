const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const env = require('dotenv');
env.config();

const gameRoutes = express.Router();

const PORT = 37303;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/gamesnew', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', () => {
  console.info('Connect to mongo: OK');
});

let Game = require('./game.model');

gameRoutes.route('/').get((req, res) => {
  Game.find((err, games) => {
    if (err) {
      console.error(err);
    } else {
      res.json(games);
    }
  });
});

gameRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;

  Game.findById(id, (err, game) => {
    if (err) {
      console.error(err);
    } else {
      // console.log(game);
      res.json(game);
    }
  });
});

gameRoutes.route('/add').post((req, res) => {
  let game = new Game(req.body);

  game
    .save()
    .then(g => {
      res.json(g);
    })
    .catch(e => {
      res.json(e);
    });
});

gameRoutes.route('/delete/:id').get((req, res) => {
  Game.findByIdAndDelete(req.params.id)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
});

gameRoutes.route('/update/:id').post((req, res) => {
  Game.findById(req.params.id, (err, game) => {
    if (err) {
      res.status(404).json(err);
    } else {
      game.players = req.body.players;
      game.scores = req.body.scores;
      game.history = req.body.history;

      game
        .save()
        .then(g => {
          res.json(g);
        })
        .catch(e => {
          res.status(400).json(e);
        });
    }
  });
});

app.use('/games', gameRoutes);

if (process.env.ENV === 'dev') {
  app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`);
  });
} else if (process.env.ENV == 'prod') {
  const fs = require('fs');
  const https = require('https');

  var privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/mihaiv.info/privkey.pem'
  );
  var certificate = fs.readFileSync(
    '/etc/letsencrypt/live/mihaiv.info/fullchain.pem'
  );

  https
    .createServer(
      {
        key: privateKey,
        cert: certificate
      },
      app
    )
    .listen(PORT);
}
