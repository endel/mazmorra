import express from "express";

import { User } from "../db/models";
import { Hero } from "../db/models";

// middlewares
import { validUser } from "../middlewares/valid-user";

import crypto from "crypto";

const salt = "wow, such security, very safe"

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

export const router = express.Router();

/**
 * Return an unique id
 */
router.get('/deviceid', function(req, res) {
  generateToken(token => res.send(JSON.stringify({ id: token })))
})

/**
 * Auth check:
 * Check if user is logged in, given an auth token
 */
router.get('/', validUser, function(req, res) {
  var user = req.user

  res.send(JSON.stringify({
    heros: user && user.heros,
    valid: (!!user)
  }))
})

/**
 * Login:
 * Return heroes and data for given user
 */
router.post('/login', function(req, res) {
  var password = digest(req.body.password)

  User.findOne({ email: req.body.email }).populate('heros').then(user => {
    if (user.password === password) {
      return user;
    } else {
      throw new Error("invalid credentials")
    }

  }).then(user => {
    generateToken(token => {
      User.update({ _id: user._id }, {
        $set: {
          token: token
        }
      }).then(() => {
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

/**
 * Register:
 * Create a new user and a hero
 */
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
      Hero.create({
        _user: user,
        name: req.body.name
      }).then(hero => {
        User.update({ _id: user._id }, {
          $set: { token: token },
          $push: { heros: hero._id }

        }).then(() => {
          res.send(JSON.stringify({
            heros: [ hero ],
            token: token
          }))

        })

      })

    })

  }).catch(error => {
    res.status(403).send(JSON.stringify({
      error: error.message
    }))
  })
});