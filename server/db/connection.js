var Sequelize = require('sequelize')
module.exports = new Sequelize(process.env.DB_STRING)
