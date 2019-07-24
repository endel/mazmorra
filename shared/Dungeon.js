// Based on: http://breinygames.blogspot.com/2011/07/random-map-generation.html

// Needs improvment:
// - It is possible with small rooms for it to not be closed (i.e. a wall tile missing)
// - Walls often double up (more room spacing?)

var helpers = require('./helpers')

var dungeon = {

    generate: function(rand, gridSize, minRoomSize, maxRoomSize, maxRooms) {
        // 1) Create the grid
        var grid = [];
        for(var x = 0; x < gridSize.x; ++x) {
            grid[x] = [];
            for(var y = 0; y < gridSize.y; ++y) {
                grid[x][y] = helpers.TILE_TYPE.EMPTY;
            }
        }

        // 2) Create a random sized room in the middle of the grid
        // 3) Add the new room to a list of all created rooms.
        var rooms = [this.generateRoom(rand, minRoomSize, maxRoomSize)];
        this.placeRoom(
            grid,
            rooms[0],
            (gridSize.x / 2) - (rooms[0].size.x / 2),
            (gridSize.y / 2) - (rooms[0].size.y / 2)
        );

        var area = gridSize.x * gridSize.y,
            roomPos = { x: 0, y: 0 };

        for(var i = 0; i < area; ++i) {
            if(maxRooms && rooms.length === maxRooms)
                break;

            // 4) Pick a random room from the list of all created rooms.
            // 5) Pick a random wall tile from the selected room.
            var branchPos = this.getBranchPosition(rand, grid, rooms),
                direction = branchPos.dir;

            // 6) Generate a new random sized room.
            var room = this.generateRoom(rand, minRoomSize, maxRoomSize);

            roomPos.x = 0;
            roomPos.y = 0;

            switch(direction) {
                case helpers.DIRECTION.NORTH:
                    roomPos.x = branchPos.x - (room.size.x / 2);
                    roomPos.y = branchPos.y - room.size.y;
                    break;

                case helpers.DIRECTION.SOUTH:
                    roomPos.x = branchPos.x - (room.size.x / 2);
                    roomPos.y = branchPos.y + 1;
                    break;

                case helpers.DIRECTION.EAST:
                    roomPos.x = branchPos.x + 1;
                    roomPos.y = branchPos.y - (room.size.y / 2);
                    break;

                case helpers.DIRECTION.WEST:
                    roomPos.x = branchPos.x - room.size.x;
                    roomPos.y = branchPos.y - (room.size.y / 2);
                    break;
            }

            roomPos.x = ~~roomPos.x;
            roomPos.y = ~~roomPos.y;

            // 7) See if there is space for the new room next to the selected wall tile of the selected room.
            // 8) If yes, continue. If no, go back to step 4.
            if(this.isSpaceForRoom(grid, gridSize, room, roomPos)) {

                // 9) Dig out the new room to add it to part of the dungeon, and add it to list of completed rooms.
                rooms.push(room);
                this.placeRoom(grid, room, roomPos.x, roomPos.y);
                // 10) Turn the wall tile picked in step 5 into a door way to make our new room accessible.

                room.branches = this.connectRooms(grid, branchPos);
            }

            // 11) Go back to step 4 until the dungeon is complete.
        }

        // 12) Add the up and down staircases inside random rooms of the dungeon.
        // 13) Finally, add some monsters, items, and gold in random areas of the dungeon.

        return [grid, rooms];
    },

    generateRoom: function(rand, minSize, maxSize) {
        var room = new helpers.Room(),
            sx = room.size.x = rand.intBetween(minSize.x, maxSize.x),
            sy = room.size.y = rand.intBetween(minSize.y, maxSize.y),
            tiles = room.tiles,
            walls = room.walls,
            col,
            wall;

        for(var x = 0; x < sx; ++x) {
            tiles.push(col = []);
            for(var y = 0; y < sy; ++y) {
                if(x === 0 || x === sx - 1 || y === 0 || y === sy - 1) {
                    var type = helpers.TILE_TYPE.WALL,
                        dir = helpers.DIRECTION.NONE,
                        corner = false;

                    //store position of normal walls (not corners)
                    if(y !== 0 && y !== sy - 1) {
                        if(x === 0) {
                            dir = helpers.DIRECTION.WEST;
                        } else if(x === sx - 1) {
                            dir = helpers.DIRECTION.EAST;
                        }
                    } else if(x !== 0 && x !== sx - 1) {
                        if(y === 0) {
                            dir = helpers.DIRECTION.NORTH;
                        } else if(y === sy - 1) {
                            dir = helpers.DIRECTION.SOUTH;
                        }
                    }
                    //add corners
                    else {
                        corner = true;
                    }

                    walls.push({ x: x, y: y, dir: dir, corner: corner });
                    col.push(type | dir | (corner ? helpers.CORNER : 0));
                } else {
                    col.push(helpers.TILE_TYPE.FLOOR);
                }
            }
        }

        return room;
    },
    placeRoom: function(grid, room, px, py) {
        px = ~~px;
        py = ~~py;

        room.position.x = px;
        room.position.y = py;

        var tx = 0,
            ty = 0;

        //copy the tiles from this room into the grid
        for(var x = px; x < (px + room.size.x); ++x) {
            for(var y = py; y < (py + room.size.y); ++y) {
                grid[x][y] = room.tiles[tx][ty];
                ty++;
            }
            tx++;
            ty = 0;
        }
    },
    getBranchPosition: function(rand, grid, rooms) {
        var room = helpers.randElm(rand, rooms),
            wall = helpers.randElm(rand, room.walls.filter(function(v) { return !v.corner; }));

        return { x: wall.x + room.position.x, y: wall.y + room.position.y, dir: wall.dir };
    },
    isSpaceForRoom: function(grid, gridSize, room, roomPos) {
        var mx = roomPos.x + room.size.x,
            my = roomPos.y + room.size.y;

        //check x size
        if(roomPos.x < 0 || mx > gridSize.x)
            return false;

        //check y size
        if(roomPos.y < 0 || my > gridSize.y)
            return false;

        //check if any tiles of this room intersect another room
        for(var x = roomPos.x; x < mx; ++x) {
            for(var y = roomPos.y; y < my; ++y) {
                if(grid[x][y] !== helpers.TILE_TYPE.EMPTY) {
                    return false;
                }
            }
        }

        return true;
    },

    connectRooms: function(grid, branchPos) {
        grid[branchPos.x][branchPos.y] = helpers.TILE_TYPE.FLOOR;

        var branches = []
        switch(branchPos.dir) {
            case helpers.DIRECTION.NORTH:
                grid[branchPos.x][branchPos.y - 1] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.NORTH;

                branches.push({ dir: branchPos.dir, x: branchPos.x, y: branchPos.y - 2 });
                branches.push({ dir: branchPos.dir, x: branchPos.x, y: branchPos.y + 1 });

                // grid[branchPos.x + 1][branchPos.y - 1] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.NORTH;
                // grid[branchPos.x][branchPos.y - 1] = helpers.TILE_TYPE.FLOOR;
                break;

            case helpers.DIRECTION.SOUTH:
                grid[branchPos.x][branchPos.y + 1] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.SOUTH;

                branches.push({ dir: branchPos.dir, x: branchPos.x, y: branchPos.y + 2 });
                branches.push({ dir: branchPos.dir, x: branchPos.x, y: branchPos.y - 1 });

                // double sized!
                // grid[branchPos.x][branchPos.y + 1] = helpers.TILE_TYPE.FLOOR;
                // grid[branchPos.x - 1][branchPos.y] = helpers.TILE_TYPE.FLOOR;
                // grid[branchPos.x - 1][branchPos.y + 1] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.SOUTH;
                break;

            case helpers.DIRECTION.EAST:
                grid[branchPos.x + 1][branchPos.y] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.EAST;

                branches.push({ dir: branchPos.dir, x: branchPos.x + 2, y: branchPos.y });
                branches.push({ dir: branchPos.dir, x: branchPos.x - 1, y: branchPos.y });
                break;

            case helpers.DIRECTION.WEST:
                grid[branchPos.x - 1][branchPos.y] = helpers.TILE_TYPE.FLOOR | helpers.DIRECTION.WEST;

                branches.push({ dir: branchPos.dir, x: branchPos.x - 2, y: branchPos.y });
                branches.push({ dir: branchPos.dir, x: branchPos.x + 1, y: branchPos.y });
                break;
        }

        return branches;
    }
};

module.exports = dungeon
