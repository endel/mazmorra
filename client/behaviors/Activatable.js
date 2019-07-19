import { Behaviour } from 'behaviour.js'
import { activatableSound, playSound3D } from "../core/sound";

export default class Activatable extends Behaviour {

  onAttach () {
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.on('active', this.onActiveChange.bind(this));

    this.on('mouseover', this.onMouseOver);
    this.on('mouseout', this.onMouseOut);
  }

  onMouseOver (tileSelection) {
    if (this.isActive) {
      tileSelection.setColor(config.COLOR_GREEN)
      App.cursor.dispatchEvent({ type: 'cursor', kind: 'activate' })
    }
  }

  onMouseOut (tileSelection) {
    tileSelection.setColor()
  }

  onActiveChange (value) {
    var canPlaySound = value;

    if (this.object.userData.type === "fountain" ) {
      canPlaySound = (value === false);
    }

    var sound = activatableSound[this.object.userData.type];
    if (sound && canPlaySound) {
      playSound3D(sound, this.object);
    }
  }

  update () {
    this.object.activeSprite.visible = this.isActive
    this.object.inactiveSprite.visible = !this.isActive
  }

  get isActive () {
    return this.object.userData.active
  }

}


