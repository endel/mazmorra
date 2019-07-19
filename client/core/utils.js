export function distance(pointA, pointB) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.z - pointB.z)
}

export function distanceFromPlayer (object) {
  if (!global.player) {
    return { x: 0, y: 0, z: 0 };

  } else {
    return {
      x: Math.abs(object.position.x - player.position.x),
      y: Math.abs(object.position.z - player.position.z),
      z: distance(object.position, player.position)
    };
  }
}
