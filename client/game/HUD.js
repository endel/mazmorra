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
import LeaderboardOverlay from "../elements/hud/LeaderboardOverlay";
import SkillButton from "../elements/hud/SkillButton";
import ConsumableShortcut from "../elements/inventory/ConsumableShortcut";
import { isMobile } from "../utils/device";
import ResourceManager from "../resource/manager";
import Hint from "../elements/hud/Hint";
import SettingsOverlay from "../elements/hud/SettingsOverlay";

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
      antialias: false,
      shadowColor: "#000000",
      shadowOffsetY: 2,
      shadowBlur: 0
    })

    this.manaText = new MeshText2D("0/0", {
      font: config.SMALL_FONT,
      fillStyle: '#fff',
      antialias: false,
      shadowColor: "#000000",
      shadowOffsetY: 2,
      shadowBlur: 0
    })

    this.expText = new MeshText2D("0/0", {
      font: config.SMALL_FONT,
      fillStyle: '#fff',
      antialias: false,
      shadowColor: "#000000",
      shadowOffsetY: 2,
      shadowBlur: 0
    })

    // Inventory
    this.inventory = new Inventory()
    this.inventory.visible = false;

    this.checkPointSelector = new CheckPointSelector();
    this.checkPointSelector.visible = false

    // FIXME: this is a workaround for `HUDController#onUpdateInventory`
    this.equipedItems = this.inventory.equipedItems;

    this.onToggleInventory = this.onToggleInventory.bind(this);
    this.openInventoryButton = new OpenInventoryButton()
    this.openInventoryButton.addEventListener('click', this.onToggleInventory)

    // Settings button
    const openSettingsButton = ResourceManager.getHUDElement("icons-settings");
    this.openSettingsButton = new THREE.Object3D();
    this.openSettingsButton.add(openSettingsButton);
    this.openSettingsButton.addEventListener("mouseover", () => {
      Hint.show("Settings", this.openSettingsButton);
      App.tweens.remove(this.openSettingsButton.scale)
      App.tweens.add(this.openSettingsButton.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut);
    });
    this.openSettingsButton.addEventListener("mouseout", () => {
      Hint.hide();
      App.tweens.remove(this.openSettingsButton.scale);
      App.tweens.add(this.openSettingsButton.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut);
    });
    this.openSettingsButton.addEventListener("click", () => this.openSettings());
    this.openSettingsButton.userData.hud = true;
    this.openSettingsButton.width = openSettingsButton.width;
    this.openSettingsButton.height = openSettingsButton.height;

    // "Quick inventory" buttons
    this.shortcutHpPotion = new ConsumableShortcut({ type: "hp-potion-", shortcutKey: "1" });
    this.shortcutMpPotion = new ConsumableShortcut({ type: "mp-potion-", shortcutKey: "2" });
    this.shortcutScroll = new ConsumableShortcut({ type: "scroll-", shortcutKey: "3" });

    this.skill1Button = new SkillButton("attack-speed", "Q");
    this.skill2Button = new SkillButton("movement-speed", "W");

    // Label
    this.selectionText = new MeshText2D("Welcome", {
      font: config.DEFAULT_FONT,
      fillStyle: '#fff',
      antialias: false,
      shadowColor: "#000000",
      shadowOffsetY: 3,
      shadowBlur: 0
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

    this.currentOverlay = null;

    global.hud = this;
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

    this.add(this.shortcutHpPotion);
    this.add(this.shortcutMpPotion);
    this.add(this.shortcutScroll);

    this.add(this.skill1Button);
    this.add(this.skill2Button);

    this.add(this.openInventoryButton);
    this.add(this.openSettingsButton);
  }

  onKeyPress (e) {
    // skip if player is not connected.
    if (!global.player) {
      return;
    }

    if (
      (this.currentOverlay && this.currentOverlay.isOpen) &&
      (e.key === "Escape" || e.key === " ")
    ) {
      // close the inventory hitting ESC / Space
      this.forceCloseOverlay();

    } else if (e.which === Keycode.I || e.which === Keycode.B) {
      this.onToggleInventory();

    } else if (e.which === Keycode.A) {
      this.dispatchEvent({ type: "atk" });

    } else if (e.which === Keycode.Q) {
      this.skill1Button.dispatchEvent({ type: "click" });

    } else if (e.which === Keycode.W) {
      this.skill2Button.dispatchEvent({ type: "click" });

    } else if (e.which === Keycode.KEY_1 || e.which === Keycode.NUMPAD_1) {
      this.shortcutHpPotion.dispatchEvent({ type: "click" });

    } else if (e.which === Keycode.KEY_2 || e.which === Keycode.NUMPAD_2) {
      this.shortcutMpPotion.dispatchEvent({ type: "click" });

    } else if (e.which === Keycode.KEY_3 || e.which === Keycode.NUMPAD_3) {
      this.shortcutScroll.dispatchEvent({ type: "click" });
    }
  }

  onToggleInventory () {
    if (this.currentOverlay && this.currentOverlay.isOpen) {
      this.forceCloseOverlay();

      if (this.currentOverlay instanceof Inventory) {
        return;
      }
    }

    const isOpen = this.inventory.isOpen;
    this.inventory.toggleOpen();

    this.currentOverlay = this.inventory;

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

  openQuests() {
    const newQuestOverlay = new NewQuestOverlay();
    this.add(newQuestOverlay);
    this.showOverlay();

    this.currentOverlay = newQuestOverlay;
  }

  openLeaderboard(data) {
    // skip opening multiple leaderboards
    if (this.currentOverlay instanceof LeaderboardOverlay) {
      return;
    }

    const leaderboard = new LeaderboardOverlay(data);
    leaderboard.toggleOpen();

    this.add(leaderboard);
    this.showOverlay();

    this.currentOverlay = leaderboard;
  }

  openSettings() {
    // skip opening multiple leaderboards
    if (this.currentOverlay instanceof SettingsOverlay) {
      this.forceCloseOverlay();
      return;
    }

    if (this.currentOverlay && this.currentOverlay.isOpen) {
      this.forceCloseOverlay();
    }

    const settings = new SettingsOverlay();
    settings.toggleOpen();

    this.add(settings);
    this.showOverlay();

    this.currentOverlay = settings;
  }

  onOpenCheckPoints(numbers, currentProgress) {
    if (this.currentOverlay && this.currentOverlay.isOpen) {
      this.forceCloseOverlay();
    }

    const isOpen = this.checkPointSelector.isOpen;

    this.add(this.checkPointSelector);
    this.checkPointSelector.openWithCheckPoints(numbers, currentProgress);

    this.currentOverlay = this.checkPointSelector;

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

    if (this.currentOverlay && this.currentOverlay.isOpen)  {
      hasOverlay = true;

      const previousCurrentOverlay = this.currentOverlay;
      this.currentOverlay.toggleOpen(() => {
        // currentOverlay may have changed in the mean time!
        if (previousCurrentOverlay === this.currentOverlay) {
          this.remove(this.currentOverlay);
          delete this.currentOverlay
        }
      });
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

    // bind inventory objects
    this.inventory.slots.userData = data.inventory;
    this.inventory.equipedItems.userData = data.equipedItems;
  }

  resize() {
    let margin = config.HUD_MARGIN * config.HUD_SCALE

    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    this.overlay.scale.set(window.innerWidth, window.innerHeight, 1)

    //
    // TOP
    //
    this.selectionText.position.set(0, halfH - (margin * 2), 0)

    //
    // LEFT SIDE
    //
    this.character.position.set(
      - halfW + this.character.width,
      halfH - this.character.height,
      0
    )

    //
    // RIGHT SIDE
    //
    this.resources.position.set(
      halfW - this.resources.width * config.HUD_MARGIN,
      halfH - this.resources.height * config.HUD_MARGIN,
      0
    );
    this.openInventoryButton.position.set(
      this.resources.position.x,
      this.resources.position.y - this.resources.height - this.openInventoryButton.height - (config.HUD_MARGIN * config.HUD_SCALE),
      0
    );

    this.openSettingsButton.position.set(
      this.resources.position.x,
      this.openInventoryButton.position.y - this.openInventoryButton.height - (config.HUD_MARGIN),
      0
    );

    this.shortcutHpPotion.position.x = this.resources.position.x - (margin/2);
    this.shortcutHpPotion.position.y = this.shortcutHpPotion.height + config.HUD_SCALE;

    this.shortcutMpPotion.position.x = this.shortcutHpPotion.position.x;
    this.shortcutMpPotion.position.y = 0;

    this.shortcutScroll.position.x = this.shortcutHpPotion.position.x;
    this.shortcutScroll.position.y = -this.shortcutScroll.height - config.HUD_SCALE;

    //
    // BOTTOM
    //
    const bottom = - halfH + this.expbar.height + (config.HUD_MARGIN * 3);
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

    //
    // SKILLS
    //
    this.skill1Button.position.x = this.manabar.position.x + this.lifebar.width / 2 + (this.skill1Button.width * 2);
    this.skill1Button.position.y = this.manabar.position.y;
    this.skill2Button.position.x = this.skill1Button.position.x + (this.skill2Button.width * 2) + config.HUD_SCALE;
    this.skill2Button.position.y = this.skill1Button.position.y;

    // update orthogonal camera aspect ratio / projection matrix
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - halfW;
    this.camera.right = halfW;
    this.camera.top = halfH
    this.camera.bottom = - halfH;
    this.camera.updateProjectionMatrix();
  }


}
