import { Behaviour } from 'behaviour.js'

let player = new WeakMap()

export default class InventoryBehaviour extends Behaviour {

  onAttach (playerObject) {
    player.set(this, playerObject)

    // this.

    this.on('toggle', this.onToggle.bind(this))
  }

  onToggle (isOpen) {
    let playerObject = player.get(this)

    this.object.slots.updateItems(playerObject.userData.inventory)

    // this.object.
    console.log(playerObject.userData.inventory)
  }

  onDetach () { }

}
