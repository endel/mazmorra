import { Behaviour } from 'behaviour.js'

export default class BattleBehaviour extends Behaviour {

  onAttach () {
    this.togglePosition = false

    this.isAttacking = false
    this.attackingPoint = { x: 0, z: 0 }
    this.attackingInterval = null

    this.on('attack', this.onAttack.bind(this))
    this.on('attack-start', this.onAttackStart.bind(this))
    this.on('action-requested', this.disable.bind(this))
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
    // show damage / miss / critical
  }

  onAttackStart (attackingPoint) {
    if (this.isAttacking) return false;

    this.isAttacking = true
    this.attackingPoint = attackingPoint

    var interval = this.object.userData.attackSpeed / 2
    this.attackingInterval = clock.setInterval(() => {
      this.togglePosition = !this.togglePosition
    }, interval)

  }

  onDestroy () {
    this.disable()
  }

}

