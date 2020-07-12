import { Room, Client } from "colyseus";
import { verifyToken } from "@colyseus/social";
import { ChatLog } from "../db/ChatLog";

export class ChatRoom extends Room {
  autoDispose = false;

  lastMessages: any[] = [];

  async onCreate() {
    this.setPatchRate(null);

    this.lastMessages = (await ChatLog.find().sort({_id: -1}).limit(30)).reverse();

    // listen to events from other rooms.
    this.presence.subscribe("events", (message) => this.broadcast(this.appendMessage(message)));

    this.onMessage("*", (client, command, data) => {
      if (command == "msg") {
        const msg = {
          name: data.name,
          lvl: data.lvl,
          progress: data.progress,
          say: data.text
        };

        this.broadcast("msg", this.appendMessage(msg));
      };
    });

    // every 20 minutes
    // this.setSimulationInterval(() => this.sendBetaMessage(), 20 * 1000 * 60);
  }

  onAuth (client, options) {
    return typeof(verifyToken(options.token)._id) === "string";
  }

  onJoin (client: Client) {
    this.lastMessages.forEach(msg => client.send("msg", msg));
  }

  appendMessage(message) {
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    this.lastMessages.push(message);

    // only 20 messages are allowed!
    if (this.lastMessages.length > 40) {
      this.lastMessages.shift();
    }

    ChatLog.create(message);
    return message;
  }

  // sendBetaMessage () {
  //   this.broadcast({
  //     name: "Mazmorra (beta)",
  //     lvl: 1,
  //     progress: 1,
  //     text: "Please join Discord to report issues or suggest improvements. Link in the bottom right.",
  //     timestamp: Date.now()
  //   });
  // }

  async onLeave (client) {}

}
