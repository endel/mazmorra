import Resources from '../hud/Resources'

import Character from '../hud/Character'
import LevelUpButton from '../hud/LevelUpButton'
import Lifebar from '../hud/Lifebar'
import ExpBar from '../hud/ExpBar'

// Inventory
import OpenInventoryButton from '../hud/inventory/OpenButton'
import Inventory from '../hud/inventory/Inventory'
import SlotStrip from '../hud/inventory/SlotStrip'

import { Text2D, textAlign } from 'three-text2d'

window.HUD_MARGIN = 2.5
window.HUD_SCALE = 7.5 / window.devicePixelRatio
window.DEFAULT_FONT = (Math.floor(HUD_SCALE * 5)) + "px primary"

export default class HUD extends THREE.Scene {

  constructor () {
    super()

    this.playerEntity = null

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 10 );
    this.camera.position.z = 10

    // Life / Mana / Expr
    this.manabar = new Lifebar('mana')
    this.lifebar = new Lifebar('life')
    this.expbar = new ExpBar()

    // Miscelaneous
    this.openInventoryButton = new OpenInventoryButton()
    this.inventory = new Inventory()
    this.inventory.visible = false

    this.add(this.inventory)
    this.openInventoryButton.addEventListener('click', this.inventory.toggleOpen.bind(this.inventory))

    // Usable skills / items
    this.usableItems = new SlotStrip({ columns: 1, slots: 3 })
    this.usableSkills = new SlotStrip({ columns: 1, slots: 3 })

    //
    // Label
    this.selectionText = new Text2D("WELCOME", { font: DEFAULT_FONT, fillStyle: '#fff', antialias: false })

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

    this.add(this.usableItems)
    this.add(this.usableSkills)

    // this.add(this.openInventoryButton)
    this.addInteractiveControl(this.openInventoryButton)
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
    this.selectionText.position.set(0, window.innerHeight / 2 - (HUD_MARGIN * 2 * HUD_SCALE), 0)

    //
    // LEFT SIDE
    //
    this.character.position.set(
      - window.innerWidth / 2 + this.character.width,
      window.innerHeight / 2 - this.character.height,
      0
    )
    this.levelUpButton.position.set( this.character.position.x + HUD_MARGIN * HUD_SCALE, this.character.position.y - this.levelUpButton.height + (HUD_SCALE/3 * HUD_SCALE), 1)

    this.usableSkills.position.x = - window.innerWidth / 2 + this.character.width + (HUD_MARGIN * HUD_SCALE)
    this.usableSkills.position.y = -this.usableSkills.height/2 + this.usableSkills.singleSlotSize/2

    //
    // RIGHT SIDE
    //
    this.resources.position.set(
      window.innerWidth / 2 - this.resources.width * HUD_MARGIN,
      window.innerHeight / 2 - this.resources.height * HUD_MARGIN,
      0
    )
    this.openInventoryButton.position.set(
      this.resources.position.x,
      this.resources.position.y - this.resources.height - this.openInventoryButton.height - HUD_MARGIN - HUD_SCALE,
      0
    )
    this.usableItems.position.x = window.innerWidth / 2 - this.usableItems.width // - (HUD_MARGIN * HUD_SCALE)
    this.usableItems.position.y = -this.usableItems.height/2 + this.usableSkills.singleSlotSize/2

    //
    // BOTTOM
    //
    this.lifebar.position.set(-this.lifebar.width - HUD_SCALE * (HUD_MARGIN * 3), - window.innerHeight / 2 + this.lifebar.height, 0)
    this.manabar.position.set(this.manabar.width + HUD_SCALE * (HUD_MARGIN * 3), - window.innerHeight / 2 + this.lifebar.height, 0)
    this.expbar.position.set(-HUD_SCALE/2, - window.innerHeight / 2 + this.expbar.height + (HUD_MARGIN * 3), 0)

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  }

}

