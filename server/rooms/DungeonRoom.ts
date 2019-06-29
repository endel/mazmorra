import { Room, Client, generateId } from "colyseus";
import { DungeonState } from "./states/DungeonState";
import { verifyToken } from "@colyseus/social";
import { Hero, DBHero } from "../db/Hero";
import { Player } from "../entities/Player";
import { DoorProgress } from "../entities/interactive/Door";
import { Season } from "../db/Season";

const TICK_RATE = 20 // 20 ticks per second

export class DungeonRoom extends Room<DungeonState> {
  maxClients = 8;

  progress: number;
  difficulty: number;

  players = new WeakMap<Client, Player>();
  heroes = new WeakMap<Client, DBHero>();
  clientMap = new WeakMap<Player, Client>();

  async onInit (options) {
    console.log("onInit =>", options);

    this.progress = options.progress || 1;
    this.difficulty = options.difficulty || 1;

    this.players = new WeakMap();
    this.heroes = new WeakMap();
    this.clientMap = new WeakMap();

    let season = await Season.find({}).sort({ until: -1 }).findOne();

    if (!season || Date.now() > season.until) {
      season = await Season.create({
        seed: `${generateId()}-${generateId()}`,
        until: Date.now() + (60 * 60 * 24 * 1 * 1000) // one from now! (in milliseconds)
        // until: Date.now() + (60 * 60 * 24 * 7 * 1000) // one week from now! (in milliseconds)
      })
    }

    console.log("seed:", season.seed);

    this.setState(new DungeonState(this.progress, this.difficulty, season.seed));

    // Allow PVP?
    if (this.state.progress > 1 && options.isPVPAllowed) {
      this.state.isPVPAllowed = true;
    }

    this.state.events.on('goto', this.onGoTo.bind(this));
    this.state.events.on('sound', this.broadcastSound.bind(this));
    this.state.events.on('send', this.sendToPlayer.bind(this));

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
    const player = this.state.createPlayer(client, hero, options);

    this.heroes.set(client, hero)
    this.players.set(client, player)
    this.clientMap.set(player, client)

    // store hero's currentProgress
    if (this.state.progress !== hero.currentProgress) {
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

    } else if (key == 'distribute-point') {
      const { attribute } = value;
      player.distributePoint(attribute);

    } else if (key == 'inventory-drag') {
      const { fromInventoryType, toInventoryType, itemId, switchItemId } = value;
      console.log({ fromInventoryType, toInventoryType, itemId, switchItemId });
      player.inventoryDrag(fromInventoryType, toInventoryType, itemId, switchItemId);

    } else if (key == 'inventory-sell') {
      const { fromInventoryType, itemId } = value;
      player.inventorySell(fromInventoryType, itemId);

    } else if (key == 'use-item') {
      const { inventoryType, itemId } = value;
      player.useItem(inventoryType, itemId);

    } else if (key == 'cast') {
      const { inventoryType, itemId, position } = value;
      player.castItem(inventoryType, itemId, position);

    } else if (key == 'drop-item') {
      const { inventoryType, itemId } = value;
      player.dropItem(inventoryType, itemId);

    } else if (key == 'checkpoint') {
      this.onGoTo(player, { progress: parseInt(value) }, { isCheckPoint: true });

    } else if (key == 'msg') {
      this.state.addMessage(player, value);
    }
  }

  onGoTo (player, data, params: any = {}) {
    const client = this.clientMap.get(player);
    const hero = this.heroes.get(client);

    if (!hero) {
      // FIXME: NPC's shouldn't try to go to another place.
      return;
    }

    let progress: number = data.progress;

    if (data.progress === DoorProgress.FORWARD) {
      progress = hero.currentProgress + 1;

    } else if (data.progress === DoorProgress.BACK) {
      progress = hero.currentProgress - 1;

    } else if (data.progress === DoorProgress.LATEST) {
      progress = hero.latestProgress;
    }

    this.send(this.clientMap.get(player), ['goto', { progress }, params]);
  }

  sendToPlayer (player, data) {
    const client = this.clientMap.get(player);

    if (player && client) {
      this.send(client, data);
    }
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

    const $update: any = {
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
    };

    if (player.checkPoint) {
      $update.$addToSet = { checkPoints: player.checkPoint };
    }

    // sync
    await Hero.updateOne({ _id: hero._id }, $update);

    this.players.delete(client);
    this.clientMap.delete(player);
    this.heroes.delete(client);
    this.state.removePlayer(player);

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
