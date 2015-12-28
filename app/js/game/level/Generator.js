import Dungeon from '../../core/Dungeon'
import helpers from '../../core/helpers'

import CharacterController from '../../behaviors/CharacterController'

import Character from '../../entities/Character'
import Enemy from '../../entities/Enemy'
import Item from '../../entities/Item'
import Chest from '../../entities/Chest'
import TileSelectionPreview from '../../entities/TileSelectionPreview'
import LightPole from '../../entities/LightPole'
import Door from '../../entities/Door'

export default class LevelGenerator {

  constructor (container) {
    this.container = container

    this.grid = null
    this.rooms = null

    this.ground = []
    this.wall = []
    this.entities = []
  }

  /**
   * @param gridSize {x: 72, y: 72}
   * @param minRoomSize {x: 4, y: 4}
   * @param maxRoomSize {x: 24, y: 24}
   * @param maxRooms 30
   */
  generate (gridSize = {x: 16, y: 16}, minRoomSize = {x: 4, y: 4}, maxRoomSize = {x: 8, y: 8}, maxRooms = 24) {
  // generate (gridSize = {x: 64, y: 64}, minRoomSize = {x: 8, y: 8}, maxRoomSize = {x: 16, y: 16}, maxRooms = 24) {
    let [ grid, rooms ] = Dungeon.generate(gridSize, minRoomSize, maxRoomSize, maxRooms)

    this.rooms = rooms
    this.grid = grid

    // expose 0/1 grid for path finder
    // 0 = walkable
    // 1 = blocked
    console.log(grid)

    return JSON.parse(JSON.stringify(grid)).map(line => {
      return line.map(type => {
        return ((type & helpers.TILE_TYPE.FLOOR) ? 0 : 1)
      })
    })
  }

  createPlayer () {
    var firstRoom = this.rooms[0]
      , lastRoom = this.rooms[ this.rooms.length - 1 ]
      //
    // character start position
    var initX = parseInt(firstRoom.position.x + (firstRoom.size.x / 2))
    var initY = parseInt(firstRoom.position.y + (firstRoom.size.y / 2))
    var character = new Character('man')
    this.fixTilePosition(character.position, initX, initY)
    character.behave(new CharacterController, camera)
    this.container.add(character)

    character.userData.x = initX
    character.userData.y = initY

    console.log(firstRoom)

    return character
  }

  createEntities () {
    var firstRoom = this.rooms[0]
      , lastRoom = this.rooms[ this.rooms.length - 1 ]

    // door start position
    var door = new Door()
    this.container.add(door)


  }

  createTiles () {
    var xlen = this.grid.length
      , ylen = this.grid[0].length;

    // // ambient light
    // var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    // container.add( light );

    for (var x = 0; x < xlen; ++x) {
      for (var y = 0; y < ylen; ++y) {
        var tile = this.grid[x][y];

        if (tile & helpers.TILE_TYPE.EMPTY) {
          continue;
        }

        // map 3d coordinates (-width/2~width/2 x -height/2~height/2)
        this.addTile(tile, x, y);
      }
    }
  }

  addTile (type, x, y) {
    var resource = null
      , group = null

    if (type & helpers.TILE_TYPE.FLOOR) {
      resource = 'tile-rock-ground'

    } else if (type & helpers.TILE_TYPE.WALL) {
      resource = (type & helpers.CORNER) ? null : 'tile-rock-wall'
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

      tile.position.y = -0.5;
      tile.rotation.x = Math.PI / 2;

      //
      // Add wall tiles on room connections
      //
      if (type & helpers.DIRECTION.NORTH) {
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y + 1);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y + 1);

      } else if (type & helpers.DIRECTION.SOUTH) {
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y - 1);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y - 1);

      } else if (type & helpers.DIRECTION.EAST) {
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x - 1, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x - 1, y);

      } else if (type & helpers.DIRECTION.WEST) {
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x + 1, y);
        this.addTile(helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x + 1, y);
      }

    } else if (type & helpers.TILE_TYPE.WALL) {
      group = this.wall

      tile.position.y = 1
      tile.rotation.x = Math.PI;

      if (type & helpers.DIRECTION.NORTH) {
        tile.position.z += TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.SOUTH) {
        tile.position.z -= TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.EAST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x -= TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.WEST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x += TILE_SIZE / 2

      }
    }

    group.push(tile)
    this.container.add(tile)
  }

  fixTilePosition(vec, x, y) {
    var xlen = this.grid.length
      , ylen = this.grid[0].length;

    vec.x = (x - (xlen / 2)) * TILE_SIZE
    vec.z = (y - (ylen / 2)) * TILE_SIZE
    // vec.x = x * TILE_SIZE
    // vec.z = y * TILE_SIZE

    return vec
  }

}
