'use strict';

import Pickable from '../behaviors/Pickable'
import Highlight from '../effects/Highlight'

var unimportantItems = ['diamond', 'elixir-heal', 'elixir-potion', 'gold', 'life-heal', 'life-potion', 'mana-heal', 'mana-potion']

export default class Item extends THREE.Object3D {

  constructor (name = 'sword') {
    super()
    var texture = ResourceManager.get( "items-" + name )

    // only highlight important items
    if (name.indexOf(unimportantItems) === -1) {
      this.highlight = new Highlight()
      this.highlight.position.y = 0.6
      this.add(this.highlight)
    }

    this.item = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      fog: true
    }))
    this.item.position.y = 0.1
    this.item.behave(new Pickable)
    this.add(this.item)

    // TODO: scale item accourding to it's texture size 4x4 / 8x8 / 16x16 px
    console.log(texture.image, texture.image.width)
    if (texture.image.width) {
    }

    this.scale.set(3, 3, 3)
  }

}

