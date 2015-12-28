'use strict';

export default class Door extends THREE.Object3D {

  constructor (type = 'door-city') {
    super()

    var material = new THREE.MeshPhongMaterial( {
        shading: THREE.FlatShading,
        map: ResourceManager.get('billboards-' + type),
        side: THREE.DoubleSide,
        transparent: true
      })
      , geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
      , mesh = new THREE.Mesh(geometry, material)

    mesh.scale.set(1.4, 1.4, 1.4)

    this.add(mesh)

    var lightColor = 0xfcfcfc
      , light = new THREE.PointLight(lightColor, 2.5, 5);

    light.position.set(0, 0.35, 0.5)

    this.add(light)
  }

}

