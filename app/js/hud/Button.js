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
  }

}




