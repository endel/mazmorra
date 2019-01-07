import Factory from './Factory'

import TileSelectionPreview from '../../elements/TileSelectionPreview'
import LevelUp from '../../elements/effects/LevelUp';

import CharacterController from '../../behaviors/CharacterController'
import { Resources } from '../../elements/character/Resources';

import { enterRoom, getClientId } from '../../core/network'
import helpers from "../../../shared/helpers"

import { doorSound, coinSound } from '../../core/sound';

export default class Level extends THREE.Object3D {

  constructor (hud, camera) {

    super()

    this.hud = hud
    this.camera = camera

    // this.room = this.enterRoom('grass')
    this.room = this.enterRoom('dungeon')

    this.entities = {}
    this.progress = 0;

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

    if (e.target.userData.type === "walkable") {
      walkableObject = e.target
    }

    this.setTileSelection(walkableObject)
  }

  onMouseOut(e) {
    this.setTileSelection(null)
  }

  enterRoom (name, options = {}) {
    this.room = enterRoom(name, options)

    this.room.onStateChange.addOnce((state) => this.setup(state));

    this.room.onError.add((err) => console.error(err));
    this.room.onLeave.add(() => this.cleanup());

    this.room.onMessage.add((payload) => {
      let [ evt, data ] = payload
      if (evt === "goto") {
        this.room.onLeave.addOnce(() => this.room = this.enterRoom('dungeon', data))

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
            // SET GLOBAL CURRENT PLAYER OBJECT
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

        // Go back to lobby if current player has died
        // (After 5 seconds)
        if (change.path.id === getClientId()) {
          this.dispatchEvent({ type: 'died' });
          setTimeout(() => {
            this.room.onLeave.addOnce(() => this.enterRoom('dungeon', { progress: 1 }));
            this.room.leave();
          }, 4000);
        }
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

    // play coin sound when current player increases his gold
    this.room.listen("entities/:id/gold", (change) => {
      if (change.operation === "replace" && change.path.id === getClientId()) {
        coinSound.play();
      }
    });
  }

  createPlayerBehaviour (entity) {
    entity.addBehaviour(new CharacterController, this.camera, this.room)
    // window.createPlayerBehaviour = () => entity.addBehaviour(new CharacterController, this.camera, this.room)

    this.hud.setPlayerObject(entity)
  }

  setInitialState (state) {
    Resources.init();

    window.IS_DAY = state.daylight
    this.progress = state.progress;

    if (this.mapkindAestetics) {
      clearInterval(this.mapkindAestetics);
      this.mapkindAestetics = undefined;
    }

    // The point-light improves readability of room connections (slightly shadowed)
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.z = 500;
    this.add(pointLight);

    // Global ambient light
    var light = new THREE.AmbientLight(0xffffff); // soft white light
    this.add(light);
    window.light = light

    /**
     * Custom aestetics per mapkind
     */
    if (state.mapkind === "inferno") {
      // Moving inferno walls
      const infernoWallTile = ResourceManager.get('tile-inferno-wall');
      this.mapkindAestetics = setInterval(() => infernoWallTile.offset.y += 0.01, 50);

    } else if (state.mapkind === "ice") {

    }

    if (state.daylight) {
      pointLight.intensity = 0.25;
      light.intensity = 1;

    } else {
      // TODO: possible to play around with luminosity with different kinds of maps
      pointLight.intensity = 0.05;
      light.intensity = 0.05
    }

    this.add(this.camera)
    this.add(this.selectionLight)
    this.add(this.clickedTileLight)

    this.factory.setGrid(state.grid)

    if (state.mapkind === "lobby") {
      this.factory.createTiles('castle');

    } else {
      this.factory.createTiles(state.mapkind)
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
