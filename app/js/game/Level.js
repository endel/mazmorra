import Colyseus from 'colyseus.js'

import Generator from './level/Generator'

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

  constructor (scene, hud, camera) {
    super()

    this.scene = scene
    this.hud = hud
    this.camera = camera

    this.colyseus = new Colyseus('ws://localhost:3553')
    this.room = this.colyseus.join('grass')
    this.room.on('update', this.onRoomUpdate.bind(this))
    this.room.on('error', (err) => console.error(err))
    this.patchId = 0

    this.entities = {}

    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.selection = new TileSelectionPreview(this.selectionLight, this.hud.selectionText)
    this.scene.add(this.selectionLight)

    this.generator = new Generator(this, this.scene, this.colyseus)

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
    if (!patches) {
      this.emit('setup', state)

      // first level setup
      this.setInitialState(state)

    } else {
      this.patchId++
      patches.map(patch => {
        if (patch.op === "remove" && patch.path.indexOf("/entities") !== -1 && patch.path.indexOf("/action") === -1) {
          let [ _, index ] = patch.path.match(/entities\/([a-zA-Z0-9_-]+)/)
          this.removeEntity(this.entities[ index ])
          delete this.entities[ index ]

        } else if (patch.op === "add" && patch.path.indexOf("/entities") !== -1 && patch.path.indexOf("/action") === -1) {
          console.log(patch)
          // create new player
          let entity = this.generator.createEntity(patch.value)
          this.entities[ entity.userData.id ] = entity

          if (entity.userData.id === this.colyseus.id) {
            entity.addBehaviour(new CharacterController, this.camera)
            this.playerEntity = entity.getEntity()
          }

        } else if (patch.path.indexOf("/entities/") !== -1) {
          let [ _, id, attribute ] = patch.path.match(/entities\/([a-zA-Z0-9_-]+)\/(.*)/)
          var entity = this.entities[ id ].getEntity()
          entity.emit('patch', state.entities[ id ], {
            op: patch.op,
            path: attribute,
            value: patch.value
          }, this.patchId)
        }

      })
    }
  }

  setInitialState (state) {
    console.log("setInitialState", state)

    window.IS_DAY = state.daylight

    if (state.daylight) {
      // ambient light
      var light = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.scene.add( light );
    }

    this.generator.setGrid(state.grid)
    this.generator.createTiles(state.mapkind)

    for (var id in state.entities) {
      this.entities[ id ] = this.generator.createEntity(state.entities[ id ])
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

        // search for entities inside highlighted tile
        var entities = []
        for (var id in this.entities) {
          if (this.entities[ id ].userData.position.y == object.userData.x &&
              this.entities[ id ].userData.position.x == object.userData.y) {
            entities.push(this.entities[ id ])
          }
        }
        this.selection.target = entities

        this.selectionLight.intensity = 0.5
        this.selectionLight.position.set(object.position.x, 2, object.position.z)
        this.selectionLight.target = object
      }
    }
  }

  getEntityAt (position) {
    console.log('getEntityAt', position)
    for (var id in this.entities) {
      if (this.entities[ id ].userData.position.x == position.x &&
          this.entities[ id ].userData.position.y == position.y) {
        return this.entities[ id ]
      }
    }
  }

  removeEntity (object) {
    object.parent.remove(object)
    object.getEntity().destroy()
  }

  playerAction () {
    if (!this.targetPosition) return false;

    this.playerEntity.emit('action-requested')

    this.room.send(['pos', {
      x: this.targetPosition.x,
      y: this.targetPosition.y
    }])
  }

}
