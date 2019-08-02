import { Enemy } from "./Enemy";
import { DBHero } from "../db/Hero";
import { StatsModifiers, Unit } from "./Unit";
import { SlimeBoss } from "./behaviours/bosses/SlimeBoss";

export class Boss extends Enemy {
  thingsToUnlockWhenDead: any[] = [];

  constructor (kind, data: Partial<DBHero>, modifiers: Partial<StatsModifiers> = {}) {
    super(kind, data,modifiers);

    this.isBoss = true;

    // FIXME: improve this!
    if (kind === 'slime-big') {
      this.addBehaviour(new SlimeBoss());
    }
  }

  get aiDistance () {
    return 4;
  }

  onDie () {
    // unlock chests and doors!
    this.thingsToUnlockWhenDead.forEach((thing) => {
      thing.isLocked = false;

      // FIXME: use .unlock instead.
      // thing.unlock();
    });

    // Announce boss killed only if user haven't progressed to next dungeons yet
    const playersWhoKilled = super.onDie().filter(player => (
      (player as any).latestProgress <= player.state.progress
    ));

    if (playersWhoKilled.length > 0) {
      // broadcast killed event for global chat.
      this.state.events.emit('event', {
        name: playersWhoKilled.map(p => (p as any).name).join(", "),
        progress: this.state.progress,
        killed: this.kind
      });
    }

    return playersWhoKilled;
  }

}
