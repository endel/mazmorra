export default class Button extends THREE.Object3D {

  constructor (kind = 'left') {
    super()

    this.standby = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-button-${ kind }`),
      transparent: true
    }))
    this.standby.scale.normalizeWithHUDTexture(this.standby.material.map)
    this.add(this.standby)

    this.over = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`gui-button-${ kind }-over`),
      transparent: true
    }))
    this.over.scale.normalizeWithHUDTexture(this.over.material.map)
    this.add(this.over)

    this.width = this.standby.material.map.frame.w * HUD_SCALE
    this.height = this.standby.material.map.frame.h * HUD_SCALE

    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))
  }

  onMouseOut () {
    tweener.add(this.scale).
      to({ x: 1, y: 1, z: 1 }, 300, Tweener.ease.cubicInOut)

    this.over.parent.remove(this.over)
    this.add(this.standby)
  }

  onMouseOver () {
    tweener.add(this.scale).
      to({ x: 0.96, y: 0.96, z: 0.97 }, 300, Tweener.ease.cubicInOut)

    this.standby.parent.remove(this.standby)
    this.add(this.over)
  }

}




