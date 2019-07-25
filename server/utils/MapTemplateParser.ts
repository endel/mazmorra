import { Entity } from "../entities/Entity";
import { Position } from "../core/Position";
import { DungeonRoom } from "./RoomUtils";
import {CORNER, DIRECTION, TILE_TYPE} from "../../shared/helpers";
import { parse } from "path";
import { MapConfig } from "./ProgressionConfig";
import { DungeonState } from "../rooms/states/DungeonState";

export const defaultSymbols = {
    [`⬜`]: TILE_TYPE.EMPTY,
    [`⬛`]: TILE_TYPE.FLOOR,
    [`🧱`]: TILE_TYPE.WALL,

    [`🕧`]: TILE_TYPE.WALL + DIRECTION.SOUTH,
    [`🕕`]: TILE_TYPE.WALL + DIRECTION.NORTH,
    [`➖`]: TILE_TYPE.WALL + DIRECTION.EAST,
    [`➗`]: TILE_TYPE.WALL + DIRECTION.WEST,

    [`🚫`]: TILE_TYPE.WALL + CORNER,

    [`🕒`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.WEST,
    [`🕞`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.EAST,
    [`🕘`]: TILE_TYPE.WALL + CORNER + DIRECTION.NORTH + DIRECTION.WEST,
    [`🕤`]: TILE_TYPE.WALL + CORNER + DIRECTION.NORTH + DIRECTION.EAST,

    [`🍴`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.NORTH,
    [`🛬`]: TILE_TYPE.WALL + CORNER + DIRECTION.WEST + DIRECTION.EAST,

    [`🈶`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.NORTH + DIRECTION.WEST,
    [`🈯`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.NORTH + DIRECTION.EAST,
    [`🈚`]: TILE_TYPE.WALL + CORNER + DIRECTION.NORTH + DIRECTION.WEST  + DIRECTION.EAST,
    [`🈳`]: TILE_TYPE.WALL + CORNER + DIRECTION.SOUTH + DIRECTION.WEST  + DIRECTION.EAST,

    [`🈵`]: TILE_TYPE.WALL + CORNER + DIRECTION.NORTH + DIRECTION.SOUTH + DIRECTION.WEST  + DIRECTION.EAST,
};

type SymbolValue = number | Entity | Entity[];
export type SymbolsDictonary = typeof defaultSymbols & {[s: string]: SymbolValue};

const isWalkable = (value: SymbolValue) => value === TILE_TYPE.FLOOR || value instanceof Entity || value instanceof Array;

export type CustomMapObject = {
    template: string, 
    symbols: SymbolsDictonary,
    config: Partial<MapConfig>,
    populate: (state: DungeonState) => void
}


export function parseMapTemplate ({template, symbols}: CustomMapObject) {
    const keys = Object.keys(symbols);
    const newLine = /\n/g;
    const keyLookup = new RegExp(`[${keys.join('')}]`, 'gu');

    template = template.trim();
    try {
        
        template
            .trim()
            .split(newLine)
            .map((row, y) => {
                const matchingCells = row.match(keyLookup);
                if (matchingCells.join('') !== row) {
                    throw new Error(`Row ${y} contains a character that is not an expected symbol`)
                }
                return matchingCells;
            })

        const grid = template
            .trim()
            .split(newLine)
            .map((row, y) => {
                const matchingCells = row.match(keyLookup);
                if (matchingCells.join('') !== row) {
                    throw new Error(`Row ${y} contains a character that is not an expected symbol`)
                }
                return [...matchingCells];
            })
            .map((row, y, grid) => {
                const symbolToValue = (cellSymbol: keyof typeof defaultSymbols, x: number) => {
                    const position = new Position();
                    position.x = x;
                    position.y = y;

                    const appendPosition = (entity: Entity) => {
                        entity.position = position;
                        return entity;                        
                    };

                    const value = symbols[cellSymbol];
                    if (value === TILE_TYPE.WALL) {
                        let wallValue = value;
                        const nextRow = grid[y + 1];
                        const prevRow = grid[y - 1];

                        // Get what directions this wall collides with an walkable tile
                        let directions = [
                            prevRow && isWalkable(symbols[prevRow[x]]) ? DIRECTION.EAST : 0,
                            nextRow && isWalkable(symbols[nextRow[x]]) ? DIRECTION.WEST : 0,
                            isWalkable(symbols[row[x - 1]]) ? DIRECTION.SOUTH : 0,
                            isWalkable(symbols[row[x + 1]]) ? DIRECTION.NORTH : 0
                        ];
                        
                        // Filter out zeros
                        directions = directions.filter(v => !!v);

                        // If there is a wall facing more than 1 side, it should be treated as an corner
                        // Or if if faces no where, add corner
                        if (directions.length > 1 || directions.length === 0) {
                            wallValue += CORNER;
                        }
                        // Sum up all directions to the wall value 
                        wallValue += directions.reduce((p, c) => p + c, 0);

                        return wallValue;
                    } else if (typeof value === "number") {
                        return value;
                    }
                    if (isWalkable(value))
                        return TILE_TYPE.FLOOR
                    
                    
                    console.warn(`Unexpected symbol on ${cellSymbol}`, value)
                    // if (value instanceof Entity) return appendPosition(value);
                    // if (value instanceof Array) return value.map(v => appendPosition(v));
                    return TILE_TYPE.EMPTY;
                }
                return row.map(symbolToValue)
            });

            const rooms: DungeonRoom[] = [];
            
            return {
                grid,
                rooms
            }

    } catch (err) {
        console.error(`Unable to parse template`, err);
        console.error(`Dumping: `);
        console.error({keys, symbols, keyLookup, template});
        throw err;
    }

    return null;
}