export function humanize (value) {
  const camelMatch = /([A-Z])/g;
  const underscoreMatch = /_/g;

  const camelCaseToSpaces = value.replace(camelMatch, " $1");
  const underscoresToSpaces = camelCaseToSpaces.replace(underscoreMatch, " ");
  const caseCorrected =
    underscoresToSpaces.charAt(0).toUpperCase() +
    underscoresToSpaces.slice(1).toLowerCase();

  return caseCorrected.replace(/\-[0-9]?/g, " ");

  // return string
  //   .replace(/^[\s_]+|[\s_]+$/g, '')
  //   .replace(/\-/g, ' ')
  //   .replace(/[_\s]+/g, ' ')
  //   .replace(/^[a-z]/, function (m) { return m.toUpperCase(); });
}


export function toScreenPosition(camera, obj) {
  var vector = new THREE.Vector3();

  var widthHalf = 0.5 * window.innerWidth;
  var heightHalf = 0.5 * window.innerHeight;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  vector.x = (vector.x * widthHalf) + widthHalf;
  vector.y = - (vector.y * heightHalf) + heightHalf;

  return {
    x: vector.x,
    y: vector.y
  };

}
