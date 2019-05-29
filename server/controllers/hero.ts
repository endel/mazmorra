import express from "express";
import { jwtMiddleware } from "@colyseus/social/express";

import { Hero } from "../db/Hero";

export const router = express.Router()

router.get('/', jwtMiddleware, async (req: express.Request, res: express.Response) => {
  console.log("received request:", req.auth._id);
  const heroes = await Hero.find({ userId: req.auth._id });
  console.log("heroes:", heroes);
  res.json(heroes);
});

router.post('/', jwtMiddleware, async (req, res) => {
  res.json(await Hero.create({
    userId: req.auth._id,

    name: req.body.name,
    klass: req.body.klass,
    hair: req.body.hair,
    hairColor: req.body.hairColor,
    eye: req.body.eye,
    body: req.body.body,
  }));
});
