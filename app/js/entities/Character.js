import Composition from './character/Composition'

export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.gender = 'man'
    this._direction = "bottom"

    this.composition = new Composition(data.properties)
    this.add(this.composition)

    this.position.y = 0.5
  }

  get sprite () {
    return this.composition.sprite;
  }

  get label () {
    return `${ this.userData.name } - LVL ${ this.userData.lvl }`
  }

  set direction (direction) {
    this.composition.direction = direction
  }

  destroy () {
     this.composition.destroy()
  }

}
