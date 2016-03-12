import EventEmitter from 'tiny-emitter'

import Colyseus from 'colyseus.js'
import Generator from './Generator'

import TileSelectionPreview from '../../entities/TileSelectionPreview'

import CharacterController from '../../behaviors/CharacterController'
import HUDController from '../../behaviors/HUDController'

import credentials from '../../web/credentials'

export default class Level extends EventEmitter {

  constructor (scene, hud, camera) {
    super()

    this.scene = scene
    this.hud = hud
    this.camera = camera

    // this.colyseus = new Colyseus('ws://192.168.0.2:3553')
    // this.colyseus = new Colyseus('ws://localhost:3553')
    this.colyseus = new Colyseus(`ws://${ window.location.hostname }:3553`)
    this.room = this.enterRoom('grass')

    this.patchId = 0

    this.entities = {}

    this.clickedTileLight = new THREE.SpotLight(COLOR_RED, 0.5, 30);
    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.selection = new TileSelectionPreview(this.selectionLight, this.hud.selectionText)

    this.generator = new Generator(this, this.scene, this.colyseus)
  }

  enterRoom (name, options = {}) {
    options.token = credentials.token
    this.room = this.colyseus.join(name, options)
    this.room.on('update', this.onRoomUpdate.bind(this))
    this.room.on('error', (err) => console.error(arguments))
    this.room.on('data', (payload) => {
      let [ event, data ] = payload
      if (event === "goto") {
        this.room.on('leave', (err) => {
          this.cleanup();
          this.room = this.enterRoom(data.identifier, data)
        })
        this.room.leave()
      }
    })
    return this.room
  }

  createPlayerBehaviour (entity) {
    entity.addBehaviour(new CharacterController, this.camera, this.room)

    this.hud.getEntity().detachAll()
    this.hud.addBehaviour(new HUDController, entity)
    // this.playerEntity = entity.getEntity()
  }

  onRoomUpdate (state, patches) {
    if (!patches) {
      this.emit('setup', state)

      // first level setup
      this.setInitialState(state)

    } else {
      this.patchId++
      patches.map(patch => {
        console.log(patch)

        if (patch.op === "remove" && patch.path.indexOf("/entities") !== -1 && patch.path.indexOf("/action") === -1) {
          let [ _, index ] = patch.path.match(/entities\/([a-zA-Z0-9_-]+)/)
          this.removeEntity(this.entities[ index ])
          delete this.entities[ index ]

        } else if (patch.op === "add" && patch.path.match(/\/entities\/([a-zA-Z0-9_-]+)$/)) {
          // create new player
          let entity = this.generator.createEntity(patch.value)
          this.entities[ entity.userData.id ] = entity

          if (entity.userData.id === this.colyseus.id) {
            this.createPlayerBehaviour(entity)
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

    this.scene.add(this.camera)
    this.scene.add(this.selectionLight)
    this.scene.add(this.clickedTileLight)

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
    for (var id in this.entities) {
      if (this.entities[ id ].userData.position.x == position.x &&
          this.entities[ id ].userData.position.y == position.y) {
        return this.entities[ id ]
      }
    }
  }

  removeEntity (object) {
    // entity may already be removed by this client somehow (text event?)
    if (object.parent)
      object.parent.remove(object)
    object.getEntity().destroy()
  }

  playerAction () {
    if (!this.targetPosition) return false;

    this.clickedTileLight.intensity = 1
    this.clickedTileLight.position.copy(this.selectionLight.position)
    this.clickedTileLight.target = this.selectionLight.target

    this.room.send(['pos', {
      x: this.targetPosition.x,
      y: this.targetPosition.y
    }])
  }

  cleanup () {
    this.generator.cleanup()

    // remove 'selection' from scene
    this.scene.remove(this.selection)
    this.scene.remove(this.camera)

    for (var id in this.entities) {
      this.entities[ id ].getEntity().destroy() // destroy from entity-component system
      if (this.entities[ id ].parent) {
        // call destroy method if it's implemented
        if (this.entities[ id ].destroy) {
          this.entities[ id ].destroy()
        }

        // remove from display list
        this.entities[ id ].parent.remove(this.entities[ id ])
      }
      delete this.entities[ id ] // remove from memory
    }

    var i = this.scene.children.length;
    while (i--) {
      let object = this.scene.children[i]
      if (object.__ENTITY__) object.getEntity().destroy()
      this.scene.remove(object)
    }
  }

}
