import ResourceManager from '../../resource/manager'

import lerp from 'lerp'
import { Behaviour } from 'behaviour.js'
import { isMobile } from '../../utils/device';
import { trackEvent } from '../../utils';

class CursorBehaviour extends Behaviour {
  onAttach () {
    this.on('update', () => this.update());
  }

  update () {
    // this.object.position.x = lerp(this.object.position.x, App.mouse.x * (window.innerWidth / 2), 0.9)
    // this.object.position.y = lerp(this.object.position.y, App.mouse.y * (window.innerHeight / 2), 0.9)
    this.object.position.x = App.mouse.x * (window.innerWidth / 2)
    this.object.position.y = App.mouse.y * (window.innerHeight / 2)
  }
  onDetach() {}
}

export default class Cursor extends THREE.Object3D {

  constructor () {
    super()

    this.kindActive = null

    this.pointer = ResourceManager.getHUDElement('cursor-pointer')
    this.pointer.material.alphaTest = 0.5
    this.pointer.position.x += this.pointer.height / 2
    this.pointer.position.y -= this.pointer.width / 2

    this.attack = ResourceManager.getHUDElement('cursor-attack')
    this.attack.material.alphaTest = 0.5
    this.attack.position.x += this.attack.height / 2
    this.attack.position.y -= this.attack.width / 2

    this.activate = ResourceManager.getHUDElement('cursor-activate')
    this.activate.material.alphaTest = 0.5
    this.activate.position.x += this.activate.height / 2
    this.activate.position.y -= this.activate.width / 2

    this.magic = ResourceManager.getHUDElement('cursor-magic')
    this.magic.material.alphaTest = 0.5
    this.magic.position.x += this.magic.height / 2
    this.magic.position.y -= this.magic.width / 2

    this.loading = ResourceManager.getHUDElement('cursor-loading')
    this.loading.material.alphaTest = 0.5
    this.loading.position.x += this.loading.height / 2
    this.loading.position.y -= this.loading.width / 2

    this.dragging = new THREE.Object3D()
    this.add(this.dragging)

    this.onUpdateCursor({ kind: "pointer" });

    if (isMobile) {
      window.addEventListener("touchstart", (e) => {
        if (fadeOutCursorTimeout) clearTimeout(fadeOutCursorTimeout);

        App.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        App.mouse.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1

        App.tweens.remove(this[this.kindActive].material);
        this.getEntity().emit('update');
      });

      let fadeOutCursorTimeout;
      window.addEventListener("touchend", (e) => {
        if (fadeOutCursorTimeout) clearTimeout(fadeOutCursorTimeout);

        App.tweens.add(this[this.kindActive].material).to({ opacity: 0 }, 500);
      });
    }

    this.addEventListener("drag", this.onDrag.bind(this));
    this.addEventListener("cursor", this.onUpdateCursor.bind(this));

    this.addBehaviour(new CursorBehaviour())
  }

  isPerformingCast() {
    return this.castingItem !== undefined;
  }

  prepareItemCast(item, itemSlot) {
    this.onUpdateCursor({ kind: "magic" });
    this.add(item);
    this.castingItem = item;
    this.castingItemSlot = itemSlot;
  }

  performItemCast() {
    trackEvent('gameplay-cast-item', {
      event_category: 'Gameplay',
      event_label: 'Cast item',
      value: this.castingItem.userData.item.type
    });

    this.remove(this.castingItem);
    this.castingItemSlot.item = this.castingItem;
    this.castingItem = undefined;
    this.onUpdateCursor({ kind: "pointer" });
  }

  cancelItemCast() {
    this.performItemCast()
  }

  onDrag(e) {
    if (e.item) {
      this.remove(this[this.kindActive])

      for (let i=this.dragging.children.length-1; i>=0; i--) {
        this.dragging.remove(this.dragging.children[i]);
      }

      this.dragging.add(e.item)

    } else {
      this.add(this[this.kindActive])
    }
  }

  onUpdateCursor (e) {
    // skip if on cast magic mode.
    if (this.castingItem || this.isDragging) {
      return false;
    }

    if (e.kind !== this.kindActive) {
      this.remove(this[this.kindActive])
      this.kindActive = e.kind
    }

    if (this.kindActive) {
      this.add(this[this.kindActive])
      this[this.kindActive].material.opacity = 1;
    }
  }

  get isDragging () {
    return this.dragging.children.length > 0
  }

  getDraggingItem () {
    return this.dragging.children[0];
  }

}
