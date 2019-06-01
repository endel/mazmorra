import { Item } from "../Item";

export abstract class EquipableItem extends Item {

  isHead() {
    return false;
  }

  isBody() {
    return false;
  }

  isLeft() {
    return false;
  }

  isRight() {
    return false;
  }

  isBoot() {
    return false;
  }


}
