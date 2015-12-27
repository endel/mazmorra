export default class Character extends THREE.Object3D {

  constructor (gender = 'man') {
    super()

    this.textures = {
      top: ResourceManager.get( 'character-' + gender + '-top' ),
      bottom: ResourceManager.get( 'character-' + gender + '-bottom' ),
      left: ResourceManager.get( 'character-' + gender + '-left' ),
      right: ResourceManager.get( 'character-' + gender + '-right' )
    }

    this.gender = gender
    this._direction = "bottom"

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures.bottom,
      color: 0xffffff,
      fog: true
    }))
    this.add(this.sprite)
    this.sprite.position.y = 0.1

    this.scale.set(3, 3, 3)
  }

  set direction (direction) {
    this._direction = direction
    var texture = this.textures[ this._direction ]

    this.sprite.material.map = texture

    var scale = SCALES[ texture.image.width ]
    this.scale.set(scale, scale, scale)
  }

}
