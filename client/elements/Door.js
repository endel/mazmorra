'use strict';
import helpers from '../../shared/helpers'

export default class Door extends THREE.Object3D {

  constructor (data, currentProgress, mapkind, gridTile) {
    super()

    this.userData = data
    this.currentProgress = currentProgress

    const doorStyle = (this.userData.destiny.progress <= 0) ? "up" : "down";
    const type = 'door-' + mapkind + "-" + doorStyle;

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

    if (gridTile & helpers.DIRECTION.NORTH) {
      this.position.y = 0.5;
      mesh.position.y = 0.5
      mesh.position.z -= 1.499 // TODO: automate a good-looking position based on door direction

    } else if (gridTile & helpers.DIRECTION.WEST) {
      this.position.x = 0.5;
      mesh.position.x = -1.5;
      mesh.position.y = 1;
      mesh.rotateY(Math.PI/2);
    }

    mesh.scale.normalizeWithTexture(material.map, true)
    this.add(mesh)

    window.door = this;

    let lightColor = 0xfcfcfc
      , light = new THREE.PointLight(lightColor, 1, 5); // Spotlight would be better here

    light.position.set(0, 0.7, -0.25)
    this.add(light)

    this.getEntity().on('mouseover', this.onMouseOver.bind(this))
    this.getEntity().on('mouseout', this.onMouseOut.bind(this))
  }

  get label () {
    const progress = this.userData.destiny.progress;
    // export enum DoorProgress {
    //   FORWARD = 1,
    //   BACK = -1,
    //   HOME = 0,
    //   LATEST = 10,
    // }

    let label = "";
    if (progress === 1) {
      label = `Forward to ${this.currentProgress + progress}`;

    } else if (progress === -1) {
      label = `Back to ${this.currentProgress + progress}`;

    } else if (progress === 0) {
      label = `Back to Lobby`

    } else if (progress === 10) {
      label = `Continue from ${player.userData.latestProgress}`;
    }

    return label;
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(config.COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

}
