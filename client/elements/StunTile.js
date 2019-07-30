'use strict';

import { i18n } from '../lang';

export default class StunTile extends THREE.Object3D {

  constructor (data) {
    super();

    this.material = new THREE.MeshPhongMaterial({
      flatShading: true,
      map: ResourceManager.get(`traps-stun-tile`),
      side: THREE.FrontSide,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(config.TILE_SIZE * 0.75, config.TILE_SIZE * 0.75);
    this.sprite = new THREE.Mesh(geometry, this.material)
    this.sprite.scale.normalizeWithTexture(this.material.map, true)
    this.sprite.rotateX(-Math.PI / 2);
    this.sprite.position.y -= 0.49;

    this.add(this.sprite);
  }

  get label () {
    return i18n('trap');
  }

}
