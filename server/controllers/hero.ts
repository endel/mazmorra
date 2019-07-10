import express from "express";
import { jwtMiddleware } from "@colyseus/social/express";

import { Hero, ATTRIBUTE_BASE_VALUE } from "../db/Hero";

export const router = express.Router()

router.get('/', jwtMiddleware, async (req: express.Request, res: express.Response) => {
  const heroes = await Hero.find({ userId: req.auth._id, alive: true });
  res.json(heroes);
});

router.post('/', jwtMiddleware, async (req, res) => {
    // see client/config.js for ordering
  const primaryAttributes = [
    'strength',
    'intelligence',
    'agility',
  ];

  const primaryAttribute = primaryAttributes[req.body.klass];

  // delete previous user's heroes.
  await Hero.deleteMany({ userId: req.auth._id });

  res.json(await Hero.create({
    userId: req.auth._id,

    name: req.body.name.substr(0, 20),
    klass: req.body.klass,
    hair: req.body.hair,
    hairColor: req.body.hairColor,
    eye: req.body.eye,
    body: req.body.body,

    primaryAttribute,
    [primaryAttribute]: ATTRIBUTE_BASE_VALUE + 3
  }));
});
