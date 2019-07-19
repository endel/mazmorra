import { Behaviour } from 'behaviour.js'
import helpers from '../../shared/helpers'

import { getClientId } from '../core/network';
import { battleStartSound, wooshSound, hitSound, playRandom, deathSound, deathStingerSound, bowSound, staffSound, fadeOut, playRandom3D, playSound3D } from '../core/sound';

export const DEAD_ENTITY_OPACITY = 0.45;

export default class BattleBehaviour extends Behaviour {

  onAttach ( factory ) {

    this.factory = factory

    this.togglePosition = false
    this.togglePositionTimeout = { active: false }

    this.isAttacking = false
    this.attackingPoint = { x: 0, z: 0 }
    this.defender = null
    this.attackDistance = 1;

    if (this.object.sprite) {
      this.originalColor = this.object.sprite.material.color.getHex()
    }

    this.on('attack', this.onAttack.bind(this))
    this.on('damage', this.onTakeDamage.bind(this))
    this.on('died', this.onDied.bind(this))
  }

  disable () {
    this.isAttacking = false
    this.togglePosition = false
  }

  getDamageAttribute() {
    return (
      this.object.userData.equipedItems.slots.left &&
      this.object.userData.equipedItems.slots.left.damageAttribute ||
      this.object.userData.primaryAttribute
    );
  }

  onAttack (actionData) {
    if (!actionData.type) { return this.disable(); }

    this.damageAttribute = this.getDamageAttribute();

    this.togglePosition = true
    this.togglePositionTimeout = App.clock.setTimeout(() => { this.togglePosition = false }, 100);

    this.defender = this.factory.level.entities[actionData.defenderId];

    // FIXME: defender might be null.
    // this is a workaround!
    if (!this.defender) {
      return;
    }

    this.attackingPoint = this.defender.position.clone();
    this.attackDistance = actionData.attackDistance;

    // this.attackingPoint = { x: 0, z: 0 };
    // this.factory.fixTilePosition(this.attackingPoint, actionData.position.y, actionData.position.x)

    if (!this.isAttacking) {
      this.isAttacking = true
      this.togglePosition = true

      // play battle start sound
      if (this.object.userData.type !== helpers.ENTITIES.PLAYER) {
        let enemyKindSound = battleStartSound[this.object.userData.kind] || battleStartSound.default;
        playSound3D(enemyKindSound, this.object);
      }
    }

    let soundToPlay;

    // create projectile
    if (this.attackDistance > 1) {
      const projectileType = (this.damageAttribute === "intelligence")
        ? helpers.ENTITIES.PROJECTILE_MAGIC
        : helpers.ENTITIES.PROJECTILE_ARROW_1;

      this.factory.createEntity({
        type: projectileType,
        position: this.object.userData.position,
        source: this.object,
        target: this.defender
      });

      soundToPlay = (this.damageAttribute === "intelligence")
        ? staffSound
        : bowSound;

    } else {
      soundToPlay = wooshSound;
    }

    playRandom3D(soundToPlay, this.object);

    // show damage / miss / critical
    let text = `-${ actionData.damage }`
      , kind = 'attention'

    if (actionData.missed) {
      kind = 'warn'
      text = 'Evaded'

    } else if (this.defender) {
      this.defender.getEntity().emit('damage', this.damageAttribute);
    }

    // create label entity
    this.factory.createEntity({
      type: helpers.ENTITIES.TEXT_EVENT,
      text: text,
      kind: kind,
      ttl: 100,
      special: actionData.critical,
      position: actionData.position
    })
  }

  onTakeDamage (damageAttribute) {
    if (this.object.sprite && (!this.lastTimeout || !this.lastTimeout.active)) {
      // play damage taken sound!
      playRandom(hitSound)

      // red blink on enemies
      this.object.sprite.material.color.setHex(config.COLOR_RED.getHex())

      if (this.lastTimeout) { this.lastTimeout.clear(); }
      this.lastTimeout = App.clock.setTimeout(() => {
        this.object.sprite.material.color.setHex(this.originalColor);
      }, 50)
    }
  }

  onDied () {
    if (this.object.userData.type === helpers.ENTITIES.PLAYER) {
      playRandom(deathSound);
    }

    if (this.object.userData.id === getClientId()) {
      fadeOut(); // fade soundtrack out
      deathStingerSound.play();
    }

    var initY = this.object.position.y
    App.tweens.add(this.object.position).
      to({ y: this.object.position.y + 1 }, 300, Tweener.ease.cubicOut).
      then(() => {
        App.tweens.add(this.object.sprite.center).
          to({ y: 1 }, 150, Tweener.ease.cubicOut);

        App.tweens.add(this.object.sprite.material).
          to({ rotation: Math.PI }, 150, Tweener.ease.cubicInOut).
          add(this.object.position).
          to({ y: initY }, 300, Tweener.ease.bounceOut).
          add(this.object.sprite.material).
          to({ opacity: DEAD_ENTITY_OPACITY }, 100, Tweener.ease.cubicInOut).
          then(this.detach.bind(this));

      })
  }

  onDetach () {
    this.disable()
  }

}
