import Hint from "../hud/Hint";

export default class QuestsButton extends THREE.Object3D {

  constructor () {
    super()

    this.userData.hud = true;

    var questsMaterial = ResourceManager.get("hud-quests");
    this.regular = new THREE.Sprite(new THREE.SpriteMaterial({ map: questsMaterial, transparent: true }));
    this.regular.scale.set(questsMaterial.frame.w * config.HUD_SCALE, questsMaterial.frame.h * config.HUD_SCALE, 1);
    this.add(this.regular);

    var newQuestMaterial = ResourceManager.get("hud-quests-new");
    this.hasNew = new THREE.Sprite(new THREE.SpriteMaterial({ map: newQuestMaterial, transparent: true }));
    this.hasNew.scale.set(newQuestMaterial.frame.w * config.HUD_SCALE, newQuestMaterial.frame.h * config.HUD_SCALE, 1);

    this.width = newQuestMaterial.frame.w * config.HUD_SCALE;
    this.height = newQuestMaterial.frame.h * config.HUD_SCALE;

    this.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.addEventListener('mouseout', this.onMouseOut.bind(this));
    this.addEventListener('click', this.onClick.bind(this));
  }

  onClick () {
    this.parent.openQuests();
  }

  onUpdate() {
  }

  onMouseOver () {
    Hint.show(`Quests`, this);

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1.1, y: 1.1 }, 200, Tweener.ease.quadOut)
  }

  onMouseOut () {
    Hint.hide();

    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: 1, y: 1 }, 200, Tweener.ease.quadOut)
  }

}
