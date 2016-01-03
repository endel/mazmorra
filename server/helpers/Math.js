
module.exports.distance = function distance (pointA, pointB) {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}

