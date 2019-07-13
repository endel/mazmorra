import { Interactive } from "../Interactive";
import helpers from "../../../shared/helpers";
import { Hero, DBHero } from "../../db/Hero";

export class Leaderboard extends Interactive {
  lastCacheTime: number = -1;
  cacheTime: number = 5 * 60 * 1000; // 5 minutes
  cachedLeaderboard: any;

  constructor (position) {
    super(helpers.ENTITIES.LEADERBOARD, position)
  }

  update (currentTime) {
    if (currentTime > this.lastCacheTime + this.cacheTime) {
      this.lastCacheTime = currentTime;

      const projection = "_id name lvl primaryAttribute latestProgress klass hair hairColor eye body";
      Hero.find({}, projection).
        sort({ lvl: -1 }).
        limit(12).
        then(heroes => {
        this.cachedLeaderboard = heroes.map((hero, i) => this.getHeroData(hero, i + 1));
      });
    }
  }

  async interact (moveEvent, player, state) {
    moveEvent.cancel();

    if (this.cachedLeaderboard && !player.leaderboardRequested) {
      const hasCurrentPlayer = this.cachedLeaderboard.find(hero => hero._id.toString() === player.hero._id.toString());

      // prevent hero from clicking multiple times and querying the database multiple times
      player.leaderboardRequested = true;

      if (!hasCurrentPlayer) {
        const position = await Hero.find({ lvl: { $gte: player.hero.lvl } }).count();
        const leaderboard = [...this.cachedLeaderboard];
        leaderboard.pop();

        const currentHero: any = this.getHeroData(player.hero, position);
        currentHero.current = true;
        leaderboard.push(currentHero);
        state.events.emit("send", player, ['leaderboard', leaderboard]);
        player.leaderboardRequested = false;

      } else {
        player.leaderboardRequested = false;
        state.events.emit("send", player, ['leaderboard', this.cachedLeaderboard.map(hero => {
          hero.current = (hero._id.toString() === player.hero._id.toString());
          return hero;
        })]);

      }
    }
  }

  getHeroData (hero: DBHero, position: number) {
    return {
      _id: hero._id,
      name: hero.name,
      lvl: hero.lvl,
      position,
      primaryAttribute: hero.primaryAttribute,
      latestProgress: hero.latestProgress,
      props: {
        klass: hero.klass,
        hair: hero.hair,
        hairColor: hero.hairColor,
        eye: hero.eye,
        body: hero.body
      }
    }
  }

  dispose () {
    super.dispose();
    delete this.cachedLeaderboard;
  }

}
