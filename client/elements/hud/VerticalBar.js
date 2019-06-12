import hint from "./Hint"

export default class VerticalBar extends THREE.Object3D {

  constructor (type = 'hp') {
    super()

    this.userData.hud = true;

    this.offsetMultiplier = 1
    this.attribute = type;

    this.bg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get(`hud-bar-bg`),
      transparent: true
    }));
    this.bg.material.opacity = 0.6;
    this.add(this.bg);

    this.fg = new THREE.Sprite(new THREE.SpriteMaterial({
      map: ResourceManager.get("hud-" + type + "-bar-fill"),
      transparent: true
    }))
    this.fg.scale.set(1, 2, 1);
    this.fg.material.opacity = 0.85;
    this.add(this.fg);

    this.scale.set(this.bg.material.map.frame.w * config.HUD_SCALE, this.bg.material.map.frame.h * config.HUD_SCALE, 1);

    this.width = this.bg.material.map.frame.w * config.HUD_SCALE;
    this.height = this.bg.material.map.frame.h * config.HUD_SCALE;

    this.initialOffset = this.fg.material.map.offset.y

    this.addEventListener('mouseover', this.onMouseOver.bind(this))
    this.addEventListener('mouseout', this.onMouseOut.bind(this))

    this.set(0)
  }

  onMouseOver () {
    const update = () => hint.show(player.userData[this.attribute].current + " / " + player.userData[this.attribute].max, this);
    update();

    this.updateHintInterval = setInterval(update, 300);
  }

  onMouseOut () {
    hint.hide();

    clearInterval(this.updateHintInterval);
  }

  set (percentage) {
    var totalHeight = this.bg.material.map.frame.h
      , imgHeight = this.fg.material.map.image.height

    // (1 - %)
    var finalPercentage = 1 - percentage
    this.fg.material.map.offset.y = this.initialOffset-((totalHeight/imgHeight)*finalPercentage)
    this.fg.position.y = -finalPercentage - (this.bg.material.map.frame.h/this.fg.material.map.frame.h)
  }

}
