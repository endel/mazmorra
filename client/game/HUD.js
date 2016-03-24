import Resources from '../hud/Resources'

import Character from '../hud/Character'
import LevelUpButton from '../hud/LevelUpButton'
import BottleBar from '../hud/BottleBar'
import ExpBar from '../hud/ExpBar'
import Cursor from '../hud/Cursor'

import HUDController from '../behaviors/HUDController'
import InventoryBehaviour from '../behaviors/InventoryBehaviour'

// Inventory
import OpenInventoryButton from '../hud/inventory/OpenButton'
import Inventory from '../hud/inventory/Inventory'
import SlotStrip from '../hud/inventory/SlotStrip'

import { Text2D, textAlign } from 'three-text2d'

export default class HUD extends THREE.Scene {

  constructor () {
    super()

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 10 );
    this.camera.position.z = 10

    this.cursor = new Cursor
    this.cursor.position.z = 10
    this.add(this.cursor)

    // Life / Mana / Expr
    this.manabar = new BottleBar('mana')

    this.lifebar = new BottleBar('life')

    this.expbar = new ExpBar()

    // Miscelaneous
    this.inventory = new Inventory()
    this.inventory.visible = false

    this.openInventoryButton = new OpenInventoryButton()
    this.openInventoryButton.addEventListener('click', this.inventory.toggleOpen.bind(this.inventory))

    // Usable skills / items
    this.usableSkills = new SlotStrip({
      columns: 1,
      slots: 3,
      accepts: 'skill'
    })

    this.usableItems = new SlotStrip({
      columns: 1,
      slots: 3,
      accepts: 'usable'
    })

    // Label
    this.selectionText = new Text2D("WELCOME", {
      font: config.DEFAULT_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    // Resources
    this.resources = new Resources()

    // Character
    this.character = new Character()

    // Level Up Button
    this.levelUpButton = new LevelUpButton()
    // this.add(this.levelUpButton)

    this.interactiveChildren = []

    this.resize()
  }

  init () {
    this.add(this.manabar)
    this.add(this.lifebar)
    this.add(this.expbar)
    this.add(this.selectionText)
    this.add(this.resources)
    this.add(this.character)

    this.addInteractiveControl(this.inventory)
    this.addInteractiveControl(this.usableItems)
    this.addInteractiveControl(this.usableSkills)

    // this.add(this.openInventoryButton)
    this.addInteractiveControl(this.openInventoryButton)
  }

  setPlayerObject (playerObject) {
    this.character.composition = playerObject.composition

    this.getEntity().detachAll()
    this.addBehaviour(new HUDController, playerObject)

    this.inventory.getEntity().detachAll()
    this.inventory.addBehaviour(new InventoryBehaviour, playerObject)
  }

  addInteractiveControl (control) {
    if (control.interactive) {
      this.interactiveChildren = this.interactiveChildren.concat(control.interactive)
    } else {
      this.interactiveChildren = this.interactiveChildren.concat(control)
    }
    this.add(control)
  }

  clearInteractiveControls () {
    this.interactiveChildren = []
  }

  resize() {
    //
    // TOP
    //
    this.selectionText.position.set(0, window.innerHeight / 2 - ( config.HUD_MARGIN * 2 *  config.HUD_SCALE), 0)

    //
    // LEFT SIDE
    //
    this.character.position.set(
      - window.innerWidth / 2 + this.character.width,
      window.innerHeight / 2 - this.character.height,
      0
    )
    this.levelUpButton.position.set( this.character.position.x +  config.HUD_MARGIN *  config.HUD_SCALE, this.character.position.y - this.levelUpButton.height + ( config.HUD_SCALE/3 *  config.HUD_SCALE), 1)

    this.usableSkills.position.x = - window.innerWidth / 2 + this.character.width + ( config.HUD_MARGIN *  config.HUD_SCALE)
    this.usableSkills.position.y = -this.usableSkills.height/2 + this.usableSkills.slotSize/2

    //
    // RIGHT SIDE
    //
    this.resources.position.set(
      window.innerWidth / 2 - this.resources.width *  config.HUD_MARGIN,
      window.innerHeight / 2 - this.resources.height *  config.HUD_MARGIN,
      0
    )
    this.openInventoryButton.position.set(
      this.resources.position.x,
      this.resources.position.y - this.resources.height - this.openInventoryButton.height -  config.HUD_MARGIN -  config.HUD_SCALE,
      0
    )
    this.usableItems.position.x = window.innerWidth / 2 - this.usableItems.width // - ( config.HUD_MARGIN *  config.HUD_SCALE)
    this.usableItems.position.y = -this.usableItems.height/2 + this.usableSkills.slotSize/2

    //
    // BOTTOM
    //
    this.lifebar.position.set(-this.lifebar.width -  config.HUD_SCALE * ( config.HUD_MARGIN * 3), - window.innerHeight / 2 + this.lifebar.height, 0)
    this.manabar.position.set(this.manabar.width +  config.HUD_SCALE * ( config.HUD_MARGIN * 3), - window.innerHeight / 2 + this.lifebar.height, 0)
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
