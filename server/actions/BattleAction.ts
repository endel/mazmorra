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
  @type("string") defenderId: string;
  @type("number") attackDistance: number;

  attacker: Unit;
  defender: Unit;

  events = new EventEmitter();

  constructor(attacker: Unit, defender: Unit) {
    super();

    this.attacker = attacker;
    this.defender = defender;
    this.defenderId = defender.id;

    this.attackDistance = this.attacker.getAttackDistance();
  }

  get isEligible() {
    let _distance = distance(this.attacker.position, this.defender.position);

    // allow to attack in diagonal
    if (
      Math.abs(this.attacker.position.x - this.defender.position.x) >= 1 &&
      Math.abs(this.attacker.position.y - this.defender.position.y) >= 1
    ) {
      _distance--;
    }

    return this.defender.isAlive && (_distance <= this.attackDistance);
  }

  attack() {
    if (!this.isEligible) {
      // clear BattleAction
      this.attacker.action = null;
      this.events.removeAllListeners();
    }

    const percent = Math.random();

    this.missed = (percent <= this.defender.evasion);
    this.critical = (percent >= 1 - this.defender.criticalStrikeChance);

    // force to update unit's direction towards defender
    this.attacker.updateDirection(this.defender.position.x, this.defender.position.y);

    if (!this.missed) {
      let damage = this.attacker.getDamage();

      // reduce armor from damage
      damage -= this.defender.getArmor();

      // prevent negative damage
      if (damage < 0) { damage = 0; }

      if (this.critical) {
        damage *= this.attacker.criticalBonus;
      }

      this.damage = Math.floor(damage);

      // Defender take the damage
      this.defender.hp.current -= this.damage;
      // this.defender.takeDamage(this)

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
    const nextAttackAllowed = timeDiff > this.attacker.getAttackSpeed();

    const active = this.isEligible && nextAttackAllowed;

    if (nextAttackAllowed) {
      // attacks = Math.floor(timeDiff / this.attacker.getAttackSpeed())
      // while (attacks--) {
      // this.attack()
      // }

      this.active = active;

      if (this.active) {
        let attacks = 0, pos = null

        this.attack()

        // update attack position
        this.position.set(this.defender.position);
      }

      this.lastUpdateTime = currentTime;
    }

  }

}
