var express = require('express')
  , router = express.Router()
  , User = require('../db/models').User
  , Hero = require('../db/models').Hero

  , crypto = require('crypto')
  , salt = "wow, such security, very safe"

function digest (text) {
  var hmac = crypto.createHmac('sha256', salt);
  hmac.update(text)
  return hmac.digest('hex')
}

function generateToken (cb) {
  crypto.randomBytes(48, function(ex, buf) {
    cb(buf.toString('hex'))
  });
}

router.get('/', function(req, res) {
  var token = req.query.token
  if (!token) {
    return res.send(JSON.stringify({valid: false}))
  } else {
    User.findOne({
      where: { token: token },
      include: [ Hero ]
    }).then(user => {
      res.send(JSON.stringify({
        heros: user && user.heros,
        valid: (!!user)
      }))
    })
  }
})

router.post('/login', function(req, res) {
  var password = digest(req.body.password)

  User.findOne({
    where: { email: req.body.email },
    include: [ Hero ]
  }).then(user => {
    if (user.password === password) {
      return user;
    } else {
      throw new Error("invalid credentials")
    }

  }).then(user => {
    generateToken(token => {
      User.update({token: token}, { where: { id: user.id }}).then(() => {
        res.send(JSON.stringify({
          heros: user.heros,
          token: token
        }))
      })
    })

  }).catch(error => {
    res.status(403).send(JSON.stringify({
      error: error.message
    }))
  })
})

router.post('/register', function(req, res) {
  var password = digest(req.body.password)

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return User.create({
        email: req.body.email,
        password: password
      })
    } else if (user.password === password) {
      return user;
    } else {
      throw new Error("invalid credentials")
    }

  }).then(user => {
    generateToken(token => {
      User.update({token: token}, { where: {id: user.id}}).then(() => {
        Hero.findOrCreate({ userId: user.id, where: { userId: user.id } }).then(hero => {
          res.send(JSON.stringify({ heros: hero, token: token }))
        })
      })
    })

  }).catch(error => {
    res.status(403).send(JSON.stringify({
      error: error.message
    }))
  })
});

module.exports = router
