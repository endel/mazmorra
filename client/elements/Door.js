'use strict';

export default class Door extends THREE.Object3D {

  constructor (data, currentProgress) {
    super()

    this.userData = data
    this.currentProgress = currentProgress

    let type = (IS_DAY)
     ? 'door-day'
     : 'door-night';

    let material = new THREE.MeshPhongMaterial( {
        shading: THREE.FlatShading,
        map: ResourceManager.get('billboards-' + type),
        side: THREE.FrontSide,
        transparent: true
      })
      , geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)
      , mesh = new THREE.Mesh(geometry, material)

    mesh.position.y = 0.6

    // TODO: automate a good-looking position based on door direction
    mesh.position.z -= 1.499

    mesh.scale.normalizeWithTexture(material.map, true)
    this.add(mesh)

    let lightColor = 0xfcfcfc
      , light = new THREE.PointLight(lightColor, 1.5, 5); // Spotlight would be better here

    light.position.set(0, 0.7, -0.25)
    this.add(light)

    this.getEntity().on('mouseover', this.onMouseOver.bind(this))
    this.getEntity().on('mouseout', this.onMouseOut.bind(this))
  }

  get label () {
    const progress = this.userData.destiny.progress;
    return (progress > this.currentProgress)
      ? `Forward to #${progress}`
      : `Back to #${progress}`
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(config.COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

}
