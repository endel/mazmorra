import Composition from './character/Composition'

export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.gender = 'man'

    this.composition = new Composition(data.properties)
    this.composition.position.y = 0.5

    this.add(this.composition)
  }

  get sprite () {
    return this.composition.sprite;
  }

  get label () {
    return `${ this.userData.name } - lvl ${ this.userData.lvl }`
  }

  set direction (direction) {
    this.composition.direction = direction
  }

  destroy () {
     this.composition.destroy()
  }

}
