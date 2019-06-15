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

    return `
<h2>${humanize(item.type)}</h2>
${(
(item.modifiers && item.modifiers.length > 0)
  ?
    "<p>" +
      item.modifiers.map(modifier => {
        const equipedItemModifier = equipedItems[item.slotName] && equipedItems[item.slotName].modifiers.filter(mod => mod.attr === modifier.attr)[0];
        const equipedModifier = (!equipedItemModifier)
          ? modifier.modifier
          : equipedItemModifier.modifier;

        return `
          <string>${humanize(modifier.attr)}</strong> ${(modifier.modifier > 0) ? "+" : ""}
          ${modifier.modifier}
          ${(modifier.modifier > equipedModifier)
            ? `<small class="increase">(+ ${(modifier.modifier - equipedModifier).toFixed(2)})</small>`
            : (modifier.modifier < equipedModifier)
              ? `<small class="decrease">(- ${(Math.abs(modifier.modifier - equipedModifier)).toFixed(2)})</small>`
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
