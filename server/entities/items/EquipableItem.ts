import { Item } from "../Item";

export abstract class EquipableItem extends Item {

  isHead() {
    return false;
  }

  isBody() {
    return !!this.slots['body'];
  }

  isLeft() {
    return !!this.slots['left'];
  }

  isRight() {
    return !!this.slots['right'];
  }

  isBoot() {
    return !!this.slots['boot'];
  }


}
