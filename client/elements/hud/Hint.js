import config from "../../config";
import { humanize, toScreenPosition } from "../../utils";

const ITEM_SLOT_SIZE = 9;

class Hint  {
  constructor() {
    var el = document.createElement("div");
    el.classList.add('hint');

    this.el = el;
    document.body.appendChild(this.el);

    this.isActive = false;

    this.lastItem = undefined;
    this.lastSprite = undefined;
  }

  show(item, sprite) {
    this.lastItem = item;
    this.lastSprite = sprite;
    this.isActive = true;

    this.el.classList.add("active");

    let contents = "";

    if (item.type) {
      contents = this.getItemHTML(item, sprite);

    } else {
      contents = `<p>${item}</p>`;
    }

    this.el.innerHTML = contents;

    var position = toScreenPosition(hud.camera, sprite);

    if (position.y >= window.innerHeight / 2) {
      this.el.style.top = (position.y - (config.HUD_SCALE * 5) - this.el.clientHeight + (ITEM_SLOT_SIZE * config.HUD_SCALE)) + "px";
      this.el.classList.add("bottom");

    } else {
      this.el.style.top = (position.y - (config.HUD_SCALE * 5)) + "px";
      this.el.classList.remove("bottom");
    }

    if (position.x >= window.innerWidth / 2) {
      this.el.style.left = (position.x - (config.HUD_SCALE * 5) - this.el.clientWidth - config.HUD_SCALE) + "px";
      this.el.classList.add("left");

    } else {
      this.el.style.left = (position.x + (config.HUD_SCALE * 5)) + "px";
      this.el.classList.remove("left");
    }

  }

  update () {
    if (this.isActive && this.lastItem && this.lastSprite) {
      this.show(this.lastItem, this.lastSprite);
    }
  }

  getItemHTML(item, sprite) {
    const player = global.player;
    if (!player) { return; }

    const equipedItems = player.userData.equipedItems.slots;

    // <img src="images/sprites/items-${item.type}.png" width="${sprite.item.scale.x}" height="${sprite.item.scale.y}" />

    //  class="${((item.isMagical) ? 'purple ' : "")}${((item.isRare) ? 'purple ' : "")}"

    return `
<h2>
${humanize(item.type)}

${(item.isRare) ? `<small class="rare">+ Rare</small>` : ""}
${(item.isMagical) ? `<small class="magical">+ Magical</small> ` : ""}

${(item.price !== undefined)
  ? (item.premium)
    ? `<small class="diamond">(${item.price} diamond)</small>`
    : `<small class="gold">(${item.price} gold)</small>`
  : ""}
</h2>

${(item.progressRequired && item.progressRequired > player.userData.latestProgress)
  ? `<p class="strength">Equipable after dungeon ${item.progressRequired}</p>`
  : "" }

${(item.damageAttribute)
  ? `<p>Damage attribute: <span class="${item.damageAttribute}">${humanize(item.damageAttribute)}</span></p>`
  : "" }

${(item.manaCost > 0)
  ? `<p>Mana cost: ${item.manaCost.toFixed(1)}</p>`
  : "" }

${(
(item.modifiers && item.modifiers.length > 0)
  ?
    "<p>" +
      item.modifiers.map(modifier => {
        const equipedItem = equipedItems[item.slotName];
        const equipedItemModifier = equipedItem && equipedItem.modifiers.filter(mod => mod.attr === modifier.attr)[0];
        let equipedModifier = (!equipedItemModifier)
          ? 0
          : equipedItemModifier.modifier;

        // workaround to not display `+30 (+30)` for potions.
        if (item.type.indexOf("-potion") !== -1) {
          equipedModifier = modifier.modifier;
        }

        let modifierValue = modifier.modifier;

        // calculate damage modifier based on `primaryAttribute`
        if (modifier.attr === "damage" && item.damageAttribute) {
          equipedModifier += player.userData.attributes[(equipedItem && equipedItem.damageAttribute) || player.userData.primaryAttribute];
          modifierValue += player.userData.attributes[item.damageAttribute];
        }

        return `
          <strong>${humanize(modifier.attr)}</strong> ${(modifierValue > 0) ? "+" : ""}
          ${modifier.modifier}
          ${(modifierValue > equipedModifier)
            ? `<small class="increase">(+ ${(modifierValue - equipedModifier).toFixed(2)})</small>`
            : (modifierValue < equipedModifier)
              ? `<small class="decrease">(- ${(Math.abs(modifierValue - equipedModifier)).toFixed(2)})</small>`
              : "" }
        `;
      }).join("<br />") +
    "</p>"
  :
    ""
)}
`;

  }

  hide() {
    this.isActive = false;
    this.el.classList.remove("active");
  }

  destroy () {
    if (this.el) {
      document.body.removeChild(this.el);
      this.el = null;
    }
  }

}

export function createHint() { return new Hint(); }

export default createHint();
