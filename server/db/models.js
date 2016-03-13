var mongoose = require('mongoose')
  , Schema = mongoose.Schema

mongoose.connect(process.env.MONGO_URI)

module.exports.User = mongoose.model('User', new Schema({
  email: String,
  password: String,
  token: String,
  heros: [
    { type: Schema.Types.ObjectId, ref: 'Hero'}
  ]
}))

module.exports.Hero = mongoose.model('Hero', new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,

  klass: { type: Number, default: 0 },
  lvl: { type: Number, default: 1 },

  // store only current values
  // max values are computed by class / lvl + item modifiers
  hp: Number,
  mp: Number,
  xp: Number,

  gold: { type: Number, default: 0 },
  diamond: { type: Number, default: 0 },

  strenght: Number,
  dexterity: Number,
  intelligence: Number,
  vitality: Number,

  hair: { type: Number, default: 0 },
  hairColor: { type: Number, default: 0 },
  eye: { type: Number, default: 0 },
  body: { type: Number, default: 0 },

  inventory: { type: Array, default: [] },
  equipedItems: { type: Array, default: [] },
  quickInventory: { type: Array, default: [] },

  skills: { type: Schema.Types.Mixed, default: {} }
}))
