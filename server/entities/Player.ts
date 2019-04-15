import { Unit } from "./Unit";
import helpers from "../../shared/helpers";

export class Player extends Unit {

  constructor (id, hero) {
    super(id, hero)
    this.type = helpers.ENTITIES.PLAYER

    this.name = hero.name
    this.lvl = hero.lvl || 1

    this.properties = {
      klass: hero.klass,
      hair: hero.hair,
      hairColor: hero.hairColor,
      eye: hero.eye,
      body: hero.body
    }

    // hit | mana | experience points
    this.hp.set(hero.hp || 100, 100)
    this.mp.set(hero.mp || 100, 100)
    this.xp.set(hero.xp || 0, 10)

    this.gold = hero.gold || 0
    this.diamond = hero.diamond || 0

    // TODO: calculate this based on
    // player klass + lvl
    this.attributes = {
      strenght: 1,
      dexterity: 1,
      intelligence: 1,
      vitality: 1
    }

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
