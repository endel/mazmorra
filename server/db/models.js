var mongoose = require('mongoose')
  , Schema = mongoose.Schema

mongoose.connect(process.env.MONGO_URI)

module.exports.User = mongoose.model('User', new Schema({
  email: String,
  password: String,
  token: String,
  heros: [ { type: Schema.Types.ObjectId, ref: 'Hero'} ]
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
}))

// var User = db.define('user', {
//   email: Sequelize.STRING,
//   password: Sequelize.STRING,
//   token: Sequelize.STRING
// })
//
// var Hero = db.define('hero', {
//   name: {
//     type: Sequelize.STRING,
//     unique: true
//   },
//
//   klass: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0
//   },
//
//   lvl: {
//     type: Sequelize.INTEGER,
//     defaultValue: 1
//   },
//
//   // store only current values
//   // max values are computed by class / lvl + item modifiers
//   hp: Sequelize.INTEGER,
//   mp: Sequelize.INTEGER,
//   xp: Sequelize.INTEGER,
//
//   gold: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0
//   },
//   diamond: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0
//   },
//
//   strenght: Sequelize.INTEGER,
//   dexterity: Sequelize.INTEGER,
//   intelligence: Sequelize.INTEGER,
//   vitality: Sequelize.INTEGER,
//
//   hair: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0 },
//   hairColor: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0 },
//   eye: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0 },
//   body: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0 },
// })
//
// Hero.belongsTo(User);
// User.hasMany(Hero)
//
// module.exports.Hero = Hero
// module.exports.User = User
