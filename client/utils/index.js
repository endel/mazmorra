export function humanize (value) {
  const camelMatch = /([A-Z])/g;
  const underscoreMatch = /_/g;

  const camelCaseToSpaces = value.replace(camelMatch, " $1");
  const underscoresToSpaces = camelCaseToSpaces.replace(underscoreMatch, " ");
  const caseCorrected =
    underscoresToSpaces.charAt(0).toUpperCase() +
    underscoresToSpaces.slice(1).toLowerCase();

  return caseCorrected.replace(/\-/g, " ").replace(/([0-9])$/g, " - T$1");

  // return string
  //   .replace(/^[\s_]+|[\s_]+$/g, '')
  //   .replace(/\-/g, ' ')
  //   .replace(/[_\s]+/g, ' ')
  //   .replace(/^[a-z]/, function (m) { return m.toUpperCase(); });
}

const lightPool = [
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  new THREE.PointLight(0x1c80e4, 0, 0),
  // new THREE.PointLight(0x1c80e4, 0, 0),
];
let currentLight = 0;

export function getLightFromPool() {
  currentLight = (currentLight + 1) % lightPool.length;
  return lightPool[currentLight];
}

export function getLightPoolCount() {
  return lightPool.length;
}

export function removeLight(light) {
  light.getEntity().detachAll();
  light.intensity = 0;
  light.distance = 0;
  window.scene.add(light);
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
