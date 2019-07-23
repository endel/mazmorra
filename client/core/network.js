import { Client } from 'colyseus.js'
import credentials from '../web/login'
import { PlayerPrefs } from './PlayerPrefs';

const protocol = window.location.protocol.replace("http", "ws");
const endpoint = (process.env.NODE_ENV === "production")
  ? `wss://mazmorra.io`
  : `${protocol}//${ window.location.hostname }:3553`;

export const client = new Client(endpoint);
export let room = null;

// export const client = new Client(`ws://${ window.location.hostname }`);
global.client = client;

let heroId;
export function setHeroId(_heroId) {
  heroId = _heroId;
}

export function getHeroId() {
  return heroId;
}

export function enterRoom (name, options = {}) {
  App.cursor.dispatchEvent({ type: "cursor", kind: "loading" });

  options.token = credentials.token

  // Assign current hero id
  if (heroId) { options.heroId = heroId; }

  // Troll adblock users
  if (window.adBlock) { options.adBlock = true; }

  room = client.join(name, options);
  room.onJoin.addOnce(() =>
    App.cursor.dispatchEvent({ type: "cursor", kind: "pointer" }));

  return room;
}

export function getClientId () {
  return room && room.sessionId;
}

export function enterChat() {
  return client.join("chat");
}
