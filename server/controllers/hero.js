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
  console.log(req.user)
  var hero = req.user.heros[0]

  if (!hero) {
    res.status(500).send('hero not found')
    return
  }

  Hero.find({ _id: hero._id }).update(req.body).then(() => {
    res.send(JSON.stringify({success: true}))
  })
})

module.exports = router

