
export default class ExpBar extends THREE.Object3D {

  constructor () {
    super()

    this.userData.hud = true;
    this.offsetMultiplier = 3

    this.bg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-xp-bar-bg") ,
      transparent: true
    }))
    this.bg.material.opacity = 0.6
    this.add(this.bg)

    this.fg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-xp-bar-fill"),
      transparent: true
    }))
    this.fg.scale.set(3, 1, 1)
    this.fg.material.opacity = 0.85
    this.add(this.fg)

    this.scale.set(this.bg.material.map.frame.w * config.HUD_SCALE, this.bg.material.map.frame.h * config.HUD_SCALE, 1)

    this.width = this.bg.material.map.frame.w * config.HUD_SCALE
    this.height = this.bg.material.map.frame.h * config.HUD_SCALE

    this.initialOffset = this.fg.material.map.offset.x

    this.set(0)
  }

  set (percentage) {
    var totalWidth = this.bg.material.map.frame.w
      , imgWidth = this.bg.material.map.image.width

    var finalPercentage = 1 - percentage
    this.fg.material.map.offset.x = this.initialOffset-((totalWidth/imgWidth)*finalPercentage)
    this.fg.position.x = -finalPercentage - ((this.bg.material.map.frame.w/this.fg.material.map.frame.w)*3)
  }

}
