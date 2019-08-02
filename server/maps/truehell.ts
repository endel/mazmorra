import { Entity } from "../entities/Entity";
import { defaultSymbols, SymbolsDictonary, CustomMapObject } from "../utils/MapTemplateParser";
import { MapKind } from "../utils/ProgressionConfig";

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
    [`🔷`]: new Lever({ unlock: [] }),
    [`⛔`]: new Fence(),
    [`🍔`]: new Fountain(),
    [`🎁`]: new Chest(),
    [`💀`]: new Boss(),
    [`👹`]: [new Monster1(), new Monster1()],
    [`👺`]: new Monster2(),
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
⬜🧱⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛🧱⬛⬛🧱⬛⬛🧱⬛🧱⬛⬛⬛⬛⬛🧱⬜
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
        mapkind: MapKind.ICE,
        daylight: false
    },
    populate: (state) => {}
}

export default mapObject;