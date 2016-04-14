import ResourceManager from '../../resource/manager'

import lerp from 'lerp'
import { Behaviour } from 'behaviour.js'

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

    this.dragging = new THREE.Object3D()
    this.add(this.dragging)

    this.onUpdateCursor({ kind: "pointer" })

    this.addEventListener( "drag", this.onDrag.bind(this) )
    this.addEventListener( "cursor", this.onUpdateCursor.bind(this) )

    this.addBehaviour(new CursorBehaviour)
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


}

class CursorBehaviour extends Behaviour {

  onAttach () {
  }

  update () {
    this.object.position.x = lerp(this.object.position.x, App.mouse.x * (window.innerWidth / 2), 0.9)
    this.object.position.y = lerp(this.object.position.y, App.mouse.y * (window.innerHeight / 2), 0.9)
  }

}
