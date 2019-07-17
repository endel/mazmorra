import { Skill } from "./Skill";
import { Unit } from "../Unit";

export class MovementSpeedSkill extends Skill {
  name: string = "movement-speed";
  manaCost: number = 10;
  duration: number = 2000;

  increasedValue: number;

  activate(unit: Unit) {
    super.activate(unit);

    // this.increasedValue = Math.floor(unit.attributes.agility * 0.5);
    // unit.statsBoostModifiers.movementSpeed += this.increasedValue;
  }

  deactivate(unit: Unit) {
    super.deactivate(unit);

    // unit.statsBoostModifiers.movementSpeed -= this.increasedValue;
  }
}
