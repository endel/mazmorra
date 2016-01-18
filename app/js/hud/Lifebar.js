
export default class Lifebar extends THREE.Object3D {

  constructor (type = 'life') {
    super()

    this.blankPixelArea = 4 // 4 blank pixels

    this.fg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-" + type + "-bar-fill"),
      transparent: true
    }))
    this.fg.material.opacity = 0.85
    this.add(this.fg)

    this.bg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-bar-bg"),
      transparent: true
    }))
    this.bg.material.opacity = 0.5
    this.add(this.bg)

    this.scale.set(this.bg.material.map.frame.w * HUD_SCALE, this.bg.material.map.frame.h * HUD_SCALE, 1)

    this.width = (this.bg.material.map.frame.w * HUD_SCALE) / 2
    this.height = (this.bg.material.map.frame.h * HUD_SCALE) / 2

    this.set(0)
  }

  set (percentage) {
    var totalHeight = this.bg.material.map.frame.h
      , unusableHeight = this.blankPixelArea
      , usableHeight = totalHeight - unusableHeight
      , usableRatio = ((totalHeight - unusableHeight * 2)/totalHeight)

    // (1 - %)
    var finalPercentage = (unusableHeight/totalHeight) + (usableRatio - (percentage * usableRatio)) // (unusableHeight/totalHeight) // - (0.6*usableRatio)

    this.fg.material.map.offset.y = -finalPercentage
    this.fg.position.y = -finalPercentage
  }

}

