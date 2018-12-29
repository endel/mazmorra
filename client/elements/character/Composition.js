import { Resources } from './Resources'

export default class Composition extends THREE.Object3D {

  constructor (props = {}) {
    super()

    this.textureOffset = Resources.getCurrentOffset()

    this.properties = {
      cape: props.klass || 0,
      cloth: props.klass || 0,
      hair: props.hair || 0,
      eye: 0,
      body: 0
    }

    this.colors = {
      hair: Resources.colors.hair[props.hairColor || 0],
      eye: Resources.colors.eye[props.eye || 0],
      body: Resources.colors.body[props.body || 0]
    }

    this._direction = 'bottom'
    this.updateTexture()
  }

  updateTexture () {
    Resources.updateTexture(this)
    var map = Resources.get(this)

    if (!this.sprite) {
      this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: map
      }))
      this.sprite.scale.normalizeWithTexture(map)
      this.add(this.sprite)

    } else {
      this.sprite.material.map = map
    }
  }

  updateClass (value) {
    this.updateProperty('cloth', value)
    this.updateProperty('cape', value)
  }

  updateProperty(property, value = null) {
    this.properties[property] = value
  }

  updateColor (property, color) {
    this.colors[ property ] = color
  }

  set direction (direction) {
    this._direction = direction
    this.updateDirection()
  }

  updateDirection () {
    this.sprite.material.map = Resources.get(this)
  }

  destroy () {
    Resources.deleteTexture(this)
  }

}