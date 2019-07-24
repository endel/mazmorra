import { Room, Client } from "colyseus";
import { verifyToken } from "@colyseus/social";
import { ChatLog } from "../db/ChatLog";

export class ChatRoom extends Room {
  autoDispose = false;

  lastMessages: any[] = [];

  async onInit() {
    this.setPatchRate(null);

    this.lastMessages = (await ChatLog.find().sort({_id: -1}).limit(30)).reverse();

    // listen to events from other rooms.
    this.presence.subscribe("events", (message) => this.broadcast(this.appendMessage(message)));

    // every 20 minutes
    // this.setSimulationInterval(() => this.sendBetaMessage(), 20 * 1000 * 60);
  }

  onAuth (options) {
    return typeof(verifyToken(options.token)._id) === "string";
  }

  onJoin (client) {
    this.lastMessages.forEach(msg => this.send(client, msg));
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

  onMessage (client: Client, message) {
    if (!Array.isArray(message)) { return; }

    const [command, data] = message;

    if (command == "msg") {
      const msg = {
        name: data.name,
        lvl: data.lvl,
        progress: data.progress,
        say: data.text
      };

      this.broadcast(this.appendMessage(msg));
    }
  }

  async onLeave (client) {}

}
