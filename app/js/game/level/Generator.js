import Dungeon from '../../core/Dungeon'
import helpers from '../../core/helpers'

var materials = {}
var geometries = {}

export default class LevelGenerator {

  constructor (container) {
    this.map = null
    this.container = container

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
  // generate (gridSize = {x: 16, y: 16}, minRoomSize = {x: 4, y: 4}, maxRoomSize = {x: 16, y: 16}, maxRooms = 24) {
  generate (gridSize = {x: 64, y: 64}, minRoomSize = {x: 8, y: 8}, maxRoomSize = {x: 16, y: 16}, maxRooms = 24) {
    return Dungeon.generate(gridSize, minRoomSize, maxRoomSize, maxRooms)
  }

  createElements (grid) {
    var xlen = grid.length
      , ylen = grid[0].length;

    // // ambient light
    // var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    // container.add( light );

    for (var x = 0; x < xlen; ++x) {
      for (var y = 0; y < ylen; ++y) {
        var tile = grid[x][y];

        if (tile & helpers.TILE_TYPE.EMPTY) {
          continue;
        }

        // map 3d coordinates (-width/2~width/2 x -height/2~height/2)
        this.addTile(tile, x - (xlen / 2), y - (ylen / 2));
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

    var texture = ResourceManager.get(resource)
      , material = materials[resource] || new THREE.MeshPhongMaterial( {
        // color: 0xa0adaf,
        // specular: 0x111111,
        // shininess: 60,
        shading: THREE.FlatShading,
        map: texture,
        side: THREE.DoubleSide
      } )
      , geometry = geometries[resource] || new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
      , tile = new THREE.Mesh(geometry, material)

    // cache material
    if (!materials[resource]) materials[resource] = material
    if (!geometries[resource]) geometries[resource] = geometry

    texture.repeat.set(3, 3)

    // set tile position
    tile.position.x = x * TILE_SIZE;
    tile.position.z = y * TILE_SIZE;

    if (type & helpers.TILE_TYPE.FLOOR) {
      group = this.ground

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

}
