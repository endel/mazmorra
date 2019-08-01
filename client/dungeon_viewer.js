import Dungeon from "../shared/Dungeon";
import helpers from "../shared/helpers";

const rand = {
  intBetween: (min, max) =>Math.floor(Math.random() * (max - min + 1) + min)
}

const TILE_SIZE = 12;

function generate() {
  const [grid, rooms] = Dungeon.generate(
    rand,
    {
      x: parseInt(gridSizeX.value),
      y: parseInt(gridSizeY.value )
    }, {
      x: parseInt(minRoomSizeX.value),
      y: parseInt(minRoomSizeY.value)
    }, {
      x: parseInt(maxRoomSizeX.value),
      y: parseInt(maxRoomSizeY.value),
    }, parseInt(numRooms.value),
    parseInt(oneDirection.value),
    parseInt(hasConnections.value),
    parseInt(hasObstacles.value),
  );
  const canvas = document.getElementById("viewer");
  canvas.width = gridSizeX.value * TILE_SIZE;
  canvas.height = gridSizeY.value * TILE_SIZE;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.style.zIndex = 999;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] & helpers.TILE_TYPE.FLOOR) {
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      } else if (grid[x][y] & helpers.TILE_TYPE.WALL) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  function drawRoom(room) {
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(room.position.x * TILE_SIZE, room.position.y * TILE_SIZE, room.size.x * TILE_SIZE, room.size.y * TILE_SIZE);
  }

  // drawRoom(rooms[0]);
  // drawRoom(rooms[rooms.length - 1]);
  // drawRoom(rooms[rooms.length-2]);
  // drawRoom(rooms[rooms.length-3]);
}

var options = {
  gridSizeX: 40,
  gridSizeY: 40,
  minRoomSizeX: 10,
  minRoomSizeY: 10,
  maxRoomSizeX: 10,
  maxRoomSizeY: 10,
  numRooms: 10,
  oneDirection: 0,
  hasConnections: 1,
  hasObstacles: 1,
}

for (let field in options) {
  var option = document.createElement("div");

  var label = document.createElement("label");
  label.innerText = field;
  option.appendChild(label)

  var input = document.createElement("input");
  input.id = field;
  input.type = "text";
  input.value = options[field].toString();
  option.appendChild(input)

  document.body.appendChild(option);
}

window.generate = generate;

generate();
