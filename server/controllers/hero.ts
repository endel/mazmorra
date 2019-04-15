import express from "express";

import { User } from "../db/models";
import { Hero } from "../db/models";

// middlewares
import { validUser } from "../middlewares/valid-user";

export const router = express.Router()

router.get('/', validUser, function(req, res) {
  var user = req.user

  res.send(JSON.stringify({
    heros: user && user.heros,
    valid: (!!user)
  }))
})

router.post('/', validUser, function(req, res) {
  var hero = req.user.heros[0]

  if (!hero) {
    res.status(500).send('hero not found')
    return
  }

  Hero.find({ _id: hero._id }).update(req.body).then(() => {
    res.send(JSON.stringify({success: true}))
  })
})
