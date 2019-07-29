// Enemy and and NPC share a lot

import DangerousThing from '../behaviors/DangerousThing'
import HasLifebar from '../behaviors/HasLifebar';
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'
import { playSound3D, mimicSound } from '../core/sound';
import { humanize, removeLight, getLightFromPool } from '../utils';
import { i18n } from '../lang';

export default class Enemy extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data
    this._direction = 'bottom'

    this.textures = {
      top: ResourceManager.get( 'enemies-' + this.userData.kind + '-top' ),
      bottom: ResourceManager.get( 'enemies-' + this.userData.kind + '-bottom' ),
      left: ResourceManager.get( 'enemies-' + this.userData.kind + '-left' ),
      right: ResourceManager.get( 'enemies-' + this.userData.kind + '-right' )
    }

    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.textures[ this._direction ],
      // fog: true
    }))
    this.originalColor = this.sprite.material.color.getHex()

    this.sprite.scale.normalizeWithTexture(this.sprite.material.map)
    this.sprite.center.set(0.5, 0);
    this.sprite.position.y = -0.5;

    this.add(this.sprite);

    // only attach lifebar if enemy is alive
    if (data.hp.current > 0) {

      // towers do not move as "dangerous thing"
      if (data.kind.indexOf("tower") === -1) {
        this.addBehaviour(new DangerousThing);

      } else {
        // Light on tower
        this.light = getLightFromPool();
        this.light.intensity = 1;
        this.light.distance = 15;
        this.light.color = new THREE.Color(0xfcf458);
        this.light.position.set(0, 2, 0);
        this.add(this.light);
      }

      // this.addBehaviour(new Shadow);
      this.addBehaviour(new HasLifebar);

      // mimic has different animation to enter
      if (data.kind === "mimic") {
        playSound3D(mimicSound, this);

        this.scale.set(0.65, 0.65, 0.65);
        App.tweens.add(this.scale).
          to({
            x: 1,
            y: 1,
            z: 1
          }, 500, Tweener.ease.elasticOut);

      } else {
        this.sprite.material.opacity = 0;
        this.sprite.position.y = -1.5;
        App.tweens.add(this.sprite.position).to({ y: 0 }, 300, Tweener.ease.quadOut);
        App.tweens.add(this.sprite.material).to({ opacity: 1 }, 300, Tweener.ease.quadOut);
      }

      if (this.userData.isBoss) {
        // Boss Announcement
        this.addEventListener("added", () => {
          this.dispatchEvent({
            bubbles: true,
            type: "announcement",
            id: "boss",
            title: i18n('bossArea'),
            sound: "boss",
            entity: this
          });
        });
      }

    }

    if (!this.userData.isBoss) {
      this.addBehaviour(new NearPlayerOpacity)
    }
  }

  get label () {
    var text = humanize(i18n(this.userData.kind)) + ` - lvl ${ this.userData.lvl }`

    if (this.userData.hp.current <= 0) {
      text = `(${i18n('dead')}) ${ text }`
    }

    return text
  }

  set direction (direction) {
    this._direction = direction

    var texture = this.textures[ this._direction ]
    this.sprite.material.map = texture

    this.sprite.scale.normalizeWithTexture(texture)
  }

  destroy () {
    if (this.light && this.light.parent) {
      removeLight(this.light);
    }
    super.destroy();
  }

}
