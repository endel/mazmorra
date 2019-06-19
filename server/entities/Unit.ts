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
import { WeaponItem } from "./items/equipable/WeaponItem";

export type Attribute = 'strength' | 'agility' | 'intelligence';
export type InventoryType = 'inventory' | 'quickInventory';

export type StatsModifiers = {
  // temporary
  hp?: number;
  mp?: number;
  xp?: number;

  // permanent
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  damage: number;
  movementSpeed: number;
  attackDistance: number;
  attackSpeed: number;
  evasion: number;
  criticalStrikeChance: number;
}

export type UnitDirection = 'bottom' | 'left' | 'top' | 'right';

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

  @type("string") direction: UnitDirection;

  @type(Bar) hp = new Bar("hp", 50);
  @type(Bar) mp = new Bar("mp", 0);
  @type(Bar) xp = new Bar("xp", 0, 10);

  @type("number") lvl: number;
  @type("string") primaryAttribute: Attribute;
  @type(UnitAttributes) attributes = new UnitAttributes();
  pointsToDistribute: number;

  @type("number") criticalBonus = 1.5; // damage * criticalBonus (on critical)

  // 0~1
  evasion: number = 0.001;
  criticalStrikeChance: number = 0.1;
  movementSpeed: number = 1000;

  lastHpRegenerationTime: number = 0;
  hpRegeneration: number = 0
  hpRegenerationInterval: number = 30000; // 30 seconds

  position: Movement;// override type

  // list of stats modifiers
  statsModifiers: StatsModifiers = {
    hp: 0,
    mp: 0,

    strength: 0,
    agility: 0,
    intelligence: 0,

    armor: 0,
    damage: 0,

    movementSpeed: 0,
    attackDistance: 0,
    attackSpeed: 0,

    evasion: 0,
    criticalStrikeChance: 0,
  };

  constructor(id?: string, hero: Partial<DBHero> = {}, state?) {
    super(id)

    this.state = state;
    this.action = null;

    this.quickInventory.set(hero.quickInventory || []);
    this.inventory.set(hero.inventory || []);

    this.equipedItems.set(hero.equipedItems || []);
    this.equipedItems.events.on('change', () => this.onEquipedItemsChange());

    this.lvl = hero.lvl || 1;

    this.primaryAttribute = hero.primaryAttribute || "strength";
    this.attributes.strength = hero.strength || 1;
    this.attributes.agility = hero.agility || 1;
    this.attributes.intelligence = hero.intelligence || 1;

    this.recalculateStatsModifiers();

    // hit | mana | experience points
    this.hp.current = hero.hp;
    this.mp.current = hero.mp;
    this.xp.set(hero.xp || 0, this.xpMax); // TOOD: max xp must be a formula against `lvl`

    // prevent hero from starting the game dead
    // when he dies and returns to lobby
    if (!this.isAlive) {
      this.hp.current = this.hp.max;
      this.mp.current = this.mp.max;

      hero.hp = this.hp.current;
    }

    const directions: UnitDirection[] = ['bottom', 'left', 'top', 'right'];
    this.direction = directions[ Math.floor(Math.random() * directions.length) ];

    this.position = new Movement(this);// FIXME:
    this.position.events.on('move', this.onMove.bind(this));

    this.xp.events.on("lvl-up", this.onLevelUp.bind(this));
  }

  recalculateStatsModifiers() {
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

    const hpPercent = this.hp.current / this.hp.max;
    this.hp.max = (this.attributes.strength + this.statsModifiers['strength'] + this.statsModifiers['hp']) * 5;
    this.hp.current = this.hp.max * hpPercent;

    const mpPercent = this.mp.current / this.mp.max;
    this.mp.max = (this.attributes.intelligence + this.statsModifiers['intelligence'] + this.statsModifiers['mp']) * 3;
    this.mp.current = this.mp.max * mpPercent;
  }

  onEquipedItemsChange(): void {
    this.recalculateStatsModifiers();
  }

  getWeapon(): WeaponItem {
    return this.equipedItems.slots['left'];
  }

  getMovementSpeed() {
    // Max attack speed modifier: 32 (5 attacks per second)
    // (10 * 25) = 200

    return (
      this.movementSpeed
      - (this.statsModifiers.movementSpeed * 20)
      - (this.attributes.agility * 20)
    );
  }

  getAttackSpeed() {
    // Max attack speed modifier: 32 (5 attacks per second)
    // (32 * 25) = 640

    return (
      1000
      - (this.statsModifiers.attackSpeed * 20)
      - (this.attributes.agility * 10)
    );
  }

  getAttackDistance() {
    return 1 + this.statsModifiers.attackDistance;
  }

  getDamage() {
    const weapon = this.getWeapon();
    const damageAttribute = (weapon && weapon.damageAttribute || this.primaryAttribute);

    const minDamage = this.attributes[damageAttribute] + this.statsModifiers[damageAttribute];
    const maxDamage = minDamage + this.statsModifiers.damage;

    return this.state.rand.intBetween(minDamage, maxDamage);
  }

  getArmor() {
    const baseArmor: {[id in Attribute]: number} = {
      strength: 0,
      agility: -1,
      intelligence: -2
    };
    return this.statsModifiers.armor + (this.attributes.agility * 0.16) + baseArmor[this.primaryAttribute];
  }

  onMove(moveEvent: MoveEvent, prevX, prevY, currentX, currentY) {

    // check if target position has been changed
    if (this.position.target) {
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
    if (!this.isAlive) {
      return;
    }

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
      this.action = null;

    } else if (!this.isBattlingAgainst(defender)) {
      this.action = new BattleAction(this, defender)
    }
  }

  isBattlingAgainst (unit) {
    return this.action && (this.action instanceof BattleAction && this.action.defender === unit)
  }

  // takeDamage (battleAction: BattleAction) {
  //   var damageTaken = battleAction.damage

  //   // TODO: consider attributes to reduce damage
  //   this.hp.current -= damageTaken

  //   return damageTaken
  // }

  onDie () {
    this.walkable = true;
    this.drop();
  }

  onKill (unit: Unit) {
    // clear pending movement
    this.position.pending = [];

    // compute experience this unit received by killing another one
    // var xp =  unit.lvl / (this.lvl / 2)
    this.xp.increment(unit.lvl / (this.lvl / 4));
  }

  updateDirection(x: number, y: number) {
    if (this.position.y > y && this.position.x < x) { // diagonal
      this.direction = 'left';

    } else if (this.position.y < y && this.position.x > x) { // diagonal
      this.direction = 'right';

    } else if (this.position.x < x) {
      this.direction = 'bottom';

    } else if (this.position.x > x) {
      this.direction = 'top';

    } else if (this.position.y > y) {
      this.direction = 'left';

    } else if (this.position.y < y) {
      this.direction = 'right';
    }
  }

  get xpMax () {
    return this.lvl * 50;
  }

  onLevelUp () {
    this.lvl++;

    this.pointsToDistribute += 2;

    this.hp.current = this.hp.max;
    this.mp.current = this.mp.max;
    this.xp.current = 0;
    this.xp.max = this.xpMax;
  }


}
