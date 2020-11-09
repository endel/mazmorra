import { generateId } from "colyseus";
import * as Config from "../utils/ProgressionConfig";
import gen, { RandomSeed } from "random-seed";

function mkify(value) {
  if (typeof (value) === "boolean") {
    return value ? "✅" : "❌";

  } else if (typeof (value) === "number") {
    return "`" + value + "`";

  } else if (typeof(value) === "object") {
    return `${value.x} x ${value.y}`;

  } else {
    return value;
  }
}

const seed = `${generateId()}-${generateId()}`;

const header = 'Progress | Daylight | Kind | Width | Height | Rooms | One direction? | Checkpoint? | Boss?';
// Min. Room Size | Max. Room Size |
console.log(header);
console.log(`${header.split("|").map(h => '---').join(" | ")}`);

for (let progress = 1; progress <= 72; progress++) {
  const rand = gen.create(seed + progress);

  const config = Config.getMapConfig(progress);
  const props = [];

  const width = config.getMapWidth(progress);
  const height = config.getMapHeight(progress);
  const minRoomSize = config.minRoomSize;
  const maxRoomSize = config.maxRoomSize;

  const minRooms = (progress == 1 || progress === Config.MAX_LEVELS) ? 2 : 3;
  const maxRooms = (progress == 1 || progress === Config.MAX_LEVELS) ? 2
    : Math.min(
      Math.floor((width * height) / (maxRoomSize.x * maxRoomSize.y)),
      Math.floor(progress / 2)
    );
  const numRooms = Math.max(minRooms, maxRooms);

  props.push(progress);
  props.push(config.daylight);
  props.push(config.mapkind);
  props.push(width);
  props.push(height);
  props.push(numRooms);
  props.push(config.oneDirection && config.oneDirection(rand, progress) || false);
  // props.push(minRoomSize);
  // props.push(maxRoomSize);
  props.push(Config.isCheckPointMap(progress));
  props.push(Config.isBossMap(progress));

  console.log(`${props.map(p => mkify(p)).join(" | ")}`);

  rand.done();
}
