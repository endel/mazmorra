'use strict';

import Highlight from './effects/Highlight'
import Pickable from '../behaviors/Pickable'
import Stretchable from '../behaviors/Stretchable'
import NearPlayerOpacity from '../behaviors/NearPlayerOpacity'
import { humanize } from '../utils';
import { i18n } from '../lang';

export default class Item extends THREE.Object3D {

  constructor (data) {
    super()

    this.userData = data

    this.sprite = ResourceManager.getSprite( "items-" + data.type )
    this.sprite.position.y = 0.5
    this.add(this.sprite)

    //
    // TODO: add "rarity" to rare items.
    //
    if (data.isRare || data.isMagical) {
      this.highlight = new Highlight(data.isMagical ? 'magical' : 'rare');
      this.highlight.position.y = 0.8;
      this.highlight.addBehaviour(new Stretchable);
      this.add(this.highlight)

      // var light = new THREE.SpotLight(0xffffff, 0.5, 50);
      // light.penumbra = 1
      // light.addBehaviour(new LightOscillator, 0.5, 0.6, 0.05)
      // light.position.set(0, 4, 0)
      // light.target = this.item
      // this.add(light)

    } else {
      this.addBehaviour(new NearPlayerOpacity)
    }

    this.sprite.addBehaviour(new Pickable)

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.getEntity().on('destroy', () => {
      this.sprite.getEntity().destroy();
      this.remove(this.sprite);
    })

    this.getEntity().on('mouseover', this.onMouseOver);
    this.getEntity().on('mouseout', this.onMouseOut);
  }

  get label () {
    return humanize(i18n(this.userData.type));
  }

  onMouseOver (tileSelection) {
    tileSelection.setColor(config.COLOR_GREEN)
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }


}
