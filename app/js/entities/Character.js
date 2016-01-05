export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.textures = {
      top: ResourceManager.get( 'character-' + this.userData.gender + '-top' ),
      bottom: ResourceManager.get( 'character-' + this.userData.gender + '-bottom' ),
      left: ResourceManager.get( 'character-' + this.userData.gender + '-left' ),
      right: ResourceManager.get( 'character-' + this.userData.gender + '-right' )
    }

    this._direction = "bottom"

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures.bottom,
      color: 0xffffff,
      fog: true,
    }))
    this.add(this.sprite)
    this.sprite.position.y = 0.5

    this.sprite.scale.set(3, 3, 3)
  }

  get label () {
    return `${ this.userData.name } - LVL ${ this.userData.lvl }`
  }

  set direction (direction) {
    this._direction = direction
    var texture = this.textures[ this._direction ]

    this.sprite.material.map = texture

    var scale = SCALES[ texture.image.width ]
    this.sprite.scale.set(scale, scale, scale)
  }

}
