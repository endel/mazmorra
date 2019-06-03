import { Behaviour } from 'behaviour.js'

let player = new WeakMap()

export default class InventoryBehaviour extends Behaviour {

  onAttach (playerObject) {
    player.set(this, playerObject)

    this.on('toggle', this.onToggle.bind(this))
  }

  onToggle (isOpen) {
    this.object.slots.updateItems();
  }

  onDetach () { }

}
