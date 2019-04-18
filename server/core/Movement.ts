import { type, Schema } from "@colyseus/schema";
import { EventEmitter } from "events";
import { Position } from "./Position";
import { Point } from "../rooms/states/DungeonState";
import { Unit } from "../entities/Unit";

export class Movement extends Position {
  pending: Point[] = [];
  lastMove: number = 0;
  active: boolean = false;

  unit: Unit;
  target: Unit;

  events = new EventEmitter();

  constructor (unit) {
    super()
    this.unit = unit
  }

  get destiny () {
    var lastIndex = this.pending.length - 1
    return (lastIndex !== -1) ? { x: this.pending[ lastIndex ][ 0 ], y: this.pending[ lastIndex ][ 1 ] } : null
  }

  equals (other) {
    return (
      this.x === other.x &&
      this.y === other.y
    );
  }

  set (x: any, y?: number) {
    if (!y && typeof(x) === "object") {
      y = x.y
      x = x.x
    }

    var event = new MoveEvent(this.unit);
    this.events.emit('move', event, this.x, this.y, x, y);

    if (event.valid()) {
      this.x = x;
      this.y = y;
    }

    // console.log(event.valid(), this.position)
  }

  moveTo (pending) {
    var now = Date.now()
    // force to move instantly if last move
    if (now - this.lastMove > this.unit.walkSpeed) {
      this.lastMove = now - this.unit.walkSpeed
    }
    this.pending = pending
  }

  update (currentTime) {
    var timeDiff = currentTime - this.lastMove
      , moves = 0
      , pos = null

    if (timeDiff > this.unit.walkSpeed) {
      moves = Math.floor(timeDiff / this.unit.walkSpeed)

      if (this.pending.length > 0) {
        this.touch(currentTime)

        pos = this.pending.shift()
        this.set(pos[0], pos[1])
        // for (var i=0; i<moves; i++) {
        //   pos = this.pending.shift()
        //   this.set(pos[0], pos[1])
        // }

        // if (this.unit.action) this.unit.action.lastUpdateTime = currentTime + this.unit.walkSpeed
      }
    }
  }

  touch (currentTime) {
    this.lastMove = currentTime

    // change direction
    if (this.pending.length > 0) {
      var x = this.pending[0][0], y = this.pending[0][1]
      if (this.x < x) {
        this.unit.direction = 'bottom'

      } else if (this.x > x) {
        this.unit.direction = 'top'

      } else if (this.y > y) {
        this.unit.direction = 'left'

      } else if (this.y < y) {
        this.unit.direction = 'right'
      }
    }

  }

}

class MoveEvent {
  isCancelled: boolean;
  target: any;

  constructor (target) {
    this.isCancelled = false
    this.target = target
  }

  cancel() { this.isCancelled = true }
  valid() { return !this.isCancelled }
}
