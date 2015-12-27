'use strict';

import Pickable from '../behaviors/Pickable'
import Highlight from '../effects/Highlight'

var unimportantItems = ['diamond', 'elixir-heal', 'elixir-potion', 'gold', 'life-heal', 'life-potion', 'mana-heal', 'mana-potion']

export default class Item extends THREE.Object3D {

  constructor (name = 'sword') {
    super()
    var texture = ResourceManager.get( "items-" + name )

    this.item = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      fog: true
    }))
    this.item.position.y = 0.1
    this.item.behave(new Pickable)
    this.add(this.item)

    // only highlight important items
    if (unimportantItems.indexOf(name) === -1) {
      this.highlight = new Highlight()
      this.highlight.position.y = 0.6
      // this.highlight.position.z = -0.05
      this.add(this.highlight)
    }

    var scale = SCALES[ texture.image.width ]
    this.item.scale.set(scale, scale, scale)

  }

}

