import { Schema, type } from "@colyseus/schema";
import { Unit } from "./Unit";
import helpers from "../../shared/helpers";

export class SkinProperties extends Schema {
  @type("number") klass: string;
  @type("number") hair: string;
  @type("number") hairColor: string;
  @type("number") eye: string;
  @type("number") body: string;
}

export class Player extends Unit {
  @type("string") name: string;
  @type(SkinProperties) properties = new SkinProperties();

  @type("number") gold: number;
  @type("number") diamond: number;

  constructor (id, hero) {
    super(id, hero)
    this.type = helpers.ENTITIES.PLAYER

    this.name = hero.name
    this.lvl = hero.lvl || 1

    // skin properties
    this.properties.klass = hero.klass;
    this.properties.hair = hero.hair;
    this.properties.hairColor = hero.hairColor;
    this.properties.eye = hero.eye;
    this.properties.body = hero.body

    // hit | mana | experience points
    this.hp.set(hero.hp || 100, 100)
    this.mp.set(hero.mp || 100, 100)
    this.xp.set(hero.xp || 0, 10)

    this.gold = hero.gold || 0
    this.diamond = hero.diamond || 0

    // TODO: calculate this based on
    // player klass + lvl
    this.attributes.strenght = 1;
    this.attributes.dexterity = 1;
    this.attributes.intelligence = 1;
    this.attributes.vitality = 1

    this.armor = 1
    this.damage = 1

    this.attackDistance = 1

    // this.walkSpeed = 600
    this.walkSpeed = 300
    this.attackSpeed = 1000

    this.hpRegeneration = 1
  }

  onMove (moveEvent, prevX, prevY, currentX, currentY) {
    super.onMove(moveEvent, prevX, prevY, currentX, currentY)

    if (this.position.target) {
      this.state.checkOverlapingEntities(moveEvent, currentX, currentY)
    }
  }
}
