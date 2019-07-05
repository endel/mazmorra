import Factory from './Factory'

import TileSelectionPreview from '../../elements/TileSelectionPreview'
import LevelUp from '../../elements/effects/LevelUp';

import CharacterController from '../../behaviors/CharacterController'
import { HeroSkinBuilder } from "../../elements/character/HeroSkinBuilder";

import { enterRoom, getClientId } from '../../core/network'
import helpers from "../../../shared/helpers"

import * as sounds from '../../core/sound';
import { doorSound, playRandom } from '../../core/sound';
import { trackEvent } from '../../utils';
import Chat from '../../behaviors/Chat';

export default class Level extends THREE.Object3D {

  constructor (hud, camera) {
    super();

    this.hud = hud;
    this.camera = camera;

    this.entities = {};
    this.progress = 0;

    this.clickedTileLight = new THREE.SpotLight(config.COLOR_RED, 0.5, 30);
    this.clickedTileLight.penumbra = 0.8;

    this.selectionLight = new THREE.SpotLight(0xffffff, 0.5, 30);
    this.selectionLight.penumbra = 0.8;
    this.selection = new TileSelectionPreview(this.selectionLight, this.hud);

    this.factory = new Factory(this);
    this.isPVPAllowed = false;

    this.lastRoomName = 'dungeon';

    // this.room = this.enterRoom('grass')
    this.enterRoom('dungeon', { progress: 1 }).then(room => {
      this.room = room;
    });

    this.addBehaviour(new Chat(), this);

    this.addEventListener("click", this.onClick.bind(this));
    this.addEventListener("mouseover", this.onMouseOver.bind(this));
    this.addEventListener("mouseout", this.onMouseOut.bind(this));

    App.cursor.addEventListener("mouseup", this.playerActionDrop.bind(this));
    App.cursor.addEventListener("distribute-point", this.distributePoint.bind(this));

    // allow to consume items!
    this.hud.addEventListener("use-item", (e) => {
      e.stopPropagation = true;

      this.room.send(["use-item", {
        inventoryType: e.inventoryType,
        itemId: e.itemId
      }]);

      if (e.inventoryType === "purchase") {
        sounds.inventorySound.buy.play();
      }
    });

    this.hud.addEventListener("inventory-drag", (e) => {
      e.stopPropagation = true;

      this.room.send(["inventory-drag", {
        fromInventoryType: e.fromInventoryType,
        toInventoryType: e.toInventoryType,
        itemId: e.itemId,
        switchItemId: e.switchItemId,
      }]);

      if (e.fromInventoryType === "purchase") {
        sounds.inventorySound.buy.play();
      }
    });

    this.hud.addEventListener("inventory-sell", (e) => {
      e.stopPropagation = true;

      this.room.send(["inventory-sell", {
        fromInventoryType: e.fromInventoryType,
        itemId: e.itemId
      }]);

      sounds.inventorySound.sell.play();
    });

    this.hud.addEventListener("checkpoint", (e) => {
      console.log("hud event, checkpoint =>", e.progress);
      this.room.send(["checkpoint", e.progress]);
    });
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

  async enterRoom (name, options = {}) {
    this.cleanup();

    if (options.progress === 1) {
      await this.checkAdPreRoll(name);
    }

    this.room = enterRoom(name, options)

    // first level setup
    this.room.onStateChange.addOnce((state) => this.setInitialState(state));

    this.room.onError.add((err, e, data) => {
      // "black screen" workaround
      // this is real messy!
      if (err === "setState") {
        this.room.leave();
        options.workaround = true;
        this.enterRoom(name, options);
      }
      console.error(err);
    });
    // this.room.onLeave.add(() => this.cleanup());

    this.room.onMessage.add((payload) => {
      const [ evt, data ] = payload;

      if (evt === "checkpoints") {
        this.hud.onOpenCheckPoints(data.filter(n => n !== this.progress).sort((a, b) => a - b));

      } else if (evt === "goto") {
        const params = payload[2];
        const roomName = (data.room) ? data.room : "dungeon";

        if (params.isPortal) {
          sounds.portal.play();
          data.isPortal = true;

        } else if (params.isCheckPoint) {
          sounds.checkpoint.play();
          data.isCheckPoint = true;

        } else {
          doorSound.play();
        }

        player.getEntity().emit('zoom', 1.5);

        this.room.onLeave.addOnce(() => {
          // analytics event
          trackEvent('gameplay-progress', {
            event_category: 'Gameplay',
            event_label: 'Progress',
            value: data.progress
          });

          setTimeout(async () => this.room = await this.enterRoom(roomName, data), 500);
        });

        setTimeout(() => this.room.leave(), 200);


      } else if (evt === "trading-items") {

        // FIXME: this piece of code is repeated in many places!
        // force to open inventory if it's closed
        if (!this.hud.isInventoryOpen()) {
          this.hud.openInventoryButton.onClick();
          this.hud.onToggleInventory();
        }

        this.playSound("approve");

        this.hud.inventory.setTradingItems(data);

      } else if (evt === "sound") {
        this.playSound(data);
      }
    });

    return this.room;
  }

  setupStateCallbacks () {
    var state = this.room.state;

    state.entities.onAdd = (entity, key) => {
      // create new player
      const object = this.factory.createEntity(entity)

      object.userData = entity;
      object.direction = entity.direction; // FIXME: this is duplicated.

      this.entities[object.userData.id] = object;

      if (object.userData.id === getClientId()) {
        // SET GLOBAL CURRENT PLAYER OBJECT
        window.player = object;
        this.createPlayerBehaviour(object, entity);

        // FIXME: this piece of code is duplicated.
        this.hud.getEntity().emit('update-all', entity);

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

                // kill boss camera effect!
                if (entity.isBoss) {
                  this.playSound("killBoss");

                  player.getEntity().emit('target', object);
                  player.getEntity().emit('zoom', 2);

                  setTimeout(() => {
                    player.getEntity().emit('target', player);
                    player.getEntity().emit('zoom', 1);
                  }, 2000);
                }

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

          // } else if (change.field === "position") {
          //   object.getEntity().emit('nextPoint', this.factory.fixTilePosition(object.position.clone(), change.value.y, change.value.x));

          } else if (change.field === "direction") {
            object.direction = change.value;

          } else if (change.field === "action") {
            const actionType = change.value && change.value.active && change.value.type;
            object.getEntity().emit(actionType, change.value);

          } else if (change.field === "active" && change.value !== change.previousValue) {
            object.getEntity().emit('active', change.value);

          } else if (change.field === "isLocked") {
            // change locked
            object.getEntity().emit('update');

          } else if (object.userData.id === getClientId()) {
            if (
              change.field === "pointsToDistribute" ||
              change.field === "equipedItems"
            )  {
              // this.hud.getEntity().emit('update-attribute', 'pointsToDistribute', change.value);
              // FIXME: this piece of code is duplicated
              this.hud.getEntity().emit('update-attributes', entity);

            } else if (
              change.field === "hp" ||
              change.field === "mp" ||
              change.field === "xp" ||
              change.field === "gold" ||
              change.field === "diamond"
            ) {
              this.hud.getEntity().emit('update-bars', entity);
            }
          }

        }
      };

      entity.position.onChange = (changes) => {
        object.getEntity().emit('nextPoint', this.factory.fixTilePosition(object.position.clone(), entity.position.y, entity.position.x));
      }

      entity.position.triggerAll();


      // boss camera effect
      if (entity.isBoss && entity.hp.current > 0) {
        setTimeout(() => {
          this.playSound("boss");

          player.getEntity().emit('target', object);
          player.getEntity().emit('rotate', true);

          setTimeout(() => {
            player.getEntity().emit('target', player);
            player.getEntity().emit('rotate', false);
          }, 2000);
        }, 1000);
      }

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
  }

