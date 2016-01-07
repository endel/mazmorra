'use strict';

export default class TileSelectionPreview extends THREE.Object3D {

  constructor (light, labelText) {
    super()

    this._target = null

    this.light = light
    this.lightColors = {}

    this.labelText = labelText

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
        this.setLabel(null)
        this._target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseout', this))
      }
      if (target) {
        // apply HUD label
        let availableLabels = target.filter(t => t.label)
          , lastLabel = availableLabels.length-1

        if (lastLabel !== -1) {
          this.setLabel(availableLabels[ lastLabel ].label)
        }

        target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseover', this))
      }
    }

    // TODO: improve me
    // clear highlight color if there's nothing on target
    if (target.length == 0) this.setColor()

    this._target = target
  }

  setColor (hex = 0xffffff) {
    if (hex instanceof THREE.Color) this.lightColors[hex] = hex

    if (!this.lightColors[hex]) {
      this.lightColors[hex] = new THREE.Color(hex)
    }

    this.material.color = this.lightColors[hex]
    this.light.color = this.lightColors[hex]
  }

  setLabel (label) {
    this.labelText.visible = !!label

    if (label !== this.labelText.text) {
      this.labelText.text = label
    }
  }

}

