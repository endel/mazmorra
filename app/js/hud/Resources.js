import Text2D from '../utils/Text2D'

export default class Lifebar extends THREE.Object3D {

  constructor () {
    super()

    // Gold
    this.gold = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-gold") }))
    this.gold.scale.set(this.gold.material.map.image.width * HUD_SCALE, this.gold.material.map.image.height * HUD_SCALE, 1)
    this.add(this.gold)

    this.goldAmount = new Text2D("500", { font: "50px primary", fillStyle: '#fcf458', antialias: false })
    this.goldAmount.position.x = - this.goldAmount._canvas.width
    this.goldAmount.position.y = 0
    this.add(this.goldAmount)

    // Diamond
    this.diamond = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-diamond") }))
    this.diamond.scale.set(this.diamond.material.map.image.width * HUD_SCALE, this.diamond.material.map.image.height * HUD_SCALE, 1)
    this.diamond.position.set(HUD_SCALE / 2, - this.diamond.material.map.image.height * (HUD_SCALE/2 + HUD_MARGIN), 1)
    this.add(this.diamond)

    this.diamondAmount = new Text2D("10", { font: "50px primary", fillStyle: '#4480b0', antialias: false })
    this.diamondAmount.position.x = -this.diamondAmount._canvas.width
    this.diamondAmount.position.y = this.diamond.position.y
    this.add(this.diamondAmount)

    this.width = (this.gold.material.map.image.width * HUD_SCALE) / 2
    this.height = (this.gold.material.map.image.height * HUD_SCALE) / 2
  }

}