  setInitialState (state) {
    // FIXME: this is because of the "black screen" workaround.
    if (!state.progress) { return; }

    this.dispatchEvent({ type: 'setup', state: state })

    window.IS_DAY = state.daylight
    this.mapkind = state.mapkind;
    this.mapvariation = state.mapvariation;
    this.mapwidth = state.width;
    this.progress = state.progress;

    this.isPVPAllowed = state.isPVPAllowed;

    HeroSkinBuilder.init();

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

    this.factory.createTiles(this.mapkind);

    // essa é ok
    // sounds.switchSoundtrack('higureForest');
    const soundtrackMap = {
      "castle": "moonlight-forest",

      "rock": 'higure-forest',
      "cave": 'higure-forest',
      "ice": 'higure-forest',
      "grass": 'higure-forest',
      "inferno": 'higure-forest',
    };

    sounds.switchSoundtrack(soundtrackMap[this.mapkind]);

    // essa é tenebrosa pra kct
    // this.soundtrack = sounds.soundtrack.plagueOfNighterrors.play();

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

  getEntityAt (position, hasUserDataAttribute) {
    for (var id in this.entities) {
      if (this.entities[ id ].userData.position.x == position.x &&
          this.entities[ id ].userData.position.y == position.y && (
            !hasUserDataAttribute ||
            (this.entities[ id ].userData[hasUserDataAttribute])
          )) {
        return this.entities[ id ];
      }
    }
  }

  removeEntity (object) {

    // entity may already be removed by this client somehow (text event?)
    if (object.parent) {
      if (object.sprite) {
        // fade out objects with sprite
        App.tweens.add(object.sprite.scale)
          .to({
            x: 0,
            y: 0,
            z: 0,
          }, 100, Tweener.ease.quadOut)
          .then(() => object.parent.remove(object));

      } else {
        object.parent.remove(object);
      }
    }

    object.getEntity().destroy();

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

    // force to close inventory/checkpoints if they're open.
    this.hud.forceCloseOverlay();

    if (App.cursor.isPerformingCast()) {
      const castingItem = App.cursor.castingItem;

      this.room.send(['cast', {
        inventoryType: castingItem.userData.inventoryType,
        itemId: castingItem.userData.itemId,
        position: {
          // FIXME: why need to invert here?
          x: this.targetPosition.y,
          y: this.targetPosition.x,
        }
      }]);

      App.cursor.performItemCast();

    } else {
      this.clickedTileLight.intensity = 1
      this.clickedTileLight.position.copy(this.selectionLight.position)
      this.clickedTileLight.target = this.selectionLight.target

      const moveCommand = {
        x: this.targetPosition.x,
        y: this.targetPosition.y,
      };

      this.room.send(['move', moveCommand]);
    }
  }

  distributePoint (event) {
    trackEvent('distribute-point', {
      event_category: 'Character',
      event_label: 'Distribute point',
      value: event.attribute
    });

    this.room.send(['distribute-point', { attribute: event.attribute }]);
  }

  playerActionDrop() {
    if (App.cursor.isDragging) {
      /**
       * Allow to drop item to the floor
       */
      const draggingItemSprite = App.cursor.getDraggingItem();
      const item = draggingItemSprite.userData;

      if (item.inventoryType === "purchase") {
        // FIXME: this is ugly!
        if (draggingItemSprite && draggingItemSprite.slot) {
          draggingItemSprite.slot._revertDraggingItem(true);
        }

        return;

      } else {
        draggingItemSprite.slot._drop();
      }

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

  async checkAdPreRoll(roomName) {
    return new Promise((resolve, reject) => {
      if (!window.isAdsAllowed()) { resolve(); }

      if (!this.totalSessions) {
        this.totalSessions = Number(window.localStorage.getItem("totalSessions") || 0);
      }

      const sessionsForAd = 4;
      this.totalSessions++;

      if (roomName !== this.lastRoomName) {
        this.totalSessions = sessionsForAd;
      }

      if (this.totalSessions % sessionsForAd === 0) {
        sounds.fadeOut(); // fade soundtrack out

        window.adPrerollComplete = () => {
          window.localStorage.setItem("totalSessions", this.totalSessions);
          resolve();
        };

        aiptag.cmd.player.push(function () {
          adplayer.startPreRoll();
        });

      } else {
        window.localStorage.setItem("totalSessions", this.totalSessions);
        resolve();
      }
    });
  }

}
