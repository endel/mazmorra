require('dotenv').config()

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { Server } from 'colyseus';

import { router as auth } from "./controllers/auth";
import { router as hero } from "./controllers/auth";
import { DungeonRoom } from './rooms/DungeonRoom';

const port = process.env.PORT || 3553;
const app = express();

const server = http.createServer(app);
const gameServer = new Server({ server: server });

gameServer.register('dungeon', DungeonRoom);

if (process.env.ENVIRONMENT !== "production") {
  app.use(cors());
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

app.use(express.static( __dirname + '/../public' ));
app.use('/auth', auth);
app.use('/hero', hero);

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
