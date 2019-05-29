import { Position } from "../core/Position";

export function distance(pointA: Position, pointB: Position) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}

