import { Room, Client } from "colyseus";
import { DungeonState } from "./states/DungeonState";
import { verifyToken } from "@colyseus/social";
import { Hero, DBHero } from "../db/Hero";
import { Player } from "../entities/Player";
import { DoorProgress } from "../entities/interactive/Door";

const TICK_RATE = 20 // 20 ticks per second

export class DungeonRoom extends Room<DungeonState> {
  maxClients = 8;

  progress: number;
  difficulty: number;

  players = new WeakMap<Client, Player>();
  heroes = new WeakMap<Client, DBHero>();
  clientMap = new WeakMap<Player, Client>();

  onInit (options) {
    this.progress = options.progress || 1;
    this.difficulty = options.difficulty || 1;

    this.players = new WeakMap();
    this.heroes = new WeakMap();
    this.clientMap = new WeakMap();

    this.setState(new DungeonState(this.progress, this.difficulty));

    this.state.events.on('goto', this.onGoTo.bind(this));
    this.state.events.on('sound', this.broadcastSound.bind(this));

    this.setSimulationInterval(() => this.tick(), 1000 / TICK_RATE);
  }

  async onAuth (options) {
    const userId = verifyToken(options.token)._id;
    return await Hero.findOne({ userId, alive: true });
  }

  requestJoin (options) {
    var success = true;

    if (options.progress) success = (success && options.progress === this.progress)
    if (options.difficulty) success = (success && options.difficulty === this.difficulty)

    return success;
  }

  async onJoin (client: Client, options: any, hero: DBHero) {
    const player = this.state.createPlayer(client, hero);

    this.heroes.set(client, hero)
    this.players.set(client, player)
    this.clientMap.set(player, client)

    // store hero's currentProgress
    if (
      this.state.progress > 1 &&
      this.state.progress !== hero.currentProgress
    ) {
      hero.currentProgress = this.state.progress;

      const $set: any = { currentProgress: hero.currentProgress };
      if (this.state.progress > hero.latestProgress) {
        $set.latestProgress = this.state.progress;
      }

      Hero.updateOne({ _id: hero._id }, { $set }).then(() => {});
    }
  }

  onMessage (client: Client, data) {
    const key = data[0]
        , value = data[1]
        , player = this.players.get(client)

    if (!player) {
      console.log("ERROR: message comming from invalid player.")
      return
    }

    if (!player.isAlive) {
      console.log("a dead player cannot perform actions!");
      return;
    }

    if (key == 'move') {
      this.state.move(player, value, true)

    } else if (key == 'inventory-drag') {
      const { fromInventoryType, toInventoryType, itemId, switchItemId } = value;
      player.inventoryDrag(fromInventoryType, toInventoryType, itemId, switchItemId);

    } else if (key == 'use-item') {
      const { inventoryType, itemId } = value;
      player.useItem(inventoryType, itemId);

    } else if (key == 'cast') {
      const { inventoryType, itemId, position } = value;
      player.castItem(inventoryType, itemId, position);

    } else if (key == 'drop-item') {
      const { inventoryType, itemId } = value;
      player.dropItem(inventoryType, itemId);

    } else if (key == 'msg') {
      // remove message after 3 seconds
      let entity = this.state.addMessage(player, value)
      this.clock.setTimeout(this.removeEntity.bind(this, entity), 3000)
    }
  }

  onGoTo (player, data) {
    const client = this.clientMap.get(player);
    const hero = this.heroes.get(client);

    if (!hero) {
      // FIXME: NPC's shouldn't try to go to another place.
      return;
    }

    let progress: number = hero.currentProgress;

    if (data.progress === DoorProgress.FORWARD) {
      progress = hero.currentProgress + 1;

    } else if (data.progress === DoorProgress.BACK) {
      progress = hero.currentProgress - 1;

    } else if (data.progress === DoorProgress.LATEST) {
      progress = hero.latestProgress;

    } else if (data.progress === DoorProgress.HOME) {
      progress = 1;
    }

    this.send(this.clientMap.get(player), ['goto', { progress }]);
  }

  broadcastSound (soundName, player) {
    if (player) {
      const client = this.clientMap.get(player);

      if (client) {
        this.send(this.clientMap.get(player), ["sound", soundName]);

      } else {
        console.log("trying to broadcast sound to NPC. skip.");
      }

    } else {
      this.broadcast(["sound", soundName]);
    }
  }

  removeEntity (entity) {
    this.state.removeEntity(entity)
  }

  async onLeave (client) {
    const hero = this.heroes.get(client)
      , player = this.players.get(client)

    if (!hero._id) return;

    const quickInventory = Object.values(player.quickInventory.slots).map(slot => slot.toJSON());
    const inventory = Object.values(player.inventory.slots).map(slot => slot.toJSON());
    const equipedItems = Object.values(player.equipedItems.slots).map(slot => slot.toJSON());

    const additionalData: {[id: string]: any} = { quickInventory, inventory, equipedItems };

    if (this.state.progress !== 1) {
    // saved coords are used when entering Portals.
      additionalData.currentCoords = (player.shouldSaveCoords)
        ? { x: player.position.x, y: player.position.y }
        : null;
    }

    // sync
    await Hero.updateOne({ _id: hero._id }, {
      $set: {
        lvl: player.lvl,
        strength: player.attributes.strength,
        agility: player.attributes.agility,
        intelligence: player.attributes.intelligence,
        pointsToDistribute: player.pointsToDistribute,

        gold: player.gold,
        diamond: player.diamond,

        hp: player.hp.current,
        mp: player.mp.current,
        xp: player.xp.current,

        ...additionalData
      }
    });

    this.players.delete(client)
    this.clientMap.delete(player)
    this.heroes.delete(client)
    this.state.removePlayer(player)

    this.resetAutoDisposeTimeout(60 * 2);
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
