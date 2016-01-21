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
      map: this.capes[2],
      color: 0xffffff,
      fog: true,
    }))
    this.capeScale = SCALES[ this.cape.material.map.frame.w ]
    this.cape.scale.set(this.capeScale, this.capeScale, this.capeScale)
    this.cape.position.set(0, -0.72, 0)
    this.add(this.cape)

    this.hair = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.hairs[3],
      color: 0xffffff,
      fog: true,
    }))
    this.hairScale = SCALES[ this.hair.material.map.frame.w ]
    this.hair.scale.set(this.hairScale, this.hairScale, this.hairScale)
    this.hair.position.set(0, 0.72, 0)
    this.initHairY = this.hair.position.y
    this.destHairY = this.hair.position.y - 0.09
    this.add(this.hair)

    this.eye = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.eyes[2],
      color: 0xffffff,
      fog: true,
    }))
    this.eyeScale = SCALES[ this.eye.material.map.frame.w ] / this.hairScale
    this.eye.scale.set(this.eyeScale, this.eyeScale, this.eyeScale)
    this.eye.position.set(0, 0, 0)
    this.hair.add(this.eye)

    this.cloth = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.clothes[2],
      color: 0xffffff,
      fog: true,
    }))
    this.clothScale = SCALES[ this.cloth.material.map.frame.w ]
    this.cloth.scale.set(this.clothScale, this.clothScale, this.clothScale)
    this.cloth.position.set(0, 0, 0)
    this.add(this.cloth)

    this.body = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.bodies[0],
      color: 0xffffff,
      fog: true,
    }))
    this.bodyScale = SCALES[ this.body.material.map.frame.w ]
    this.body.scale.set(this.bodyScale, this.bodyScale, this.bodyScale)
    this.add(this.body)

    setTimeout(() => this.moveHairUp(), Math.random() * 1500)
  }

  // HAIR MOVING => REFACTOR ME
  moveHairUp () {
    this.tween = tweener.
      add(this.hair.position).
      to({ y: this.destHairY }, 1100, Tweener.ease.cubicInOut).
      then(this.moveHairDown.bind(this))
  }
  moveHairDown () {
    this.tween = tweener.
      add(this.hair.position).
      to({ y: this.initHairY }, 1100, Tweener.ease.cubicInOut).
      then(this.moveHairUp.bind(this))
  }

}
