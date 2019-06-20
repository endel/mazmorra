import { Behaviour } from 'behaviour.js'
import lerp from 'lerp'

export default class HUDController extends Behaviour {

  onAttach (playerObject) {
    this.playerObject = playerObject

    // events
    this.on("update-inventory", this.onUpdateInventory.bind(this));
    this.on("update-attributes", this.onUpdateAttributes.bind(this));
    this.on("update-bars", this.onUpdateBars.bind(this));

    this.on("update-all", (data) => {
      this.onUpdateAttributes(data);
      this.onUpdateBars(data);
    });
  }

  onUpdateInventory(inventoryType) {
    this.object[inventoryType].updateItems();
  }

  onUpdateAttributes (data) {
    this.object.character.update(data);
    // this.object.character.updateAttribute(attribute, value);
  }

  onUpdateBars (data) {
    // TODO: only update texts when they really change
    this.object.resources.goldAmount.text = data.gold.toString();
    this.object.resources.diamondAmount.text = data.diamond.toString();

    this.object.lifeText.text = Math.ceil(data.hp.current) + "/" + data.hp.max;
    this.object.manaText.text = Math.ceil(data.mp.current) + "/" + data.mp.max;
    this.object.expText.text = Math.ceil(data.xp.current) + "/" + data.xp.max;
  }

  update() {
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

