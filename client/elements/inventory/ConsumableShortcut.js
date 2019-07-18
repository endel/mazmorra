import hint from "../hud/Hint";
import { humanize } from "../../utils";
import { MeshText2D, textAlign } from "three-text2d";

export default class ConsumableShortcut extends THREE.Object3D {

  constructor (options) {
    super()

    this.userData.hud = true;

    this._item = null
    this.type = options.type;
    this.shortcutKey = options.shortcutKey;

    this.bg = ResourceManager.getHUDElement("hud-consumable-shortcut")
    this.add(this.bg)

    this.width = this.bg.width;
    this.height = this.bg.height;

    var qtyTex = ResourceManager.get("hud-item-slot-qty");
    this.qty = new THREE.Sprite(new THREE.SpriteMaterial({ map: qtyTex, transparent: true }))
    this.qty.scale.set(qtyTex.frame.w *  config.HUD_SCALE, qtyTex.frame.h *  config.HUD_SCALE, 1)
    this.qty.position.x = 3 * config.HUD_SCALE;
    this.qty.position.y = -3 * config.HUD_SCALE;
    this.qty.position.z = 2;

    this.qtyText = new MeshText2D("0", {
      align: textAlign.center,
      font: config.SMALL_FONT,
      fillStyle: "#d8d8d8"
    });
    this.qtyText.scale.set(0.6, 0.6, 0.6);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);

    // mouse-over / mouse-out
    this.addEventListener('mouseover', this.onMouseOver);
    this.addEventListener('mouseout', this.onMouseOut);

    // click
    this.addEventListener('click', this.onClick);
    this.addEventListener('dblclick', this.onClick);
  }

  // set enabled (bool) {
  //   this.userData.hud = bool;
  // }

  hasItem () {
    return this._item
  }

  onMouseOver ( e ) {
    hint.show(`(${this.shortcutKey}) Use ${humanize(this.type)}`, this);

    if (this._item) {
      App.tweens.remove(this.scale)
      App.tweens.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
    }
  }

  onMouseOut () {
    hint.hide();

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

  set item(slot) {
    if (this._slot !== slot) {
      if (this._item) {
        this.remove(this._item);
      }

      if (slot) {
        this._item = ResourceManager.getHUDElement(`items-${slot.type}`);
        this._item.position.x = 0;
        this._item.position.y = 0;
        this._item.position.z = 1;
        this.add(this._item);
      }
    }

    this._slot = slot;
    this.updateItemQty();
  }

  updateItemQty() {
    const qty = this._slot && this._slot.qty;

    if (qty) {
      this.add(this.qty);

      this.qtyText.text = qty.toString();
      this.qtyText.position.x = this.qty.position.x;
      this.qtyText.position.y = this.qty.position.y + (this.qtyText.height * this.qtyText.scale.y) / 2.2;
      this.qtyText.position.z = 3;

      this.add(this.qtyText);

    } else if (this.qtyText) {
      this.remove(this.qty);
      this.remove(this.qtyText);
    }
  }

  get item () {
    return this._item
  }

  get material () {
    return this.bg.material;
  }

  onClick(e) {
    e.stopPropagation = true;

    if (this._slot) {
      this.dispatchEvent({
        type: "use-item",
        bubbles: true,
        itemId: this._slot.id,
        inventoryType: "inventory"
      });
    }
  }

  removeAllListeners() {
    this.removeEventListener('mouseover', this.onMouseOver);
    this.removeEventListener('mouseout', this.onMouseOut);
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('dblclick', this.onClick);
  }

}
