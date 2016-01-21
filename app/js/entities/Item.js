'use strict';

import Highlight from '../effects/Highlight'
import Pickable from '../behaviors/Pickable'
import LightOscillator from '../behaviors/LightOscillator'
import Stretchable from '../behaviors/Stretchable'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'

var unimportantItems = ['diamond', 'elixir-heal', 'elixir-potion', 'gold', 'life-heal', 'life-potion', 'mana-heal', 'mana-potion']

export default class Item extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    var texture = ResourceManager.get( "items-" + data.type )
    this.item = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      fog: true
    }))
    this.item.position.y = 0.5
    this.add(this.item)

    // only highlight important items
    if (unimportantItems.indexOf(data.type) === -1) {
      this.highlight = new Highlight()
      this.highlight.position.y = 0.7
      this.highlight.position.x -= 0.28
      this.highlight.position.z = -0.4
      this.highlight.addBehaviour(new Stretchable)
      this.add(this.highlight)

      var light = new THREE.SpotLight(0xffffff, 0.5, 50);
      light.addBehaviour(new LightOscillator, 0.5, 0.6, 0.05)
      light.position.set(0, 4, 0)
      light.target = this.item
      this.add(light)

    } else {
      this.addBehaviour(new NearPlayerOpacity)
    }

    this.item.scale.normalizeWithTexture(this.item.material.map)
    this.item.addBehaviour(new Pickable)
  }

  get label () {
    return this.userData.type.replace('-', ' ')
  }

}

