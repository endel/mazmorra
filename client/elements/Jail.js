'use strict';
import helpers from '../../shared/helpers'
import { i18n } from '../lang';

export default class Jail extends THREE.Object3D {

  constructor (data, currentProgress, mapkind) {
    super()

    this.userData = data
    this.mapkind = this.userData.mapkind || mapkind;
    this.currentProgress = currentProgress

    this.material = new THREE.MeshPhongMaterial({
      flatShading: true,
      map: ResourceManager.get('billboards-jail'),
      side: THREE.FrontSide,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)
    const mesh = new THREE.Mesh(geometry, this.material)

    if (this.userData.direction === helpers.DIRECTION.SOUTH) {
      this.position.y = 0.5;
      mesh.position.y = 0.5;
      mesh.position.z -= 1.499;

    } else if (this.userData.direction === helpers.DIRECTION.NORTH) {
      this.position.y = 0.5;
      mesh.position.y = 0.5;
      mesh.position.z = 1.5;

    } else if (this.userData.direction === helpers.DIRECTION.WEST) {
      this.position.x = 0.5;
      mesh.position.x = 1.499;
      mesh.position.y = 1;
      mesh.rotateY(Math.PI/2);

    } else if (this.userData.direction === helpers.DIRECTION.EAST) {
      this.position.x = 0.5;
      mesh.position.x = -1.499;
      mesh.position.y = 1;
      mesh.rotateY(Math.PI/2);
    }

    this.onUpdate();

    mesh.scale.normalizeWithTexture(this.material.map, true)
    this.add(mesh);

    this.getEntity().on('mouseover', this.onMouseOver.bind(this))
    this.getEntity().on('mouseout', this.onMouseOut.bind(this))

    this.getEntity().on('update', this.onUpdate.bind(this));
  }

  get isLocked () {
    return this.userData.isLocked;
  }

  onUpdate () {
    if (!this.isLocked) {
      App.tweens.add(this.position).to({ y: 3.2 }, 1500, Tweener.ease.quartOut);
    } else {
      App.tweens.add(this.position).to({ y: 0.5 }, 1500, Tweener.ease.quartOut);
    }
  }

  get label () {
    return (this.isLocked) ? i18n('lockedJail') : i18n('openedJail');
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(config.COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

}
