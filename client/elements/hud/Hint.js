import config from "../../config";

class Hint  {
  constructor() {
    this.el = document.querySelector("#hint");
  }

  show(item, sprite) {
    this.el.classList.add("active");

    let contents = "";

    if (item.type) {
      contents = this.getItemHTML(item, sprite);

    } else {
      contents = `<p>${item}</p>`;
    }

    this.el.innerHTML = contents;

    var position = this.toScreenPosition(sprite);
    this.el.style.left = (position.x - (config.HUD_SCALE * 5) - this.el.clientWidth - config.HUD_SCALE) + "px";
    this.el.style.top = (position.y - (config.HUD_SCALE * 5)) + "px";
  }

  getItemHTML(item, sprite) {
    const equipedItems = player.userData.equipedItems.slots;

    return `
<h2>
  <!-- <img src="images/sprites/items-${item.type}.png" width="${sprite.item.scale.x}" height="${sprite.item.scale.y}" /> -->
  ${item.type}
</h2>
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
          <string>${modifier.attr}</strong> ${(modifier.modifier > 0) ? "+" : ""}
          ${modifier.modifier}
          ${(modifier.modifier > equipedModifier)
            ? `<small class="increase">(+ ${modifier.modifier - equipedModifier})</small>`
            : (modifier.modifier < equipedModifier)
              ? `<small class="decrease">(- ${Math.abs(modifier.modifier - equipedModifier)})</small>`
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
    this.el.classList.remove("active");
  }

  toScreenPosition(obj) {
    var camera = hud.camera;
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * window.innerWidth;
    var heightHalf = 0.5 * window.innerHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = - (vector.y * heightHalf) + heightHalf;

    return {
      x: vector.x,
      y: vector.y
    };

  }

}

export default new Hint();
