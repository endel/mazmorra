import express from "express";
import helpers from "../../shared/helpers"
import { jwtMiddleware } from "@colyseus/social/express";

import { Hero, ATTRIBUTE_BASE_VALUE, DBItem } from "../db/Hero";

export const router = express.Router()

router.get('/', jwtMiddleware, async (req: express.Request, res: express.Response) => {
  const heroes = await Hero.find({ userId: req.cauth._id, alive: true });
  res.json(heroes);
});

router.delete('/', jwtMiddleware, async (req, res) => {
  // delete previous user's heroes.
  const deleted = await Hero.deleteOne({
    userId: req.cauth._id,
    _id: req.body._id
  });

  if (deleted.n > 0) {
    const heroes = await Hero.find({ userId: req.cauth._id, alive: true });
    res.json(heroes);

  } else {
    res.status(403);
    res.json({ error: "invalid hero" });
  }
});


router.post('/', jwtMiddleware, async (req, res) => {
    // see client/config.js for ordering
  const primaryAttributes = [
    'strength',
    'intelligence',
    'agility',
  ];

  const initialWeapon: { [id: string]: DBItem } = {
    'strength': {
      type: helpers.ENTITIES.WEAPON_1, modifiers: [{
        attr: "damage",
        modifier: 0
      }]
    },
    'intelligence': {
      type: helpers.ENTITIES.WAND_1, modifiers: [{
        attr: "damage",
        modifier: 0
      }, {
        attr: "attackDistance",
        modifier: 1
      }],
    },
    'agility': {
      type: helpers.ENTITIES.BOW_1, modifiers: [{
        attr: "damage",
        modifier: 0
      }, {
        attr: "attackDistance",
        modifier: 1
      }]
    },
  }

  const primaryAttribute = primaryAttributes[req.body.klass];

  // delete previous user's heroes.
  const numHeroes = await Hero.count({ userId: req.cauth._id });

  // each player can only have 3 heroes
  if (numHeroes < 3) {
    res.json(await Hero.create({
      userId: req.cauth._id,

      name: req.body.name.substr(0, 20),
      klass: req.body.klass,
      hair: req.body.hair,
      hairColor: req.body.hairColor,
      eye: req.body.eye,
      body: req.body.body,

      primaryAttribute,
      [primaryAttribute]: ATTRIBUTE_BASE_VALUE + 3,

      equipedItems: [initialWeapon[primaryAttribute]]
    }));

  } else {
    res.status(403);
    res.json({error: "max heroes reached"});
  }
});
