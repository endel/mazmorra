import ResourceManager from '../resource/manager'

import lerp from 'lerp'
import { Behaviour } from 'behaviour.js'

export default class Cursor extends THREE.Scene {

  constructor () {
    super()
    this.mouse = { x: 0, y: 0 }

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

    this.addBehaviour(new CursorBehaviour)
  }

  get isDragging () {
    return this.dragging.children.length > 0
  }


}

class CursorBehaviour extends Behaviour {

  onAttach () {
    this.type = null
    this.isDragging = false

    this.on('update', this.onUpdate.bind(this))
    this.on('drag', this.onDrag.bind(this))
    this.onUpdate('pointer')
  }

  onUpdate (type) {
    if (this.object.isDragging) return false

    if (this.type) {
      this.object.remove(this.object[ this.type ])
    }

    if (type) {
      this.object.add(this.object[ type ])
    }

    this.type = type
  }

  onDrag (element) {
    this.isDragging = (element) ? true : false

    if (this.isDragging) {
      this.onUpdate(null)
      this.object.dragging.add(element)

    } else {
      this.onUpdate('pointer')
    }
  }

  update () {
    this.object.position.x = lerp(this.object.position.x, this.object.mouse.x * (window.innerWidth / 2), 0.9)
    this.object.position.y = lerp(this.object.position.y, this.object.mouse.y * (window.innerHeight / 2), 0.9)
  }

}
