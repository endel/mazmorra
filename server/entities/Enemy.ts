import helpers from "../../shared/helpers";

  // Entities
import { Unit, StatsModifiers } from "./Unit";
import { Player } from "./Player";
import { type } from "@colyseus/schema";
import { DBHero } from "../db/Hero";
import { WeaponItem } from "./items/equipable/WeaponItem";
import { ItemModifier } from "./Item";

export class Enemy extends Unit {
  @type("string") kind: string;

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(undefined, data);
    this.type = helpers.ENTITIES.ENEMY

    this.kind = kind;
    this.lvl = data.lvl || 1;

    // apply stats modifiers
    if (Object.keys(modifiers).length > 0) {
      // equip dummy item to allow stats calculation.
      const item = new WeaponItem();
      for (const statName in modifiers) {
        const modifier = new ItemModifier();
        modifier.attr = statName;
        modifier.modifier = modifiers[statName];
        item.modifiers.push(modifier);
      }
      this.equipedItems.add(item);

      this.recalculateStatsModifiers();
    }
  }

  update (currentTime) {
    super.update(currentTime)

    // TODO: better close-to-player unit detection.
    const closePlayer = this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x, Player)
          || this.state.gridUtils.getEntityAt(this.position.y, this.position.x + 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y, this.position.x - 1, Player)

          // diagonal
          || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x - 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y - 1, this.position.x + 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x - 1, Player)
          || this.state.gridUtils.getEntityAt(this.position.y + 1, this.position.x + 1, Player)

    if (closePlayer && !this.isBattlingAgainst(closePlayer)) {
      this.state.move(this, { x: closePlayer.position.y, y: closePlayer.position.x })
    }
  }

}
