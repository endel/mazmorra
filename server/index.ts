require('dotenv').config()

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressBasicAuth from 'express-basic-auth';

import { Server } from 'colyseus';
import socialRoutes from "@colyseus/social/express";
import { monitor } from "@colyseus/monitor";

import { router as hero } from "./controllers/hero";
import { DungeonRoom } from './rooms/DungeonRoom';
import { ChatRoom } from './rooms/ChatRoom';

const port = process.env.PORT || 3553;
const app = express();

const basicAuth = expressBasicAuth({
  users: { admin: "mazmorra" },
  challenge: true
});


const server = http.createServer(app);
const gameServer = new Server({ server: server });

gameServer.register('chat', ChatRoom);
gameServer.register('dungeon', DungeonRoom);
gameServer.register('loot', DungeonRoom);

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

app.use('/', socialRoutes);
app.use('/hero', hero);

app.use('/colyseus', basicAuth, monitor(gameServer));

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
