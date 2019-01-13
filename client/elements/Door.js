'use strict';

export default class Door extends THREE.Object3D {

  constructor (data, currentProgress, mapkind) {
    super()

    this.userData = data
    this.currentProgress = currentProgress

    let type = 'door-' + mapkind;

    let material = new THREE.MeshPhongMaterial( {
        shading: THREE.FlatShading,
        map: ResourceManager.get('billboards-' + type),
        side: THREE.FrontSide,
        transparent: true
      })
      // +2.8 for the pillars
      // , geometry = new THREE.PlaneGeometry(config.TILE_SIZE + 2.8, config.TILE_SIZE + 2.8)
      , geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)
      , mesh = new THREE.Mesh(geometry, material)

    window.door = this;

    this.position.y = 0.5;
    mesh.position.y = 0.5

    // TODO: automate a good-looking position based on door direction
    mesh.position.z -= 1.499

    mesh.scale.normalizeWithTexture(material.map, true)
    this.add(mesh)

    window.door = this;

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
