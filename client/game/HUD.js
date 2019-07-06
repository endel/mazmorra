import * as Keycode from "keycode.js";
import Resources from '../elements/hud/Resources'

import Character from '../elements/hud/Character'
import HorizontalBar from '../elements/hud/HorizontalBar'
import Cursor from '../elements/hud/Cursor'

import HUDController from '../behaviors/HUDController'
import InventoryBehaviour from '../behaviors/InventoryBehaviour'

// Inventory
import OpenInventoryButton from '../elements/inventory/OpenButton'
import Inventory from '../elements/inventory/Inventory'
import SlotStrip from '../elements/inventory/SlotStrip'
import CheckPointSelector from "../elements/hud/CheckPointSelector";

import { MeshText2D, textAlign } from 'three-text2d'
import { inventorySound } from '../core/sound';
import NewQuestOverlay from "../elements/hud/NewQuestOverlay";

export default class HUD extends THREE.Scene {

  constructor () {
    super()

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 10 );
    this.camera.position.z = 5

    this.cursor = new Cursor
    this.cursor.position.z = 5
    this.add(this.cursor)

    // Expose cursor globally on app
    App.cursor = this.cursor;

    // Life / Mana / Expr
    this.manabar = new HorizontalBar('mp');
    this.lifebar = new HorizontalBar('hp');
    this.expbar = new HorizontalBar('xp');

    this.lifeText = new MeshText2D("0/0", {
      font: config.SMALL_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    this.manaText = new MeshText2D("0/0", {
      font: config.SMALL_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    this.expText = new MeshText2D("0/0", {
      font: config.SMALL_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    // Inventory
    this.inventory = new Inventory()
    this.inventory.visible = false;

    this.checkPointSelector = new CheckPointSelector();
    this.checkPointSelector.visible = false

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
    });
    this.quickInventory.enabled = true;

    // Label
    this.selectionText = new MeshText2D("Welcome", {
      font: config.DEFAULT_FONT,
      fillStyle: '#fff',
      antialias: false
    })

    // Resources
    this.resources = new Resources();

    // Character
    this.character = new Character();

    this.overlay = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.FrontSide,
      transparent: true
    }));
    this.overlay.position.z = -1;
    this.overlay.material.opacity = 0;
    this.overlay.visible = false;

    window.hud = this;
    window.addEventListener("keydown", this.onKeyPress.bind(this));

    this.resize()
  }

  init () {
    this.add(this.overlay);
    this.add(this.manabar);
    this.add(this.lifebar);
    this.add(this.expbar);
    this.add(this.selectionText);
    this.add(this.resources);
    this.add(this.character);

    this.add(this.lifeText);
    this.add(this.manaText);
    this.add(this.expText);

    this.add(this.inventory);
    this.add(this.quickInventory);
    // this.add(this.skillsInventory);

    this.add(this.openInventoryButton);

    this.add(this.checkPointSelector);
  }

