import { humanize } from "../utils";

export default class TileSelectionPreview extends THREE.Object3D {

  constructor (light, hud) {
    super()

    this._target = null

    this.light = light
    this.lightColors = {}

    // TODO: decouple cursor reference
    this.cursor = hud.cursor
    this.selectionText = hud.selectionText

    this.material = new THREE.MeshPhongMaterial( {
      map: ResourceManager.get('effects-tile-selection'),
      transparent: true,
      side: THREE.DoubleSide,
      // fog: true
    })
    this.material.opacity = 0.6
    this.geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)

    this.setColor()
  }

  set target (target) {

    if (this._target !== target) {

      if (this._target) {
        this.setLabel( null )
        this._target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseout', this))
      }

      if (target) {
        // apply HUD label
        let availableLabels = target.filter(t => t.label)
          , lastLabel = availableLabels.length-1

        if (lastLabel !== -1) {
          this.setLabel(humanize(availableLabels[lastLabel].label));
        }

        target.forEach(e => e.__ENTITY__ && e.__ENTITY__.emit('mouseover', this))
      }
    }

    // TODO: improve me
    // clear highlight color if there's nothing on target
    if (target.length == 0) {

      // set pointer cursor
      App.cursor.dispatchEvent({ type: 'cursor', kind: 'pointer' })

      this.setColor()

    }

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
    this.selectionText.visible = !!label

    if (label !== this.selectionText.text) {
      this.selectionText.text = label
    }
  }

}
