require('dotenv').config()

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressBasicAuth from 'express-basic-auth';

import { Server, Room } from 'colyseus';
import socialRoutes from "@colyseus/social/express";
import { monitor } from "@colyseus/monitor";

import { router as hero } from "./controllers/hero";
import { DungeonRoom } from './rooms/DungeonRoom';
import { ChatRoom } from './rooms/ChatRoom';
import { Hero } from './db/Hero';
import { connectDatabase } from '@colyseus/social';
import { Report } from './db/Report';
import { debugLog } from './utils/Debug';

const port = process.env.PORT || 3553;
const app = express();

const basicAuth = expressBasicAuth({
  users: { admin: "mazmorra" },
  challenge: true
});

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  perMessageDeflate: false
});

connectDatabase(async () => {
  // ensure players are set as offline when booting up.
  console.log("Let's update online users!");
  const updated = await Hero.updateMany({ online: true }, { $set: { online: false } });
  console.log(updated);
});

gameServer.register('chat', ChatRoom);
gameServer.register('dungeon', DungeonRoom);
gameServer.register('pvp', DungeonRoom);
gameServer.register('loot', DungeonRoom);
gameServer.register('infinite', DungeonRoom);
gameServer.register('custom', DungeonRoom);

if (process.env.ENVIRONMENT !== "production") {
  gameServer.register('test-items', DungeonRoom);
  gameServer.register('test-monsters', DungeonRoom);

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

// Debugging colyseus Room
(Room.prototype as any).getSerializerDebugData = function() {
  return {
    handshake: Array.from(Uint8Array.from(Buffer.from(this._serializer.handshake && this._serializer.handshake()))),
    fullState: Array.from(Uint8Array.from(Buffer.from(this._serializer.getFullState()))),
  }
}

/**
 * Temporary: error reports from the client!
 */
app.post("/report", async (req, res) => {
  const report = req.body;
  report.timestamp = Date.now();

  if (report.message.indexOf("_schema") >= 0) {
    const remoteCall = await gameServer.matchMaker.remoteRoomCall(report.roomId, 'getSerializerDebugData');
    if (remoteCall && remoteCall[1]) {
      report.debug = remoteCall[1];
    }
  }

  debugLog(`client-side error: ${report.stack}`);

  const data = await Report.create(report);
  res.json(data);
});

app.use('/', socialRoutes);
app.use('/hero', hero);

// app.use('/colyseus', basicAuth, monitor(gameServer));
app.use('/colyseus', basicAuth, monitor(gameServer));

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
