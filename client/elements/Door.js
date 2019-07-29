'use strict';
import helpers from '../../shared/helpers'
import QuestIndicator from '../behaviors/QuestIndicator';
import { PlayerPrefs } from '../core/PlayerPrefs';
import { i18n } from '../lang';

export default class Door extends THREE.Object3D {

  constructor (data, currentProgress, mapkind, gridTile) {
    super()

    this.userData = data
    this.mapkind = this.userData.mapkind || mapkind;
    this.currentProgress = currentProgress

    this.material = new THREE.MeshPhongMaterial({
      flatShading: true,
      map: this.getTexture(),
      side: THREE.FrontSide,
      // transparent: true
    });

      // +2.8 for the pillars
      // , geometry = new THREE.PlaneGeometry(config.TILE_SIZE + 2.8, config.TILE_SIZE + 2.8)

    const geometry = new THREE.PlaneGeometry(config.TILE_SIZE, config.TILE_SIZE)
    const mesh = new THREE.Mesh(geometry, this.material)

    if (gridTile & helpers.DIRECTION.NORTH) {
      this.position.y = 0.5;
      mesh.position.y = 0.5;
      mesh.position.z -= 1.499; // TODO: automate a good-looking position based on door direction

    } else if (gridTile & helpers.DIRECTION.WEST) {
      this.position.x = 0.5;
      mesh.position.x = -1.499;
      mesh.position.y = 1;
      mesh.rotateY(Math.PI/2);
    }

    mesh.scale.normalizeWithTexture(this.material.map, true)
    this.add(mesh);

    let lightColor = 0xfcfcfc
      , light = new THREE.PointLight(lightColor, 1, 5); // Spotlight would be better here

    light.position.set(0, 0.7, -0.25)
    this.add(light)

    // Tutorial: show indicator for first door
    if (
      this.userData.destiny.progress === 2 &&
      !PlayerPrefs.get("tutorial", false)
    ) {
      this.addBehaviour(new QuestIndicator());
    }

    this.getEntity().on('mouseover', this.onMouseOver.bind(this))
    this.getEntity().on('mouseout', this.onMouseOut.bind(this))

    this.getEntity().on('update', this.onUpdate.bind(this));
  }

  getTexture() {
    const doorStyle = (this.isLocked)
      ? "locked"
      : (this.userData.destiny.progress === -1) ? "up" : "down";

    return ResourceManager.get('billboards-door-' + this.mapkind + "-" + doorStyle);
  }

  get isLocked () {
    return this.userData.isLocked;
  }

  onUpdate () {
    this.material.map = this.getTexture();
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

    if (this.userData.destiny.room) {
      label = this.userData.destiny.room;

    } else if (progress === -2) {
      label = `${i18n('forwardTo')} ${this.currentProgress + 1}`;

    } else if (progress === -1) {
      label = `${i18n('backTo')} ${this.currentProgress - 1}`;

    } else if (progress === 1) {
      label = i18n('backToCastle');

    } else if (progress === -3) {
      label = `${i18n('continueFrom')} ${player.userData.latestProgress}`;

    } else {
      label = `${i18n('downTo')} ${progress}`;
    }

    if (this.userData.mapkind) {
      label += ` (${i18n(this.userData.mapkind)})`;
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
