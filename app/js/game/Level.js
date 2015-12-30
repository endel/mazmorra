import Colyseus from 'colyseus.js'
import PF from 'pathfinding'

import Generator from './level/Generator'

import Network from '../behaviors/Player/Network'
import GameObject from '../behaviors/GameObject'
import TileSelectionPreview from '../entities/TileSelectionPreview'

import CharacterController from '../behaviors/CharacterController'

import Character from '../entities/Character'
import Enemy from '../entities/Enemy'
import Item from '../entities/Item'
import Chest from '../entities/Chest'
import LightPole from '../entities/LightPole'
import Portal from '../entities/Portal'
import Door from '../entities/Door'
import EventEmitter from 'tiny-emitter'

export default class Level extends EventEmitter {

  constructor (scene, camera) {
    super()

    this.scene = scene
    this.camera = camera

    this.colyseus = new Colyseus('ws://localhost:3553')
    this.room = this.colyseus.join('grass')
    this.room.on('update', this.onRoomUpdate.bind(this))
    this.room.on('error', (err) => console.error(err))

    this.entities = []
    this.players = []

    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.selection = new TileSelectionPreview(this.selectionLight)
    this.scene.add(this.selectionLight)

    this.generator = new Generator(this.scene)

    // this.entities = this.generator.createEntities()

    // var lightPole = new LightPole()
    // lightPole.position.copy(character.position)
    // lightPole.position.z -= 10
    // lightPole.position.x -= 10
    // this.scene.add(lightPole)
    //
    // var lightPole = new LightPole()
    // lightPole.position.copy(character.position)
    // lightPole.position.z -= 30
    // lightPole.position.x = 5
    // this.scene.add(lightPole)
    //
    // var enemy = new Enemy('rat')
    // enemy.position.x = -6
    // this.scene.add(enemy)
    //
    // var enemy = new Enemy('bat')
    // enemy.position.x = -10
    // this.scene.add(enemy)
    //
    // // var enemy = new Enemy('demon')
    // // enemy.position.x = -12
    // // this.scene.add(enemy)
    //
    // var enemy = new Enemy('green-snake')
    // enemy.position.x = -8
    // this.scene.add(enemy)
    //
    // var item = new Item('sword')
    // item.position.x = 3
    // this.scene.add(item)
    //
    // var item = new Item('gold')
    // item.position.z = 3
    // item.position.x = 3
    // this.scene.add(item)
    //
    // var item = new Item('life-potion')
    // item.position.z = 3
    // item.position.x = 6
    // this.scene.add(item)
    //
    // var item = new Item('mana-potion')
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('elixir-potion')
    // item.position.x = -3
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('mana-heal')
    // item.position.x = -6
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('life-heal')
    // item.position.x = -9
    // item.position.z = 3
    // this.scene.add(item)
    //
    // var item = new Item('shield-metal')
    // item.position.x = 6
    // this.scene.add(item)
    //
    // var chest = new Chest()
    // chest.position.x = -3
    // this.scene.add(chest)
  }

  onRoomUpdate (state, patches) {
    console.log("onRoomUpdate", state, patches)
    if (!patches) {
      this.emit('setup', state)

      // first level setup
      this.setInitialState(state)

    } else {
      patches.map(patch => {
        if (patch.op === "add" && patch.path.indexOf("/players") !== -1) {
          // create new player
          let character = this.generator.createPlayer(patch.value)
          character.addBehaviour(new GameObject, this.generator)
          this.players.push(character)

        } else if (patch.path.indexOf("/players/") !== -1) {
          let [ _, index, attribute ] = patch.path.match(/players\/([0-9])\/(.*)/)
          var entity = this.players[ parseInt(index) ].getEntity()
          entity.emit('patch', state.players[index], {
            op: patch.op,
            path: attribute,
            value: patch.value
          })
        }

      })
    }
  }

  setInitialState (state) {
    console.log("setInitialState", state)

    if (state.daylight) {
      // ambient light
      var light = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.scene.add( light );
    }

    this.generator.setGrid(state.grid)
    this.generator.createTiles(state.mapkind)

    for (var i=0, l=state.entities.length; i<l; i++) {
      let entity = this.generator.createEntity(state.entities[ i ])
      entity.addBehaviour(new GameObject, this.generator)
      this.entities.push(entity)
    }

    // create players
    for (var i=0, l=state.players.length; i<l; i++) {
      let character = this.generator.createPlayer(state.players[ i ])
      character.addBehaviour(new GameObject, this.generator)
      this.players.push(character)

      if (state.players[ i ].id === this.colyseus.id) {
        character.addBehaviour(new CharacterController, this.camera)
        character.addBehaviour(new Network, this.colyseus, this.room)
        this.playerEntity = character.getEntity()
      }
    }
  }

  setTileSelection (object) {
    if (!object) {
      if (this.selection.parent) {
        this.selection.parent.remove(this.selection)
        this.selectionLight.intensity = 0
        this.targetPosition = null
      }

    } else {
      if (this.selection.parent !== object) {
        object.add(this.selection)
        this.targetPosition = object.userData
        this.selection.target = this.entities.filter(entity => (entity.userData.position.x == object.userData.x && entity.userData.position.y == object.userData.y))
        this.selectionLight.intensity = 0.5
        this.selectionLight.position.set(object.position.x, 2, object.position.z)
        this.selectionLight.target = object
      }
    }
  }

  playerAction () {
    if (!this.targetPosition) return false;

    this.room.send(['pos', {
      x: this.targetPosition.x,
      y: this.targetPosition.y
    }])

    // this.playerEntity.emit('action', {
    //   x: this.targetPosition.x,
    //   y: this.targetPosition.y
    // })

    // // clear previous timeouts
    // // TODO: we shouldn't need this!
    // this.timeouts.forEach(timeout => clearTimeout(timeout))
    // this.timeouts = []
    //
    // var finder = new PF.AStarFinder(); // { allowDiagonal: true, dontCrossCorners: true }
    //
    // var path = finder.findPath(
    //   this.player.userData.x, this.player.userData.y,
    //   this.targetPosition.y, this.targetPosition.x, // TODO: why need to invert x/y here?
    //   this.pathfinder.clone() // FIXME: we shouldn't create leaks that way!
    // );
    //
    // // first block is always the starting point, we don't need it
    // path.shift()
    //
    // var timeout = 200
    // path.forEach((point,i) => {
    //   var pos = {x: 0, z: 0}
    //   this.generator.fixTilePosition(pos, point[1], point[0]) // TODO: why need to invert x/y here?
    //
    //   this.timeouts.push(
    //     setTimeout(() => this.playerNetwork.move(pos, point[0], point[1]), timeout * i)
    //   )
    // })
  }

}
