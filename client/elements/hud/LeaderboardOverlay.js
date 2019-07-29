import { SpriteText2D, textAlign, MeshText2D } from 'three-text2d'
import Composition from '../character/Composition';
import { MAX_CHAR_WIDTH, MAX_CHAR_HEIGHT } from '../character/HeroSkinBuilder';
import { i18n } from '../../lang';

export default class LeaderboardOverlay extends THREE.Object3D {

  constructor (data) {
    super()

    this.isOpen = false;

    this.title = ResourceManager.getHUDElement('hud-big-title-red');
    this.title.position.y = this.title.height * 3;
    this.add(this.title);

    this.titleText = new MeshText2D(i18n('hallOfFame'), {
      align: textAlign.center,
      font: config.FONT_TITLE,
      fillStyle: "#ffffff"
    });
    this.titleText.position.y = this.title.position.y + this.title.height - this.titleText.height - 6;
    this.add(this.titleText);

    const HEROS_PER_LINE = 3;
    const HERO_WIDTH = 42 * config.HUD_SCALE;
    const HERO_HEIGHT = 14 * config.HUD_SCALE;

    this.heroes = new THREE.Object3D();
    this.heroes.position.x = (-HERO_WIDTH * HEROS_PER_LINE) / 2.5;
    this.heroes.position.y = this.title.position.y - this.title.height - (config.HUD_MARGIN + config.HUD_SCALE * 3);
    this.add(this.heroes);

    data.forEach((hero, i) => {
      const composition = new Composition(hero.props);
      composition.sprite.scale.set(
        MAX_CHAR_WIDTH * config.HUD_SCALE,
        MAX_CHAR_HEIGHT * config.HUD_SCALE,
        1
      );

      // 10 maxlength on leaderboard
      const fillStyle = (hero.current) ? "#fcf458" : "#ffffff";

      const uppercaseChars = hero.name.match(/([A-Z+])/);
      const maxLength = 14 - ((uppercaseChars && uppercaseChars[1]) || "").length;
      const nameWordWrap = (hero.name.length > maxLength) ? `${hero.name.substr(0, maxLength)}...` : hero.name;

      const name = new MeshText2D(`${hero.position}. ${nameWordWrap}` , {
        align: textAlign.left,
        font: config.SMALL_FONT,
        fillStyle
      });

      const level = new MeshText2D(`${i18n('level')} ${hero.lvl}` , {
        align: textAlign.left,
        font: config.SMALL_FONT,
        fillStyle
      });

      name.position.x = MAX_CHAR_WIDTH * config.HUD_SCALE;
      name.position.y = name.height;
      level.position.x = MAX_CHAR_WIDTH * config.HUD_SCALE;
      // level.position.y = -level.height / 2;

      const heroView = new THREE.Object3D();
      heroView.add(composition);
      heroView.add(name);
      heroView.add(level);
      heroView.position.x = ((i % HEROS_PER_LINE) * HERO_WIDTH);
      heroView.position.y = -(Math.floor(i / HEROS_PER_LINE)) * HERO_HEIGHT;

      this.heroes.add(heroView);
    });

    this.width = this.title.width;
    this.height = this.title.height;
  }

  toggleOpen (cb) {
    this.isOpen = !this.isOpen
    this.visible = true;

    const scaleFrom = ((this.isOpen) ? 0.5 : 1);
    const scaleTo = ((this.isOpen) ? 1 : 0.85);

    this.scale.set(scaleFrom, scaleFrom, scaleFrom);

    if (this.isOpen) {
      this.title.materialopacity = 0;
      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 1 }, 500, Tweener.ease.quintOut);

      for (let i = 0; i < this.heroes.children.length; i++) {
        for (let j = 0; j < this.heroes.children[i].children.length; j++) {
          this.heroes.children[i].children[j].material.opacity = 0;
          App.tweens.add(this.heroes.children[i].children[j].material).
            wait(i * 50).
            to({ opacity: 1 }, 200).
            then(() => {
              if (cb) cb();
            });
        }
      }

    } else {
      for (let i = 0; i < this.heroes.children.length; i++) {
        const composition = this.heroes.children[i].children[0];
        this.heroes.children[i].remove(composition);
        composition.destroy();

        for (let j = 0; j < this.heroes.children[i].children.length; j++) {
          App.tweens.
            add(this.heroes.children[i].children[j].material).
            to({ opacity: 0 }, 200);
        }
      }

      App.tweens.remove(this.title.material);
      App.tweens.add(this.title.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut);

      App.tweens.remove(this.titleText.material);
      App.tweens.add(this.titleText.material).to({ opacity: 0 }, 500, Tweener.ease.quintOut).then(() => {
        // remove from parent!
        if (this.heroes.parent) {
          this.heroes.parent.remove(this.heroes);
        }
        if (cb) cb();
      });

    }

    // scale container
    App.tweens.remove(this.scale)
    App.tweens.add(this.scale).to({ x: scaleTo, y: scaleTo, z: scaleTo }, 500, Tweener.ease.quintOut).then(() => {
      if (!this.isOpen) this.visible = false;
    });
  }

}
