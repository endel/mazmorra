// Enemy and and NPC share a lot

import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'
import DangerousThing from '../behaviors/DangerousThing';

export default class NPC extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data
    this._direction = 'bottom'

    this.textures = {
      top: ResourceManager.get( 'npc-' + this.userData.kind + '-top' ),
      bottom: ResourceManager.get( 'npc-' + this.userData.kind + '-bottom' ),
      left: ResourceManager.get( 'npc-' + this.userData.kind + '-left' ),
      right: ResourceManager.get( 'npc-' + this.userData.kind + '-right' )
    }

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures[ this._direction ],
      fog: true
    }))
    this.originalColor = this.sprite.material.color.getHex()

    this.sprite.scale.normalizeWithTexture(this.sprite.material.map)
    this.sprite.position.y = 0.1

    this.add(this.sprite)

    this.addBehaviour(new DangerousThing)
    this.addBehaviour(new NearPlayerOpacity)
  }

  get label () {
    var text = this.userData.kind

    if (this.userData.hp.current <= 0) {
      text = `Dead ${ text }`
    }

    return text
  }

  set direction (direction) {
    this._direction = direction

    var texture = this.textures[ this._direction ]
    this.sprite.material.map = texture

    this.sprite.scale.normalizeWithTexture(texture)
  }

}
