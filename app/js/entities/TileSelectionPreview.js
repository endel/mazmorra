'use strict';

export default class TileSelectionPreview extends THREE.Object3D {

  constructor () {
    super()

    var material = new THREE.MeshPhongMaterial( {
      shading: THREE.FlatShading,
      map: ResourceManager.get('effects-tile-selection'),
      side: THREE.DoubleSide,
      transparent: true,
      fog: true
    })
    var geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE)
    var mesh = new THREE.Mesh(geometry, material)

    this.add(mesh)

    // var light = new THREE.PointLight(0xfcfcfc, 2, 5);
    // // this.light = new THREE.PointLight(0xffffff, 1, 50, 1 );
    //
    // // light.castShadow = true;
    // // light.shadowCameraNear = 1;
    // // light.shadowCameraFar = 30;
    // // light.shadowCameraVisible = true;
    // // light.shadowMapWidth = 64;
    // // light.shadowMapHeight = 64;
    // // light.shadowMapWidth = 2048;
    // // light.shadowMapHeight = 1024;
    // // light.shadowBias = 0.01;
    // // light.shadowDarkness = 0.5;
    // light.position.set(0, 0.25, 0)
    // this.add(light)
  }

}

