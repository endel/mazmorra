import { Client } from 'colyseus.js'
import credentials from '../web/login'

const protocol = window.location.protocol.replace("http", "ws");
const endpoint = (process.env.NODE_ENV === "production")
  ? `wss://mazmorra.io`
  : `${protocol}//${ window.location.hostname }:3553`;

export const client = new Client(endpoint);

// export const client = new Client(`ws://${ window.location.hostname }`);
window.client = client;

export function enterRoom (name, options = {}) {
  App.cursor.dispatchEvent({ type: "cursor", kind: "loading" });

  options.token = credentials.token

  const room = client.join(name, options);
  room.onJoin.addOnce(() =>
    App.cursor.dispatchEvent({ type: "cursor", kind: "pointer" }));

  return room;
}

export function getClientId () {
  return client.id
}

export function enterChat() {
  return client.join("chat");
}
