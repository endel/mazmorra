"use strict";

var _ = require('dotenv').config()

  , colyseus = require('colyseus')
  , http = require('http')

  , express = require('express')
  , bodyParser = require('body-parser')
  , cors = require('cors')

  , port = process.env.PORT || 3553
  , app = express()
  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

  , DungeonRoom = require('./rooms/DungeonRoom')

gameServer.register('castle', DungeonRoom, { mapkind: 'castle' })
gameServer.register('grass', DungeonRoom, { mapkind: 'grass' })
gameServer.register('rock', DungeonRoom, { mapkind: 'rock' })
gameServer.register('ice', DungeonRoom, { mapkind: 'ice' })
gameServer.register('inferno', DungeonRoom, { mapkind: 'inferno' })

if (process.env.ENVIRONMENT !== "production") {
  app.use(cors())
} else {
  var whitelist = ['http://talk.itch.zone'];
  app.use(cors({
    origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  }))
}

// to support URL-encoded bodies
app.use(bodyParser.json());

app.use(express.static( __dirname + '/public' ))
app.use('/auth', require('./controllers/auth'))
app.use('/hero', require('./controllers/hero'))

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
