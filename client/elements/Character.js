import Composition from './character/Composition'

export default class Character extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.composition = new Composition(data.properties)
    this.composition.position.y = 0.5

    this.add(this.composition)
  }

  get sprite () {
    return this.composition.sprite;
  }

  get label () {
    return (this !== global.player)
      ? `${ this.userData.name } - lvl ${ this.userData.lvl }`
      : undefined;
  }

  set direction (direction) {
    this.composition.direction = direction
  }

  destroy () {
     this.composition.destroy()
  }

}
