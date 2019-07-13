import { Unit } from "../Unit";

export abstract class Skill {
  abstract name: string;
  abstract manaCost: number;
  abstract duration: number;

  activationTime: number;

  activate(unit: Unit) {
    this.activationTime = Date.now();
  }

  update(unit, currentTime) {
    const isActive = (this.activationTime + this.duration >= currentTime);

    // return is skill is still active or not
    return isActive;
  }

  deactivate(unit: Unit) {
  }
}
