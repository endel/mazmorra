import { Behaviour } from 'behaviour.js'
import helpers from '../../../shared/helpers'

export default class BattleBehaviour extends Behaviour {

  onAttach (generator) {
    this.togglePosition = false

    this.isAttacking = false
    this.attackingPoint = { x: 0, z: 0 }
    this.attackingInterval = null
    this.defender = null

    this.generator = generator

    this.on('attack', this.onAttack.bind(this))
    this.on('action-requested', this.disable.bind(this))

    this.on('died', this.onDied.bind(this))
  }

  disable () {
    this.isAttacking = false
    this.togglePosition = false
    if (this.attackingInterval) {
      this.attackingInterval.clear()
      this.attackingInterval = null
    }
  }

  onAttack (data) {
    if (!this.isAttacking) {
      this.defender = this.generator.level.getEntityAt(data.position)

      this.attackingPoint = this.generator.fixTilePosition(this.object.position.clone(), data.position.y, data.position.x)
      this.onAttackStart(this.attackingPoint)
    }

    // show damage / miss / critical
    let text = `-${ data.damage }`
      , kind = 'attention'

    if (data.missed) {
      kind = 'warn'
      text = 'miss'
    }

    // create label entity
    this.generator.createEntity({
      type: helpers.ENTITIES.TEXT_EVENT,
      text: text,
      kind: kind,
      special: data.critical,
      position: data.position
    })
  }

  onAttackStart (attackingPoint) {
    if (this.isAttacking) return false;

    this.isAttacking = true
    this.togglePosition = true
    this.attackingPoint = attackingPoint

    var interval = this.object.userData.attackSpeed / 2
    this.attackingInterval = clock.setInterval(this.onAnimationLoop.bind(this), interval)
  }

  onAnimationLoop () {
    if (this.defender.userData.hpCurrent > 0) {
      this.togglePosition = !this.togglePosition
    } else {
      this.disable()
    }
  }

  onDied () {
    var initY = this.object.position.y
    tweener.add(this.object.position).
      to({ y: this.object.position.y + 1 }, 300, Tweener.ease.cubicOut).
      add(this.object.sprite.material).
      to({ rotation: Math.PI }, 150, Tweener.ease.cubicInOut).
      add(this.object.position).
      to({ y: initY }, 300, Tweener.ease.cubicOut).
      then(this.detach.bind(this))
  }

  onDetach () {
    this.disable()
  }

}

