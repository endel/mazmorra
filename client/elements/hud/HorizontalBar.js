import Hint from "./Hint";

export default class HorizontalBar extends THREE.Object3D {

  constructor (type = 'xp') {
    super()

    this.attribute = type;
    this.offsetMultiplier = 3

    this.bg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`hud-${type}-bar-bg`) ,
      transparent: true
    }));
    this.bg.material.opacity = 0.6;

    this.add(this.bg);

    const material = new THREE.MeshBasicMaterial({ map: ResourceManager.get(`hud-${type}-bar-fill`) });
    material.side = THREE.DoubleSide;

    // const geometry = new THREE.PlaneGeometry(1, 1);
    // this.fg = new THREE.Mesh(geometry, material);
    // // this.fg.scale.set(1, 1, 1);
    // this.fg.material.opacity = 0.9;
    // this.fg.material.clippingPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)];
    // this.add(this.fg);
    // window.fg = this.fg;

    this.fg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`hud-${type}-bar-fill`),
      transparent: true
    }));
    this.fg.scale.set(3, 1, 1);
    this.fg.material.opacity = 0.8;
    this.add(this.fg);

    this.scale.set(this.bg.material.map.frame.w * config.HUD_SCALE, this.bg.material.map.frame.h * config.HUD_SCALE, 1);

    this.width = this.bg.material.map.frame.w * config.HUD_SCALE;
    this.height = this.bg.material.map.frame.h * config.HUD_SCALE;

    this.initialOffset = this.fg.material.map.offset.x;

    // TODO: fixed to the left?
    // this.bg.center.x = 0;
    // this.fg.center.x = 0;

    this.set(0);
  }

  set (percentage) {
    var totalWidth = this.bg.material.map.frame.w
      , imgWidth = this.bg.material.map.image.width

    var finalPercentage = 1 - percentage
    this.fg.material.map.offset.x = this.initialOffset-((totalWidth/imgWidth)*finalPercentage)
    this.fg.position.x = -finalPercentage - ((this.bg.material.map.frame.w/this.fg.material.map.frame.w)*3)
  }

}
