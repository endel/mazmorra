import Colyseus from 'colyseus.js'
import credentials from '../web/credentials'

const client = new Colyseus(`ws://${ window.location.hostname }:3553`);

export function enterRoom (name, options = {}) {
  options.token = credentials.token
  return client.join(name, options)
}

export function getClientId () {
  return client.id
}
