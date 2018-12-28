import { Client } from 'colyseus.js'
import credentials from '../web/credentials'

const client = new Client(`ws://${ window.location.hostname }:3553`);
window.client = client;

export function enterRoom (name, options = {}) {
  options.token = credentials.token
  return client.join(name, options)
}

export function getClientId () {
  return client.id
}
