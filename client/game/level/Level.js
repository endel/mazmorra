import Factory from './Factory'

import TileSelectionPreview from '../../elements/TileSelectionPreview'

import CharacterController from '../../behaviors/CharacterController'

import { enterRoom, getClientId } from '../../core/network'

export default class Level extends THREE.Object3D {

  constructor (hud, camera) {

    super()

    this.hud = hud
    this.camera = camera

    this.room = this.enterRoom('grass')

    this.patchId = 0

    this.entities = {}

    this.clickedTileLight = new THREE.SpotLight(config.COLOR_RED, 0.5, 30);
    this.clickedTileLight.penumbra = 0.8

    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.selectionLight.penumbra = 0.8
    this.selection = new TileSelectionPreview(this.selectionLight, this.hud)

    this.factory = new Factory(this)

    this.addEventListener( "click", this.onClick.bind(this) )
    this.addEventListener( "mouseover", this.onMouseOver.bind(this) )
    this.addEventListener( "mouseout", this.onMouseOut.bind(this) )

  }

  onClick (e) {

    this.playerAction()

  }

  onMouseOver (e) {

    let walkableObject = null

    if ( e.target.userData.type === "walkable" ) {

      walkableObject = e.target

    } else if ( e.target.userData.position ) {

      walkableObject = this.factory.getTileAt( e.target.userData.position )

    } else if ( e.target.parent.userData.position ) {

      walkableObject = this.factory.getTileAt( e.target.parent.userData.position )

    } else if ( e.path.length > 1 ) {

      // TODO: this might be unecessary
      // try to select over tile through intersection path

      let intersection = e.path.filter(i => i.object.userData.type === "walkable" || i.object.userData.position)[0]

      if ( ! intersection )  { return }

      if ( intersection.object.userData.position ) {

        walkableObject = this.factory.getTileAt( intersection.object.userData.position )

      } else {

        walkableObject = intersection.object

      }

    }

    this.setTileSelection( walkableObject )

  }

  onMouseOut (e) {

    this.setTileSelection( null )

  }

  enterRoom (name, options = {}) {
    this.room = enterRoom(name, options)

    this.room.on('update', this.onRoomUpdate.bind(this))

    this.room.on('error', (err) => console.error(arguments))

    this.room.on('data', (payload) => {
      let [ evt, data ] = payload

      if (evt === "goto") {

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
    this.hud.setPlayerObject(entity)
  }

  onRoomUpdate (state, patches) {
    // console.log(patches)

    if (!patches) {
      this.dispatchEvent( { type: 'setup', state: state } )

      // first level setup
      this.setInitialState(state)

    } else {
      this.patchId++
      patches.map(patch => {

        if (patch.op === "remove" && patch.path.indexOf("/entities") !== -1 && patch.path.indexOf("/action") === -1) {
          let [ _, index ] = patch.path.match(/entities\/([a-zA-Z0-9_-]+)/)
          this.removeEntity(this.entities[ index ])
          delete this.entities[ index ]

        } else if (patch.op === "add" && patch.path.match(/\/entities\/([a-zA-Z0-9_-]+)$/)) {
          // create new player
          let entity = this.factory.createEntity(patch.value)
          this.entities[ entity.userData.id ] = entity

          if (entity.userData.id === getClientId()) {
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
    window.IS_DAY = state.daylight

    if (state.daylight) {
      // ambient light
      var light = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.add( light );
    }

    this.add(this.camera)
    this.add(this.selectionLight)
    this.add(this.clickedTileLight)

    this.factory.setGrid(state.grid)
    this.factory.createTiles(state.mapkind)

    for (var id in state.entities) {
      this.entities[ id ] = this.factory.createEntity(state.entities[ id ])
    }
  }

  setTileSelection (object) {

    if (!object) {

      if (this.selection.parent) {

        this.selection.target = []
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
        this.selectionLight.position.set(object.position.x, 1, object.position.z)
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
    if (object.parent) {
      object.parent.remove(object)
    }

    object.getEntity().destroy()

  }

  playerAction (targetPosition) {

    this.clickedTileLight.intensity = 1
    this.clickedTileLight.position.copy(this.selectionLight.position)
    this.clickedTileLight.target = this.selectionLight.target

    this.room.send(['pos', {
      x: this.targetPosition.x,
      y: this.targetPosition.y
    }])

  }

  cleanup () {
    this.factory.cleanup()

    // remove 'selection' from scene

    this.remove(this.selection)
    this.remove(this.camera)

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

    var i = this.children.length;
    while (i--) {
      let object = this.children[i]
      if (object.__ENTITY__) object.getEntity().destroy()
      this.remove(object)
    }

  }

}
