import Factory from './Factory'

import TileSelectionPreview from '../../elements/TileSelectionPreview'
import LevelUp from '../../elements/effects/LevelUp';

import CharacterController from '../../behaviors/CharacterController'
import { Resources } from '../../elements/character/Resources';

import { enterRoom, getClientId } from '../../core/network'
import helpers from "../../../shared/helpers"

import * as sounds from '../../core/sound';
import { doorSound, playRandom } from '../../core/sound';

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

    // first level setup
    this.room.onStateChange.addOnce((state) => this.setInitialState(state));

    this.room.onError.add((err) => console.error(err));
    this.room.onLeave.add(() => this.cleanup());

    this.room.onMessage.add((payload) => {
      const [ evt, data ] = payload
      if (evt === "goto") {
        this.room.onLeave.addOnce(() => this.room = this.enterRoom('dungeon', data))

        this.room.leave()
        doorSound.play();

      } else if (evt === "sound") {
        this.playSound(data);
      }
    });

    return this.room
  }

  setupStateCallbacks () {
    var state = this.room.state;

    state.entities.onAdd = (entity, key) => {
      // create new player
      const object = this.factory.createEntity(entity)
      object.userData = entity;

      this.entities[object.userData.id] = object;

      if (object.userData.id === getClientId()) {
        // SET GLOBAL CURRENT PLAYER OBJECT
        window.player = object;
        this.createPlayerBehaviour(object, entity);

        /**
         * update inventory
         */
        entity.quickInventory.onChange = (_) => { this.hud.getEntity().emit('update-inventory', 'quickInventory'); }
        entity.quickInventory.triggerAll();

        entity.inventory.onChange = (_) => { this.hud.getEntity().emit('update-inventory', 'inventory'); }
        entity.inventory.triggerAll();

        // update inventory
        entity.equipedItems.onChange = (_) => { this.hud.getEntity().emit('update-inventory', 'equipedItems'); }
        entity.equipedItems.triggerAll();
      }

      // may not be a player
      if (entity.hp) {
        entity.hp.onChange = (changes) => {
          for (const change of changes) {
            if (change.field === "current") {
              if (change.value <= 0) {
                object.getEntity().emit('died');

                // Go back to lobby if current player has died
                // (After 5 seconds)
                if (key === getClientId()) {
                  this.dispatchEvent({ type: 'died' });
                  setTimeout(() => {
                    this.room.onLeave.addOnce(() => this.enterRoom('dungeon', { progress: 1 }));
                    this.room.leave();
                  }, 4000);
                }
              }
            }
          }
        };
      }
      // entity.hp.triggerAll() ??


      /**
       * Entity Change:
       * Level / Position / Direction
       */
      entity.onChange = (changes) => {
        for (const change of changes) {
          if (change.field === "lvl" && change.value !== change.previousValue) {
            object.add(new LevelUp())

            this.factory.createEntity({
              type: helpers.ENTITIES.TEXT_EVENT,
              text: 'Level Up!',
              kind: 'warn',
              ttl: 500,
              special: true,
              position: object.userData.position
            });

          } else if (change.field === "position") {
            object.getEntity().emit('nextPoint', this.factory.fixTilePosition(object.position.clone(), change.value.y, change.value.x));

          } else if (change.field === "direction") {
            object.direction = change.value;

          } else if (change.field === "action") {
            const actionType = change.value && change.value.active && change.value.type;
            object.getEntity().emit(actionType, change.value);

          } else if (change.field === "active" && change.value !== change.previousValue) {
            object.getEntity().emit('active', change.value);
          }

        }
      };
      // entity.triggerAll() ??
    };
    state.entities.triggerAll();

    state.entities.onRemove = (entity, key) => {
      if (this.entities[key]) {
        this.removeEntity(this.entities[key])
        delete this.entities[key];
      }
    }
  }

  createPlayerBehaviour (object, data) {
    object.addBehaviour(new CharacterController, this.camera, this.room)
    this.hud.setPlayerObject(object, data);

    // allow to consume items!
    this.hud.addEventListener("use-item", (e) => {
      e.stopPropagation = true;
      this.room.send(["use-item", {
        inventoryType: e.inventoryType,
        itemId: e.itemId
      }]);
    });

    this.hud.addEventListener("inventory-drag", (e) => {
      e.stopPropagation = true;
      this.room.send(["inventory-drag", {
        fromInventoryType: e.fromInventoryType,
        toInventoryType: e.toInventoryType,
        itemId: e.itemId,
        switchItemId: e.switchItemId,
      }]);
    });

  }

  setInitialState (state) {
    this.dispatchEvent({ type: 'setup', state: state })

    window.IS_DAY = state.daylight
    this.mapkind = state.mapkind;
    this.mapwidth = state.width;
    this.progress = state.progress;

    Resources.init();

    //
    // Display map name + progress
    //
    if (this.progress !== 1) {
      this.hud.levelText.text = `${this.mapkind} ${this.progress}`;

    } else {
      this.hud.levelText.text = `Village`;
    }

    //
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
    if (this.mapkind === "inferno") {
      // Moving inferno walls
      const infernoWallTile = ResourceManager.get('tile-inferno-wall');
      this.mapkindAestetics = setInterval(() => infernoWallTile.offset.y += 0.01, 50);

    } else if (this.mapkind === "ice") {
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

    if (this.mapkind === "lobby") {
      this.factory.createTiles('castle');

    } else {
      this.factory.createTiles(this.mapkind)
    }

    this.setupStateCallbacks();
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

  playSound (soundName) {
    const sound = sounds[soundName + "Sound"];

    if (Array.isArray(sound)) {
      playRandom(sound);

    } else if (sound) {
      sound.play();
    }
  }

  playerAction (targetPosition) {
    if (!this.targetPosition) return;

    this.clickedTileLight.intensity = 1
    this.clickedTileLight.position.copy(this.selectionLight.position)
    this.clickedTileLight.target = this.selectionLight.target

    const moveCommand = {
      x: this.targetPosition.x,
      y: this.targetPosition.y,
    };

    if (App.cursor.isDragging) {
      /**
       * Allow to drop item to the floor
       */
      const draggingItemSprite = App.cursor.getDraggingItem();
      const item = draggingItemSprite.userData;

      /**
       * Animate & remove item from cursor.
       */
      App.tweens.
        add(draggingItemSprite.scale).
        to(draggingItemSprite.initialScale, 300, Tweener.ease.quintOut);
      App.tweens.
        add(draggingItemSprite.material).
        to({ opacity: 0 }, 300, Tweener.ease.quintOut).
        then(() => {
          if (draggingItemSprite.parent) {
            draggingItemSprite.parent.remove(draggingItemSprite)
          }
        });

      // stop dragging
      App.cursor.dispatchEvent({
        type: "drag",
        item: false
      });

      this.room.send(['drop-item', {
        inventoryType: item.inventoryType,
        itemId: item.itemId
      }]);
      return;
    }

    this.room.send(['move', moveCommand]);
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
