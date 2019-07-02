require('dotenv').config();

import { Hero } from "../db/Hero";
import { isCheckPointMap } from "../utils/ProgressionConfig";
import { connectDatabase } from "@colyseus/social";

async function perform() {
  await connectDatabase();

  const heroes = await Hero.find({});
  console.log(heroes.length + " heroes found.");

  for (let i = 0; i < heroes.length; i++) {
    const checkPoints = [1];

    for (let progress = 2; progress <= heroes[i].latestProgress; progress++) {
      if (isCheckPointMap(progress)) {
        checkPoints.push(progress);
      }
    }

    heroes[i].checkPoints = checkPoints;

    await heroes[i].save();
  }

  process.exit();
}

(async () => await perform())();
