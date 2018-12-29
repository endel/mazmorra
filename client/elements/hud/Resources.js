import { MeshText2D, textAlign } from 'three-text2d'

export default class Lifebar extends THREE.Object3D {

  constructor () {
    super()

    // Gold
    this.gold = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-gold") }))
    this.gold.scale.set(this.gold.material.map.frame.w * config.HUD_SCALE, this.gold.material.map.frame.h * config.HUD_SCALE, 1)
    this.add(this.gold)

    this.goldAmount = new MeshText2D("0", { font: config.DEFAULT_FONT, align: textAlign.right, fillStyle: '#fcf458', antialias: false })
    this.goldAmount.position.y = config.HUD_SCALE * ( config.HUD_MARGIN * 1.3)
    this.goldAmount.position.x = - config.HUD_SCALE * ( config.HUD_MARGIN * 1.5)
    this.add(this.goldAmount)

    // Diamond
    this.diamond = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-diamond") }))
    this.diamond.scale.set(this.diamond.material.map.frame.w * config.HUD_SCALE, this.diamond.material.map.frame.h * config.HUD_SCALE, 1)
    this.diamond.position.set(-config.HUD_SCALE/10, - this.diamond.material.map.frame.h * (config.HUD_SCALE +  config.HUD_MARGIN), 1)
    this.add(this.diamond)

    this.diamondAmount = new MeshText2D("0", { font: config.DEFAULT_FONT, align: textAlign.right, fillStyle: '#4480b0', antialias: false })
    this.diamondAmount.position.x = - config.HUD_SCALE * ( config.HUD_MARGIN * 1.5)
    this.diamondAmount.position.y = this.diamond.position.y + (config.HUD_SCALE * ( config.HUD_MARGIN * 1.3))
    this.add(this.diamondAmount)

    this.width = (this.gold.material.map.frame.w * config.HUD_SCALE) / 2
    this.height = (this.gold.material.map.frame.h * config.HUD_SCALE) / 2
  }

}
