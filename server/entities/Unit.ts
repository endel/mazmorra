import { type, Schema } from "@colyseus/schema";

import { Entity } from "./Entity";
import { Bar } from "../core/Bar";
import { Movement } from "../core/Movement";
import { Inventory } from "../core/Inventory";
import { EquipedItems } from "../core/EquipedItems";

// Actions
import { BattleAction } from "../actions/BattleAction";

type Attribute = 'strenght' | 'dexterity' | 'intelligence' | 'vitality';

export class UnitAttributes extends Schema {
  @type("number") strenght = 1;
  @type("number") dexterity = 1;
  @type("number") intelligence = 1;
  @type("number") vitality = 1;
}

export class Unit extends Entity {
  // Items / Inventory
  @type(Inventory) inventory = new Inventory({}, [{ type: 'shield-wood' }]);
  @type(EquipedItems) equipedItems = new EquipedItems();
  @type(Inventory) quickInventory = new Inventory({ capacity: 3 });

  @type(Movement) position = new Movement(this);
  @type("string") direction = "bottom";

  @type(Bar) hp = new Bar(50);
  @type(Bar) mp = new Bar(0);
  @type(Bar) xp = new Bar(0, 10);
  @type(UnitAttributes) attributes = new UnitAttributes();
  @type("number") lvl = 1;

  @type("number") armor = 1;
  @type("number") damage = 1;

  @type("string") damageAttribute: Attribute = "strenght";
  @type("number") criticalBonus = 1.5; // damage * criticalBonus (on critical)

  @type("number") walkSpeed = 1000;

  // attack attributes
  @type("number") attackDistance = 1;
  @type("number") attackSpeed = 2000;

  lastHpRegenerationTime: number = 0;
  hpRegeneration: number = 0
  hpRegenerationInterval: number = 3000

  constructor(id, options: any = {}) {
    super(id)

    this.equipedItems.set(options.equipedItems || [])
    this.quickInventory.set(options.quickInventory || [])

    this.action = null

    this.armor = 1
    this.damage = 1
    this.damageAttribute = 'strenght'
    this.criticalBonus = 1.5

    // walking attributes
    this.walkSpeed = 1000

    this.attackDistance = 1
    this.attackSpeed = 2000

    this.position.on('move', this.onMove.bind(this))
  }

  onMove(moveEvent, prevX, prevY, currentX, currentY) {

    // check if target position has been changed
    if (this.position.target) {

      // // TODO: improve me
      // if (this.position.target instanceof Unit &&
      //     this.position.target.isAlive &&
      //     currentX === this.position.target.position.x &&
      //     currentY === this.position.target.position.y) {
      //   moveEvent.cancel()
      //   return
      // }

      if (
        this.position.destiny && (
          this.position.destiny.x !== this.position.target.position.x ||
          this.position.destiny.y !== this.position.target.position.y
        )
      ) {
        this.position.x = currentX
        this.position.y = currentY
        this.state.move(this, { x: this.position.target.position.x, y: this.position.target.position.y }, false)
      }
    }
  }

  get isAlive() { return this.hp.current > 0 }

  update(currentTime) {
    // a dead unit can't do much, I guess
    if (!this.isAlive) return

    if (currentTime > this.lastHpRegenerationTime + this.hpRegenerationInterval) {
      this.hp.set( this.hp.current + this.hpRegeneration )
      this.lastHpRegenerationTime = currentTime;
    }

    if (this.action && this.action.isEligible)  {
      this.action.update(currentTime)
      this.position.touch(currentTime)

    } else {
      this.position.update(currentTime)
    }
  }

  drop () {
    if (!this.state) return

    this.state.dropItemFrom(this)
  }

  attack (defender) {
    if (defender === null || !defender.isAlive) {
      this.action = null

    } else if (!this.isBattlingAgainst(defender)) {
      this.action = new BattleAction(this, defender)
    }
  }

  isBattlingAgainst (unit) {
    return this.action && (this.action instanceof BattleAction && this.action.defender === unit)
  }

  takeDamage (battleAction) {
    var damageTaken = battleAction.damage

    // TODO: consider attributes to reduce damage
    this.hp.current -= damageTaken

    return damageTaken
  }

  onDie () {}

  onKill (unit) {
    // compute experience this unit received by killing another one
    // var xp =  unit.lvl / (this.lvl / 2)
    var xp =  unit.lvl / (this.lvl / 4)

    // level up!
    if (this.xp.current + xp > this.xp.max) {
      xp = (this.xp.current + xp) - this.xp.max
      this.levelUp()
    }

    // killed unit may drop something
    if (unit.state) {
      unit.drop();
    }

    this.xp.current += xp
  }

  levelUp () {
    this.lvl ++

    for (let attr in this.attributes) {
      this.attributes[ attr ]++
    }

    this.hp.current = this.hp.max
    this.mp.current = this.mp.max
    this.xp.current = 0
  }


}
