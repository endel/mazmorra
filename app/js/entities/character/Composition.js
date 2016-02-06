import Resources from './Resources'

const MAX_CHAR_WIDTH = 7
    , MAX_CHAR_HEIGHT = 10

export default class Composition extends THREE.Object3D {

  constructor (props = {}, move = true) {
    super()

    this.properties = {
      cape: props.klass,
      cloth: props.klass,
      hair: props.hair || 1,
      eye: 0,
      body: null
    }

    this._direction = 'bottom'
    Resources.init()

    this.textureCanvas = document.createElement('canvas')
    this.textureCanvas.height = MAX_CHAR_HEIGHT
    this.textureCanvas.width = MAX_CHAR_WIDTH * 5 // (top, left, right, bottom, HUD head)

    this.tempCanvas = document.createElement('canvas')
    this.tempCanvas.height = MAX_CHAR_HEIGHT
    this.tempCanvas.width = MAX_CHAR_WIDTH

    this.cape = new THREE.Sprite(new THREE.SpriteMaterial({
      map: Resources.get('cape', this.properties.cape)[this._direction],
      color: 0xffffff,
      fog: true,
    }))
    this.cape.position.set(0, -0.72, 0)
    this.cape.position.y += 0.1
    this.cape.initY = this.cape.position.y
    this.cape.destY = this.cape.position.y - 0.09

    this.hair = new THREE.Sprite(new THREE.SpriteMaterial({
      map: Resources.get('hair', this.properties.hair)[this._direction],
      color: 0xd0c01c,
      fog: true,
    }))

    this.eye = new THREE.Sprite(new THREE.SpriteMaterial({
      map: Resources.get('eye', this.properties.eye)[this._direction],
      color: 0xffffff,
      fog: true,
    }))
    this.eye.position.set(0, -0.62, 0)

    // head (hair + eyes)
    this.head = new THREE.Object3D()
    this.head.position.set(0, 1.275, 0)
    this.head.initY = this.head.position.y
    this.head.destY = this.head.position.y - 0.09
    this.head.add(this.eye)
    this.head.add(this.hair)
    this.add(this.head)

    this.cloth = new THREE.Sprite(new THREE.SpriteMaterial({
      map: Resources.get('cloth', this.properties.cloth)[this._direction],
      color: 0xffffff,
      fog: true,
    }))
    this.add(this.cloth)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: Resources.get('body', this.properties.body),
      color: 0xffffff,
      fog: true,
    }))
    this.add(this.body)

    // default configuration
    // this.setProperty('hair', 0)
    // this.setProperty('body')
    // this.setProperty('klass', 0)
    this.updateProperty('eye', 0)
    this.updateProperty('hair', this.properties.hair)

    this.updateColor('hair', Resources.colors.hair[0])
    this.updateColor('eye', Resources.colors.eye[props.eye || 0])
    this.updateColor('body', Resources.colors.body[props.body || 0])

    this.updateDirection()

    if (move) {
      // setTimeout(() => this.moveUp(this.head, 1300), Math.random() * 1500)
      setTimeout(() => this.moveUp(this.cape, 800), Math.random() * 1000)
    }
  }

  updateClass (value) {
    this.updateProperty('cloth', value)
    this.updateProperty('cape', value)
  }

  updateProperty(property, value = null) {
    this.properties[property] = value
    var texture = this.getTexture(property, value)

    if (property==="hair") {
      this.hair.visible = !!texture
    }

    // change texture only if its valid
    if (texture) {
      this[property].material.map = texture
      this[property].scale.normalizeWithTexture(texture)
    }
  }

  updateColor (property, color) {
    this[ property ].material.color = color
  }

  getTexture (type, index) {
    var texture = Resources.get(type, index)
    return (texture && texture[this._direction])
  }

  getColor (type, index) {
    return Resources.getColor(type, index)
  }

  set direction (direction) {
    this._direction = direction
    this.updateDirection()
  }

  updateDirection () {
    for (let prop in this.properties) {
      let texture = this.getTexture(prop, this.properties[prop])
      this[prop].visible = !!texture
      if (texture) {
        this[prop].material.map = texture
        this[prop].scale.normalizeWithTexture(texture)

        if (prop === "hair") {
          this[prop].position.y = -(texture.frame.h * 0.5) / 4
        }
      }
    }
  }

  // HAIR MOVING => REFACTOR ME
  moveUp (target, time) {
    this.tween = tweener.
      add(target.position).
      to({ y: target.destY }, time, Tweener.ease.cubicInOut).
      then(this.moveDown.bind(this, target, time))
  }

  moveDown (target, time) {
    this.tween = tweener.
      add(target.position).
      to({ y: target.initY }, time, Tweener.ease.cubicInOut).
      then(this.moveUp.bind(this, target, time))
  }

}
