// var canvas = document.createElement('canvas')
//   , ctx = canvas.getContext('2d')
//
// canvas.style.position = "absolute"
// canvas.style.top = "50px"
// canvas.style.left = "50px"
// window.document.body.appendChild(canvas)
//
//     canvas.width = gridSize.x * TILE_SIZE
//     canvas.height = gridSize.y * TILE_SIZE
//
// function drawTile(type, x, y) {
//   ctx.fillStyle = '#ffffff'
//   ctx.fillRect(
//       x * TILE_SIZE,
//       y * TILE_SIZE,
//       TILE_SIZE,
//       TILE_SIZE
//   );
// }
//
// function drawGridMap(grid) {
//   var xlen = grid.length,
//       ylen = grid[0].length;
//
//   //draw dungeon grid
//   for(var x = 0; x < xlen; ++x) {
//     for(var y = 0; y < ylen; ++y) {
//       var tile = grid[x][y];
//
//       if(tile & helpers.TILE_TYPE.EMPTY)
//         continue;
//
//       if(tile & helpers.TILE_TYPE.FLOOR) {
//         drawTile('floor', x, y);
//         //ctx.fillStyle = options.colors[helpers.TILE_TYPE.FLOOR];
//       }
//
//       //ctx.fillRect(x * scale.x, y * scale.y, scale.x, scale.y);
//     }
//   }
// }
// drawGridMap(grid)
