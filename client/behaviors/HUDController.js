import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'

export default class HUDController extends Behaviour {

  onAttach (playerObject) {
    this.playerObject = playerObject

    // events
    this.on("update-inventory", this.onUpdateInventory.bind(this));
    this.on("update-attributes", this.onUpdateAttributes.bind(this));
  }

  onUpdateInventory(inventoryType) {
    this.object[inventoryType].updateItems();
  }

  onUpdateAttributes (data) {
    this.object.character.update(data);
    // this.object.character.updateAttribute(attribute, value);
  }

  update () {
    // TODO: only update texts when they really change
    this.object.resources.goldAmount.text = this.playerObject.userData.gold.toString();
    this.object.resources.diamondAmount.text = this.playerObject.userData.diamond.toString();

    this.setPercentage(this.object.lifebar, this.playerObject.userData.hp.current / this.playerObject.userData.hp.max, 'x');
    this.setPercentage(this.object.manabar, this.playerObject.userData.mp.current / this.playerObject.userData.mp.max, 'x');
    this.setPercentage(this.object.expbar, this.playerObject.userData.xp.current / this.playerObject.userData.xp.max, 'x');
  }

  setPercentage (object, percentage, attr) {
    var frameAttr = (attr === 'y') ? 'h' : 'w'
      , totalArea = object.bg.material.map.frame[frameAttr]
      , imgHeight = object.bg.material.map.image.height

    // (1 - %)
    var finalPercentage = 1 - percentage

    object.fg.material.map.offset[attr] = lerp(object.fg.material.map.offset[attr], object.initialOffset-((totalArea/imgHeight)*finalPercentage), 0.1)
    object.fg.position[attr] = lerp(
      object.fg.position[attr],
      - finalPercentage - ((object.bg.material.map.frame[frameAttr]/object.fg.material.map.frame[frameAttr]) * object.offsetMultiplier),
      0.1
    )
  }

  onDetach () {
  }

}

