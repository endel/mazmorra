import Composition from './character/Composition'

export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.gender = 'man'
    this._direction = "bottom"

    this.composition = new Composition({}, false)
    this.add(this.composition)
  }

  get label () {
    return `${ this.userData.name } - LVL ${ this.userData.lvl }`
  }

  set direction (direction) {
    this.composition.direction = direction
  }

}
