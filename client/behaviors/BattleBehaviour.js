import { Behaviour } from 'behaviour.js'
import helpers from '../../shared/helpers'

export default class BattleBehaviour extends Behaviour {

  onAttach ( factory ) {

    this.factory = factory

    this.togglePosition = false
    this.togglePositionTimeout = { active: false }

    this.isAttacking = false
    this.attackingPoint = { x: 0, z: 0 }
    this.defender = null

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

  onAttack (data) {
    if (!data.type) { return this.disable(); }

    // // TODO: this shouldn't be necessary
    // // GameObject's patch method is triggering 'attack' event multiple times
    // if (this.togglePositionTimeout.active) { return; }

    this.togglePosition = true
    this.togglePositionTimeout = App.clock.setTimeout(() => { this.togglePosition = false }, 100)

    if (!this.isAttacking) {
      this.defender = this.factory.level.getEntityAt(data.position)

      this.attackingPoint = this.factory.fixTilePosition(this.object.position.clone(), data.position.y, data.position.x)
      this.onAttackStart(this.attackingPoint)
    }

    // show damage / miss / critical
    let text = `-${ data.damage }`
      , kind = 'attention'

    if (data.missed) {
      kind = 'warn'
      text = 'miss'

    } else if (this.defender) {
      this.defender.getEntity().emit('damage')
    }

    // create label entity
    this.factory.createEntity({
      type: helpers.ENTITIES.TEXT_EVENT,
      text: text,
      kind: kind,
      ttl: 100,
      special: data.critical,
      position: data.position
    })
  }

  onAttackStart (attackingPoint) {
    if (this.isAttacking) return false;

    this.isAttacking = true
    this.togglePosition = true
    this.attackingPoint = attackingPoint
  }

  onTakeDamage () {
    if (this.object.sprite && (!this.lastTimeout || !this.lastTimeout.active)) {
      // red blink on enemies
      this.object.sprite.material.color.setHex(config.COLOR_RED.getHex())
      if (this.lastTimeout) this.lastTimeout.clear()

      this.lastTimeout = App.clock.setTimeout(() => {
        this.object.sprite.material.color.setHex(this.originalColor)
      }, 50)
    }
  }

  onDied () {
    var initY = this.object.position.y
    App.tweens.add(this.object.position).
      to({ y: this.object.position.y + 1 }, 300, Tweener.ease.cubicOut).
      add(this.object.sprite.material).
      to({ rotation: Math.PI }, 150, Tweener.ease.cubicInOut).
      add(this.object.position).
      to({ y: initY }, 300, Tweener.ease.bounceOut).
      then(this.detach.bind(this))
  }

  onDetach () {
    this.disable()
  }

}
