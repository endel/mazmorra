export default class Character extends THREE.Sprite {

  constructor (gender = 'man') {
    super(new THREE.SpriteMaterial({
      map: ResourceManager.get( "character-" + gender + "-bottom"),
      color: 0xffffff,
      fog: true
    }))

    this.gender = gender
    this._direction = "bottom"

    this.scale.set(3, 3, 3)
  }

  set direction (direction) {
    this._direction = direction
    this.material.map = ResourceManager.get("character-" + this.gender + "-" + direction)
  }

}
