import config from "../../config";
import { humanize, toScreenPosition } from "../../utils";

class Hint  {
  constructor() {
    this.el = document.querySelector("#hint");

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
    this.el.style.left = (position.x - (config.HUD_SCALE * 5) - this.el.clientWidth - config.HUD_SCALE) + "px";
    this.el.style.top = (position.y - (config.HUD_SCALE * 5)) + "px";
  }

  update () {
    if (this.isActive && this.lastItem && this.lastSprite) {
      this.show(this.lastItem, this.lastSprite);
    }
  }

  getItemHTML(item, sprite) {
    const equipedItems = player.userData.equipedItems.slots;

    // <img src="images/sprites/items-${item.type}.png" width="${sprite.item.scale.x}" height="${sprite.item.scale.y}" />

    //  class="${((item.isMagical) ? 'purple ' : "")}${((item.isRare) ? 'purple ' : "")}"

    return `
<h2>
${humanize(item.type)}

${(item.isRare) ? `<span class="rare">+ Rare</span>` : ""}
${(item.isMagical) ? `<span class="magical">+ Magical</span> ` : ""}

${(item.price !== undefined)
  ? (item.premium)
    ? `<small class="diamond">(${item.price} diamond)</small>`
    : `<small class="gold">(${item.price} gold)</small>`
  : ""}
</h2>

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
        const equipedItemModifier = equipedItems[item.slotName] && equipedItems[item.slotName].modifiers.filter(mod => mod.attr === modifier.attr)[0];
        let equipedModifier = (!equipedItemModifier)
          ? modifier.modifier
          : equipedItemModifier.modifier;

        let modifierValue = modifier.modifier;

        // calculate damage modifier based on `primaryAttribute`
        if (modifier.attr === "damage" && item.damageAttribute) {
          equipedModifier += player.userData.attributes[player.userData.primaryAttribute];
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


}

export default new Hint();
