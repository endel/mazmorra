import * as Keycode from "keycode.js";
import Resources from '../elements/hud/Resources'

import Character from '../elements/hud/Character'
import BottleBar from '../elements/hud/BottleBar'
import ExpBar from '../elements/hud/ExpBar'
import Cursor from '../elements/hud/Cursor'

import HUDController from '../behaviors/HUDController'
import InventoryBehaviour from '../behaviors/InventoryBehaviour'

// Inventory
import OpenInventoryButton from '../elements/inventory/OpenButton'
import Inventory from '../elements/inventory/Inventory'
import SlotStrip from '../elements/inventory/SlotStrip'

import { MeshText2D, textAlign } from 'three-text2d'
import { inventorySound } from '../core/sound';

export default class HUD extends THREE.Scene {

  constructor () {
    super()

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 10 );
    this.camera.position.z = 5

    this.cursor = new Cursor
    this.cursor.position.z = 5
    this.add(this.cursor)

    // Expose cursor globally on app
    App.cursor = this.cursor

    // Life / Mana / Expr
    this.manabar = new BottleBar('mp')
    this.lifebar = new BottleBar('hp')
    this.expbar = new ExpBar()

    // Inventory
    this.inventory = new Inventory()
    this.inventory.visible = false

    // FIXME: this is a workaround for `HUDController#onUpdateInventory`
    this.equipedItems = this.inventory.equipedItems;

    this.openInventoryButton = new OpenInventoryButton()
    this.openInventoryButton.addEventListener('click', this.onToggleInventory.bind(this))

    // Usable skills / items
    this.skillsInventory = new SlotStrip({
      columns: 1,
      slots: 3,
      accepts: 'skill'
    })

    this.quickInventory = new SlotStrip({
      columns: 1,
      slots: 6,
      inventoryType: "quickInventory"
    })

    // Label
    this.selectionText = new MeshText2D("Welcome", {
      font: config.DEFAULT_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    // Label
    this.levelText = new MeshText2D("Village", {
      font: config.DEFAULT_FONT,
      fillStyle: '#fff',
      align: textAlign.right,
      antialias: false
    })

    // Resources
    this.resources = new Resources()

    // Character
    this.character = new Character()

    // // Level Up Button
    // this.levelUpButton = new LevelUpButton()
    // this.add(this.levelUpButton)

    this.overlay = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.FrontSide,
      transparent: true
    }));
    this.overlay.position.z = -1
    this.overlay.material.opacity = 0
    this.overlay.visible = false

    window.hud = this;
    window.addEventListener("keydown", this.onKeyPress.bind(this));

    this.resize()
  }

  init () {
    this.add( this.overlay )
    this.add( this.manabar )
    this.add( this.lifebar )
    this.add( this.expbar )
    this.add( this.selectionText )
    this.add( this.levelText )
    this.add( this.resources )
    this.add( this.character )

    this.add( this.inventory )
    this.add( this.quickInventory )
    // this.add( this.skillsInventory )

    this.add( this.openInventoryButton )
  }

  onKeyPress (e) {
    if (
      e.which === Keycode.I + 32 || e.which === Keycode.I ||
      e.which === Keycode.B + 32 || e.which === Keycode.B ||
      (
        // close the inventory hitting ESC if  {
        this.openInventoryButton.isOpen &&
        e.key === "Escape"
      )
    ) {
      // open inventory pressing "i" or "b"
      this.openInventoryButton.onClick();
      this.onToggleInventory();
    }
  }

  onToggleInventory () {

    if (this.inventory.isOpen) {
      this.hideOverlay();
      inventorySound.close.play();

    } else {
      this.showOverlay();
      inventorySound.open.play();
    }

    this.inventory.toggleOpen()
  }

  showOverlay (duration = 200) {
    this.overlay.visible = true
    App.tweens.add(this.overlay.material).to({ opacity: 0.5 }, duration);
  }

  hideOverlay(duration = 200) {
    App.tweens.add(this.overlay.material).to({ opacity: 0 }, duration).then(() => {
      this.overlay.visible = false
    })
  }

  setPlayerObject (player, data) {
    this.character.composition = player.composition

    if ( !this.controller ) {
      this.controller = new HUDController();
      this.addBehaviour(this.controller, player);

    } else {
      this.controller.playerObject = player;
    }

    this.inventory.getEntity().detachAll()
    this.inventory.addBehaviour(new InventoryBehaviour(), player)

    // bind inventory objects
    this.inventory.slots.userData = data.inventory;
    this.quickInventory.userData = data.quickInventory;
    this.inventory.equipedItems.userData = data.equipedItems;
  }

  resize() {
    let margin = config.HUD_MARGIN * config.HUD_SCALE

    this.overlay.scale.set(window.innerWidth, window.innerHeight, 1)

    //
    // TOP
    //
    this.selectionText.position.set(0, window.innerHeight / 2 - (margin * 2), 0)

    this.levelText.position.set(-this.levelText.width -  config.HUD_SCALE * ( config.HUD_MARGIN * 3 ), window.innerHeight / 2 - margin * 2, 0)

    this.levelText.position.set(
      window.innerWidth / 2 - config.HUD_SCALE * (config.HUD_MARGIN),
      - window.innerHeight / 2 + this.levelText.height + (config.HUD_MARGIN * 3),
      0
    )

    //
    // LEFT SIDE
    //
    this.character.position.set(
      - window.innerWidth / 2 + this.character.width,
      window.innerHeight / 2 - this.character.height,
      0
    )

    // this.levelUpButton.position.set( this.character.position.x + margin, this.character.position.y - this.levelUpButton.height + ( config.HUD_SCALE/3 * config.HUD_SCALE), 1)

    this.skillsInventory.position.x = - window.innerWidth / 2 + this.skillsInventory.width/2 + margin
    this.skillsInventory.position.y = - window.innerHeight / 2 + this.skillsInventory.slotSize/2 + margin

    //
    // RIGHT SIDE
    //
    this.resources.position.set(
      window.innerWidth / 2 - this.resources.width * config.HUD_MARGIN,
      window.innerHeight / 2 - this.resources.height * config.HUD_MARGIN,
      0
    )
    this.openInventoryButton.position.set(
      this.resources.position.x,
      this.resources.position.y - this.resources.height - this.openInventoryButton.height - config.HUD_MARGIN - config.HUD_SCALE,
      0
    )
    this.quickInventory.position.x = this.resources.position.x - (margin/2)
    this.quickInventory.position.y = this.openInventoryButton.position.y - this.quickInventory.height - margin;

    //
    // BOTTOM
    //
    this.lifebar.position.set(-this.lifebar.width -  config.HUD_SCALE * ( config.HUD_MARGIN * 3 ), - window.innerHeight / 2 + this.lifebar.height, 0)
    this.manabar.position.set(this.manabar.width +  config.HUD_SCALE * ( config.HUD_MARGIN * 3 ), - window.innerHeight / 2 + this.lifebar.height, 0)
    this.expbar.position.set(- config.HUD_SCALE/2, - window.innerHeight / 2 + this.expbar.height + ( config.HUD_MARGIN * 3), 0)

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  }


}
