import helpers from '../../../shared/helpers'

import GameObject from '../../behaviors/GameObject'
import HasLifebar from '../../behaviors/HasLifebar'
import DangerousThing from '../../behaviors/DangerousThing';

import Character from '../../elements/Character'
import Enemy from '../../elements/Enemy'
import NPC from '../../elements/NPC';
import Item from '../../elements/Item'
import Chest from '../../elements/Chest'
import Fountain from '../../elements/Fountain'
import Rock from '../../elements/Rock'
import Aesthetic from '../../elements/Aesthetic'
import LightPole from '../../elements/LightPole'
import Door from '../../elements/Door'
import TextEvent from '../../elements/TextEvent'
import Portal from '../../elements/Portal';
import Projectile from '../../elements/effects/Projectile';

import { getClientId } from '../../core/network'

export default class Factory {

  constructor ( level ) {
    this.level = level

    // visual groups
    this.ground = []
    this.wall = []

    window.factory = this;
  }

  setGrid (grid) {
    this.grid = grid
  }

  createEntity (data) {
    var element = null

    switch (data.type) {
      case helpers.ENTITIES.DOOR:
        // THIS IS UGLY AF
        let gridItem;

        // DETECT IF IS NORTH OR WEST TILE
        const northTile = this.grid[(data.position.x - 1) + this.level.mapwidth * data.position.y];
        const westTile = this.grid[data.position.x + this.level.mapwidth * (data.position.y - 1)];

        if ((northTile & helpers.TILE_TYPE.WALL) && (northTile & helpers.DIRECTION.NORTH)) {
          gridItem = northTile;
        } else if ((westTile & helpers.TILE_TYPE.WALL) && (westTile & helpers.DIRECTION.WEST)) {
          gridItem = westTile;
        }

        element = new Door(data, this.level.progress, this.level.mapkind, gridItem);
        console.log(data);
        element.userData.interactive = true;
        break;

      case helpers.ENTITIES.ENEMY:
        element = new Enemy(data);
        break;

      case helpers.ENTITIES.PLAYER:
        element = new Character(data);
        if (data.id !== getClientId()) {
          element.addBehaviour(new HasLifebar, this);

          if (this.level.isPVPAllowed) {
            element.addBehaviour(new DangerousThing);
          }
        }
        break;

      case helpers.ENTITIES.NPC:
        element = new NPC(data);
        break;

      case helpers.ENTITIES.LIGHT:
        element = new LightPole();
        break;

      case helpers.ENTITIES.PORTAL:
        element = new Portal(data);
        element.userData.interactive = true;
        break;

      case helpers.ENTITIES.AESTHETICS:
        //
        // TODO: change material on tile instead.
        // https://stackoverflow.com/a/16897178/892698
        //
        element = new Aesthetic(this.level.mapkind);
        break;

      case helpers.ENTITIES.PROJECTILE_MAGIC:
      case helpers.ENTITIES.PROJECTILE_ARROW_1:
        element = new Projectile(data);
        break;

      case helpers.ENTITIES.ROCK:
        element = new Rock();
        break;

      case helpers.ENTITIES.CHEST:
        element = new Chest(data);
        break;

      case helpers.ENTITIES.FOUNTAIN:
        element = new Fountain(data);
        break;

      case helpers.ENTITIES.TEXT_EVENT:
        element = new TextEvent(data);
        break;

      // TODO: refactor me.
      // All the rest are items.
      default:
        element = new Item(data);
        break;
    }

    this.fixTilePosition(element.position, data.position.y, data.position.x)
    this.level.add(element)

    if (
      element instanceof Enemy ||
      element instanceof NPC ||
      element instanceof Character
    ) {
      element.addBehaviour(new GameObject, this)
    }

    element.userData = data
    return element
  }

  createTiles (mapkind = 'grass') {
    var width = this.level.mapwidth;

    for (let i = 0, l = this.grid.length; i < l; i++) {
      const tile = this.grid[i];

      if (tile & helpers.TILE_TYPE.EMPTY) {
        continue;
      }

      const x = (i % width);
      const y = Math.floor(i / width);

      // map 3d coordinates (-width/2~width/2 x -height/2~height/2)
      this.addTile(mapkind, tile, y, x);
    }
  }

  addTile (mapkind, type, x, y) {
    var resource = null
      , group = null

    if (type & helpers.TILE_TYPE.FLOOR) {
      resource = 'tile-'+mapkind+'-ground'

    } else if (type & helpers.TILE_TYPE.WALL) {
      resource = (type & helpers.CORNER) ? null : 'tile-'+mapkind+'-wall'
    }

    // ignore corners for a while
    if (resource === null) return

    var tile = ResourceManager.createTileMesh(resource)

    // set tile position
    this.fixTilePosition(tile.position, x, y)

    if (type & helpers.TILE_TYPE.FLOOR) {
      group = this.ground

      // keep tile x/y reference on Object3D
      tile.userData.x = x
      tile.userData.y = y
      tile.userData.type = "walkable";

      tile.position.y = -0.5;
      tile.rotation.x = Math.PI / 2;

      //
      // Add wall tiles on room connections
      //
      if (type & helpers.DIRECTION.NORTH) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y + 1);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y + 1);

      } else if (type & helpers.DIRECTION.SOUTH) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y - 1);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y - 1);

        // double sized
        // this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        // this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x + 1, y);
        // this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y - 1);
        // this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x + 1, y - 1);

      } else if (type & helpers.DIRECTION.EAST) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x - 1, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x - 1, y);

      } else if (type & helpers.DIRECTION.WEST) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x + 1, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x + 1, y);
      }

    } else if (type & helpers.TILE_TYPE.WALL) {
      group = this.wall

      tile.position.y = 1
      tile.rotation.x = Math.PI;

      tile.userData.type = "wall";

      if (type & helpers.DIRECTION.NORTH) {
        tile.position.z += config.TILE_SIZE / 2 // - config.WALL_THICKNESS / 2

      } else if (type & helpers.DIRECTION.SOUTH) {
        tile.position.z -= config.TILE_SIZE / 2 // - config.WALL_THICKNESS / 2

      } else if (type & helpers.DIRECTION.EAST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x -= config.TILE_SIZE / 2 // + config.WALL_THICKNESS / 2

      } else if (type & helpers.DIRECTION.WEST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x += config.TILE_SIZE / 2 // - config.WALL_THICKNESS / 2
      }
    }

    group.push(tile)
    this.level.add(tile)
  }

  fixTilePosition(vec, x, y) {
    const xlen = this.level.mapwidth;
    const ylen = this.grid.length / xlen;

    vec.x = (x - (ylen / 2)) * config.TILE_SIZE
    vec.z = (y - (xlen / 2)) * config.TILE_SIZE

    return vec
  }

  getTileAt ( x, y ) {

    if ( 'x' in x && 'y' in x ) {
      y = x.y
      x = x.x
    }

    return this.ground.find(tile => (tile.userData.x === y && tile.userData.y === x));

  }

  cleanup () {
    let l = this.ground.length;
    while (l--) this.ground[l].parent.remove(this.ground[l])

    l = this.wall.length;
    while (l--) this.wall[l].parent.remove(this.wall[l])

    this.ground = []
    this.wall = []
  }

}
