import Factory from './Factory'

import TileSelectionPreview from '../../elements/TileSelectionPreview'
import LevelUp from '../../elements/effects/LevelUp';

import CharacterController from '../../behaviors/CharacterController'

import { enterRoom, getClientId } from '../../core/network'
import helpers from "../../../shared/helpers"

import { doorSound } from '../../core/sound';

export default class Level extends THREE.Object3D {

  constructor (hud, camera) {

    super()

    this.hud = hud
    this.camera = camera

    this.room = this.enterRoom('grass')

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

    this.room.onStateChange.addOnce((state) => this.setup(state));

    this.room.onError.add((err) => console.error(err));

    this.room.onMessage.add((payload) => {
      let [ evt, data ] = payload
      if (evt === "goto") {
        this.room.onLeave.addOnce(() => {
          this.cleanup();
          this.room = this.enterRoom(data.identifier, data)
        })

        this.room.leave()
        doorSound.play()
      }
    });

    return this.room
  }

  setup (state) {
    this.dispatchEvent({ type: 'setup', state: state })

    // first level setup
    this.setInitialState(state);

    var entitiesToUpdate = {};
    this.room.onStateChange.add((state) => {
      for (var entityId in entitiesToUpdate) {
        var entityToUpdate = entitiesToUpdate[entityId];
        delete entitiesToUpdate[entityId];

        var object = this.entities[entityId];

        if (!object) {
          console.warn("entity", entityId, "is not on client. still receiving data from server.");
          return;
        }

        object.userData = state.entities[entityId];
        object.userData.x = state.entities[entityId].position.x;
        object.userData.y = state.entities[entityId].position.y;

        // TODO: possible leak here
        if (
          entityToUpdate.x !== undefined ||
          entityToUpdate.y !== undefined
        ) {
          object.getEntity().emit('nextPoint', this.factory.fixTilePosition(object.position.clone(), object.userData.y, object.userData.x))
        }

        if (entityToUpdate.action) {
          let actionType = object.userData.action && object.userData.action.type;
          object.getEntity().emit(actionType, object.userData.action)
        }

        if (entityToUpdate.active !== undefined) {
          object.getEntity().emit('active', entityToUpdate.active)
        }

          // LEVEL UP text event
        if (entityToUpdate.levelUp) {
          object.add(new LevelUp())

          this.factory.createEntity({
            type: helpers.ENTITIES.TEXT_EVENT,
            text: 'UP',
            kind: 'warn',
            ttl: 500,
            special: true,
            position: object.userData.position
          });
        }
      }
    });

    this.room.listen("entities/:id", (change) => {
      if (change.operation === "remove") {
          this.removeEntity(this.entities[ change.path.id ])
          delete this.entities[ change.path.id ];

      } else if (change.operation === "add") {
          // create new player
          let entity = this.factory.createEntity(change.value)
          this.entities[ entity.userData.id ] = entity

          if (entity.userData.id === getClientId()) {
            window.player = entity;
            this.createPlayerBehaviour(entity)
          }
      }
    }, true);


    this.room.listen("entities/:id/position/:axis", (change) => {
      if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};
      entitiesToUpdate[change.path.id][change.path.axis] = change.value;
    }, true);

    this.room.listen("entities/:id/hp/current", (change) => {
      if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};

      if (change.value <= 0) {
        var object = this.entities[change.path.id];
        object.getEntity().emit('died');
      }
    }, true);

    this.room.listen("entities/:id/lvl", (change) => {
      if (change.operation === "replace") {
        if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};
        entitiesToUpdate[change.path.id].levelUp = true;
      }
    }, true);

    this.room.listen("entities/:id/direction", (change) => {
      var object = this.entities[change.path.id];
      object.direction = change.value;
    }, true);


    this.room.listen("entities/:id/action", (change) => {
      if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};
      entitiesToUpdate[change.path.id].action = true;
    });

    this.room.listen("entities/:id/action/lastUpdateTime", (change) => {
      if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};
      entitiesToUpdate[change.path.id].action = true;
    });

    // USE FOUNTAIONS / ITEMS
    this.room.listen("entities/:id/active", (change) => {
      if (!entitiesToUpdate[change.path.id]) entitiesToUpdate[change.path.id] = {};
      entitiesToUpdate[change.path.id].active = change.value;
    });
  }

  createPlayerBehaviour (entity) {
    entity.addBehaviour(new CharacterController, this.camera, this.room)
    this.hud.setPlayerObject(entity)
  }

  setInitialState (state) {
    window.IS_DAY = state.daylight

    if (state.daylight) {
      // ambient light
      var light = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.add( light );
      window.light = light
    }

    this.add(this.camera)
    this.add(this.selectionLight)
    this.add(this.clickedTileLight)

    this.factory.setGrid(state.grid)
    this.factory.createTiles(state.mapkind)
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
    if (!this.targetPosition) return;

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
