import { Text2D, textAlign } from 'three-text2d'

export default class Lifebar extends THREE.Object3D {

  constructor () {
    super()

    // Gold
    this.gold = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-gold") }))
    this.gold.scale.set(this.gold.material.map.frame.w * HUD_SCALE, this.gold.material.map.frame.h * HUD_SCALE, 1)
    this.add(this.gold)

    this.goldAmount = new Text2D("0", { font: DEFAULT_FONT, align: textAlign.right, fillStyle: '#fcf458', antialias: false })
    this.goldAmount.position.y = HUD_SCALE * (HUD_MARGIN / 1.5)
    this.goldAmount.position.x = - HUD_SCALE * (HUD_MARGIN * 1.5)
    this.add(this.goldAmount)

    // Diamond
    this.diamond = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get("items-diamond") }))
    this.diamond.scale.set(this.diamond.material.map.frame.w * HUD_SCALE, this.diamond.material.map.frame.h * HUD_SCALE, 1)
    this.diamond.position.set(HUD_SCALE / 2, - this.diamond.material.map.frame.h * (HUD_SCALE/2 + HUD_MARGIN), 1)
    this.add(this.diamond)

    this.diamondAmount = new Text2D("0", { font: DEFAULT_FONT, align: textAlign.right, fillStyle: '#4480b0', antialias: false })
    this.diamondAmount.position.x = - HUD_SCALE * (HUD_MARGIN * 1.5)
    this.diamondAmount.position.y = this.diamond.position.y + (HUD_SCALE * (HUD_MARGIN / 1.5))
    this.add(this.diamondAmount)

    this.width = (this.gold.material.map.frame.w * HUD_SCALE) / 2
    this.height = (this.gold.material.map.frame.h * HUD_SCALE) / 2
  }

}


