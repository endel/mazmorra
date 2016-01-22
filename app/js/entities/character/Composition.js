import DangerousThing from '../../behaviors/DangerousThing'

export default class Composition extends THREE.Object3D {

  constructor () {
    super()

    this.bodies = [
      ResourceManager.get('character-body-0-bottom'),
      ResourceManager.get('character-body-1-bottom')
    ]

    this.eyes = [
      ResourceManager.get( 'character-eyes-0-bottom' ),
      ResourceManager.get( 'character-eyes-1-bottom' ),
      ResourceManager.get( 'character-eyes-2-bottom' )
    ]

    this.hairs = [
      ResourceManager.get( 'character-hair-0-bottom' ),
      ResourceManager.get( 'character-hair-1-bottom' ),
      ResourceManager.get( 'character-hair-2-bottom' ),
      ResourceManager.get( 'character-hair-3-bottom' ),
      ResourceManager.get( 'character-hair-4-bottom' ),
      ResourceManager.get( 'character-hair-5-bottom' ),
      ResourceManager.get( 'character-hair-6-bottom' ),
      ResourceManager.get( 'character-hair-7-bottom' ),
      ResourceManager.get( 'character-hair-8-bottom' ),
    ]

    this.clothes = [
      ResourceManager.get( 'character-clothes-0-bottom' ),
      ResourceManager.get( 'character-clothes-1-bottom' ),
      ResourceManager.get( 'character-clothes-2-bottom' ),
    ]

    this.capes = [
      ResourceManager.get('character-cape-0-bottom'),
      ResourceManager.get('character-cape-1-bottom'),
      ResourceManager.get('character-cape-2-bottom')
    ]

    this.items = [ ResourceManager.get( 'character-items-0' ) ]

    this.cape = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.capes[1],
      color: 0xffffff,
      fog: true,
      depthTest: false
    }))
    this.cape.scale.normalizeWithTexture(this.capes[2])
    this.cape.position.set(0, -0.72, 0)
    this.cape.position.y += 0.1
    this.cape.initY = this.cape.position.y
    this.cape.destY = this.cape.position.y - 0.09
    this.add(this.cape)

    this.hair = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.hairs[3],
      color: 0xffffff,
      fog: true,
      depthTest: false
    }))
    this.hair.scale.normalizeWithTexture(this.hairs[3])
    this.hair.position.set(0, 0.45, 0)
    this.hair.initY = this.hair.position.y
    this.hair.destY = this.hair.position.y - 0.09
    this.hair.renderOrder = 3
    this.add(this.hair)

    this.eye = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.eyes[0],
      color: 0xffffff,
      fog: true,
      depthTest: false
    }))
    this.eye.scale.normalizeWithTexture(this.eyes[0])
    this.eye.scale.set(this.eye.scale.x / this.hair.scale.x, this.eye.scale.y / this.hair.scale.y, 1)
    this.eye.position.set(0, 0.18, 0)
    this.hair.add(this.eye)

    this.cloth = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.clothes[1],
      color: 0xffffff,
      fog: true,
      depthTest: false
    }))
    this.cloth.scale.normalizeWithTexture(this.clothes[1])
    this.cloth.position.y -= 0.12
    this.cloth.renderOrder = 1
    this.add(this.cloth)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.bodies[0],
      color: 0xffffff,
      fog: true,
      depthTest: false
    }))
    this.body.scale.normalizeWithTexture(this.bodies[0])
    this.body.renderOrder = 0
    this.add(this.body)

    setTimeout(() => this.moveUp(this.hair, 1300), Math.random() * 1500)
    setTimeout(() => this.moveUp(this.cape, 800), Math.random() * 1000)
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
