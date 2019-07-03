import { Room, Client } from "colyseus";
import { verifyToken } from "@colyseus/social";
import { ChatLog } from "../db/ChatLog";

export class ChatRoom extends Room {
  autoDispose = false;

  lastMessages: any[] = [];

  onInit() {
    this.setPatchRate(null);
  }

  onAuth (options) {
    return typeof(verifyToken(options.token)._id) === "string";
  }

  onJoin (client) {
    this.lastMessages.forEach(msg => this.send(client, msg));
  }

  onMessage (client: Client, message) {
    const [command, data] = message;

    if (command == "msg") {
      const msg = {
        name: data.name,
        lvl: data.lvl,
        progress: data.progress,
        text: data.text,
        timestamp: Date.now()
      };

      this.broadcast(msg);

      this.lastMessages.push(msg);

      // only 20 messages are allowed!
      if (this.lastMessages.length > 20) {
        this.lastMessages.shift();
      }

      ChatLog.create(msg);
    }
  }

  async onLeave (client) {}

}
