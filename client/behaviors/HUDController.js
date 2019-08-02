import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'
import { createHint } from '../elements/hud/Hint';
import { i18n } from '../lang';

export default class HUDController extends Behaviour {

  onAttach (playerObject) {
    this.playerObject = playerObject

    const LEVELS_WITH_TUTORIAL = 15;

    // events
    this.on("update-inventory", this.onUpdateInventory.bind(this));
    this.on("update-attributes", this.onUpdateAttributes.bind(this));
    this.on("update-bars", this.onUpdateBars.bind(this));

    if (playerObject.userData.latestProgress <= LEVELS_WITH_TUTORIAL) {
      this.on("update-bars", this.onUpdateBarsTutorial.bind(this));
      this.on("update-attributes", this.onUpdateAttributesTutorial.bind(this));
      this.on("update-inventory", this.onUpdateInventoryTutorial.bind(this));
    }

    this.on("update-all", (data) => {
      this.onUpdateAttributes(data);
      this.onUpdateBars(data);

      if (playerObject.userData.latestProgress <= LEVELS_WITH_TUTORIAL) {
        this.onUpdateBarsTutorial(data);
        this.onUpdateAttributesTutorial(data)
        this.onUpdateInventoryTutorial(data)
      }
    });
  }

  onUpdateInventory(inventoryType) {
    this.object[inventoryType].updateItems();

    // also update consumable shortcuts
    if (inventoryType === "inventory") {
      const shortcutButtons = [this.object.shortcutHpPotion, this.object.shortcutMpPotion, this.object.shortcutScroll];
      const slots = this.object.inventory.slots.userData.slots;

      shortcutButtons.forEach((shortcutButton) => {
        for (let itemId in slots) {
          if (slots[itemId].type.indexOf(shortcutButton.type) === 0) {
            shortcutButton.item = slots[itemId];
            return;
          }
        }
        shortcutButton.item = null;
      });
    }
  }

  onUpdateAttributes (data) {
    this.object.character.update(data);
    // this.object.character.updateAttribute(attribute, value);
  }

  onUpdateBars (data) {
    // TODO: only update texts when they really change
    this.object.resources.goldAmount.text = data.gold.toString();
    this.object.resources.diamondAmount.text = data.diamond.toString();

    this.object.lifeText.text = Math.ceil(data.hp.current) + "/" + data.hp.max;
    this.object.manaText.text = Math.ceil(data.mp.current) + "/" + data.mp.max;
    this.object.expText.text = Math.ceil(data.xp.current) + "/" + data.xp.max;
  }

  onUpdateBarsTutorial (data) {
    if (data.hp.current < data.hp.max / 2) {
      if (!this.hpHint) {
        this.hpHint = createHint();
        this.hpHint.show(i18n('usePotionsToRestoreHP'), this.object.shortcutHpPotion);
      }

    } else if (this.hpHint) {
      this.hpHint.destroy();
      this.hpHint = null;
    }
  }

  onUpdateAttributesTutorial (data) {
    if (data.pointsToDistribute > 0 && this.lastLevelHint !== data.lvl) {
      this.lastLevelHint = data.lvl;

      if (!this.lvlUpHint) {

        this.lvlUpHint = createHint();
        this.lvlUpHint.show(i18n('upgradeAttributes'), this.object.character.lvlUpButton);

        this.lvlUpHintDestroy = () => {
          if (this.lvlUpHint) {
            this.lvlUpHint.destroy();
            this.lvlUpHint = null;
            this.lvlUpHintDestroy = null;
            this.object.character.lvlUpButton.removeEventListener("click", this.lvlUpHintDestroy);
          }
        }
        this.object.character.lvlUpButton.addEventListener("click", this.lvlUpHintDestroy);
      }

    } else if (this.lvlUpHint) {
      this.lvlUpHintDestroy();
    }

  }

  onUpdateInventoryTutorial (inventoryType) {
    /**
     * Displays hint to go to portal
     */
    if (inventoryType === "inventory") {
      const occupiedSlots = Object.keys(this.playerObject.userData.inventory.slots).length;

      if (occupiedSlots === this.object.inventory.slots.numSlots) {
        if (!this.hasSeenPortalTutorial) {
          this.hasSeenPortalTutorial = true;

          this.usePortalHint = createHint();
          this.usePortalHint.show(i18n('tutorialPortalSellItems'), this.object.shortcutScroll);

          this.usePortalHintDestroy = () => {
            if (this.usePortalHint) {
              this.usePortalHint.destroy();
              this.usePortalHint = null;
              this.usePortalHintDestroy = null;
              this.object.shortcutScroll.removeEventListener("click", this.usePortalHintDestroy);
            }
          }
          this.object.shortcutScroll.addEventListener("click", this.usePortalHintDestroy);

        }
      } else {
        if (this.usePortalHintDestroy) { this.usePortalHintDestroy(); }
        this.hasSeenPortalTutorial = false;
      }
    }
  }

  update() {
    this.setPercentage(this.object.lifebar, this.playerObject.userData.hp.current / this.playerObject.userData.hp.max, 'x');
    this.setPercentage(this.object.manabar, this.playerObject.userData.mp.current / this.playerObject.userData.mp.max, 'x');
    this.setPercentage(this.object.expbar, this.playerObject.userData.xp.current / this.playerObject.userData.xp.max, 'x');
  }

  setPercentage (object, percentage, attr) {
    var frameAttr = (attr === 'y') ? 'h' : 'w'
      , totalArea = object.bg.material.map.frame[frameAttr]
      , imgHeight = object.bg.material.map.image.height

    // (1 - %)
    var finalPercentage = 1 - percentage

    object.fg.material.map.offset[attr] = lerp(object.fg.material.map.offset[attr], object.initialOffset-((totalArea/imgHeight)*finalPercentage), 0.1)
    object.fg.position[attr] = lerp(
      object.fg.position[attr],
      - finalPercentage - ((object.bg.material.map.frame[frameAttr]/object.fg.material.map.frame[frameAttr]) * object.offsetMultiplier),
      0.1
    )
  }

  onDetach () {
  }

}

