import { type, Schema } from "@colyseus/schema";

import { Entity } from "./Entity";
import { Bar } from "../core/Bar";
import { Movement, MoveEvent } from "../core/Movement";
import { Inventory } from "../core/Inventory";
import { EquipedItems } from "../core/EquipedItems";

// Actions
import { BattleAction } from "../actions/BattleAction";
import { DBHero } from "../db/Hero";
import { Item } from "./Item";

export const BASE_WALKING_SPEED = 400;

export type Attribute = 'strength' | 'agility' | 'intelligence';
export type InventoryType = 'inventory' | 'quickInventory';

export type StatsModifiers = {
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  damage: number;
  walkSpeed: number;
  attackDistance: number;
  attackSpeed: number;
  evasion: number;
  criticalStrikeChance: number;
}

export class UnitAttributes extends Schema {
  @type("number") strength;
  @type("number") agility;
  @type("number") intelligence;
}

export class Unit extends Entity {
  // Items / Inventory
  @type(Inventory) inventory = new Inventory({ capacity: 12 });
  @type(EquipedItems) equipedItems = new EquipedItems();
  @type(Inventory) quickInventory = new Inventory({ capacity: 6 });
  @type(BattleAction) action: BattleAction;

  @type("string") direction = "bottom";

  @type(Bar) hp = new Bar(50);
  @type(Bar) mp = new Bar(0);
  @type(Bar) xp = new Bar(0, 10);

  @type(UnitAttributes) attributes = new UnitAttributes();
  @type("string") primaryAttribute: Attribute;
  @type("number") lvl = 1;

  @type("number") armor = 0;

  @type("number") criticalBonus = 1.5; // damage * criticalBonus (on critical)
  @type("number") walkSpeed = 1;

  // attack attributes
  @type("number") attackDistance = 1;
  @type("number") attackSpeed = 1500;

  // 0~1
  evasion: number = 0.001;
  criticalStrikeChance: number = 0.1;

  lastHpRegenerationTime: number = 0;
  hpRegeneration: number = 0
  hpRegenerationInterval: number = 30000; // 30 seconds

  position: Movement;// override type

  // list of stats modifiers
  statsModifiers: StatsModifiers = {
    strength: 0,
    agility: 0,
    intelligence: 0,

    armor: 0,
    damage: 0,

    walkSpeed: 0,
    attackDistance: 0,
    attackSpeed: 0,

    evasion: 0,
    criticalStrikeChance: 0,
  };

  constructor(id?: string, hero: Partial<DBHero> = {}) {
    super(id)

    this.action = null;

    this.quickInventory.set(hero.quickInventory || []);
    this.inventory.set(hero.inventory || []);

    this.equipedItems.set(hero.equipedItems || []);
    this.equipedItems.events.on('change', () => this.onEquipedItemsChange());

    this.primaryAttribute = hero.primaryAttribute || "strength";
    this.attributes.strength = hero.strength || 1;
    this.attributes.agility = hero.agility || 1;
    this.attributes.intelligence = hero.intelligence || 1;

    this.recalculateStatsModifiers();

    // hit | mana | experience points
    this.hp.current = hero.hp || 100;
    this.mp.current = hero.mp || 0;
    this.xp.set(hero.xp || 0, 100); // TOOD: max xp must be a formula against `lvl`

    this.position = new Movement(this);// FIXME:
    this.position.events.on('move', this.onMove.bind(this));
  }

  recalculateStatsModifiers() {
    console.log("will recalculate stats modifiers...");
    // re-set all stats modifiers
    for (const attr in this.statsModifiers) {
      this.statsModifiers[attr] = 0;
    }

    // cache all equiped items modifiers
    for (const slotName in this.equipedItems.slots) {
      const item: Item = this.equipedItems.slots[slotName];
      if (item) {
        item.modifiers.forEach(modifier => {
          this.statsModifiers[modifier.attr] += modifier.modifier
        });
      }
    }

    this.hp.max = (this.attributes.strength + this.statsModifiers['strength']) * 4;
    this.mp.max = (this.attributes.intelligence + this.statsModifiers['intelligence']) * 2;

    console.log("stats modifiers recalculated!");
  }

  onEquipedItemsChange(): void {
    this.recalculateStatsModifiers();
  }

  getWalkSpeed() {
    return this.walkSpeed * BASE_WALKING_SPEED;
  }

  getDamage() {
    const minDamage = this.attributes[this.primaryAttribute] + this.statsModifiers[this.primaryAttribute];
    const maxDamage = minDamage + this.statsModifiers['damage'];
    return Math.floor(Math.random() * (maxDamage - minDamage + 1) + minDamage);
  }

  getArmor() {
    const baseArmor: {[id in Attribute]: number} = {
      'strength': 0,
      'agility': -1,
      'intelligence': -2,
    }
    return this.armor + this.attributes.strength + baseArmor[this.primaryAttribute];
  }

  onMove(moveEvent: MoveEvent, prevX, prevY, currentX, currentY) {

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

    // upgrade attributes
    this.attributes.strength++;
    this.attributes.agility++;
    this.attributes.intelligence++;

    this.hp.current = this.hp.max
    this.mp.current = this.mp.max
    this.xp.current = 0
  }


}
