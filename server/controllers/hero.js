var express = require('express')
  , router = express.Router()

  , User = require('../db/models').User
  , Hero = require('../db/models').Hero

  // middlewares
  , validUser = require('../middlewares/valid-user')

router.get('/', validUser, function(req, res) {
  var user = req.user

  res.send(JSON.stringify({
    heros: user && user.heros,
    valid: (!!user)
  }))
})

router.post('/', validUser, function(req, res) {
  var hero = req.user.heros[0]
  if (hero) {
    Hero.update(req.body, { where: { id: hero.id } }).then(() => {
      res.send(JSON.stringify({success: true}))
    })
  }
})

module.exports = router

