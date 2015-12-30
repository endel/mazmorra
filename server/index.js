"use strict";

var colyseus = require('colyseus')
  , http = require('http')
  , express = require('express')
  , cors = require('cors')

  , port = process.env.PORT || 3553
  , app = express()
  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

  , DungeonRoom = require('./rooms/DungeonRoom')

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
app.use(express.static( __dirname + '/public' ))

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
