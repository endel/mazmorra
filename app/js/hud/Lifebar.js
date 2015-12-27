var blankPixelArea = 4 // 4 blank pixels

export default class Lifebar extends THREE.Object3D {

  constructor (type = 'life') {
    super()

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

    this.scale.set(this.bg.material.map.image.width * HUD_SCALE, this.bg.material.map.image.height * HUD_SCALE, 1)

    this.width = (this.bg.material.map.image.width * HUD_SCALE) / 2
    this.height = (this.bg.material.map.image.height * HUD_SCALE) / 2

    var totalHeight = this.bg.material.map.image.height
      , unusableHeight = blankPixelArea
      , usableHeight = totalHeight - unusableHeight
      , usableRatio = ((totalHeight - unusableHeight * 2)/totalHeight)

    // (1 - %)
    var percentage = 0.3
    var finalPercentage = (unusableHeight/totalHeight) + (usableRatio - (percentage * usableRatio)) // (unusableHeight/totalHeight) // - (0.6*usableRatio)
    var randWaitTime = 1000 + (Math.random() * 1000)

    tweener.
      add(this.fg.material.map.offset).
      wait(randWaitTime).
      to({ y: -finalPercentage }, 400, Tweener.ease.cubicOut)
    tweener.
      add(this.fg.position).
      wait(randWaitTime).
      to({ y: -finalPercentage }, 400, Tweener.ease.cubicOut)
  }

}

