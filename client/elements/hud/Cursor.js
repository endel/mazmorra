import ResourceManager from '../../resource/manager'

import lerp from 'lerp'
import { Behaviour } from 'behaviour.js'

class CursorBehaviour extends Behaviour {
  onAttach () {}
  update () {
    this.object.position.x = lerp(this.object.position.x, App.mouse.x * (window.innerWidth / 2), 0.9)
    this.object.position.y = lerp(this.object.position.y, App.mouse.y * (window.innerHeight / 2), 0.9)
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

    this.dragging = new THREE.Object3D()
    this.add(this.dragging)

    this.onUpdateCursor({ kind: "pointer" });

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
    this.remove(this.castingItem);
    this.castingItemSlot.item = this.castingItem;
    this.castingItem = undefined;
    this.onUpdateCursor({ kind: "pointer" });
  }

  cancelItemCast() {
    this.performItemCast()
  }

  onDrag (e) {

    if ( e.item ) {

      this.remove( this[ this.kindActive ] )
      this.dragging.add( e.item )

    } else {

      this.add( this[ this.kindActive ] )

    }

  }

  onUpdateCursor (e) {
    // skip if on cast magic mode.
    if (this.castingItem || this.isDragging) {
      return false;
    }

    if ( e.kind !== this.kindActive ) {

      this.remove( this[ this.kindActive ] )

      this.kindActive = e.kind

    }

    if ( this.kindActive ) {

      this.add( this[ this.kindActive ] )

    }

  }

  get isDragging () {
    return this.dragging.children.length > 0
  }

  getDraggingItem () {
    return this.dragging.children[0];
  }

}
