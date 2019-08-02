import { Entity } from "../entities/Entity";
import { defaultSymbols, SymbolsDictonary, CustomMapObject } from "../utils/MapTemplateParser";
import { MapKind } from "../utils/ProgressionConfig";
import { Door, DoorDestiny } from "../entities/interactive/Door";
import { Enemy } from "../entities/Enemy";

// Fake entities just to mock the map
class Fence extends Entity {}
class Fountain extends Entity {}
class Chest extends Entity {}
class Boss extends Entity {}
class Monster1 extends Entity {}
class Monster2 extends Entity {}
class Lever extends Entity {constructor(a: any) {super()}}

const symbols: SymbolsDictonary = {
    ...defaultSymbols,
    [`🔷`]: ({x, y}, state) => new Lever({ unlock: [] }),
    [`⛔`]: ({x, y}, state) => new Fence(),
    [`🍔`]: ({x, y}, state) => new Fountain(),
    [`🎁`]: ({x, y}, state) => new Chest(),
    [`💀`]: ({x, y}, state) => new Boss(),
    [`👹`]: ({x, y}, state) => [new Monster1(), new Monster1()],
    [`👺`]: ({x, y}, state) => {
        const e = new Enemy('golem', {});
        e.position.set(x, y);
        return e;
    },
    [`🚪`]: ({x, y}, state) => new Door({x, y}, new DoorDestiny({room: "dungeon", progress: 1}))
};

/*
      WEST
NORTH      SOUTH
      EAST
*/
const template = `
⬜⬜⬜⬜⬜⬜⬜🧱🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜🧱⬛⬛⬛⬛⬛🧱⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜🧱⬛⬛⬛⬛⬛🧱⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜🧱🧱🧱⬛🧱🧱🧱⬜⬜⬜🧱⬛⬛⬛⬛🧱🧱🧱⬛⬛⬛⬛⬛🧱⬜⬜⬜
⬜🧱🧱🧱🧱🧱🧱⬜⬜🧱⬛🧱⬜⬜⬜⬜🧱🧱⬛⬛⬛🧱⬛⬛🧱🧱🧱⬛⬛⬛🧱🧱⬜⬜
⬜🧱⬛⬛⬛⬛🧱🧱🧱🧱⬛🧱🧱🧱🧱🧱🧱⬛⬛⬛🧱⬛⬛⬛⬛⬛🧱⬛⬛⬛⬛🧱🧱⬜
⬜🧱⬛👺⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬛⬛⬛🧱⬛🧱⬛⬛⬛⬛⬛🧱⬜
⬜🧱🚪⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬛⬛🧱⬛⬛🧱⬛🧱⬛⬛⬛⬛⬛🧱⬜
⬜🧱⬛👹⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬛⬛🧱⬛🧱⬛⬛⬛⬛⬛⬛⬛🧱⬜
⬜🧱⬛⬛⬛⬛🧱🧱🧱🧱🧱⬛🧱🧱🧱🧱🧱⬛⬛🧱⬛⬛⬛⬛🧱⬛⬛⬛⬛⬛⬛🧱🧱⬜
⬜🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬛⬜⬜⬜⬜🧱🧱⬛⬛🧱⬛⬛⬛🧱⬛⬛⬛⬛⬛🧱🧱⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜🧱⬛⬛⬛🧱🧱🧱🧱⬛⬛⬛⬛⬛🧱⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛⬛⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜
⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜🧱🧱⬛⬛⬛⬛⬛⬛⬛⬛🧱🧱⬜⬜⬜⬜
⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱⬜⬜⬜⬜⬜
⬜⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜
⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
`;


const mapObject: CustomMapObject = {
    symbols,
    template,
    startPosition: {
        x: 3,
        y: 7
    },
    config: {
        mapkind: MapKind.INFERNO,
        daylight: true
    },
    populate: (state) => {}
}

export default mapObject;