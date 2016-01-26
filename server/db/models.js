var Sequelize = require('sequelize')
var db = require('./connection')

var User = db.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  token: Sequelize.STRING
})

var Hero = db.define('hero', {
  name: Sequelize.STRING,

  klass: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },

  lvl: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },

  // store only current values
  // max values are computed by class / lvl + item modifiers
  hp: Sequelize.INTEGER,
  mp: Sequelize.INTEGER,
  xp: Sequelize.INTEGER,

  gold: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  diamond: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },

  strenght: Sequelize.INTEGER,
  dexterity: Sequelize.INTEGER,
  intelligence: Sequelize.INTEGER,
  vitality: Sequelize.INTEGER,

  hair: {
    type: Sequelize.INTEGER,
    defaultValue: 0 },
  hairColor: {
    type: Sequelize.INTEGER,
    defaultValue: 0 },
  eye: {
    type: Sequelize.INTEGER,
    defaultValue: 0 },
  body: {
    type: Sequelize.INTEGER,
    defaultValue: 0 },
})

Hero.belongsTo(User);
User.hasMany(Hero)

module.exports.Hero = Hero
module.exports.User = User
