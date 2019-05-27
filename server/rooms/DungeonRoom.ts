import { Room } from "colyseus";
import { DungeonState } from "./states/DungeonState";
import { User, verifyToken } from "@colyseus/social";
import { Hero } from "../db/models";

const TICK_RATE = 30

export class DungeonRoom extends Room<DungeonState> {
  autoDispose = false;
  maxClients = 10;

  progress: number;
  difficulty: number;

  players = new WeakMap();
  heroes = new WeakMap();
  clientMap = new WeakMap();

  onInit (options) {
    this.progress = options.progress || 1
    this.difficulty = options.difficulty || 1

    this.players = new WeakMap()
    this.heroes = new WeakMap()
    this.clientMap = new WeakMap()

    this.setState(new DungeonState(this.progress, this.difficulty))

    this.state.events.on('goto', this.onGoTo.bind(this))

    setInterval( this.tick.bind(this), 1000 / TICK_RATE );

    // this.setSimulationInterval( this.tick.bind(this), 1000 / TICK_RATE )
  }

  async onAuth (options) {
    const token = verifyToken(options.token);
    return await User.findById(token._id);
  }

  requestJoin (options) {
    var success = true;

    if (options.progress) success = (success && options.progress === this.progress)
    if (options.difficulty) success = (success && options.difficulty === this.difficulty)

    return success;
  }

  onJoin (client, options, user) {
    const hero = new Hero();
    const player = this.state.createPlayer(client, hero);

    this.heroes.set(client, hero)
    this.players.set(client, player)
    this.clientMap.set(player, client)

    if (this.state.progress !== 1) {
      Hero.update({ _id: hero._id }, {
        $set: { progress: this.state.progress }
      }).then(() => { });
    }
  }

  onMessage (client, data) {
    const key = data[0]
        , value = data[1]
        , player = this.players.get(client)

    if (!player) {
      console.log("ERROR: message comming from invalid player.")
      return
    }

    if (key == 'pos') {
      this.state.move(player, value, true)

    } else if (key == 'msg') {
      // remove message after 3 seconds
      let entity = this.state.addMessage(player, value)
      this.clock.setTimeout(this.removeEntity.bind(this, entity), 3000)
    }
  }

  onGoTo (player, data) {
    const client = this.clientMap.get(player);
    const hero = this.heroes.get(client);

    const progress = (hero.progress < data.progress)
      ? data.progress
      : hero.progress;

    this.send(this.clientMap.get(player), ['goto', { progress }]);
  }

  removeEntity (entity) {
    this.state.removeEntity(entity)
  }

  onLeave (client) {
    const hero = this.heroes.get(client)
      , player = this.players.get(client)

    if (!hero._id) return;

    // sync
    return Hero.update({ _id: hero._id }, {
      $set: {
        lvl: player.lvl,
        gold: player.gold,
        diamond: player.diamond,
        hp: player.hp.current,
        mp: player.mp.current,
        xp: player.xp.current
      }
    }).then(() => {
      this.players.delete(client)
      this.clientMap.delete(player)
      this.heroes.delete(client)
      this.state.removePlayer(player)
    });
  }

  tick () {
    // update game logic
    this.clock.tick()
    this.state.update(this.clock.currentTime)
  }

  // dispose () {
  //   console.log("dispose MatchRoom", this.roomId)
  // }

}
