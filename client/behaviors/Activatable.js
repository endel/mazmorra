import { Behaviour } from 'behaviour.js'
import { activatableSound } from "../core/sound";

export default class Activatable extends Behaviour {

  onAttach () {
    this.on('mouseover', this.onMouseOver.bind(this))
    this.on('active', this.onActiveChange.bind(this));
  }

  onMouseOver () {
    if (this.isActive) {
      App.cursor.dispatchEvent({ type: 'cursor', kind: 'activate' })
    }
  }

  onActiveChange (value) {
    var canPlaySound = value;

    if (this.object.userData.type === "fountain" ) {
      canPlaySound = (value === false);
    }
    console.log('onActiveChange, canPlaySound:', canPlaySound);

    var sound = activatableSound[this.object.userData.type];
    if (sound && canPlaySound) { sound.play(); }
  }

  update () {
    this.object.activeSprite.visible = this.isActive
    this.object.inactiveSprite.visible = !this.isActive
  }

  get isActive () {
    return this.object.userData.active
  }

}


