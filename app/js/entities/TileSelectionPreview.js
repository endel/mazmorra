'use strict';

export default class TileSelectionPreview extends THREE.Object3D {

  constructor (light) {
    super()

    this._target = null

    this.light = light
    this.lightColors = {}

    this.material = new THREE.MeshPhongMaterial( {
      shading: THREE.FlatShading,
      map: ResourceManager.get('effects-tile-selection'),
      side: THREE.DoubleSide,
      transparent: true,
      fog: true
    })
    this.geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)

    this.setColor()
  }

  set target (target) {
    if (this._target !== target) {
      if (this._target) {
        this._target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseout', this))
      }
      if (target) {
        target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseover', this))
      }
    }
    this._target = target
  }

  setColor (hex = 0xffffff) {
    if (!this.lightColors[hex]) {
      this.lightColors[hex] = new THREE.Color(hex)
    }

    this.material.color = this.lightColors[hex]
    this.light.color = this.lightColors[hex]
  }

}

