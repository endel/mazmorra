import { Skill } from "./Skill";
import { Unit } from "../Unit";

export class AttackSpeedSkill extends Skill {
  name: string = "attack-speed";
  manaCost: number = 15;
  duration: number = 3000;

  increasedValue: number;

  activate(unit: Unit) {
    super.activate(unit);

    this.increasedValue = Math.min(Math.ceil(unit.attributes.agility * 0.75), 20);
    unit.statsBoostModifiers.attackSpeed += this.increasedValue;
  }

  deactivate(unit: Unit) {
    super.deactivate(unit);

    unit.statsBoostModifiers.attackSpeed -= this.increasedValue;
  }
}
