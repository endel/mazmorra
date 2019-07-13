import Hint from "./Hint";

export default class SkillButton extends THREE.Object3D {

  constructor (skillName, hotkey) {
    super()

    this.userData.hud = true;

    this.userData.hint = `(${hotkey}) `;

    if (skillName === "attack-speed") {
      this.userData.hint += `Increases attack speed<br/>
        <strong>Duration:</strong> 3s<br/>
        <strong class="intelligence">Mana cost:</strong> 15`;

    } else if (skillName === "movement-speed") {
      this.userData.hint += `Increases movement speed<br />
        <strong>Duration:</strong> 2s<br/>
        <strong class="intelligence">Mana cost:</strong> 10`;
    }

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ResourceManager.get(`skills-${skillName}`) }))
    this.add(this.sprite)

    this.width = (this.sprite.material.map.frame.w *  config.HUD_SCALE) / 2
    this.height = (this.sprite.material.map.frame.h *  config.HUD_SCALE) / 2

    this.initialScale = {
      x: this.sprite.material.map.frame.w * config.HUD_SCALE,
      y: this.sprite.material.map.frame.h * config.HUD_SCALE,
    };
    this.scale.set(this.initialScale.x, this.initialScale.y, 1);

    this.addEventListener("mouseover", () => this.onMouseOver());
    this.addEventListener("mouseout", () => this.onMouseOut());

    this.addEventListener("click", () => {
      this.dispatchEvent({
        type: "skill",
        skill: skillName,
        bubbles: true
      });

      this.scale.x = this.initialScale.x - 5;
      this.scale.y = this.initialScale.y - 5;
      this.onMouseOut();
    });
  }

  get isActive () {
    return this.userData.hud === true;
  }

  onMouseOver () {
    if (this.userData.hint) { Hint.show(this.userData.hint, this.sprite); }

    App.tweens.remove(this.scale);
    App.tweens.add(this.scale).to({
      x: this.initialScale.x + 4,
      y: this.initialScale.y + 4,
    }, 300, Tweener.ease.quadOut);
  }

  onMouseOut () {
    if (this.userData.hint) { Hint.hide(); }
    App.tweens.remove(this.scale);
    App.tweens.add(this.scale).to(this.initialScale, 200, Tweener.ease.quadOut);
  }

}
