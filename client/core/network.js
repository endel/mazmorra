import { Client } from 'colyseus.js'
import credentials from '../web/login'

const protocol = window.location.protocol.replace("http", "ws");
const endpoint = (process.env.NODE_ENV === "production")
  ? `${protocol}//${window.location.hostname}`
  : `${protocol}//${ window.location.hostname }:3553`;

export const client = new Client(endpoint);

// export const client = new Client(`ws://${ window.location.hostname }`);
window.client = client;

export function enterRoom (name, options = {}) {
  options.token = credentials.token
  return client.join(name, options)
}

export function getClientId () {
  return client.id
}

export function enterChat() {
  return client.join("chat");
}
