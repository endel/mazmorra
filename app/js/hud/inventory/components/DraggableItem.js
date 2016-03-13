import { Behaviour } from 'behaviour.js'

export default class DraggableItem extends Behaviour {

  onAttach () {
    this.isDragging = false

    this.object.addEventListener('click', this.toggleDrag.bind(this))
    this.object.addEventListener('touchstart', this.startDrag.bind(this))
    this.object.addEventListener('touchend', this.stopDrag.bind(this))
  }

  toggleDrag () {
    if (!this.isDragging) {
      this.startDrag()
    } else {
      this.stopDrag()
    }
  }

  startDrag () {
    this.isDragging = true
  }

  stopDrag () {
    this.isDragging = false
  }

  onDetach () {
  }


}

