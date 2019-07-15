import { Entity } from "../entities/Entity";
import { Position } from "../core/Position";
import { EmptySpace, WalkableSpace } from "../utils/MapTemplateParser";

// Fake entities just to mock the map
class Fence extends Entity {}
class Fountain extends Entity {}
class Chest extends Entity {}
class Boss extends Entity {}
class Monster1 extends Entity {}
class Monster2 extends Entity {}
class Lever extends Entity {constructor(a: any) {super()}}

export const symbols = {
    [`⬜`]: EmptySpace,
    [`⬛`]: WalkableSpace,
    [`🔷`]: new Lever({ unlock: [] }),
    [`⛔`]: new Fence(),
    [`🍔`]: new Fountain(),
    [`🎁`]: new Chest(),
    [`💀`]: new Boss(),
    [`👹`]: [new Monster1(), new Monster1()],
    [`👺`]: new Monster2(),
};

export const keys = Object.keys(symbols);

export const mapTemplate = `
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬛⬛⬛⬜⬜⬛⬛⬛⬛⬛⬜
⬜⬛⬛⬛⬜⬜⬛⬜⬜⬜⛔⬜
⬜⬛⬛🍔⬜⬛⬛⬛⬜🔷⬛⬜
⬜⬜⬛⬜⬜⬛💀⬛⬜⬛⬛⬜
⬜⬜⬛⬜⬜⬛🎁⬛⬜👺⬛⬜
⬜⬛⬛⬛⬜⬜⬜⬜⬜⬛⬜⬜
⬜⬛👹⬛⬛⬛⬛⬛⬛⬛⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
`;