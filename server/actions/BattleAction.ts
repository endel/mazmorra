import { type } from "@colyseus/schema";
import { EventEmitter } from "events";

import { Action } from "./Action";
import { distance } from "../helpers/Math";
import { Position } from "../core/Position";
import { Unit } from "../entities/Unit";

export class BattleAction extends Action {
  @type("boolean") missed: boolean;
  @type("number") damage: number;
  @type("boolean") critical: boolean;
  @type(Position) position = new Position();

  attacker: Unit;
  defender: Unit;

  events = new EventEmitter();

  constructor(attacker: Unit, defender: Unit) {
    super()

    this.attacker = attacker;
    this.defender = defender;
  }

  get isEligible() {
    return this.defender.isAlive && (distance(this.attacker.position, this.defender.position) <= this.attacker.attackDistance)
  }

  attack() {
    if (!this.isEligible) {
      // clear BattleAction
      this.attacker.action = null;
      this.events.removeAllListeners();
    }

    let d20 = Math.ceil(Math.random() * 20)

    this.missed = (d20 <= this.defender.armor)
    this.critical = (d20 == 20)

    if (!this.missed) {
      this.damage = d20 + this.attacker.damage + this.attacker.attributes[this.attacker.damageAttribute]
      if (this.critical) {
        this.damage *= Math.floor(this.attacker.criticalBonus)
      }

      let damageTaken = this.defender.takeDamage(this)

      if (!this.defender.isAlive) {
        this.defender.onDie()
        this.attacker.onKill(this.defender)

      }
      //
      // TODO: use damageTaken for lifestealing or other modifiers
      //
    }
  }

  update(currentTime) {
    const timeDiff = currentTime - this.lastUpdateTime
    const nextAttackAllowed = timeDiff > this.attacker.attackSpeed;

    const active = this.isEligible && nextAttackAllowed;

    if (nextAttackAllowed) {
      // attacks = Math.floor(timeDiff / this.attacker.attackSpeed)
      // while (attacks--) {
      // this.attack()
      // }

      this.active = active;


      if (this.active) {
        let attacks = 0, pos = null

        this.attack()

        // update attack position
        this.position = this.defender.position.clone();
      }

      this.lastUpdateTime = currentTime;
    }

  }

}