  onKeyPress (e) {
    if (
      e.which === Keycode.I + 32 || e.which === Keycode.I ||
      e.which === Keycode.B + 32 || e.which === Keycode.B ||
      (
        // close the inventory hitting ESC
        (this.inventory.isOpen || this.checkPointSelector.isOpen) &&
        (e.key === "Escape" || e.key === " ")
      )
    ) {
      if (this.checkPointSelector.isOpen) {
        this.forceCloseOverlay();

      } else {
        // open inventory pressing "i" or "b"
        this.openInventoryButton.onClick();
        this.onToggleInventory();
      }

    } else if (e.which === Keycode.A) {
      this.dispatchEvent({type: "atk"});

    } else if (e.which === Keycode.KEY_1 || e.which === Keycode.NUMPAD_1) {
      this.quickInventory.slots[0].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[0]
      })

    } else if (e.which === Keycode.KEY_2 || e.which === Keycode.NUMPAD_2) {
      this.quickInventory.slots[1].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[1]
      })

    } else if (e.which === Keycode.KEY_3 || e.which === Keycode.NUMPAD_3) {
      this.quickInventory.slots[2].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[2]
      })

    } else if (e.which === Keycode.KEY_4 || e.which === Keycode.NUMPAD_4) {
      this.quickInventory.slots[3].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[3]
      })

    } else if (e.which === Keycode.KEY_5 || e.which === Keycode.NUMPAD_5) {
      this.quickInventory.slots[4].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[4]
      })

    } else if (e.which === Keycode.KEY_6 || e.which === Keycode.NUMPAD_6) {
      this.quickInventory.slots[5].dispatchEvent({
        type: "dblclick",
        target: this.quickInventory.slots[5]
      })

    }
  }

  onToggleInventory () {
    if (this.checkPointSelector.isOpen) {
      this.forceCloseOverlay();
    }

    const isOpen = this.inventory.isOpen;
    this.inventory.toggleOpen();

    if (isOpen) {
      this.character.onCloseInventory();
      this.hideOverlay();
      inventorySound.close.play();

    } else {
      this.character.onOpenInventory();
      this.showOverlay();
      inventorySound.open.play();
    }
  }

  onOpenQuests() {
    const newQuestOverlay = new NewQuestOverlay();
    this.add(newQuestOverlay);
    this.showOverlay();
  }

  onOpenCheckPoints(numbers) {
    if (this.isInventoryOpen()) {
      this.forceCloseOverlay();
    }

    const isOpen = this.checkPointSelector.isOpen;
    this.checkPointSelector.openWithCheckPoints(numbers);

    if (isOpen) {
      this.hideOverlay();
      inventorySound.close.play();

    } else {
      this.showOverlay();
      inventorySound.open.play();
    }
  }

  isInventoryOpen () {
    return this.inventory.isOpen;
  }

  forceCloseOverlay() {
    let hasOverlay;

    if (this.isInventoryOpen()) {
      hasOverlay = true;

      this.openInventoryButton.onClick();
      this.onToggleInventory();
    }

    if (this.checkPointSelector.isOpen) {
      hasOverlay = true;
      this.checkPointSelector.toggleOpen();
    }

    if (hasOverlay) {
      this.hideOverlay();
    }
  }

  showOverlay (duration = 200) {
    this.overlay.visible = true
    App.tweens.remove(this.overlay.material);
    App.tweens.add(this.overlay.material).to({ opacity: 0.8 }, duration);
  }

  hideOverlay(duration = 200) {
    App.tweens.remove(this.overlay.material);
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

    this.inventory.getEntity().destroy();// RIGHT?!
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

    //
    // LEFT SIDE
    //
    this.character.position.set(
      - window.innerWidth / 2 + this.character.width,
      window.innerHeight / 2 - this.character.height,
      0
    )

    this.skillsInventory.position.x = - window.innerWidth / 2 + this.skillsInventory.width/2 + margin
    this.skillsInventory.position.y = - window.innerHeight / 2 + this.skillsInventory.slotSize/2 + margin

    //
    // RIGHT SIDE
    //
    this.resources.position.set(
      window.innerWidth / 2 - this.resources.width * config.HUD_MARGIN,
      window.innerHeight / 2 - this.resources.height * config.HUD_MARGIN,
      0
    );
    this.openInventoryButton.position.set(
      this.resources.position.x,
      this.resources.position.y - this.resources.height - this.openInventoryButton.height - (config.HUD_MARGIN * config.HUD_SCALE),
      0
    );
    this.quickInventory.position.x = this.resources.position.x - (margin/2);
    this.quickInventory.position.y = this.openInventoryButton.position.y - this.quickInventory.height - margin;

    //
    // BOTTOM
    //
    const bottom = - window.innerHeight / 2 + this.expbar.height + (config.HUD_MARGIN * 3);
    this.lifebar.position.set(- config.HUD_SCALE / 2, bottom + this.lifebar.height + this.expbar.height + (config.HUD_MARGIN + config.HUD_SCALE), 0);
    this.manabar.position.set(- config.HUD_SCALE / 2, bottom + this.expbar.height + (config.HUD_MARGIN + config.HUD_SCALE), 0);
    this.expbar.position.set(- config.HUD_SCALE / 2, bottom, 0);

    this.lifeText.position.set(
      this.lifebar.position.x,
      this.lifebar.position.y + this.lifeText.height / 2.5,
      this.lifebar.position.z
    );

    this.manaText.position.set(
      this.manabar.position.x,
      this.manabar.position.y + this.manaText.height / 2.5,
      this.manabar.position.z
    );

    this.expText.position.set(
      this.expbar.position.x,
      this.expbar.position.y + this.expText.height / 2.5,
      this.expbar.position.z
    );

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  }


}
